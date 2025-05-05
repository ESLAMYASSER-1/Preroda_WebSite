from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from PIL import Image
import tifffile
import onnxruntime as ort
import os
from pathlib import Path

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:3000"], allow_methods=["*"], allow_headers=["*"])

# Paths
MODEL_PATH = "Final_Model.onnx"
OUTPUT_DIR = "files"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Load ONNX model
# session = ort.InferenceSession(MODEL_PATH)
print('python started')

@app.post("/receive-file/")
async def receive_file(file: UploadFile = File(...)):
    print('okkkkkk')
    contents = await file.read()
    # Process the file or save it
    with open(f"received_{file.filename}", "wb") as f:
        f.write(contents)
    return JSONResponse(content={"filename": file.filename, "message": "File received!"})