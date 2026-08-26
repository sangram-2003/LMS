import os
import requests
from dotenv import load_dotenv

load_dotenv()



OLLAMA_URL = "http://localhost:11434/api/chat"
OLLAMA_MODEL = "llama3.2:1b"



# Prompt Builder


def build_prompt(query, context_docs):
    context = "\n\n".join(context_docs)

    prompt = f"""
You are LibAssist, a library management assistant.

You MUST answer ONLY from the retrieved context.

STRICT RULES:

- Never generate code.
- Never explain programming.
- Never use outside knowledge.
- Never invent books or authors.
- Never recommend books.
- Return only matching book information.
- Do not use Markdown.
- Do not add explanations.

If a matching book exists, return exactly:

Title:
Author:
ISBN:
Available:

If no matching book exists, return exactly:

No relevant book found.


Context:

{context}


User Question:

{query}


Answer:
"""

    return prompt


# ==========================
# Generate Answer
# ==========================

def generate_answer(query, context_docs):
    prompt = build_prompt(query, context_docs)

    try:
        data = {
            "model": OLLAMA_MODEL,
            "messages": [
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            "stream": False,
        }

        print("\n==============================")
        print("📞 Calling Ollama")
        print("🤖 Model:", OLLAMA_MODEL)

        response = requests.post(
            OLLAMA_URL,
            json=data,
            timeout=300,
        )

        print("Status:", response.status_code)

        if response.status_code != 200:
            print(response.text)
            return "Unable to generate answer."

        result = response.json()

        answer = (
            result.get("message", {})
            .get("content", "")
            .strip()
        )

        if not answer:
            return "No response generated."

        return answer

    except requests.exceptions.Timeout:
        print(" Request timeout")
        return "Model response timeout."

    except requests.exceptions.ConnectionError:
        print("Connection error")
        return "Cannot connect to LLM service."

    except Exception as e:
        print(" Exception:", e)
        return f"Error: {str(e)}"