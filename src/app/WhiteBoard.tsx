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
import WhiteBoardControls from './WhiteBoardControls';
import useShape from './hooks/useShape';
import usePulldownRefresh from './hooks/usePulldownRefresh';
import { ShapeEnum } from './models/enums/Shape.enum';
import { ToolType } from './models/types/Tool.type';

const WhiteBoard = () => {
  // DISABLE PULLDOWN TO REFRESH IN MOBILE
  usePulldownRefresh();
  // GENERAL SETTINGS
  const MINIMUM_SIZE = 50;
  const [tool, setTool] = useState<ToolType>('DEFAULT');
  const shapeColor = useRef('#0959AE');
  const [, updateState] = useState({});
  const forceUpdate = useCallback(() => updateState({}), []);
  // SHAPE STATES
  const [selectShape, setSelectShape] = useState<string>(undefined);
  const stageRef = useRef<StageType>();
  const layerRef = useRef<LayerType>();
  // CUSTOM HOOK TO IMPROVE THE USE OF ALL SHAPES
  const {
    getAllShapeStates,
    getAllShapes,
    getSpecificShapeState,
    getSpecificShape,
  } = useShape();
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
    getSpecificShape(ShapeEnum.BRUSHES) as LineShapeModel[],
    getSpecificShapeState(ShapeEnum.BRUSHES),
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
      color: shapeColor.current,
      minimumSize: MINIMUM_SIZE,
    });
    paintBrush();
  }, [paintBrush, setConfigBrush, tool]);
  // CUSTOM HOOK TO REMOVE THE SHAPES
  useRemoveShapes(
    getAllShapes(),
    getAllShapeStates(),
    selectShape,
    forceUpdate,
    transformer.current,
    layerRef.current
  );
  // CUSTOM HOOK TO CHANGE THE z-index OF THE SHAPES
  const { renderZIndex } = useZIndexShape(selectShape, layerRef.current);
  // CHECK THE z-index WHEN IS LOADED
  useLayoutEffect(() => {
    setTimeout(() => renderZIndex(layerRef.current), 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="wb-container">
      {/* INIT CONTROLS SECTION */}
      <WhiteBoardControls
        shapeList={getAllShapes()}
        getSpecificShapeState={getSpecificShapeState}
        setTool={setTool}
        stageRef={stageRef.current}
        layerRef={layerRef.current}
        onChangeColor={(color) => {
          shapeColor.current = color;
        }}
      />
      {/* END CONTROLS SECTION */}
      {/* INIT CANVAS SECTION */}
      <Stage
        ref={stageRef}
        width={window.innerWidth}
        height={window.innerHeight}
      >
        <Layer ref={layerRef}>
          {getSpecificShape(ShapeEnum.RECTANGLES).map((rectangleRef) => (
            <RectangleWB
              key={rectangleRef.id}
              minimumSize={MINIMUM_SIZE}
              shapeProps={rectangleRef}
              isSelected={rectangleRef.id === selectShape}
              onSelect={() => setSelectShape(rectangleRef.id)}
              onChange={(newAttrs) => {
                const scopeRects = [...getSpecificShape(ShapeEnum.RECTANGLES)];
                const idx = scopeRects
                  .map(({ id }) => id)
                  .indexOf(rectangleRef.id);
                scopeRects[idx] = newAttrs as GeneralShapeModel;

                getSpecificShapeState(ShapeEnum.RECTANGLES)(scopeRects); // setState(param)
              }}
            />
          ))}
          {getSpecificShape(ShapeEnum.CIRCLES).map((circleRef) => (
            <CircleWB
              key={circleRef.id}
              minimumSize={MINIMUM_SIZE}
              shapeProps={circleRef}
              isSelected={circleRef.id === selectShape}
              onSelect={() => setSelectShape(circleRef.id)}
              onChange={(newAttrs) => {
                const scopeCircles = [...getSpecificShape(ShapeEnum.CIRCLES)];
                const idx = scopeCircles
                  .map(({ id }) => id)
                  .indexOf(circleRef.id);
                scopeCircles[idx] = newAttrs as GeneralShapeModel;

                getSpecificShapeState(ShapeEnum.CIRCLES)(scopeCircles); // setState(param)
              }}
            />
          ))}
          {getSpecificShape(ShapeEnum.IMAGES).map((imageRef) => (
            <ImageWB
              key={imageRef.id}
              minimumSize={MINIMUM_SIZE}
              shapeProps={imageRef}
              isSelected={imageRef.id === selectShape}
              onSelect={() => setSelectShape(imageRef.id)}
              onChange={(newAttrs) => {
                const scopeImages = [...getSpecificShape(ShapeEnum.IMAGES)];
                const idx = scopeImages
                  .map(({ id }) => id)
                  .indexOf(imageRef.id);
                scopeImages[idx] = newAttrs as ImageShapeModel;

                getSpecificShapeState(ShapeEnum.IMAGES)(scopeImages); // setState(param)
              }}
            />
          ))}
          {getSpecificShape(ShapeEnum.LINES).map((lineRef) => (
            <LineWB
              key={lineRef.id}
              minimumSize={MINIMUM_SIZE}
              shapeProps={lineRef}
              isSelected={lineRef.id === selectShape}
              onSelect={() => setSelectShape(lineRef.id)}
              onChange={(newAttrs) => {
                const scopeLines = [...getSpecificShape(ShapeEnum.LINES)];
                const idx = scopeLines.map(({ id }) => id).indexOf(lineRef.id);
                scopeLines[idx] = newAttrs as LineShapeModel;

                getSpecificShapeState(ShapeEnum.LINES)(scopeLines); // setState(param)
              }}
            />
          ))}
          {getSpecificShape(ShapeEnum.ARROWS).map((arrowRef) => (
            <ArrowWB
              key={arrowRef.id}
              minimumSize={MINIMUM_SIZE}
              shapeProps={arrowRef}
              isSelected={arrowRef.id === selectShape}
              onSelect={() => setSelectShape(arrowRef.id)}
              onChange={(newAttrs) => {
                const scopeArrows = [...getSpecificShape(ShapeEnum.ARROWS)];
                const idx = scopeArrows
                  .map(({ id }) => id)
                  .indexOf(arrowRef.id);
                scopeArrows[idx] = newAttrs as LineShapeModel;

                getSpecificShapeState(ShapeEnum.ARROWS)(scopeArrows); // setState(param)
              }}
            />
          ))}
          {getSpecificShape(ShapeEnum.TEXTS).map((textRef) => (
            <TextWB
              key={textRef.id}
              minimumSize={MINIMUM_SIZE}
              shapeProps={textRef}
              isSelected={textRef.id === selectShape}
              onSelect={() => setSelectShape(textRef.id)}
              onChange={(newAttrs) => {
                const scopeTexts = [
                  ...getSpecificShape(ShapeEnum.TEXTS),
                ] as TextShapeModel[];
                const idx = scopeTexts.map(({ id }) => id).indexOf(textRef.id);
                scopeTexts[idx] = newAttrs as TextShapeModel;

                const setTexts = getSpecificShapeState(
                  ShapeEnum.TEXTS
                ) as React.Dispatch<React.SetStateAction<TextShapeModel[]>>;
                setTexts(scopeTexts); // setState(param)
              }}
              stage={stageRef.current}
            />
          ))}
        </Layer>
      </Stage>
      {/* END CANVAS SECTION */}
    </main>
  );
};

export default WhiteBoard;
