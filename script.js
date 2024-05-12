document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('drawingCanvas');
  const ctx = canvas.getContext('2d');

  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;

  function draw(e) {
    if (!isDrawing) return;
    const tool = document.getElementById('toolSelector').value;

    if (tool === 'pencil') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = document.getElementById('colorPicker').value;
    } else if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
    } else if (tool === 'fill') {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const tolerance = 10; // Adjust tolerance as needed
      const fillColor = document.getElementById('colorPicker').value;
      floodFill(imageData, e.offsetX, e.offsetY, fillColor, tolerance);
      ctx.putImageData(imageData, 0, 0);
    }

    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = document.getElementById('brushSize').value;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();

    [lastX, lastY] = [e.offsetX, e.offsetY];
  }

  canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
  });

  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', () => isDrawing = false);
  canvas.addEventListener('mouseout', () => isDrawing = false);

  document.getElementById('clearBtn').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });

  // Function to save canvas as PNG
  function saveAsPNG() {
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = url;
    link.click();
  }

  // Function to save canvas as JPEG
  function saveAsJPEG() {
    const url = canvas.toDataURL('image/jpeg', 0.8); // Quality set to 0.8
    const link = document.createElement('a');
    link.download = 'drawing.jpg';
    link.href = url;
    link.click();
  }

  document.getElementById('savePNGBtn').addEventListener('click', saveAsPNG);
  document.getElementById('saveJPGBtn').addEventListener('click', saveAsJPEG);

  function floodFill(imageData, startX, startY, fillColor, tolerance) {
    const stack = [[startX, startY]];
    const originalColor = getPixelColor(imageData, startX, startY);
    const targetColor = hexToRgb(fillColor);

    while (stack.length) {
      const [x, y] = stack.pop();
      const currentColor = getPixelColor(imageData, x, y);

      if (colorMatch(currentColor, originalColor, tolerance)) {
        setPixelColor(imageData, x, y, targetColor);

        stack.push([x + 1, y]);
        stack.push([x - 1, y]);
        stack.push([x, y + 1]);
        stack.push([x, y - 1]);
      }
    }
  }

  function getPixelColor(imageData, x, y) {
    const index = (y * imageData.width + x) * 4;
    return {
      r: imageData.data[index],
      g: imageData.data[index + 1],
      b: imageData.data[index + 2],
      a: imageData.data[index + 3]
    };
  }

  function setPixelColor(imageData, x, y, color) {
    const index = (y * imageData.width + x) * 4;
    imageData.data[index] = color.r;
    imageData.data[index + 1] = color.g;
    imageData.data[index + 2] = color.b;
    imageData.data[index + 3] = color.a;
  }

  function colorMatch(color1, color2, tolerance) {
    return Math.abs(color1.r - color2.r) <= tolerance &&
           Math.abs(color1.g - color2.g) <= tolerance &&
           Math.abs(color1.b - color2.b) <= tolerance;
  }

  function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
      a: 255
    };
  }
});


