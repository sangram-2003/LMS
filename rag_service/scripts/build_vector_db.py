import requests
import numpy as np
import faiss

from core.embedding import get_embedding
from utils.helpers import save_db


API = "http://localhost/LMS/Api/books/getBooks.php"


# ==============================
# FETCH BOOKS
# ==============================

def fetch_books():

    print("🔄 Fetching books from API...")


    try:

        res = requests.get(
            API,
            timeout=30
        )


        print(
            "📡 Status Code:",
            res.status_code
        )


        data = res.json()


        print(
            "✅ Books:",
            len(data)
        )


        return data



    except Exception as e:

        print(
            "❌ API Error:",
            e
        )

        return []



# ==============================
# PREPARE DOCS (NO NLP)
# ==============================

def prepare_docs(books):

    docs = []


    print(
        "\n🔄 Preparing Documents..."
    )


    for i, b in enumerate(books):


        print(
            f"\n📘 Book {i+1}: {b.get('title')}"
        )



        raw_text = f"""
Title: {b.get('title')}
Description: {b.get('description')}
Genre: {b.get('genre')}
Keywords: {b.get('keywords')}
Author: {b.get('author')}
ISBN: {b.get('isbn')}
"""



        # Simple lowercase only
        clean_text = raw_text.lower()



        print(
            "🧾 Raw:",
            raw_text[:150],
            "..."
        )


        print(
            "🧠 Clean:",
            clean_text[:150],
            "..."
        )



        docs.append({

            "title": b.get("title", ""),

            "author": b.get("author", ""),

            "isbn": b.get("isbn", ""),

            "keywords": b.get("keywords", ""),

            "description": b.get("description", ""),

            "genre": b.get("genre", ""),

            "available": b.get("available", ""),


            "raw_text": raw_text,


            "text": clean_text

        })



    print(
        "\n✅ Total Docs:",
        len(docs)
    )


    return docs




# ==============================
# EMBEDDINGS
# ==============================

def generate_embeddings(docs):

    embeddings = []


    print(
        "\n🔄 Generating Embeddings..."
    )


    for i, d in enumerate(docs):

        print(
            "Embedding:",
            i+1
        )


        emb = get_embedding(
            d["text"]
        )


        if emb is not None:

            embeddings.append(
                emb
            )



    print(
        "✅ Embeddings:",
        len(embeddings)
    )


    return embeddings




# ==============================
# BUILD FAISS INDEX
# ==============================

def build_index(embeddings):


    arr = np.array(
        embeddings
    ).astype(
        "float32"
    )



    index = faiss.IndexFlatL2(
        arr.shape[1]
    )


    index.add(arr)



    print(
        "✅ FAISS Index:",
        index.ntotal
    )



    return index




# ==============================
# MAIN
# ==============================

def main():


    books = fetch_books()



    if not books:

        print(
            "❌ No books found"
        )

        return



    docs = prepare_docs(
        books
    )



    embeddings = generate_embeddings(
        docs
    )



    if not embeddings:

        print(
            "❌ No embeddings generated"
        )

        return



    index = build_index(
        embeddings
    )



    save_db(
        index,
        docs
    )



    print(
        "\n🎉 DATABASE BUILD COMPLETE!"
    )




if __name__ == "__main__":

    main()