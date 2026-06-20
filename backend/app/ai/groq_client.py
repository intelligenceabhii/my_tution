import os
from groq import Groq
from dotenv import load_dotenv
from ..database import SessionLocal

load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '.env'))

ENV_API_KEY = os.getenv("GROQ_API_KEY", "")

def _load_config():
    try:
        db = SessionLocal()
        from ..models import AIConfig
        config = db.query(AIConfig).first()
        db.close()
        if config:
            return config
    except Exception:
        pass
    return None

def groq_generate_content(prompt: str, use_config: bool = True) -> str:
    config = _load_config()
    api_key = ""
    model = "llama3-70b-8192"
    temperature = 0.7
    max_tokens = 2048
    top_p = 0.95

    if config and config.groq_api_key:
        api_key = config.groq_api_key
    else:
        api_key = ENV_API_KEY

    if config and config.groq_model:
        model = config.groq_model

    if use_config:
        if config and config.temperature is not None:
            temperature = config.temperature
        if config and config.max_tokens is not None:
            max_tokens = config.max_tokens
        if config and config.top_p is not None:
            top_p = config.top_p

    if not api_key:
        raise ValueError("GROQ_API_KEY not found. Configure it in AI Settings or .env file")

    client = Groq(api_key=api_key)
    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        temperature=temperature,
        max_tokens=max_tokens,
        top_p=top_p,
    )
    return response.choices[0].message.content
