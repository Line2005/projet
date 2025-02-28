#

import yagmail
import logging

logger = logging.getLogger(__name__)

class EmailService:
    def __init__(self, username, password):
        self.username = username
        self.password = password
        self._yag = None

    @property
    def yag(self):
        """Lazy initialization of yagmail SMTP connection"""
        if self._yag is None:
            try:
                self._yag = yagmail.SMTP(self.username, self.password)
                logger.info("Yagmail SMTP connection initialized")
            except Exception as e:
                logger.error(f"Failed to initialize yagmail SMTP connection: {str(e)}")
                raise
        return self._yag

    def send_email(self, to, subject, body):
        """Send email with error handling and logging"""
        try:
            self.yag.send(
                to=to,
                subject=subject,
                contents=body
            )
            logger.info(f"Email sent successfully to {to}")
            return True
        except Exception as e:
            logger.error(f"Failed to send email to {to}: {str(e)}")
            raise

# Initialize the email service
email_service = EmailService(
    username="yvangodimomo@gmail.com",
    password="pzls apph esje cgdl"
)