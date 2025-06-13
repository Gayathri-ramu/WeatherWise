# Keep feedback route only
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import JSONResponse

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

FEEDBACK_FILE = "feedback.txt"

class Feedback(BaseModel):
    name: str
    email: str
    message: str

@app.post("/submit-feedback/")
async def submit_feedback(feedback: Feedback):
    try:
        with open(FEEDBACK_FILE, "a", encoding="utf-8") as f:
            f.write(f"Name: {feedback.name}\nEmail: {feedback.email}\nMessage: {feedback.message}\n---\n")
        return {"status": "success"}
    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})
