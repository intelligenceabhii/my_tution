from ..database import SessionLocal

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

def get_active_provider():
    config = _load_config()
    if config and config.ai_provider:
        return config.ai_provider
    return "gemini"

def generate_content(prompt: str, use_config: bool = True) -> str:
    provider = get_active_provider()
    if provider == "groq":
        from .groq_client import groq_generate_content
        return groq_generate_content(prompt, use_config)
    else:
        from .gemini_client import generate_content as gemini_generate
        return gemini_generate(prompt, use_config)
