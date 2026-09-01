from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import mysql.connector

from utils.helpers import load_db
from core.search import search
from core.llm import generate_answer
from core.recommend import recommend

app = FastAPI()


# CORS

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# LOAD VECTOR DB

index, docs = load_db()
print("✅ Docs loaded successfully")



# MODELS

class Query(BaseModel):
    query: str


class RecommendRequest(BaseModel):
    roll_number: str



# DB FUNCTION

def get_user_activity(roll_number):
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="collegelibrery"
    )

    cursor = conn.cursor(dictionary=True)

    query = """
    SELECT isbn, action_type, search_term
    FROM user_activity
    WHERE roll_number = %s
    ORDER BY created_at DESC
    LIMIT 20
    """

    cursor.execute(query, (roll_number,))
    data = cursor.fetchall()

    cursor.close()
    conn.close()

    return data


# CHATBOT API

@app.post("/ask")
def ask(q: Query):

    print("\n========================")
    print("📩 User Query:", q.query)

    try:
        # Search
        docs_result, isbn_list = search(q.query, index, docs)

        print("📚 Documents Found:", len(docs_result))
        print("📦 ISBN:", isbn_list)

        if not docs_result:
            return {
                "answer": "No relevant book found.",
                "isbn": []
            }

        print("🤖 Calling generate_answer()...")

        answer = generate_answer(q.query, docs_result)

        print("✅ generate_answer() completed")
        print("📝 Answer:", answer)

        return {
            "answer": answer,
            "isbn": isbn_list
        }

    except Exception as e:
        print(" ERROR in /ask")
        print(type(e).__name__)
        print(str(e))

        return {
            "answer": f"Backend Error: {str(e)}",
            "isbn": []
        }



# RECOMMENDATION API

@app.post("/recommend")
def recommend_books(req: RecommendRequest):

    activity = get_user_activity(req.roll_number)

    if not activity:
        return {
            "message": "No activity found",
            "recommendations": []
        }

    results = recommend(activity, index, docs)

    return {
        "recommendations": results
    }