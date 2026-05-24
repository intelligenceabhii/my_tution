import os
from google import genai
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '.env'))

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

_client = None

def get_genai_client():
    global _client
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY not found in .env file")
    if _client is None:
        _client = genai.Client(api_key=GEMINI_API_KEY)
    return _client

def generate_content(prompt: str) -> str:
    client = get_genai_client()
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt,
    )
    return response.text
