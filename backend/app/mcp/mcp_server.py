import os, sys, json, argparse
from typing import Any

sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
from mcp.server import Server, NotificationOptions
from mcp.server.models import InitializationOptions
import mcp.server.stdio
import mcp.types as types

load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '.env'))

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./data/mytution.db")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

from app.models import TutorProfile, ParentRequirement, TutorApplication, Review
from app.ai.match_flow import run_ai_match

server = Server("mytuition-mcp")

@server.list_tools()
async def handle_list_tools() -> list[types.Tool]:
    return [
        types.Tool(name="get_available_tutors", description="Get list of approved tutors filtered by subject, class, area", inputSchema={"type": "object", "properties": {"subject": {"type": "string"}, "class_level": {"type": "string"}, "area": {"type": "string"}}}),
        types.Tool(name="get_parent_requirement", description="Get full details of a parent requirement by ID", inputSchema={"type": "object", "properties": {"requirement_id": {"type": "integer"}}, "required": ["requirement_id"]}),
        types.Tool(name="match_tutors_with_ai", description="Run AI matching for a requirement and get ranked tutors", inputSchema={"type": "object", "properties": {"requirement_id": {"type": "integer"}}, "required": ["requirement_id"]}),
        types.Tool(name="get_tutor_reviews", description="Get all reviews for a specific tutor", inputSchema={"type": "object", "properties": {"tutor_id": {"type": "integer"}}, "required": ["tutor_id"]}),
        types.Tool(name="update_application_status", description="Update the status of a tutor application", inputSchema={"type": "object", "properties": {"application_id": {"type": "integer"}, "status": {"type": "string", "enum": ["accepted", "rejected"]}}, "required": ["application_id", "status"]}),
        types.Tool(name="get_tutor_stats", description="Get tutor statistics", inputSchema={"type": "object", "properties": {"tutor_id": {"type": "integer"}}, "required": ["tutor_id"]}),
    ]

@server.call_tool()
async def handle_call_tool(name: str, arguments: dict[str, Any] | None) -> list[types.TextContent]:
    db = SessionLocal()
    try:
        if name == "get_available_tutors":
            query = db.query(TutorProfile).filter(TutorProfile.is_approved == True)
            if arguments:
                if arguments.get("subject"):
                    query = query.filter(TutorProfile.subjects.astext.contains(arguments["subject"]))
                if arguments.get("class_level"):
                    query = query.filter(TutorProfile.classes_handled.astext.contains(arguments["class_level"]))
                if arguments.get("area"):
                    query = query.filter(TutorProfile.area_in_ranchi.ilike(f"%{arguments['area']}%"))
            tutors = query.all()
            result = [{"id": t.id, "name": t.full_name, "qualification": t.qualification, "subjects": t.subjects, "classes": t.classes_handled, "board": t.board, "mode": t.teaching_mode, "area": t.area_in_ranchi, "fee": t.expected_fee, "experience": t.experience_years, "rating": t.rating} for t in tutors]
            return [types.TextContent(type="text", text=json.dumps(result, indent=2, default=str))]
        elif name == "get_parent_requirement":
            req_id = arguments.get("requirement_id") if arguments else None
            if not req_id:
                return [types.TextContent(type="text", text="Missing requirement_id")]
            req = db.query(ParentRequirement).filter(ParentRequirement.id == req_id).first()
            if not req:
                return [types.TextContent(type="text", text="Requirement not found")]
            result = {"id": req.id, "child_class": req.child_class, "subjects_needed": req.subjects_needed, "board": req.board, "preferred_timing": req.preferred_timing, "location_area": req.location_area, "budget_per_month": req.budget_per_month, "teaching_mode": req.teaching_mode, "special_notes": req.special_notes, "status": req.status, "created_at": str(req.created_at)}
            return [types.TextContent(type="text", text=json.dumps(result, indent=2, default=str))]
        elif name == "match_tutors_with_ai":
            req_id = arguments.get("requirement_id") if arguments else None
            if not req_id:
                return [types.TextContent(type="text", text="Missing requirement_id")]
            try:
                result = run_ai_match(req_id, db)
                return [types.TextContent(type="text", text=json.dumps(result, indent=2, default=str))]
            except Exception as e:
                return [types.TextContent(type="text", text=f"AI match failed: {str(e)}")]
        elif name == "get_tutor_reviews":
            tutor_id = arguments.get("tutor_id") if arguments else None
            if not tutor_id:
                return [types.TextContent(type="text", text="Missing tutor_id")]
            reviews = db.query(Review).filter(Review.tutor_id == tutor_id).all()
            result = [{"id": r.id, "parent_id": r.parent_id, "rating": r.rating, "comment": r.comment, "created_at": str(r.created_at)} for r in reviews]
            return [types.TextContent(type="text", text=json.dumps(result, indent=2, default=str))]
        elif name == "update_application_status":
            app_id = arguments.get("application_id") if arguments else None
            status_val = arguments.get("status") if arguments else None
            if not app_id or not status_val:
                return [types.TextContent(type="text", text="Missing application_id or status")]
            app = db.query(TutorApplication).filter(TutorApplication.id == app_id).first()
            if not app:
                return [types.TextContent(type="text", text="Application not found")]
            app.status = status_val
            db.commit()
            return [types.TextContent(type="text", text=f"Application {app_id} updated to {status_val}")]
        elif name == "get_tutor_stats":
            tutor_id = arguments.get("tutor_id") if arguments else None
            if not tutor_id:
                return [types.TextContent(type="text", text="Missing tutor_id")]
            apps = db.query(TutorApplication).filter(TutorApplication.tutor_id == tutor_id).all()
            total = len(apps)
            accepted = sum(1 for a in apps if a.status == "accepted")
            rate = round((accepted / total * 100), 1) if total else 0
            revs = db.query(Review).filter(Review.tutor_id == tutor_id).all()
            avg = round(sum(r.rating for r in revs) / len(revs), 1) if revs else 0
            result = {"tutor_id": tutor_id, "total_applications": total, "accepted": accepted, "acceptance_rate": rate, "total_reviews": len(revs), "avg_rating": avg}
            return [types.TextContent(type="text", text=json.dumps(result, indent=2, default=str))]
        else:
            return [types.TextContent(type="text", text=f"Unknown tool: {name}")]
    finally:
        db.close()

async def run_server():
    async with mcp.server.stdio.stdio_server() as (read_stream, write_stream):
        await server.run(read_stream, write_stream, InitializationOptions(server_name="mytuition-mcp", server_version="0.1.0", capabilities=server.get_capabilities(notification_options=NotificationOptions(), experimental_capabilities={})))

def main():
    parser = argparse.ArgumentParser(description="MY Tuition MCP Server")
    parser.add_argument("--port", type=int, default=8001)
    args = parser.parse_args()
    import asyncio
    asyncio.run(run_server())

if __name__ == "__main__":
    main()
