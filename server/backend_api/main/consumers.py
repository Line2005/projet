import json
from datetime import timezone, datetime
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Conversation, Message
from django.contrib.auth import get_user_model
from django.core.exceptions import PermissionDenied

User = get_user_model()


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.conversation_id = self.scope['url_route']['kwargs']['conversation_id']
        self.room_group_name = f'chat_{self.conversation_id}'

        # Check authentication
        user = self.scope["user"]
        if user.is_anonymous:
            # Reject the connection for unauthenticated users
            await self.close(code=4003)
            return

        # Check authorization
        conversation_exists = await self.check_conversation_permission(user.id, self.conversation_id)
        if not conversation_exists:
            # Reject the connection for unauthorized users
            await self.close(code=4004)
            return

        # Store user for later use
        self.user = user

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        # Notify the group that the user has joined
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'user_joined',
                'user_id': user.id,
                'username': user.username,
                'timestamp': str(datetime.now(timezone.utc))
            }
        )

    async def disconnect(self, close_code):
        # Leave room group
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

            if hasattr(self, 'user') and not self.user.is_anonymous:
                # Notify the group that the user has left
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'user_left',
                        'user_id': self.user.id,
                        'username': self.user.username,
                        'timestamp': str(datetime.now(timezone.utc))
                    }
                )

    async def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
            message = text_data_json['message']

            # Get the current user
            user = self.scope["user"]

            # Save message to database and get the created message object
            saved_message = await self.save_message(user, message)

            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'id': saved_message.id,
                    'message': message,
                    'sender_id': user.id,
                    'timestamp': str(saved_message.timestamp),
                    'is_read': False
                }
            )
        except json.JSONDecodeError:
            # Handle invalid JSON
            await self.send(text_data=json.dumps({
                'error': 'Invalid JSON format'
            }))
        except KeyError:
            # Handle missing message key
            await self.send(text_data=json.dumps({
                'error': 'Message key is required'
            }))
        except Exception as e:
            # Handle other exceptions
            await self.send(text_data=json.dumps({
                'error': f'An error occurred: {str(e)}'
            }))

    async def chat_message(self, event):
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'id': event.get('id'),
            'message': event['message'],
            'sender_id': event['sender_id'],
            'timestamp': event['timestamp'],
            'is_read': event.get('is_read', False),
            'is_sender': event['sender_id'] == self.user.id
        }))

    async def user_joined(self, event):
        # Send notification that a user has joined
        if event['user_id'] != self.user.id:  # Don't notify the user about themselves
            await self.send(text_data=json.dumps({
                'type': 'user_joined',
                'user_id': event['user_id'],
                'username': event['username'],
                'timestamp': event['timestamp']
            }))

    async def user_left(self, event):
        # Send notification that a user has left
        if event['user_id'] != self.user.id:  # Don't notify the user about themselves
            await self.send(text_data=json.dumps({
                'type': 'user_left',
                'user_id': event['user_id'],
                'username': event['username'],
                'timestamp': event['timestamp']
            }))

    @database_sync_to_async
    def save_message(self, user, message_content):
        conversation = Conversation.objects.get(id=self.conversation_id)
        message = Message.objects.create(
            conversation=conversation,
            sender=user,
            content=message_content
        )
        return message

    @database_sync_to_async
    def check_conversation_permission(self, user_id, conversation_id):
        try:
            user = User.objects.get(id=user_id)
            conversation = Conversation.objects.get(id=conversation_id)

            # Check permission based on user role
            if user.role == 'investor':
                return conversation.investor.user_id == user_id
            elif user.role == 'entrepreneur':
                return conversation.help_request.entrepreneur.user_id == user_id
            return False
        except User.DoesNotExist:
            print(f"User {user_id} not found")
            return False
        except Conversation.DoesNotExist:
            print(f"Conversation {conversation_id} not found")
            return False
        except Exception as e:
            print(f"Unexpected error in check_conversation_permission: {e}")
            return False