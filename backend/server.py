from flask import Flask, request, jsonify
from gradio_client import Client
# from flask_cors import CORS
from lan import LANGS

app = Flask(__name__)

# Initialize Gradio client
client = Client("https://debanga-lang-app.hf.space/--replicas/s8sbp/")

# Enable CORS for a specific route
# CORS(app, resources={r"/translate": {"origins": "http://192.168.1.4:19000"}})


@app.route('/translate', methods=['POST'])
def translate():
    try:
        # Get data from the request
        data = request.get_json()
        print(data)
        source_language = data.get('sourceLanguage')
        target_language = data.get('targetLanguage')
        print(source_language)
        print(target_language)
        input_text = data.get('inputText')
        print(input_text)
        source_language = LANGS[source_language]
        target_language = LANGS[target_language]
        print(source_language)
        print(target_language)

        # Perform translation using Gradio client
        result = client.predict(
            source_language,
            target_language,
            input_text,
            api_name="/predict"
        )
        print(result)
        return jsonify(result)
        # return jsonify({"translation": result})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=False, port=5005)
