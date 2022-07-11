import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { Transformer } from 'konva/lib/shapes/Transformer';
import { Layer } from 'konva/lib/Layer';
import { Stage } from 'konva/lib/Stage';

import * as uuid from 'uuid';

import { BrushModel } from '../models/Brush.model';

/**
 * Custom hook to free brush in canvas
 * @param setId Callback to set shape id in main component (Whiteboard)
 * @param deselectAnyNode: Handles the general deselection of a transformer object either from this hook or other components
 * @param setSelectShape: React hook to set currently selected id in actual state
 */
const useBrushWB = (
  setId: (id: string) => void,
  deselectAnyNode: (
    evt: KonvaEventObject<MouseEvent> | KonvaEventObject<TouchEvent>
  ) => void,
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
        setId(localId);

        lastLine = new Konva.Line({
          id: localId,
          stroke: 'purple',
          strokeWidth: 6,
          globalCompositeOperation: 'source-over',
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
    }
    stage.on('click tap', (evt) => deselectAnyNode(evt));
  };

  return { setConfigBrush, paintBrush };
};

export default useBrushWB;
