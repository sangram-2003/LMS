import numpy as np

from core.embedding import get_embedding



# ==========================
# SAFE LOWER
# ==========================

def safe_lower(value):
    """
    Convert any value safely to lowercase.
    Handles None values.
    """

    if value is None:
        return ""

    return str(value).lower().strip()



# ==========================
# KEYWORD SCORE
# ==========================

def keyword_score(query, book):

    query = safe_lower(query)


    if not query:
        return 0



    title = safe_lower(
        book.get("title")
    )

    author = safe_lower(
        book.get("author")
    )

    genre = safe_lower(
        book.get("genre")
    )

    description = safe_lower(
        book.get("description")
    )

    keywords = safe_lower(
        book.get("keywords")
    )

    isbn = safe_lower(
        book.get("isbn")
    )



    score = 0



    # ======================
    # FIELD MATCHING
    # ======================


    # Title
    if query in title:

        print("✅ Query → title")

        score += 1.0



    # Author
    if query in author:

        print("✅ Query → author")

        score += 0.8



    # Keywords
    if query in keywords:

        print("✅ Query → keywords")

        score += 0.7



    # Description
    if query in description:

        print("✅ Query → description")

        score += 0.5



    # Genre
    if query in genre:

        print("✅ Query → genre")

        score += 0.5



    # ISBN
    if query == isbn:

        print("✅ Query → ISBN")

        score += 1.5



    # Normalize

    max_score = 5.0

    return score / max_score





# ==========================
# KEYWORD SEARCH
# ==========================

def keyword_search(query, documents):

    results = []


    for doc in documents:


        score = keyword_score(
            query,
            doc
        )


        if score > 0:

            results.append(
                {
                    "document": doc,
                    "keyword_score": score
                }
            )



    results.sort(
        key=lambda x: x["keyword_score"],
        reverse=True
    )


    return results





# ==========================
# HYBRID SEARCH
# ==========================

def search(query, index, docs, k=15):


    print("\n==============================")
    print("🔍 QUERY:", query)
    print("==============================")



    query = safe_lower(query)



    if not query:

        return [], []



    # ======================
    # EMBEDDING
    # ======================

    embedding = get_embedding(
        query
    )


    if embedding is None:

        print(
            "❌ Embedding failed"
        )

        return [], []



    vector = np.array(
        [embedding]
    ).astype(
        "float32"
    )



    # ======================
    # FAISS SEARCH
    # ======================

    distances, indexes = index.search(
        vector,
        k
    )


    print(
        "📊 FAISS Candidates:",
        len(indexes[0])
    )



    results = []



    # ======================
    # HYBRID RANKING
    # ======================

    for rank, idx in enumerate(indexes[0]):


        if idx >= len(docs):

            continue



        book = docs[idx]



        print("\n----------------------")

        print(
            "📘",
            book.get("title")
        )



        # FAISS distance to score

        vector_score = 1 / (
            1 + float(distances[0][rank])
        )


        print(
            "📐 Vector Score:",
            vector_score
        )



        # Keyword score

        kw_score = keyword_score(
            query,
            book
        )


        print(
            "🔤 Keyword Score:",
            kw_score
        )



        # Final hybrid score

        final_score = (

            0.6 * vector_score

            +

            0.4 * kw_score

        )



        print(
            "🏆 Final Score:",
            final_score
        )



        results.append(

            (
                final_score,
                book
            )

        )



    # Sort

    results.sort(
        key=lambda x:x[0],
        reverse=True
    )



    print("\n🏆 FINAL RESULTS")



    for score, book in results[:5]:

        print(
            book.get("title"),
            "=>",
            score
        )



    # ======================
    # RETURN CONTEXT
    # ======================

    top_docs = [

        book

        for score, book in results[:5]

    ]



    context_docs = [

        book.get("raw_text","")

        for book in top_docs

    ]



    isbn_list = [

        book.get("isbn","")

        for book in top_docs

    ]



    print(
        "\n📦 ISBN:",
        isbn_list
    )



    return context_docs, isbn_list