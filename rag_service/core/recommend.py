import numpy as np
from core.embedding import get_embedding

def build_user_query(activity):
    search_terms = []

    for row in activity:
        if row.get("search_term"):
            search_terms.append(row["search_term"])

    query = " ".join(search_terms)

    if not query:
        query = "popular books programming data structures"

    return query


def recommend(activity, index, docs, k=5):
    print("\n==============================")
    print("🤖 RECOMMENDATION MODE")
    print("==============================")

    query = build_user_query(activity)
    print("🧠 Generated Query:", query)

    emb = get_embedding(query)
    if emb is None:
        print("❌ Embedding failed")
        return []

    q = np.array([emb]).astype("float32")
    D, I = index.search(q, k)

    viewed_books = {}
    requested_books = set()

    for row in activity:
        isbn = row.get("isbn")

        if not isbn:
            continue

        if row["action_type"] == "view":
            viewed_books[isbn] = viewed_books.get(isbn, 0) + 1

        elif row["action_type"] == "request":
            requested_books.add(isbn)

    results = []

    for rank, idx in enumerate(I[0]):
        if idx < len(docs):
            doc = docs[idx]

            isbn = doc.get("isbn", "")
            doc_text = doc.get("text", "")

            if isbn in requested_books:
                continue

            vector_score = 1 / (1 + D[0][rank])
            final_score = vector_score

            if isbn in viewed_books:
                final_score += 0.1 * viewed_books[isbn]

            results.append({
                "isbn": isbn,
                "title": doc.get("title"),
                "score": float(round(final_score, 4))
            })

    results.sort(key=lambda x: x["score"], reverse=True)

    print("\n🏆 FINAL RECOMMENDATIONS:")
    for r in results:
        print(r)

    return results[:8]