import requests
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("OPENROUTER_API_KEY")

def get_headers():
    return {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

def generate_answer(query, context_docs):
    url = "https://openrouter.ai/api/v1/chat/completions"

    context = "\n\n".join(context_docs)

    prompt = f"""
You are a library assistant.

STRICT RULES:
- Only recommend books from the context
- Do NOT add outside knowledge
- If no match: say "No relevant book found"
- Add isbn number with answer
- Conversation like support desk
Context:
{context}

User Question:
{query}

Answer format:
1. Book name
2. Reason
"""

    data = {
        "model": "deepseek/deepseek-chat",
        "messages": [
            {"role": "user", "content": prompt}
        ]
    }

    try:
        res = requests.post(url, headers=get_headers(), json=data)

        if res.status_code != 200:
            print("❌ LLM Error:", res.text)
            return "Error"

        return res.json()["choices"][0]["message"]["content"]

    except Exception as e:
        return str(e)