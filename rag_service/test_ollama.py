import requests

url = "http://localhost:11434/api/chat"

data = {
    "model": "gemma4:12b",
    "messages": [
        {
            "role": "user",
            "content": "Hello"
        }
    ],
    "stream": False
}

try:
    response = requests.post(url, json=data, timeout=30)

    print("Status Code:", response.status_code)
    print(response.text)

except Exception as e:
    print(type(e).__name__)
    print(e)