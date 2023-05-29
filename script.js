const imageUpload = document.getElementById('uploadImg')
let image
let canvas
let box

Promise.all([
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
]).then(start)

async function start() {
  const container = document.getElementById('inputImg')
  document.body.append(container)
  imageUpload.addEventListener('change', async () => {
    if (image) image.remove()
    if (canvas) canvas.remove()
    image = await faceapi.bufferToImage(imageUpload.files[0])
    container.append(image)
    canvas = faceapi.createCanvasFromMedia(image)
    container.append(canvas)
    const displaySize = { width: image.width, height: image.height }
    faceapi.matchDimensions(canvas, displaySize)
    const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    resizedDetections.forEach(detection => {
      box = detection.detection.box
      const drawBox = new faceapi.draw.DrawBox(box)
      drawBox.draw(canvas)
  })
  faceExtraction()
  })
}

let outputImage = document.getElementById("outputImg")

async function faceExtraction(){ 
  const regionsToExtract = [
      new faceapi.Rect( box.x, box.y , box.width , box.height)
  ]
                      
  let faceImages = await faceapi.extractFaces(image, regionsToExtract)
  
      faceImages.forEach(canvas =>{      
          outputImage.src = canvas.toDataURL();      
      })   
}                       