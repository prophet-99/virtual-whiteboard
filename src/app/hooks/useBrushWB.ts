import Konva from 'konva';
import { Layer } from 'konva/lib/Layer';
import { Transformer } from 'konva/lib/shapes/Transformer';
import { Stage } from 'konva/lib/Stage';

import * as uuid from 'uuid';

import { BrushModel } from '../models/Brush.model';

const useBrushWB = (
  setIdCallback: (id: string) => void,
  setSelectShape: React.Dispatch<React.SetStateAction<string>>
) => {
  let stage: Stage;
  let layer: Layer;
  let transformerRef: Transformer;
  let mode: 'default' | 'brush';
  let minimumSize: number;

  const setConfigBrush = (brushConfig: BrushModel) => {
    stage = brushConfig.stage;
    layer = brushConfig.layer;
    transformerRef = brushConfig.transformerRef;
    mode = brushConfig.mode;
    minimumSize = brushConfig.minimumSize;
  };

  const paintBrush = () => {
    // REMOVE EVENTS IF EXISTS
    stage.off('mousedown touchstart');
    stage.off('mouseup touchend');
    stage.off('mousemove touchmove');
    stage.off('click tap');

    // ACTIVE EVENTS ONLY IF mode IS DIFFERENT FROM default
    if (mode !== 'default') {
      let isPaint = false;
      let lastLine: Konva.Line;

      stage.on('mousedown touchstart', () => {
        isPaint = true;
        const position = stage.getPointerPosition();
        const localId = `brush~${uuid.v4()}`;
        setIdCallback(localId);

        lastLine = new Konva.Line({
          id: localId,
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
        // ADDED TRANSFORM REF TO LAST LINE
        lastLine.on('click tap', ({ target }) => {
          setSelectShape(target.id());
          layer.add(transformerRef);
          transformerRef.nodes([target]);
          layer.draw();
        });
        lastLine.on('transformend', () => {
          lastLine.setAttrs({
            width: Math.max(minimumSize, lastLine.width() * lastLine.scaleX()),
            height: Math.max(
              minimumSize,
              lastLine.height() * lastLine.scaleY()
            ),
          });
        });
      });

      stage.on('mousemove touchmove', () => {
        if (!isPaint) return;
        const position = stage.getPointerPosition();
        const newPoints = lastLine.points().concat([position.x, position.y]);
        lastLine.points(newPoints);
        layer.batchDraw();
      });
    } else {
      stage.on('click tap', (evt) => {
        if (evt.target === stage) {
          transformerRef.nodes([]);
          layer.draw();
        } else {
          const type = evt.target.id().split('~')[0];
          if (type !== 'brush') {
            transformerRef.nodes([]);
            layer.draw();
          }
        }
      });
    }
  };

  return { setConfigBrush, paintBrush };
};

export default useBrushWB;
