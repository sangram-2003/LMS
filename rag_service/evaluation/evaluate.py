import json
import time
from core.search import search
from utils.helpers import load_db

index, docs = load_db()

with open("evaluation/golden_dataset.json", "r") as f:
    dataset = json.load(f)


def evaluate():
    total = len(dataset)

    top1 = 0
    top3 = 0
    total_time = 0

    for item in dataset:
        query = item["query"]
        expected = item["expected_isbn"]

        print("\n====================")
        print("QUERY:", query)

        start = time.time()

        context_docs, isbn_list = search(query, index, docs)

        end = time.time()

        total_time += (end - start)

        print("EXPECTED:", expected)
        print("GOT:", isbn_list)

        # TOP 1 ACCURACY
        if isbn_list and isbn_list[0] in expected:
            top1 += 1

        # TOP 3 ACCURACY
        if any(i in expected for i in isbn_list):
            top3 += 1

    print("\n🔥 FINAL RESULT")
    print("Top-1 Accuracy:", top1 / total)
    print("Top-3 Accuracy:", top3 / total)
    print("Avg Response Time:", total_time / total, "sec")


if __name__ == "__main__":
    evaluate()