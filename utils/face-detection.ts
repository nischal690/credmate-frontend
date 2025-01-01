import * as faceapi from 'face-api.js'

let modelsLoaded = false

export async function loadFaceDetectionModels() {
  if (modelsLoaded) return

  try {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    ])
    modelsLoaded = true
    console.log('Face detection models loaded successfully')
  } catch (error) {
    console.error('Error loading face detection models:', error)
    throw error
  }
}

export async function detectSingleFace(imageData: string): Promise<boolean> {
  if (!modelsLoaded) {
    await loadFaceDetectionModels()
  }

  try {
    const img = await createImageFromDataUrl(imageData)
    const detections = await faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
    return detections.length === 1
  } catch (error) {
    console.error('Error detecting face:', error)
    return false
  }
}

function createImageFromDataUrl(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = dataUrl
  })
}

