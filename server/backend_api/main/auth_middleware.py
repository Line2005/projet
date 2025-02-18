from channels.middleware import BaseMiddleware
from django.contrib.auth.models import AnonymousUser
from channels.db import database_sync_to_async


class TokenAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        # Import here to avoid AppRegistryNotReady error
        from rest_framework_simplejwt.tokens import AccessToken
        from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
        from django.db import close_old_connections
        from django.contrib.auth import get_user_model

        User = get_user_model()

        # Get the token from query parameters
        query_string = scope.get('query_string', b'').decode()
        query_params = dict(x.split('=') for x in query_string.split('&') if '=' in x)
        token_key = query_params.get('token', None)

        if token_key:
            # Get user from token
            scope['user'] = await self.get_user_from_token(token_key, User, AccessToken, InvalidToken, TokenError,
                                                           close_old_connections)
        else:
            scope['user'] = AnonymousUser()

        return await super().__call__(scope, receive, send)

    @database_sync_to_async
    def get_user_from_token(self, token_key, User, AccessToken, InvalidToken, TokenError, close_old_connections):
        try:
            # Close old database connections to prevent usage of timed out connections
            close_old_connections()

            # Verify the token and get the user
            access_token = AccessToken(token_key)
            user_id = access_token.payload.get('user_id')

            # Get the user from the database
            user = User.objects.get(id=user_id)
            return user if user.is_active else AnonymousUser()
        except (InvalidToken, TokenError) as e:
            print(f"Token authentication failed: {str(e)}")
            return AnonymousUser()
        except User.DoesNotExist:
            print(f"User from token does not exist")
            return AnonymousUser()