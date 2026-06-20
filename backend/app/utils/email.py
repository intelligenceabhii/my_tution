import os
import smtplib
import logging
from email.message import EmailMessage

logger = logging.getLogger(__name__)

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
CONTACT_TO = os.getenv("CONTACT_TO", "abhii.intelligence@gmail.com")

def send_contact_email(name: str, email: str, subject: str, message: str) -> bool:
    if not SMTP_USER or not SMTP_PASSWORD:
        logger.warning("SMTP not configured — contact message logged but not sent")
        logger.info(f"Contact form: from={name} <{email}>, subject={subject}, message={message}")
        return False

    try:
        msg = EmailMessage()
        msg["From"] = SMTP_USER
        msg["To"] = CONTACT_TO
        msg["Reply-To"] = email
        msg["Subject"] = f"[MY Tuition Contact] {subject}"

        body = f"""New contact form submission:

Name: {name}
Email: {email}
Subject: {subject}

Message:
{message}
"""
        msg.set_content(body)

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.send_message(msg)

        logger.info(f"Contact email sent successfully from {email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send contact email: {e}")
        return False
