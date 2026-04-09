import numpy as np
from core.embedding import get_embedding



# KEYWORD SCORE

def keyword_score(query, doc_text):
    query_words = query.lower().split()
    doc_lower = doc_text.lower()

    score = 0

    for word in query_words:
        if word in doc_lower:
            score += 2

        # Title boost
        if "title:" in doc_lower:
            try:
                title = doc_lower.split("title:")[1].split("\n")[0]
                if word in title:
                    score += 3
            except:
                pass

        # Keywords boost
        if "keywords:" in doc_lower:
            try:
                kw = doc_lower.split("keywords:")[1]
                if word in kw:
                    score += 2
            except:
                pass

    return score / 10



#  SEARCH FUNCTION

def search(query, index, docs, k=5):
    print("\n==============================")
    print("🔍 SEARCH QUERY:", query)
    print("==============================")

    emb = get_embedding(query)
    if emb is None:
        print("❌ Embedding failed")
        return [], []

    q = np.array([emb]).astype("float32")
    D, I = index.search(q, k)

    results = []

    for rank, idx in enumerate(I[0]):
        if idx < len(docs):

            doc_obj = docs[idx]

            # ✅ SAFE ACCESS
            doc_text = doc_obj.get("text", "")
            title = doc_obj.get("title", "N/A")
            isbn = doc_obj.get("isbn", "N/A")

            print(f"\n📘 Candidate {rank+1}")
            print("Index:", idx)
            print("Title:", title)
            print("ISBN:", isbn)

            # 🔥 Scores
            vector_score = 1 / (1 + D[0][rank])
            kw_score = keyword_score(query, doc_text)
            final_score = (0.7 * vector_score) + (0.3 * kw_score)

            print("Vector Score:", round(vector_score, 4))
            print("Keyword Score:", round(kw_score, 4))
            print("Final Score:", round(final_score, 4))

            results.append((final_score, doc_obj))

    #sort

    results.sort(key=lambda x: x[0], reverse=True)

    print("\n🏆 TOP RESULTS AFTER SORTING")

    top_docs = [doc for score, doc in results[:3]]

    # SAFE ISBN EXTRACTION
    isbn_list = [doc.get("isbn", "") for doc in top_docs]

    # CONTEXT FOR LLM
    context_docs = [doc.get("text", "") for doc in top_docs]

    for i, doc in enumerate(top_docs):
        print(f"\n📗 Final Result {i+1}")
        print("Title:", doc.get("title"))
        print("ISBN:", doc.get("isbn"))

    print("\n📦 FINAL ISBN LIST:", isbn_list)

    return context_docs, isbn_list