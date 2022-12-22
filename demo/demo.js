const initializeCanvas = () => {
  const img = document.getElementById("demo-image");
  const cnvs = document.getElementById("bounding-canvas");

  // Set Canvas dimensions
  cnvs.style.position = "absolute";
  cnvs.style.left = img.offsetLeft + "px";
  cnvs.style.top = img.offsetTop + "px";
  cnvs.style.height = img.height + "px";
  cnvs.style.width = img.width + "px";
}

const draw = () => {
  // Grab the demo data
  fetch('/data.json', {
    method: 'GET'
  }).then((res) => {
    console.log(res.body)
  })

  const cnvs = document.getElementById("bounding-canvas");

  var ctx = cnvs.getContext("2d");
  ctx.strokeRect(50, 50, 50, 50);

  // Filled triangle
  // ctx.beginPath();
  // ctx.moveTo(25, 25);
  // ctx.lineTo(105, 25);
  // ctx.lineTo(25, 105);
  // ctx.fill();

  // // Stroked triangle
  // ctx.beginPath();
  // ctx.moveTo(125, 125);
  // ctx.lineTo(125, 45);
  // ctx.lineTo(45, 125);
  // ctx.closePath();
  // ctx.stroke();
}

