/**
 * USE RESIZE CANVAS
 * <canvas id="my-canvas" width="480" height="270" />
 * const canvasCtx = canvas.getContext("2d")
 * const { xOffset, yOffset, newWidth, newHeight } = resizeCanvas(video, canvas);
 * canvasCtx.drawImage(video, xOffset, yOffset, newWidth, newHeight);
 */
export function resizeCanvas(srcNode, canvasNode) {
  const wrh = srcNode.width / srcNode.height;
  let newWidth = canvasNode.width;
  let newHeight = newWidth / wrh;
  if (newHeight > canvasNode.height) {
    newHeight = canvasNode.height;
    newWidth = newHeight * wrh;
  }
  const xOffset = newWidth < canvasNode.width ? (canvasNode.width - newWidth) / 2 : 0;
  const yOffset = newHeight < canvasNode.height ? (canvasNode.height - newHeight) / 2 : 0;

  return {
    xOffset,
    yOffset,
    newWidth,
    newHeight,
  };
}

export default () => {};
