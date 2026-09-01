import pickle
import faiss
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "data")



# ==========================
# SAVE DATABASE
# ==========================

def save_db(index, docs):

    os.makedirs(
        DATA_PATH,
        exist_ok=True
    )


    index_path = os.path.join(
        DATA_PATH,
        "vector.index"
    )


    docs_path = os.path.join(
        DATA_PATH,
        "docs.pkl"
    )


    # Save FAISS index

    faiss.write_index(
        index,
        index_path
    )


    # Save documents

    with open(
        docs_path,
        "wb"
    ) as f:

        pickle.dump(
            docs,
            f
        )


    print("✅ Database saved")



# ==========================
# LOAD DATABASE
# ==========================

def load_db():

    index_path = os.path.join(
        DATA_PATH,
        "vector.index"
    )


    docs_path = os.path.join(
        DATA_PATH,
        "docs.pkl"
    )



    if (
        os.path.exists(index_path)
        and os.path.exists(docs_path)
    ):


        index = faiss.read_index(
            index_path
        )



        with open(
            docs_path,
            "rb"
        ) as f:

            docs = pickle.load(
                f
            )


        print(
            "✅ Database loaded"
        )


        print(
            "📚 Documents:",
            len(docs)
        )


        return index, docs



    print(
        "❌ Database not found"
    )


    return None, None