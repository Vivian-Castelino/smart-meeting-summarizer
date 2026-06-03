import whisper
import textwrap
from transformers import pipeline
import torch

class MeetingSummarizationPipeline:
    def __init__(self, whisper_model="base"):
        self.device = 0 if torch.cuda.is_available() else -1
        self.whisper_model = whisper.load_model(whisper_model)
        self.summarizer = pipeline(
            task="summarization",
            model="facebook/bart-large-cnn",
            device=self.device
        )

    def transcribe_audio(self, audio_path):
        result = self.whisper_model.transcribe(audio_path, fp16=False)
        return result["text"]

    def summarize_text(self, text, max_chunk=400):
        words = text.split()
        chunks = [" ".join(words[i:i + max_chunk]) for i in range(0, len(words), max_chunk)]
        
        summaries = []
        for chunk in chunks:
            if len(chunk.split()) < 30: continue
            res = self.summarizer(chunk, max_new_tokens=150, min_length=40, do_sample=False)[0]["summary_text"]
            summaries.append(res)
        return " ".join(summaries)

    def extract_important_points(self, text):
        """New: Specifically extracts key highlights and action items."""
        words = text.split()
        # Smaller chunks often yield more detailed 'points'
        chunks = [" ".join(words[i:i + 250]) for i in range(0, len(words), 250)]
        
        points = []
        for chunk in chunks:
            # We use a shorter max_length to get concise bullet points
            res = self.summarizer(chunk, max_new_tokens=80, min_length=20, do_sample=False)[0]["summary_text"]
            # Formatting as a list item
            points.append(f"• {res}")
        return "\n".join(points)

    def process_meeting(self, audio_path):
        transcript = self.transcribe_audio(audio_path)
        summary = self.summarize_text(transcript)
        important_points = self.extract_important_points(transcript)
        
        return {
            "transcript": transcript,
            "summary": summary,
            "points": important_points
        }