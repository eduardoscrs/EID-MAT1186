import { drawFallbackCircle, drawNoRealGraphMessage } from "./fallback";
import { drawBackground, drawGrid } from "./grid";
import { drawAuxiliaryElements } from "./helperLines";
import { drawKeyPoints } from "./markers";
import { drawConicPaths } from "./paths";
import { calculateViewport } from "./viewport";

export function drawGraph(ctx, data, width, height) {
  const viewport = calculateViewport(data, width, height);

  drawBackground(ctx, width, height);
  drawGrid(ctx, width, height, viewport);

  if (data && data.tiene_grafica_real === false) {
    drawNoRealGraphMessage(ctx, data, width, height);
    return;
  }

  if (!data?.puntos_grafica) {
    drawFallbackCircle(ctx, width, height);
    return;
  }

  drawAuxiliaryElements(ctx, data, viewport);
  drawConicPaths(ctx, data, viewport);
  drawKeyPoints(ctx, data, viewport);
}
