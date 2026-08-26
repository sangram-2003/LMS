import requests

OLLAMA_URL = "http://localhost:11434/api/embeddings"

MODEL = "nomic-embed-text-v2-moe"




# Generate Embedding


def get_embedding(text):

    data = {
        "model": MODEL,
        "prompt": text
    }


    try:

        response = requests.post(
            OLLAMA_URL,
            json=data,
            timeout=120
        )


        if response.status_code != 200:

            print(
                "❌ Embedding Error:",
                response.text
            )

            return None



        result = response.json()


        embedding = result.get(
            "embedding"
        )


        if embedding is None:

            print(
                " No embedding returned"
            )

            return None



        return embedding



    except requests.exceptions.Timeout:

        print(
            " Embedding timeout"
        )

        return None



    except requests.exceptions.ConnectionError:

        print(
            " Cannot connect to Ollama"
        )

        return None



    except Exception as e:

        print(
            " Embedding Exception:",
            
        )

        return None