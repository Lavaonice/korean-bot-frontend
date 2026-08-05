// Candle melt animation for vanilla HTML
// Runs automatically on page load
(function() {
  let meltInterval;
  let flameHidden = false;
  
  function startCandleMelt() {
    const candle = document.querySelector('#candle');
    if (!candle) return;
    
    candle.classList.add('melting');
    let frame = 0;
    
    meltInterval = setInterval(() => {
      const padded = (frame + 1).toString().padStart(3, '0');
      const framePath = `assets/diary/candle-frames-240/${padded}.png`;
      candle.style.backgroundImage = `url("${framePath}")`;
      
      // Hide flame during final 12 frames (229-240)
      if (frame >= 228 && !flameHidden) {
        flameHidden = true;
        candle.classList.add('flame-extinguished');
      }
      
      frame++;
      if (frame >= 240) {
        clearInterval(meltInterval);
      }
    }, 50); // 50ms per frame = 12 seconds total
  }
  
  // Start after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startCandleMelt);
  } else {
    startCandleMelt();
  }
})();
