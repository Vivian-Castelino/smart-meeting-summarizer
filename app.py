from flask import Flask, render_template, request, jsonify, send_file
import os
from processor import MeetingSummarizationPipeline
from fpdf import FPDF
import io

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

pipeline = MeetingSummarizationPipeline(whisper_model="base")

@app.route('/')
def index():
    return jsonify({"message": "API running"})


@app.route('/summarize', methods=['POST'])
def summarize():
    try:
        print("FILES:", request.files)
        print("FORM:", request.form)

        if 'audio' not in request.files:
            return jsonify({"error": "No audio file received"}), 400

        file = request.files['audio']

        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(file_path)

        result = pipeline.process_meeting(file_path)

        return jsonify(result)

    except Exception as e:
        print("ERROR:", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/generate_pdf', methods=['POST'])
def generate_pdf():
    try:
        data = request.json
        summary = data.get('summary', '')
        points = data.get('points', '')

        def clean_text(text):
            return text.encode('latin-1', 'ignore').decode('latin-1')

        pdf = FPDF()
        pdf.add_page()
        
        # Title
        pdf.set_font("Arial", 'B', 16)
        pdf.cell(200, 10, txt="Meeting Minutes & Summary", ln=True, align='C')
        
        # Summary
        pdf.ln(10)
        pdf.set_font("Arial", 'B', 12)
        pdf.cell(200, 10, txt="Executive Summary", ln=True)
        pdf.set_font("Arial", '', 10)
        pdf.multi_cell(0, 5, txt=clean_text(summary))
        
        # Points
        pdf.ln(10)
        pdf.set_font("Arial", 'B', 12)
        pdf.cell(200, 10, txt="Important Points", ln=True)
        pdf.set_font("Arial", '', 10)
        pdf.multi_cell(0, 5, txt=clean_text(points))

        response = io.BytesIO(pdf.output(dest='S').encode('latin-1'))
        return send_file(response, mimetype='application/pdf', as_attachment=True, download_name="Summary.pdf")
    
    except Exception as e:
        print(f"PDF Error: {e}") 
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, threaded=True)