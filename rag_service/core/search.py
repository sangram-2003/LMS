import numpy as np

from core.embedding import get_embedding


SIMILARITY_THRESHOLD = 0.0450


def safe_lower(value):
    """
    Convert any value safely to lowercase.
    Handles None values.
    """

    if value is None:
        return ""

    return str(value).lower().strip()



# KEYWORD SCORE


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

    query_words = set(query.split())

    if not query_words:
        return 0

    score = 0

  #Tittle

    title_matches = sum(
        1
        for word in query_words
        if word in title
    )

    if title_matches > 0:

        print(" Query words → title")

        score += (
            title_matches / len(query_words)
        ) * 1.0

    
    # AUTHOR
    

    author_matches = sum(
        1
        for word in query_words
        if word in author
    )

    if author_matches > 0:

        print(" Query words → author")

        score += (
            author_matches / len(query_words)
        ) * 0.8

    
    # KEYWORDS
    

    keyword_matches = sum(
        1
        for word in query_words
        if word in keywords
    )

    if keyword_matches > 0:

        print(" Query words → keywords")

        score += (
            keyword_matches / len(query_words)
        ) * 0.7

    
    # DESCRIPTION
    

    description_matches = sum(
        1
        for word in query_words
        if word in description
    )

    if description_matches > 0:

        print("✅ Query words → description")

        score += (
            description_matches / len(query_words)
        ) * 0.5

   
    # GENRE
    

    genre_matches = sum(
        1
        for word in query_words
        if word in genre
    )

    if genre_matches > 0:

        print(" Query words → genre")

        score += (
            genre_matches / len(query_words)
        ) * 0.5

    
    # ISBN
   

    if query == isbn:

        print(" Query → ISBN")

        score += 1.5

#    {NORMALIZE}

    max_score = 5.0

    return score / max_score



# KEYWORD SEARCH


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



# HYBRID SEARCH


def search(query, index, docs, k=15):

    print("\n==============================")
    print("QUERY:", query)
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
            " Embedding failed"
        )

        return [], []

    vector = np.array(
        [embedding]
    ).astype(
        "float32"
    )

   
    # FAISS SEARCH
    

    distances, indexes = index.search(
        vector,
        k
    )

    print(
        "📊 FAISS Candidates:",
        len(indexes[0])
    )

    results = []

    
    # HYBRID RANKING
   

    for rank, idx in enumerate(indexes[0]):

        if idx >= len(docs):

            continue

        book = docs[idx]

        print("\n----------------------")

        print(
            "📘",
            book.get("title")
        )

        
        # VECTOR SCORE
       

        vector_score = 1 / (
            1 + float(distances[0][rank])
        )

        print(
            "📐 Vector Score:",
            vector_score
        )

        
        # KEYWORD SCORE
        

        kw_score = keyword_score(
            query,
            book
        )

        print(
            "🔤 Keyword Score:",
            kw_score
        )

        
        # HYBRID FINAL SCORE
       

        final_score = (

            0.4 * vector_score

            +

            0.6 * kw_score

        )

        print(
            " Final Score:",
            final_score
        )

        
        # THRESHOLD
        

        if final_score < SIMILARITY_THRESHOLD:

            print(
                "Removed by threshold:",
                final_score
            )

            continue

        print(
            " Passed threshold:",
            final_score
        )

        results.append(

            (
                final_score,
                book
            )

        )

    
    # SORT
    

    results.sort(
        key=lambda x: x[0],
        reverse=True
    )

    
    # FINAL TOP-5 RESULTS
    

    print("\n FINAL RESULTS")

    for score, book in results[:5]:

        print(
            book.get("title"),
            "=>",
            score
        )

    
    # RETURN TOP-5 CONTEXT
    

    top_docs = [

        book

        for score, book in results[:5]

    ]

    context_docs = [

        book.get("raw_text", "")

        for book in top_docs

    ]

    isbn_list = [

        book.get("isbn", "")

        for book in top_docs

    ]

    print(
        "\n ISBN:",
        isbn_list
    )

    return context_docs, isbn_list