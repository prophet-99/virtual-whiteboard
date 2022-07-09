import { useCallback, useEffect, useRef, useState } from 'react';

import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { Stage as StageType } from 'konva/lib/Stage';
import { Layer as LayerType } from 'konva/lib/Layer';
import { Layer, Stage } from 'react-konva';

import {
  GeneralShapeModel,
  ImageShapeModel,
  LineShapeModel,
  TextShapeModel,
} from './models/Shape.model';
import RectangleWB from './components/RectangleWB';
import CircleWB from './components/CircleWB';
import ImageWB from './components/ImageWB';
import LineWB from './components/LineWB';
import ArrowWB from './components/ArrowWB';
import TextWB from './components/TextWB';
import useBrushWB from './hooks/useBrushWB';

const initialRectangles: GeneralShapeModel[] = [
  {
    x: 10,
    y: 10,
    width: 100,
    height: 100,
    fill: 'red',
    id: 'rect~1',
  },
  {
    x: 150,
    y: 150,
    width: 100,
    height: 100,
    fill: 'green',
    id: 'rect~2',
  },
];

const initialCircles: GeneralShapeModel[] = [
  {
    x: 10, // TODO: RANDOM X Y
    y: 10,
    width: 100,
    height: 100,
    fill: '#98c379',
    id: 'circle~1',
  },
];

const initialImages: ImageShapeModel[] = [
  {
    x: 10, // TODO: RANDOM X Y
    y: 10,
    width: 100,
    height: 100,
    fill: '#98c379',
    id: 'image~1',
    imageURL:
      'https://www.xtrafondos.com/wallpapers/resoluciones/19/one-piece-artwork_2560x1440_4011.jpg',
  },
];

const initialLines: LineShapeModel[] = [
  {
    stroke: '#810955',
    strokeWidth: 5,
    // TODO: RANDOM POINTS
    points: [500, 100, 500, 300], // *[X1, Y1, X2, Y2] -> (X1 === X2)
    id: 'line~1',
  },
];

const initialArrows: LineShapeModel[] = [
  {
    stroke: '#1A4D2E',
    strokeWidth: 6,
    // TODO: RANDOM POINTS
    points: [800, 100, 800, 300], // *[X1, Y1, X2, Y2] -> (X1 === X2)
    id: 'arrow~1',
  },
];

const initialTexts: TextShapeModel[] = [
  {
    id: 'text~1',
    fontSize: 16,
    width: 200,
    x: 80, // TODO: RANDOM X Y
    y: 80,
  },
  {
    id: 'text~2',
    fontSize: 16,
    width: 200,
    x: 80, // TODO: RANDOM X Y
    y: 80,
  },
];

