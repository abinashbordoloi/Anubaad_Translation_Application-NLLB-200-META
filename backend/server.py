import os
from base64 import b64encode
from flask import Flask, request, jsonify
from gradio_client import Client, handle_file, file
from flask_cors import CORS
from lan import LANGS, LANGS2
import tempfile
import traceback
import requests
# from ai4bharat.transliteration import XlitEngine


app = Flask(__name__)
# CORS(app)

# Initialize Gradio client
# client0 = Client("abinashbordoloi/Anubaad-Assamese-Translation-Model_NLLB-200")

# Enable CORS for a specific route
# CORS(app, resources={r"/translate": {"origins": "http://192.168.1.4:19000"}})


# @app.route('/translate', methods=['POST'])

# def translate():
#     try:
#         data = request.get_json()
#         print(f"Received data: {data}")

#         source_language = data.get('sourceLanguage')
#         target_language = data.get('targetLanguage')
#         input_text = data.get('inputText')

#         print(f"Source Language: {source_language}")
#         print(f"Target Language: {target_language}")
#         print(f"Input Text: {input_text}")

#         source_language = LANGS[source_language]
#         target_language = LANGS[target_language]

#         result = client0.predict(
#             source_language,
#             target_language,
#             input_text,
#             api_name="/predict"
#         )
#         print(f"Translation Result: {result}")
#         return jsonify(result)

#     except Exception as e:
#         error_trace = traceback.format_exc()
#         print(f"Error: {error_trace}")
#         return jsonify({"error": str(e), "traceback": error_trace}), 500


@app.route('/dictionary', methods=['POST'])
def dictionary():
    try:
        # Parse the incoming JSON request data
        data = request.get_json()
        input_text = data.get('inputText')
        source_language = data.get('sourceLanguage')

        # Initialize the transliteration engine
        e = XlitEngine("as", beam_width=10, rescore=True)

        # Perform transliteration
        out = e.translit_word(input_text, topk=5)

        # Return the result as JSON
        return jsonify(out), 200

    except Exception as e:
        # Handle any errors
        return jsonify({"error": str(e)}), 500


client = Client("https://facebook-seamless-m4t-v2-large.hf.space")
# whisper = Client("abidlabs/whisper-large-v2")
# print(client)

# print(client.view_api())


@app.route('/text-to-speech', methods=['POST'])
def text_to_speech():
    try:
        data = request.get_json()
        input_text = data.get('inputText')
        source_language = data.get('sourceLanguage')
        target_language = data.get('targetLanguage')

        result = client.predict(
            input_text,
            source_language,
            target_language,
            api_name="/t2st"
        )
        return jsonify({"translatedAudio": result[0], "translatedText": result[1]})
    except Exception as e:
        error_trace = traceback.format_exc()
        return jsonify({"error": str(e), "traceback": error_trace}), 500


@app.route('/text-to-text', methods=['POST'])
def text_to_text():
    try:
        data = request.get_json()
        input_text = data.get('inputText')
        source_language = data.get('sourceLanguage')
        target_language = data.get('targetLanguage')
        print(input_text)
        print(source_language)
        print(target_language)

        result = client.predict(
            input_text,
            source_language,
            target_language,
            api_name="/t2tt"
        )
        print(result)

        return jsonify({"translatedText": result})
    except Exception as e:
        error_trace = traceback.format_exc()
        return jsonify({"error": str(e), "traceback": error_trace}), 500


@app.route('/automatic-speech-recognition', methods=['POST'])
def automatic_speech_recognition():
    try:
        data = request.get_json()
        input_audio = data.get('inputAudio')
        target_language = data.get('targetLanguage')

        result = client.predict(
            input_audio,
            target_language,
            api_name="/asr"
        )
        return jsonify({"recognizedText": result})
    except Exception as e:
        error_trace = traceback.format_exc()
        return jsonify({"error": str(e), "traceback": error_trace}), 500


@app.route('/speech-to-speech', methods=['POST'])
def speech_to_speech():
    try:
        # Get JSON data from the request
        data = request.json

        # Extract required fields from JSON data
        uri = data.get('uri')
        source_language = data.get('sourceLanguage', 'default_source_language')
        target_language = data.get('targetLanguage', 'default_target_language')

        if not uri:
            return jsonify({"error": "No URI provided"}), 400

        # Perform speech-to-speech translation logic
        result = client.predict(
            uri,
            source_language,
            target_language,
            api_name="/s2st"
        )
        print(result)

        # Construct the response based on the expected output
        translation_result = {
            "translatedAudio": result.get("translated_speech", "/path/to/default/audio.wav"),
            "translatedText": result.get("translated_text", "Translated text not available")
        }

        return jsonify(translation_result), 200

    except Exception as e:
        # Log the exception for debugging
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500


@app.route('/whisper', methods=['POST'])
def whisper():
    try:
        data = request.get_json()
        input_audio = data.get('input_audio')
        # source_language = data.get('sourceLanguage')
        # target_language = data.get('targetLanguage')
        print(input_audio)
        result = whisper.predict(
            input_audio,
            api_name="/predict"
        )
        print(result)

        return jsonify({"translatedText": result})
    except Exception as e:
        error_trace = traceback.format_exc()
        return jsonify({"error": str(e), "traceback": error_trace}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
