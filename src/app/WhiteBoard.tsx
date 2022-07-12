import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import Konva from 'konva';
import { Stage as StageType } from 'konva/lib/Stage';
import { Layer as LayerType } from 'konva/lib/Layer';
import { Transformer as TransformerType } from 'konva/lib/shapes/Transformer';
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
import useRemoveShapes from './hooks/useRemoveShapes';
import useZIndexShape from './hooks/useZIndexShape';
import {
  initialArrows,
  initialCircles,
  initialImages,
  initialLines,
  initialRectangles,
  initialTexts,
  initialBrushes,
} from './models/InitialObjectsMock';

const WhiteBoard = () => {
  // DISABLE PULLDOWN TO REFRESH IN MOBILE
  useLayoutEffect(() => {
    document.querySelector('html').classList.add('disable-pulldown-refresh-wb');
    document.querySelector('body').classList.add('disable-pulldown-refresh-wb');
    return () => {
      document
        .querySelector('html')
        .classList.remove('disable-pulldown-refresh-wb');
      document
        .querySelector('body')
        .classList.remove('disable-pulldown-refresh-wb');
    };
  }, []);
  // GENERAL SETTINGS
  const MINIMUM_SIZE = 50;
  const [tool, setTool] = useState<'default' | 'brush'>('default');
  const [, updateState] = useState({});
  const forceUpdate = useCallback(() => updateState({}), []);
  // SHAPES
  const [rectangles, setRectangles] = useState(initialRectangles);
  const [circles, setCircles] = useState(initialCircles);
  const [images, setImages] = useState(initialImages);
  const [lines, setLines] = useState(initialLines);
  const [arrows, setArrows] = useState(initialArrows);
  const [texts, setTexts] = useState(initialTexts);
  const [brushes, setBrushes] = useState(initialBrushes);
  const [selectShape, setSelectShape] = useState<string>(undefined);
  const stageRef = useRef<StageType>();
  const layerRef = useRef<LayerType>();
  // INMUTABLE TRANSFORMER FOR BRUSH HOOK
  const transformer = useRef<TransformerType>(
    new Konva.Transformer({
      boundBoxFunc: (_, newBox) => ({
        ...newBox,
        width: Math.max(MINIMUM_SIZE, newBox.width),
        height: Math.max(MINIMUM_SIZE, newBox.height),
      }),
    })
  );
  // BRUSH HOOK, SETUP AND USE
  const { paintBrush, setConfigBrush } = useBrushWB(
    brushes,
    setBrushes,
    ({ target }) => {
      if (target === target.getStage()) {
        transformer.current.nodes([]);
        setSelectShape(undefined);
      } else if (target.id().split('~')[0] !== 'brush')
        transformer.current.nodes([]);
    },
    setSelectShape
  );
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
  // CUSTOM HOOK TO REMOVE THE SHAPES
  useRemoveShapes(
    {
      arrows,
      circles,
      images,
      lines,
      rectangles,
      texts,
      brushes,
    },
    {
      setArrows,
      setCircles,
      setImages,
      setLines,
      setRectangles,
      setTexts,
      setBrushes,
    },
    selectShape,
    forceUpdate,
    transformer.current,
    layerRef.current
  );
  // CUSTOM HOOK TO CHANGE THE z-index OF THE SHAPES
  useZIndexShape(selectShape, layerRef.current);

  return (
    <>
      <button onClick={() => setTool('brush')} type="button">
        Brush me
      </button>
      <button onClick={() => setTool('default')} type="button">
        Default
      </button>
      <button
        onClick={() => console.log(stageRef.current.toJSON(), rectangles)}
        type="button"
      >
        Save
      </button>
      <button
        onClick={() => {
          const link = document.createElement('a');
          link.download = 'whiteboard.png';
          // CONFIGURE WITH PIXEL RATIO 1.5 FOR HD IMAGES
          link.href = stageRef.current.toDataURL({ pixelRatio: 1.5 });
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }}
        type="button"
      >
        Save to Image
      </button>
      <Stage
        ref={stageRef}
        width={window.innerWidth}
        height={window.innerHeight}
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
