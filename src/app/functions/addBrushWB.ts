import Konva from 'konva';

import { Layer } from 'konva/lib/Layer';
import { Stage } from 'konva/lib/Stage';

const addBrushWB = (
  stage: Stage,
  layer: Layer,
  mode: 'default' | 'brush' | 'erase' = 'brush'
) => {
  // REMOVE EVENTS IF EXISTS
  stage.off('mousedown touchstart');
  stage.off('mouseup touchend');
  stage.off('mousemove touchmove');

  // ACTIVE EVENTS ONLY IF mode IS DIFFERENT FROM default
  if (mode !== 'default') {
    let isPaint = false;
    let lastLine: Konva.Line;

    stage.on('mousedown touchstart', () => {
      isPaint = true;
      const position = stage.getPointerPosition();
      lastLine = new Konva.Line({
        stroke: mode === 'brush' ? 'purple' : 'white',
        strokeWidth: mode === 'brush' ? 5 : 20,
        globalCompositeOperation:
          mode === 'brush' ? 'source-over' : 'destination-out',
        points: [position.x, position.y],
        draggable: true,
      });
      layer.add(lastLine);
    });
    stage.on('mouseup touchend', () => {
      isPaint = false;
    });
    stage.on('mousemove touchmove', () => {
      if (!isPaint) return;
      const position = stage.getPointerPosition();
      const newPoints = lastLine.points().concat([position.x, position.y]);
      lastLine.points(newPoints);
      layer.batchDraw();
    });
    stage.on('click tap', (evt) => {
      if (evt.target === stage) return;
      // CHECK IF TYPE IS TEXT
      const type = evt.target.id().split('~')[0];
      transformerRef.detach();
      if (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        evt.target.id() === (stage as any).mouseClickStartShape.id() &&
        type === 'text'
      ) {
        layer.add(transformerRef);
        transformerRef.nodes([evt.target]);
        layer.draw();
      }
    });
  }
};

export default addBrushWB;
