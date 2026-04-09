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

def get_embedding(text):
    url = "https://openrouter.ai/api/v1/embeddings"

    data = {
        "model": "openai/text-embedding-3-small",
        "input": text
    }

    try:
        res = requests.post(url, headers=get_headers(), json=data)

        if res.status_code != 200:
            print("❌ Embedding Error:", res.text)
            return None

        return res.json()["data"][0]["embedding"]

    except Exception as e:
        print("❌ Embedding Exception:", e)
        return None