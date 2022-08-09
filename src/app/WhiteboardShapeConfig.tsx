import { ChangeEvent, useEffect, useRef, useState } from 'react';

import { Node, NodeConfig } from 'konva/lib/Node';
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
  /**
   * Hanlde function to execute callback when current shape is selected
   * @param shapeCallbacks List of callbacks to execute with specific shape
   * @param onEndCbk Callback to execute in end of Switch
   */
  const handleExecuteBySpecificShape = (
    shapeCallbacks: ShapeCallbacksType,
    onEndCbk = () => {}
  ) => {
    const {
      arrowsCbk,
      circlesCbk,
      imagesCbk,
      linesCbk,
      rectanglesCbk,
      textsCbk,
      brushesCbk,
    } = shapeCallbacks;
    Object.keys(shapeList).forEach((key, idx) => {
      const existShape = Object.values(shapeList)[idx].some(
        ({ id }: { id: string }) => id === currentShapeId
      );
      if (existShape) {
        switch (key) {
          case ShapeEnum.ARROWS:
            (arrowsCbk || (() => {}))(key);
            break;
          case ShapeEnum.CIRCLES:
            (circlesCbk || (() => {}))(key);
            break;
          case ShapeEnum.IMAGES:
            (imagesCbk || (() => {}))(key);
            break;
          case ShapeEnum.LINES:
            (linesCbk || (() => {}))(key);
            break;
          case ShapeEnum.RECTANGLES:
            (rectanglesCbk || (() => {}))(key);
            break;
          case ShapeEnum.TEXTS:
            (textsCbk || (() => {}))(key);
            break;
          case ShapeEnum.BRUSHES:
            (brushesCbk || (() => {}))(key);
            break;
          default:
        }
        onEndCbk();
      }
    });
  };

  // HOOKS TO MANAGE THE STATE OF COMPONENT
  const [shapeConfig, setShapeConfig] = useState({
    isActive: false,
    x: 0,
    y: 0,
  });
  const [color, setColor] = useState('#fff');
  const activateSpecificTools = useRef({ color: true });
  const currentShapeSt = useRef<Node<NodeConfig>>();
  useEffect(() => {
    if (currentShapeId) {
      [currentShapeSt.current] = layerRef.find(
        (node: NodeConfig) => node.getId() === currentShapeId
      );
      //! DONT SUPPORT TEXT IN V1
      activateSpecificTools.current.color = !currentShapeSt.current
        .getAttrs()
        .id.includes('text');
      // CREATE AND PLACE SHAPE CONFIGURATION
      const shapePosition = currentShapeSt.current.getAbsolutePosition();
      const stageBox = stageRef.container().getBoundingClientRect();
      setShapeConfig({
        isActive: true,
        x: stageBox.left + shapePosition.x + 4,
        y: stageBox.top + shapePosition.y + 4,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      handleExecuteBySpecificShape({
        arrowsCbk: () => {
          setColor(currentShapeSt.current.getAttrs().stroke);
        },
        circlesCbk: () => {
          setColor(currentShapeSt.current.getAttrs().fill);
        },
        imagesCbk: () => {
          setColor(currentShapeSt.current.getAttrs().fill);
        },
        linesCbk: () => {
          setColor(currentShapeSt.current.getAttrs().stroke);
        },
        rectanglesCbk: () => {
          setColor(currentShapeSt.current.getAttrs().fill);
        },
        brushesCbk: () => {
          setColor(currentShapeSt.current.getAttrs().stroke);
        },
      });
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

  // FUNCTIONS TO MANAGE SHAPE CONFIG
  const changeShapeColor = ({ target }: ChangeEvent) => {
    const currentColor = (target as HTMLInputElement).value;
    handleExecuteBySpecificShape(
      {
        arrowsCbk: (key: string) => {
          getSpecificShapeState(key as ShapeEnum)(
            shapeList.arrows.map((shape) =>
              shape.id === currentShapeId
                ? { ...shape, stroke: currentColor }
                : shape
            )
          );
        },
        circlesCbk: (key: string) => {
          getSpecificShapeState(key as ShapeEnum)(
            shapeList.circles.map((shape) =>
              shape.id === currentShapeId
                ? { ...shape, fill: currentColor }
                : shape
            )
          );
        },
        linesCbk: (key: string) => {
          getSpecificShapeState(key as ShapeEnum)(
            shapeList.lines.map((shape) =>
              shape.id === currentShapeId
                ? { ...shape, stroke: currentColor }
                : shape
            )
          );
        },
        rectanglesCbk: (key: string) => {
          getSpecificShapeState(key as ShapeEnum)(
            shapeList.rectangles.map((shape) =>
              shape.id === currentShapeId
                ? { ...shape, fill: currentColor }
                : shape
            )
          );
        },
        brushesCbk: (key: string) => {
          currentShapeSt.current.setAttrs({
            stroke: currentColor,
          });
          getSpecificShapeState(key as ShapeEnum)(
            shapeList.brushes.map((shape) =>
              shape.id === currentShapeId
                ? { ...shape, stroke: currentColor }
                : shape
            )
          );
        },
      },
      () => {
        setColor(currentColor);
      }
    );
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
        {activateSpecificTools.current.color && (
          <label className="wb-controls__item wb-controls__item--input">
            <i
              className="wb-controls__color-pck"
              style={{ background: color }}
            />
            <input type="color" value={color} onChange={changeShapeColor} />
          </label>
        )}
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

type ShapeCallbacksType = {
  arrowsCbk?: (key: string) => void;
  circlesCbk?: (key: string) => void;
  imagesCbk?: (key: string) => void;
  linesCbk?: (key: string) => void;
  rectanglesCbk?: (key: string) => void;
  textsCbk?: (key: string) => void;
  brushesCbk?: (key: string) => void;
};

export default WhiteboardShapeConfig;
