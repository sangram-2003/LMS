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
    print("🔄 Fetching books from API:", BOOKS_API)

    res = requests.get(BOOKS_API)
    print("📡 Status Code:", res.status_code)

    data = res.json()

    print("📦 RAW API DATA:")
    print(data)

    print("📊 Total Books:", len(data))
    return data


def prepare_docs(books):
    docs = []

    print("\n🔄 Preparing documents...")

    for i, b in enumerate(books):
        print(f"\n📘 Book {i+1}:")
        print(b)

        # ✅ Safe ISBN extraction
        isbn = ""
        for key in b.keys():
            if "isbn" in key.lower():
                isbn = b[key]
                break

        print("🔑 Extracted ISBN:", isbn)

        text = f"""
Title: {b.get('title', '')}
ISBN: {isbn}
Author: {b.get('author', '')}
Category: {b.get('category_id', '')}
Genre: {b.get('genre', '')}
Description: {b.get('description', '')}
Keywords: {b.get('keywords', '')}
Available: {b.get('available', '')}
"""

        print("🧾 DOC CREATED:")
        print(text)

        docs.append({
    "title": b.get("title", ""),
    "isbn": isbn,
    "text": text
})

    print("\n✅ Total Docs:", len(docs))
    return docs


def main():
    print("🚀 Building Vector DB...\n")

    books = fetch_books()
    docs = prepare_docs(books)

    embeddings = []

    print("\n🔄 Generating embeddings...")

    for i, doc in enumerate(docs):
        print(f"⚡ Embedding {i+1}")
        emb = get_embedding(doc["text"])

        if emb:
            embeddings.append(emb)
        else:
            print("❌ Embedding failed")

    arr = np.array(embeddings).astype("float32")

    index = faiss.IndexFlatL2(arr.shape[1])
    index.add(arr)

    os.makedirs("rag_service/data", exist_ok=True)

    save_db(index, docs)

    print("\n🎉 Vector DB Created Successfully!")


if __name__ == "__main__":
    main()