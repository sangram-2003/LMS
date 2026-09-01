import requests
from dotenv import load_dotenv

load_dotenv()


# OLLAMA CONFIGURATION

OLLAMA_URL = "http://localhost:11434/api/chat"
OLLAMA_MODEL = "qwen2.5:1.5b-instruct "



# PROMPT BUILDER


def build_prompt(query, context_docs):

    context = "\n\n".join(context_docs)

    prompt = f"""
You are LibAssist, a library management assistant.

The retrieval system has already selected the books from the library
database that are relevant to the user's query.

Your task is ONLY to give a short, natural-language answer to the user.

STRICT RULES:

1. Use ONLY the information provided in CONTEXT.
2. Do NOT use outside knowledge.
3. Do NOT invent any book, author, ISBN, availability, or other information.
4. Do NOT decide which books are relevant. The retrieval system has already done that.
5. Do NOT repeat the complete CONTEXT.
6. Do NOT output raw database records.
7. Do NOT output:
   Title:
   Author:
   ISBN:
   Available:
   for every book.
8. Do NOT list all retrieved book information in the answer.
9. Do NOT create a Markdown table.
10. Keep the answer concise.
11. If books are available in the CONTEXT, briefly tell the user that relevant books were found.
12. If the CONTEXT is empty, return exactly:
No relevant book found.

The actual book details will be displayed separately by the library interface.

CONTEXT:

{context}

USER QUESTION:

{query}

ANSWER:
"""

    return prompt


# GENERATE ANSWER


def generate_answer(query, context_docs):

    # No retrieved books
    if not context_docs:
        return "No relevant book found."

    prompt = build_prompt(
        query,
        context_docs
    )

    try:

        data = {
            "model": OLLAMA_MODEL,
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "stream": False,
            "options": {
                "temperature": 0.1
                
            }
        }

        print("\n==============================")
        print("📞 Calling Ollama")
        print("🤖 Model:", OLLAMA_MODEL)

        response = requests.post(
            OLLAMA_URL,
            json=data,
            timeout=300
        )

        print(
            "Status:",
            response.status_code
        )

        if response.status_code != 200:

            print(
                "Ollama Error:",
                response.text
            )

            return "Unable to generate answer."

        result = response.json()

        answer = (
            result
            .get("message", {})
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

        print(" Connection error")

        return "Cannot connect to LLM service."

    except Exception as e:

        print(
            "Exception:",
            e
        )

        return f"Error: {str(e)}"