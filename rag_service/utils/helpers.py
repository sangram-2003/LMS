import pickle
import faiss
import os

DATA_PATH = "rag_service/data"

def save_db(index, docs):
    faiss.write_index(index, f"{DATA_PATH}/vector.index")

    with open(f"{DATA_PATH}/docs.pkl", "wb") as f:
        pickle.dump(docs, f)


def load_db():
    index_path = f"{DATA_PATH}/vector.index"
    docs_path = f"{DATA_PATH}/docs.pkl"

    if os.path.exists(index_path) and os.path.exists(docs_path):
        index = faiss.read_index(index_path)

        with open(docs_path, "rb") as f:
            docs = pickle.load(f)

        return index, docs

    return None, None