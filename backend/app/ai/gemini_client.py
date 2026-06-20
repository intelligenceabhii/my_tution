import os
from google import genai
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from ..database import SessionLocal

load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '.env'))

ENV_API_KEY = os.getenv("GEMINI_API_KEY", "")

_client = None
_config_cache = None

def _load_config():
    global _config_cache
    try:
        db = SessionLocal()
        from ..models import AIConfig
        config = db.query(AIConfig).first()
        db.close()
        if config:
            _config_cache = config
            return config
    except Exception:
        pass
    return None

def get_api_key():
    config = _load_config()
    if config and config.gemini_api_key:
        return config.gemini_api_key
    return ENV_API_KEY

def get_model_name():
    config = _load_config()
    if config and config.model_name:
        return config.model_name
    return "gemini-2.0-flash"

def get_temperature():
    config = _load_config()
    if config and config.temperature is not None:
        return config.temperature
    return 0.7

def get_max_tokens():
    config = _load_config()
    if config and config.max_tokens is not None:
        return config.max_tokens
    return 2048

def get_top_p():
    config = _load_config()
    if config and config.top_p is not None:
        return config.top_p
    return 0.95

def is_match_enabled():
    config = _load_config()
    if config is not None:
        return config.match_enabled
    return True

def is_summarize_enabled():
    config = _load_config()
    if config is not None:
        return config.summarize_enabled
    return True

def get_match_prompt_template():
    config = _load_config()
    if config and config.match_prompt_template:
        return config.match_prompt_template
    return None

def get_summarize_prompt_template():
    config = _load_config()
    if config and config.summarize_prompt_template:
        return config.summarize_prompt_template
    return None

def get_genai_client():
    global _client
    api_key = get_api_key()
    if not api_key:
        raise ValueError("GEMINI_API_KEY not found. Configure it in AI Settings or .env file")
    if _client is None:
        _client = genai.Client(api_key=api_key)
    return _client

def generate_content(prompt: str, use_config: bool = True) -> str:
    client = get_genai_client()
    model = get_model_name() if use_config else "gemini-2.0-flash"
    kwargs = {"model": model, "contents": prompt}
    if use_config:
        kwargs["config"] = genai.types.GenerateContentConfig(
            temperature=get_temperature(),
            max_output_tokens=get_max_tokens(),
            top_p=get_top_p(),
        )
    response = client.models.generate_content(**kwargs)
    return response.text
