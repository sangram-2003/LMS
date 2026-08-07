import numpy as np
from core.embedding import get_embedding

# ==============================
# 🧠 NLTK SETUP
# ==============================
import nltk
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords, wordnet

# Run once (comment after first run)
nltk.download('wordnet')
nltk.download('omw-1.4')
nltk.download('stopwords')
nltk.download('averaged_perceptron_tagger')

lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words('english'))


# ==============================
# 🧠 POS TAG HELPER (Better Lemma)
# ==============================
def get_pos(word):
    tag = nltk.pos_tag([word])[0][1][0].upper()
    tag_dict = {
        "J": wordnet.ADJ,
        "V": wordnet.VERB,
        "N": wordnet.NOUN,
        "R": wordnet.ADV
    }
    return tag_dict.get(tag, wordnet.NOUN)


# ==============================
# 🧠 PREPROCESS FUNCTION
# ==============================
def preprocess(text):
    words = text.lower().split()

    cleaned = []
    for word in words:
        if word not in stop_words:
            lemma = lemmatizer.lemmatize(word, get_pos(word))
            cleaned.append(lemma)

    return cleaned


# ==============================
# 🔍 KEYWORD SCORE + DEBUG
# ==============================
def keyword_score(query, doc_text):
    query_words = preprocess(query)
    doc_words = preprocess(doc_text)

    score = 0
    matched = []
    not_matched = []

    # Extract title & keywords safely
    doc_lower = doc_text.lower()

    title_words = []
    keyword_words = []

    if "title:" in doc_lower:
        try:
            title = doc_lower.split("title:")[1].split("\n")[0]
            title_words = preprocess(title)
        except:
            pass

    if "keywords:" in doc_lower:
        try:
            kw = doc_lower.split("keywords:")[1]
            keyword_words = preprocess(kw)
        except:
            pass

    # Matching logic
    for word in query_words:
        sources = []

        if word in doc_words:
            score += 2
            sources.append("text")

        if word in title_words:
            score += 3
            sources.append("title")

        if word in keyword_words:
            score += 2
            sources.append("keywords")

        if sources:
            matched.append({
                "word": word,
                "matched_in": sources
            })
        else:
            not_matched.append(word)

    return score / 10, matched, not_matched, query_words


# ==============================
# 🔎 SEARCH FUNCTION
# ==============================
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

            doc_text = doc_obj.get("text", "")
            title = doc_obj.get("title", "N/A")
            isbn = doc_obj.get("isbn", "N/A")

            print(f"\n📘 Candidate {rank+1}")
            print("Title:", title)
            print("ISBN:", isbn)

            # =========================
            # 🔥 SCORING
            # =========================
            vector_score = 1 / (1 + D[0][rank])

            kw_score, matched, not_matched, processed_query = keyword_score(query, doc_text)

            final_score = (0.7 * vector_score) + (0.3 * kw_score)

            # =========================
            # 🧠 DEBUG OUTPUT
            # =========================
            print("\n🧠 NLP DEBUG")

            print("Processed Query:", processed_query)

            print("\nMatched Words:")
            if matched:
                for m in matched:
                    print(f"   ✅ {m['word']} → {m['matched_in']}")
            else:
                print("   ❌ No matches")

            print("\nUnmatched Words:")
            if not_matched:
                for nm in not_matched:
                    print(f"   ❌ {nm}")
            else:
                print("   ✅ All words matched")

            # 📊 Match Ratio
            total_words = len(processed_query)
            match_count = len(matched)

            print(f"\n📊 Match Ratio: {match_count}/{total_words}")

            # 📈 Scores
            print("\n📈 Scores")
            print("Vector Score:", round(vector_score, 4))
            print("Keyword Score:", round(kw_score, 4))
            print("Final Score:", round(final_score, 4))

            results.append((final_score, doc_obj))

    # =========================
    # 🏆 SORT RESULTS
    # =========================
    results.sort(key=lambda x: x[0], reverse=True)

    print("\n🏆 TOP RESULTS AFTER SORTING")

    top_docs = [doc for score, doc in results[:3]]

    isbn_list = [doc.get("isbn", "") for doc in top_docs]
    context_docs = [doc.get("text", "") for doc in top_docs]

    for i, doc in enumerate(top_docs):
        print(f"\n📗 Final Result {i+1}")
        print("Title:", doc.get("title"))
        print("ISBN:", doc.get("isbn"))

    print("\n📦 FINAL ISBN LIST:", isbn_list)

    return context_docs, isbn_list