import { useRef } from 'react';

import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { Line } from 'konva/lib/shapes/Line';
import { Transformer } from 'konva/lib/shapes/Transformer';
import { Layer } from 'konva/lib/Layer';
import { Stage } from 'konva/lib/Stage';

import * as uuid from 'uuid';

import { BrushModel } from '../models/Brush.model';
import { LineShapeModel } from '../models/Shape.model';
import { ToolType } from '../models/types/Tool.type';

/**
 * Custom hook to free brush in canvas
 * @param brushes List of shapes to rendered in canvas on first initialization
 * @param setBrush React hook to set brush in main component (Whiteboard)
 * @param deselectAnyNode: Handles the general deselection of a transformer object either from this hook or other components
 * @param setSelectShape: React hook to set currently selected id in actual state
 */
const useBrushWB = (
  brushes: LineShapeModel[],
  setBrush: React.Dispatch<React.SetStateAction<LineShapeModel[]>>,
  deselectAnyNode: (
    evt: KonvaEventObject<MouseEvent> | KonvaEventObject<TouchEvent>
  ) => void,
  setSelectShape: React.Dispatch<React.SetStateAction<string>>
) => {
  let stage: Stage;
  let layer: Layer;
  let transformerRef: Transformer;
  let mode: ToolType;
  let minimumSize: number;
  const isFirstInitialization = useRef(true);
  /**
   * Add events to brush line when transform end or click
   * @param brush Line reference to process
   */
  const handleAddEventsToBrush = (brush: Line) => {
    // ADDED TRANSFORM REF TO LAST LINE
    brush.on('click tap', ({ target }) => {
      setSelectShape(target.id());
      layer.add(transformerRef);
      transformerRef.nodes([target]);
      layer.draw();
    });
    brush.on('transformend dragend', () => {
      const newWidth = Math.max(minimumSize, brush.width() * brush.scaleX());
      const newHeight = Math.max(minimumSize, brush.height() * brush.scaleY());
      brush.setAttrs({
        width: newWidth,
        height: newHeight,
      });
      // ADDED TO SHAPE STATE
      setBrush((prevState) => {
        const idx = prevState.findIndex(({ id }) => id === brush.id());
        const newState = [...prevState];
        newState[idx].rotation = brush.rotation();
        newState[idx].height = brush.height();
        newState[idx].scaleX = brush.scaleX();
        newState[idx].scaleY = brush.scaleY();
        newState[idx].width = brush.width();
        newState[idx].x = brush.x();
        newState[idx].y = brush.y();

        return newState;
      });
    });
  };

  const setConfigBrush = (brushConfig: BrushModel) => {
    stage = brushConfig.stage;
    layer = brushConfig.layer;
    transformerRef = brushConfig.transformerRef;
    mode = brushConfig.mode;
    minimumSize = brushConfig.minimumSize;
    // DRAW BRUSHES ON FIRST INITIALIZATION
    if (isFirstInitialization.current && brushConfig) {
      brushes.forEach((brush) => {
        const lineRef = new Konva.Line({
          id: brush.id,
          stroke: brush.stroke,
          strokeWidth: brush.strokeWidth,
          globalCompositeOperation: 'source-over',
          points: brush.points,
          draggable: true,
          // NEW PROPERTIES ADDED TO SAVE
          rotation: brush.rotation,
          height: brush.height,
          scaleX: brush.scaleX,
          scaleY: brush.scaleY,
          width: brush.width,
          x: brush.x,
          y: brush.y,
        });
        layer.add(lineRef);
        handleAddEventsToBrush(lineRef);
      });
      isFirstInitialization.current = false;
    }
  };

  const paintBrush = () => {
    // REMOVE EVENTS IF EXISTS
    stage.off('mousedown touchstart');
    stage.off('mouseup touchend');
    stage.off('mousemove touchmove');
    stage.off('click tap');

    // ACTIVE EVENTS ONLY IF mode IS DIFFERENT FROM default
    if (mode !== 'DEFAULT') {
      let isPaint = false;
      let lastLine: Konva.Line;

      stage.on('mousedown touchstart', () => {
        isPaint = true;
        const position = stage.getPointerPosition();

        lastLine = new Konva.Line({
          id: `brush~${uuid.v4()}`,
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
        // ADDED TO SHAPE STATE
        handleAddEventsToBrush(lastLine);
        setBrush((prevState) => [
          ...prevState,
          {
            id: lastLine.id(),
            points: lastLine.points(),
            stroke: lastLine.stroke(),
            strokeWidth: lastLine.strokeWidth(),
          },
        ]);
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
