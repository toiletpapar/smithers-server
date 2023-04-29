const xmlns = 'http://www.w3.org/2000/svg'

const drawAnnotations = async () => {
  const img = document.getElementById('demo-image')

  const svg = document.createElementNS(xmlns, 'svg')
  svg.style.width = img.width
  svg.style.height = img.height
  svg.style.position = 'absolute'
  svg.style.left = 0
  svg.style.top = 0
  svg.id = 'annotation-layer'
  
  const annotationContainer = document.getElementById('annotation-container')
  annotationContainer.appendChild(svg)

  // Grab the demo data
  const response = await fetch('/data.json', {
    method: 'GET'
  })
  const data = await response.json()

  data.textAnnotations.forEach((annotation) => {
    const polygon = drawPolygon(svg, annotation.boundingPoly.vertices)

    if (polygon) {
      polygon.addEventListener('mousemove', function(evt) {
        showTooltip(evt, annotation.description)
      })

      polygon.addEventListener('mouseleave', function() {
        hideTooltip()
      })

      svg.appendChild(polygon)
    }
  })
}

// Given an array of verticies, draw lines between the vertices in the provided context
const drawPolygon = (svg, vertices) => {
  if (vertices.length > 2) {
    const polygon = document.createElementNS(xmlns, 'polygon')

    vertices.forEach((vertex) => {
      const point = svg.createSVGPoint()
      point.x = vertex.x
      point.y = vertex.y
      polygon.points.appendItem(point)
    })

    return polygon
  }

  return null
}

function showTooltip(evt, text) {
  let tooltip = document.getElementById('tooltip')
  tooltip.innerHTML = text
  tooltip.style.display = 'block'
  tooltip.style.left = evt.pageX + 10 + 'px'
  tooltip.style.top = evt.pageY + 10 + 'px'
}

function hideTooltip() {
  var tooltip = document.getElementById('tooltip')
  tooltip.style.display = 'none'
}

drawAnnotations()