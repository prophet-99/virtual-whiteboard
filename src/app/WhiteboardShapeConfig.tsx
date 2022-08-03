import { ChangeEvent, useEffect, useState } from 'react';

import { NodeConfig } from 'konva/lib/Node';
import { Layer as LayerType } from 'konva/lib/Layer';
import { Stage as StageType } from 'konva/lib/Stage';

import useZIndexShape from './hooks/useZIndexShape';
import { ShapeEnum } from './models/enums/Shape.enum';
import { ShapeListModel } from './models/ShapeState.model';

const WhiteboardShapeConfig = ({
  shapeList,
  getSpecificShapeState,
  currentShapeId,
  layerRef,
  stageRef,
}: WhiteBoardShConfigPropsType) => {
  const [shapeConfig, setShapeConfig] = useState({
    isActive: false,
    x: 0,
    y: 0,
  });
  const [color, setColor] = useState('#fff');
  useEffect(() => {
    if (currentShapeId) {
      const currentShape = layerRef.find(
        (node: NodeConfig) => node.getId() === currentShapeId
      )[0];
      // CREATE AND PLACE SHAPE CONFIGURATION
      const shapePosition = currentShape.getAbsolutePosition();
      const stageBox = stageRef.container().getBoundingClientRect();
      setShapeConfig({
        isActive: true,
        x: stageBox.left + shapePosition.x + 4,
        y: stageBox.top + shapePosition.y + 4,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setColor(currentShape.getAttrs().fill);
    }
    return () => {
      setShapeConfig({
        isActive: false,
        x: 0,
        y: 0,
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentShapeId]);
  // HOOK TO MANAGE z-index
  const { bringForward, bringToFront, sendBackward, sendToBack } =
    useZIndexShape(currentShapeId, layerRef);
  // FUNCTIONS TO MANAGE THE BUTTONS
  const changeShapeColor = ({ target }: ChangeEvent) => {
    const currentColor = (target as HTMLInputElement).value;

    Object.keys(shapeList).forEach((key, idx) => {
      const existShape = Object.values(shapeList)[idx].some(
        ({ id }: { id: string }) => id === currentShapeId
      );
      if (existShape) {
        switch (key) {
          case ShapeEnum.ARROWS:
            getSpecificShapeState(key as ShapeEnum)(
              shapeList.arrows.map((shape) =>
                shape.id === currentShapeId
                  ? { ...shape, stroke: currentColor }
                  : shape
              )
            );
            break;
          case ShapeEnum.CIRCLES:
            break;
          case ShapeEnum.IMAGES:
            break;
          case ShapeEnum.LINES:
            break;
          case ShapeEnum.RECTANGLES:
            break;
          case ShapeEnum.TEXTS:
            break;
          case ShapeEnum.BRUSHES:
            break;
          default:
        }
        setColor(currentColor);
      }
    });
  };

  return (
    shapeConfig.isActive && (
      <section
        className="wb-controls"
        style={{
          position: 'absolute',
          top: shapeConfig.y,
          left: shapeConfig.x,
        }}
      >
        <button
          className="wb-controls__item"
          type="button"
          onClick={bringForward}
        >
          <i className="fa-regular fa-object-ungroup" />
        </button>
        <button
          className="wb-controls__item"
          type="button"
          onClick={bringToFront}
        >
          <i className="fa-regular fa-object-ungroup" />
        </button>
        <button
          className="wb-controls__item"
          type="button"
          onClick={sendBackward}
        >
          <i className="fa-regular fa-object-ungroup" />
        </button>
        <button
          className="wb-controls__item"
          type="button"
          onClick={sendToBack}
        >
          <i className="fa-regular fa-object-ungroup" />
        </button>
        <label className="wb-controls__item wb-controls__item--input">
          <i className="wb-controls__color-pck" style={{ background: color }} />
          <input type="color" value={color} onChange={changeShapeColor} />
        </label>
      </section>
    )
  );
};

type WhiteBoardShConfigPropsType = {
  shapeList: ShapeListModel;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getSpecificShapeState: (type: ShapeEnum) => any;
  currentShapeId: string;
  stageRef: StageType;
  layerRef: LayerType;
};
export default WhiteboardShapeConfig;
