document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('drawingCanvas');
  const ctx = canvas.getContext('2d');

  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;

  function draw(e) {
    if (!isDrawing) return;
    ctx.strokeStyle = document.getElementById('colorPicker').value;
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
});