const WhiteBoard = () => {
  const MINIMUM_SIZE = 50;
  const [tool, setTool] = useState<'default' | 'brush'>('default');
  const [, updateState] = useState({});
  const forceUpdate = useCallback(() => updateState({}), []);
  // SHAPES AND FUNCTIONS
  const [rectangles, setRectangles] = useState(initialRectangles);
  const [circles, setCircles] = useState(initialCircles);
  const [images, setImages] = useState(initialImages);
  const [lines, setLines] = useState(initialLines);
  const [arrows, setArrows] = useState(initialArrows);
  const [texts, setTexts] = useState(initialTexts);
  const brushes = useRef([]);
  const [selectShape, setSelectShape] = useState<string>(undefined);
  const stageRef = useRef<StageType>();
  const layerRef = useRef<LayerType>();
  // INMUTABLE TRANSFORMER FOR BRUSH FUNCTION
  const transformer = useRef(
    new Konva.Transformer({
      boundBoxFunc: (_, newBox) => ({
        ...newBox,
        width: Math.max(MINIMUM_SIZE, newBox.width),
        height: Math.max(MINIMUM_SIZE, newBox.height),
      }),
    })
  );
  const { paintBrush, setConfigBrush } = useBrushWB((returnedId) => {
    brushes.current = [...brushes.current, returnedId];
  }, setSelectShape);
  useEffect(() => {
    setConfigBrush({
      stage: stageRef.current,
      layer: layerRef.current,
      transformerRef: transformer.current,
      mode: tool,
      minimumSize: MINIMUM_SIZE,
    });
    paintBrush();
  }, [paintBrush, setConfigBrush, tool]);
  // FUNCTIONS AND EVENTS
  const checkIfDeselected = ({
    target,
  }: KonvaEventObject<MouseEvent> | KonvaEventObject<TouchEvent>) => {
    if (target === target.getStage()) setSelectShape(undefined);
    else if (target.id().split('~')[0] === 'brush') setSelectShape(undefined);
  };
  useEffect(() => {
    const deleteEvtRef = ({ code }: KeyboardEvent) => {
      if (code === 'Delete') {
        let selectedIdx = arrows.findIndex(({ id }) => id === selectShape);
        if (selectedIdx !== -1) {
          arrows.splice(selectedIdx, 1);
          setArrows(arrows);
          forceUpdate();
          return;
        }
        selectedIdx = circles.findIndex(({ id }) => id === selectShape);
        if (selectedIdx !== -1) {
          circles.splice(selectedIdx, 1);
          setCircles(circles);
          forceUpdate();
          return;
        }
        selectedIdx = images.findIndex(({ id }) => id === selectShape);
        if (selectedIdx !== -1) {
          images.splice(selectedIdx, 1);
          setImages(images);
          forceUpdate();
          return;
        }
        selectedIdx = lines.findIndex(({ id }) => id === selectShape);
        if (selectedIdx !== -1) {
          lines.splice(selectedIdx, 1);
          setLines(lines);
          forceUpdate();
          return;
        }
        selectedIdx = rectangles.findIndex(({ id }) => id === selectShape);
        if (selectedIdx !== -1) {
          rectangles.splice(selectedIdx, 1);
          setRectangles(rectangles);
          forceUpdate();
          return;
        }
        selectedIdx = texts.findIndex(({ id }) => id === selectShape);
        if (selectedIdx !== -1) {
          texts.splice(selectedIdx, 1);
          setTexts(texts);
          forceUpdate();
          return;
        }
        selectedIdx = brushes.current.findIndex((id) => id === selectShape);
      }
    };
    document.addEventListener('keydown', deleteEvtRef);
    return () => document.removeEventListener('keydown', deleteEvtRef);
  }, [selectShape]);

  return (
    <>
      <button onClick={() => setTool('brush')} type="button">
        Brush me
      </button>
      <button onClick={() => setTool('default')} type="button">
        Default
      </button>
      <Stage
        ref={stageRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={checkIfDeselected}
        onTouchStart={checkIfDeselected}
      >
        <Layer ref={layerRef}>
          {rectangles.map((rectangleRef) => (
            <RectangleWB
              key={rectangleRef.id}
              minimumSize={MINIMUM_SIZE}
              shapeProps={rectangleRef}
              isSelected={rectangleRef.id === selectShape}
              onSelect={() => setSelectShape(rectangleRef.id)}
              onChange={(newAttrs) => {
                const scopeRects = [...rectangles];
                const idx = scopeRects
                  .map(({ id }) => id)
                  .indexOf(rectangleRef.id);
                scopeRects[idx] = newAttrs as GeneralShapeModel;

                setRectangles(scopeRects);
              }}
            />
          ))}
          {circles.map((circleRef) => (
            <CircleWB
              key={circleRef.id}
              minimumSize={MINIMUM_SIZE}
              shapeProps={circleRef}
              isSelected={circleRef.id === selectShape}
              onSelect={() => setSelectShape(circleRef.id)}
              onChange={(newAttrs) => {
                const scopeCircles = [...circles];
                const idx = scopeCircles
                  .map(({ id }) => id)
                  .indexOf(circleRef.id);
                scopeCircles[idx] = newAttrs as GeneralShapeModel;

                setCircles(scopeCircles);
              }}
            />
          ))}
          {images.map((imageRef) => (
            <ImageWB
              key={imageRef.id}
              minimumSize={MINIMUM_SIZE}
              shapeProps={imageRef}
              isSelected={imageRef.id === selectShape}
              onSelect={() => setSelectShape(imageRef.id)}
              onChange={(newAttrs) => {
                const scopeImages = [...images];
                const idx = scopeImages
                  .map(({ id }) => id)
                  .indexOf(imageRef.id);
                scopeImages[idx] = newAttrs as ImageShapeModel;

                setImages(scopeImages);
              }}
            />
          ))}
          {lines.map((lineRef) => (
            <LineWB
              key={lineRef.id}
              minimumSize={MINIMUM_SIZE}
              shapeProps={lineRef}
              isSelected={lineRef.id === selectShape}
              onSelect={() => setSelectShape(lineRef.id)}
              onChange={(newAttrs) => {
                const scopeLines = [...lines];
                const idx = scopeLines.map(({ id }) => id).indexOf(lineRef.id);
                scopeLines[idx] = newAttrs as LineShapeModel;

                setLines(scopeLines);
              }}
            />
          ))}
          {arrows.map((arrowRef) => (
            <ArrowWB
              key={arrowRef.id}
              minimumSize={MINIMUM_SIZE}
              shapeProps={arrowRef}
              isSelected={arrowRef.id === selectShape}
              onSelect={() => setSelectShape(arrowRef.id)}
              onChange={(newAttrs) => {
                const scopeArrows = [...arrows];
                const idx = scopeArrows
                  .map(({ id }) => id)
                  .indexOf(arrowRef.id);
                scopeArrows[idx] = newAttrs as LineShapeModel;

                setArrows(scopeArrows);
              }}
            />
          ))}
          {texts.map((textRef) => (
            <TextWB
              key={textRef.id}
              minimumSize={MINIMUM_SIZE}
              shapeProps={textRef}
              isSelected={textRef.id === selectShape}
              onSelect={() => setSelectShape(textRef.id)}
              onChange={(newAttrs) => {
                const scopeTexts = [...texts];
                const idx = scopeTexts.map(({ id }) => id).indexOf(textRef.id);
                scopeTexts[idx] = newAttrs as TextShapeModel;

                setTexts(scopeTexts);
              }}
              stage={stageRef.current}
            />
          ))}
        </Layer>
      </Stage>
    </>
  );
};

export default WhiteBoard;
