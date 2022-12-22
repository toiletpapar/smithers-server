const initializeCanvas = () => {
  const img = document.getElementById("demo-image")

  img.style.display = "none"

  const cnvs = document.getElementById("bounding-canvas")

  const ctx = cnvs.getContext("2d")
  ctx.canvas.height = img.height
  ctx.canvas.width = img.width
  ctx.drawImage(img, 0, 0)
}

// Given an array of verticies, draw lines between the vertices in the provided context
const drawPolygon = (ctx, vertices) => {
  if (vertices.length > 1) {
    ctx.beginPath()
    ctx.moveTo(vertices[0].x, vertices[0].y)

    vertices.slice(1, vertices.length).forEach((vertex) => {
      ctx.lineTo(vertex.x, vertex.y)
    })

    ctx.lineTo(vertices[0].x, vertices[0].y)
    ctx.stroke()
  }
}

const draw = async () => {
  const cnvs = document.getElementById("bounding-canvas")
  const ctx = cnvs.getContext("2d")
  ctx.lineWidth = 5
  ctx.strokeStyle = "blue"

  // Grab the demo data
  const response = await fetch('/data.json', {
    method: 'GET'
  })
  const data = await response.json()

  data.textAnnotations.forEach((annotation) => {
    drawPolygon(ctx, annotation.boundingPoly.vertices)
  })
}

