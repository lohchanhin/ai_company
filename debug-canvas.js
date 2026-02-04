// 在瀏覽器 Console 執行此腳本檢查 Pixi
console.log('=== Pixi Canvas Debug ===');
console.log('Canvas elements:', document.querySelectorAll('canvas').length);
document.querySelectorAll('canvas').forEach((canvas, i) => {
  console.log(`Canvas ${i}:`, {
    width: canvas.width,
    height: canvas.height,
    display: window.getComputedStyle(canvas).display,
    parent: canvas.parentElement?.className
  });
});
