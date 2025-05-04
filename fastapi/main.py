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
session = ort.InferenceSession(MODEL_PATH)

@app.post("/predict")
async def predict(name: str = Form(...), image: UploadFile = File(...)):
    # Save uploaded TIFF
    input_path = os.path.join(OUTPUT_DIR, f"{name}_{image.filename}")
    with open(input_path, "wb") as f:
        f.write(await image.read())

    # Read and preprocess TIFF
    tiff_image = tifffile.imread(input_path)
    if tiff_image.ndim == 3:  # Convert to grayscale if RGB
        tiff_image = np.mean(tiff_image, axis=2).astype(np.uint8)
    
    # Preprocess for ONNX model (adjust based on your model)
    input_data = tiff_image.astype(np.float32) / 255.0
    input_data = np.expand_dims(input_data, axis=(0, 1))  # Shape: [1, 1, H, W]

    # Run inference
    input_name = session.get_inputs()[0].name
    outputs = session.run(None, {input_name: input_data})[0]

    # Post-process output (adjust based on your model)
    output_image = outputs[0, 0]  # Assuming single-channel output
    output_image = (output_image * 255).astype(np.uint8)

    # Save output as JPG
    output_filename = f"{name}_output.jpg"
    output_path = os.path.join(OUTPUT_DIR, output_filename)
    Image.fromarray(output_image).save(output_path, "JPEG")

    # Return URL for Express server
    image_url = f"http://localhost:8000/files/{output_filename}"
    return JSONResponse({"image_url": image_url})

@app.get("/files/{filename}")
async def get_file(filename: str):
    file_path = Path(OUTPUT_DIR) / filename
    if not file_path.exists():
        return JSONResponse({"error": "File not found"}, status_code=404)
    return FileResponse(file_path)