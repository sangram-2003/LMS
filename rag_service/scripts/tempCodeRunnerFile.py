import requests
import numpy as np
import faiss
import os
from dotenv import load_dotenv

from core.embedding import get_embedding
from utils.helpers import save_db

load_dotenv()

BOOKS_API = os.getenv("BOOKS_API_URL")


def fetch_books():
    res = requests.get(BOOKS_API)
    return res.json()


def prepare_docs(books):
    docs = []

    for b in books:
        text = f"""
Title: {b.get('title', '')}
Author: {b.get('author', '')}
Category: {b.get('category_id', '')}
Genre: {b.get('genre', '')}
Description: {b.get('description', '')}
Keywords: {b.get('keywords', '')}
Available: {b.get('available', '')}
"""
        docs.append(text)

    return docs


def main():
    print("🚀 Building Vector DB...")

    books = fetch_books()
    docs = prepare_docs(books)

    embeddings = []

    for doc in docs:
        emb = get_embedding(doc)
        if emb:
            embeddings.append(emb)

    arr = np.array(embeddings).astype("float32")

    index = faiss.IndexFlatL2(arr.shape[1])
    index.add(arr)

    os.makedirs("rag_service/data", exist_ok=True)

    save_db(index, docs)

    print("✅ Vector DB Created!")


if __name__ == "__main__":
    main()