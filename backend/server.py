from flask import Flask, request, jsonify
from gradio_client import Client, handle_file
# from flask_cors import CORS
from lan import LANGS, LANGS2
import tempfile
import traceback
import requests


# LANGS2= {
#     "afr": "Afrikaans",
#     "amh": "Amharic",
#     "arb": "Modern Standard Arabic",
#     "ary": "Moroccan Arabic",
#     "arz": "Egyptian Arabic",
#     "asm": "Assamese",
#     "ast": "Asturian",
#     "azj": "North Azerbaijani",
#     "bel": "Belarusian",
#     "ben": "Bengali",
#     "bos": "Bosnian",
#     "bul": "Bulgarian",
#     "cat": "Catalan",
#     "ceb": "Cebuano",
#     "ces": "Czech",
#     "ckb": "Central Kurdish",
#     "cmn": "Mandarin Chinese",
#     "cym": "Welsh",
#     "dan": "Danish",
#     "deu": "German",
#     "ell": "Greek",
#     "eng": "English",
#     "est": "Estonian",
#     "eus": "Basque",
#     "fin": "Finnish",
#     "fra": "French",
#     "gaz": "West Central Oromo",
#     "gle": "Irish",
#     "glg": "Galician",
#     "guj": "Gujarati",
#     "heb": "Hebrew",
#     "hin": "Hindi",
#     "hrv": "Croatian",
#     "hun": "Hungarian",
#     "hye": "Armenian",
#     "ibo": "Igbo",
#     "ind": "Indonesian",
#     "isl": "Icelandic",
#     "ita": "Italian",
#     "jav": "Javanese",
#     "jpn": "Japanese",
#     "kam": "Kamba",
#     "kan": "Kannada",
#     "kat": "Georgian",
#     "kaz": "Kazakh",
#     "kea": "Kabuverdianu",
#     "khk": "Halh Mongolian",
#     "khm": "Khmer",
#     "kir": "Kyrgyz",
#     "kor": "Korean",
#     "lao": "Lao",
#     "lit": "Lithuanian",
#     "ltz": "Luxembourgish",
#     "lug": "Ganda",
#     "luo": "Luo",
#     "lvs": "Standard Latvian",
#     "mai": "Maithili",
#     "mal": "Malayalam",
#     "mar": "Marathi",
#     "mkd": "Macedonian",
#     "mlt": "Maltese",
#     "mni": "Meitei",
#     "mya": "Burmese",
#     "nld": "Dutch",
#     "nno": "Norwegian Nynorsk",
#     "nob": "Norwegian Bokm\u00e5l",
#     "npi": "Nepali", 
#     "nya": "Nyanja",
#     "oci": "Occitan",
#     "ory": "Odia",
#     "pan": "Punjabi",
#     "pbt": "Southern Pashto",
#     "pes": "Western Persian",
#     "pol": "Polish",
#     "por": "Portuguese",
#     "ron": "Romanian",
#     "rus": "Russian",
#     "slk": "Slovak",
#     "slv": "Slovenian",
#     "sna": "Shona",
#     "snd": "Sindhi",
#     "som": "Somali",
#     "spa": "Spanish",
#     "srp": "Serbian",
#     "swe": "Swedish",
#     "swh": "Swahili",
#     "tam": "Tamil",
#     "tel": "Telugu",
#     "tgk": "Tajik",
#     "tgl": "Tagalog",
#     "tha": "Thai",
#     "tur": "Turkish",
#     "ukr": "Ukrainian",
#     "urd": "Urdu",
#     "uzn": "Northern Uzbek",
#     "vie": "Vietnamese",
#     "xho": "Xhosa",
#     "yor": "Yoruba",
#     "yue": "Cantonese",
#     "zlm": "Colloquial Malay",
#     "zsm": "Standard Malay",
#     "zul": "Zulu",
# }

app = Flask(__name__)

# Initialize Gradio client
client0 = Client("Debanga/lang_app")

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
        result = client0.predict(
            source_language,
            target_language,
            input_text,
            api_name="/predict"
        )
        print(result)
        return jsonify(result)
        return jsonify({"translation": result})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Initialize Gradio Client
client = Client("https://facebook-seamless-m4t-v2-large.hf.space/--replicas/otd97/")

@app.route('/speech-to-speech', methods=['POST'])
def speech_to_speech():
    try:
        data = request.get_json()
        input_audio = data.get('inputAudio')
        source_language = data.get('sourceLanguage')
        target_language = data.get('targetLanguage')
        
        result = client.predict(
            input_audio,
            source_language,
            target_language,
            api_name="/s2st"
        )
        return jsonify({"translatedAudio": result[0], "translatedText": result[1]})
    except Exception as e:
        error_trace = traceback.format_exc()
        return jsonify({"error": str(e), "traceback": error_trace}), 500

@app.route('/speech-to-text', methods=['POST'])
def speech_to_text():
    try:
        data = request.get_json()
        input_audio = data.get('inputAudio')
        source_language = data.get('sourceLanguage')
        target_language = data.get('targetLanguage')
        
        result = client.predict(
            input_audio,
            source_language,
            target_language,
            api_name="/s2tt"
        )
        return jsonify({"translatedText": result})
    except Exception as e:
        error_trace = traceback.format_exc()
        return jsonify({"error": str(e), "traceback": error_trace}), 500

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
        
        result = client.predict(
            input_text,
            source_language,
            target_language,
            api_name="/t2tt"
        )
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

if __name__ == '__main__':
    app.run(host = "0.0.0.0",debug=False, port = 5000)