import os
import sys
import json
import time


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE_DIR)

from core.search import search
from utils.helpers import load_db


index, docs = load_db()

if index is None or docs is None:
    print("Database not found.")
    print("Run: python -m scripts.build_vector_db")
    sys.exit(1)


# The golden dataset contains:{ User query ,Expected ISBNs}
# These are used as ground truth for evaluation.


dataset_path = os.path.join(
    os.path.dirname(__file__),
    "golden_dataset.json"
)

if not os.path.exists(dataset_path):
    print("golden_dataset.json not found")
    sys.exit(1)

with open(dataset_path, "r", encoding="utf-8") as f:
    dataset = json.load(f)



# Evaluation Function

def evaluate():

    total = len(dataset)

    # -----------------------------
    # Evaluation Counters
    # -----------------------------

    top1 = 0
    top3 = 0
    top5 = 0
    hit5 = 0

    precision5 = 0
    recall5 = 0
    f1_total = 0
    mrr_total = 0

    total_response_time = 0

    # Start overall evaluation timer
    overall_start = time.time()

  
    for item in dataset:

        query = item["query"]
        expected = item["expected_isbn"]

        print("\n====================================")
        print("QUERY:", query)

        
        start = time.time()

        _, isbn_list = search(query, index, docs)

        end = time.time()

        response_time = end - start
        total_response_time += response_time

        print("EXPECTED :", expected)
        print("RETRIEVED:", isbn_list)

       
        # Top-1 Accuracy
        
        if len(isbn_list) >= 1 and isbn_list[0] in expected:
            top1 += 1

        
        # Top-3 Accuracy
        
        if any(i in expected for i in isbn_list[:3]):
            top3 += 1

       
        # Top-5 Accuracy / Hit Rate@5
        
        if any(i in expected for i in isbn_list[:5]):
            top5 += 1
            hit5 += 1

        
        # Precision@5
        
        retrieved5 = isbn_list[:5]

        relevant = len(set(retrieved5) & set(expected))

        precision = relevant / max(len(retrieved5), 1)

        
        # Recall@5
        
        recall = relevant / len(expected)

        precision5 += precision
        recall5 += recall

      
        # F1@5
       
        if precision + recall > 0:
            f1 = (2 * precision * recall) / (precision + recall)
        else:
            f1 = 0

        f1_total += f1

        
        # Mean Reciprocal Rank (MRR) {Finds the rank of the first relevant document.}
        
       
        rr = 0

        for rank, isbn in enumerate(isbn_list, start=1):

            if isbn in expected:
                rr = 1 / rank
                break

        mrr_total += rr

        # Display metrics for the current query
        

        print("Precision@5 :", round(precision, 3))
        print("Recall@5    :", round(recall, 3))
        print("F1@5        :", round(f1, 3))
        print("MRR         :", round(rr, 3))
        print("Time        :", round(response_time, 4), "sec")

    
    # Compute overall evaluation statistics
    

    overall_end = time.time()

    total_eval_time = overall_end - overall_start

    avg_response = total_response_time / total

    throughput = total / total_eval_time

   
    # Final Evaluation Output
   
    print("FINAL EVALUATION")
    print("--------------------------------")

    print(f"Top-1 Accuracy        : {top1/total:.4f}")
    print(f"Top-3 Accuracy        : {top3/total:.4f}")
    print(f"Top-5 Accuracy        : {top5/total:.4f}")
    print(f"Hit Rate@5            : {hit5/total:.4f}")

    print(f"Precision@5           : {precision5/total:.4f}")
    print(f"Recall@5              : {recall5/total:.4f}")
    print(f"F1@5                  : {f1_total/total:.4f}")
    print(f"MRR                   : {mrr_total/total:.4f}")

    print(f"Average Response Time : {avg_response:.4f} sec")
    print(f"Total Evaluation Time : {total_eval_time:.4f} sec")
    print(f"Throughput            : {throughput:.2f} queries/sec")



if __name__ == "__main__":
    print("Starting evaluation...")
    evaluate()