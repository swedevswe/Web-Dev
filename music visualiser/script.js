document.addEventListener('DOMContentLoaded', () => {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const analyser = audioCtx.createAnalyser();
  const canvas = document.getElementById('canvas');
  const canvasCtx = canvas.getContext('2d');

  analyser.fftSize = 2048;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  function drawVisualizer() {
    requestAnimationFrame(drawVisualizer);

    analyser.getByteFrequencyData(dataArray);

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 350;

    const angleStep = (Math.PI * 2) / bufferLength;

    for (let i = 0; i < bufferLength; i++) {
      const amplitude = dataArray[i] / 128.0;
      const angle = i * angleStep;

      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      const circleRadius = 2 + 5 * amplitude;

      canvasCtx.fillStyle = 'firebrick';
      canvasCtx.beginPath();
      canvasCtx.arc(x, y, circleRadius, 0, 2 * Math.PI);
      canvasCtx.fill();
    }
  }

  const audioElement = new Audio('music.mp3');
  audioElement.addEventListener('canplay', () => {
    const source = audioCtx.createMediaElementSource(audioElement);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    audioElement.play();
  });

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  drawVisualizer();
});