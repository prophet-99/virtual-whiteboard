import { useState } from 'react';

import { ShapeEnum } from '../models/enums/Shape.enum';
import {
  GeneralShapeModel,
  ImageShapeModel,
  LineShapeModel,
  TextShapeModel,
} from '../models/Shape.model';
import {
  ShapeListModel,
  ShapeStateListModel,
} from '../models/ShapeState.model';
import { getSpecificStoredShapesUtil } from '../utils/storedData.util';

/**
 * Custom hook to manage all shapes with their states
 */
const useShape = () => {
  // STATES OF ALL SHAPES
  const [arrows, setArrows] = useState(
    (getSpecificStoredShapesUtil(ShapeEnum.ARROWS) as LineShapeModel[]) ?? []
  );
  const [circles, setCircles] = useState(
    (getSpecificStoredShapesUtil(ShapeEnum.CIRCLES) as GeneralShapeModel[]) ??
      []
  );
  const [images, setImages] = useState(
    (getSpecificStoredShapesUtil(ShapeEnum.IMAGES) as ImageShapeModel[]) ?? []
  );
  const [lines, setLines] = useState(
    (getSpecificStoredShapesUtil(ShapeEnum.LINES) as LineShapeModel[]) ?? []
  );
  const [rectangles, setRectangles] = useState(
    (getSpecificStoredShapesUtil(
      ShapeEnum.RECTANGLES
    ) as GeneralShapeModel[]) ?? []
  );
  const [texts, setTexts] = useState(
    (getSpecificStoredShapesUtil(ShapeEnum.TEXTS) as TextShapeModel[]) ?? []
  );
  const [brushes, setBrushes] = useState(
    (getSpecificStoredShapesUtil(ShapeEnum.BRUSHES) as LineShapeModel[]) ?? []
  );
  const shapeList: ShapeListModel = {
    arrows,
    circles,
    images,
    lines,
    rectangles,
    texts,
    brushes,
  };
  const shapeStateList: ShapeStateListModel = {
    setArrows,
    setCircles,
    setImages,
    setLines,
    setRectangles,
    setTexts,
    setBrushes,
  };
  // FUNCTIONS TO MANAGE THIS HOOK
  const getAllShapeStates = () => shapeStateList;
  const getAllShapes = () => shapeList;
  const getSpecificShapeState = (type: ShapeEnum) => {
    const key = `set${type[0].toUpperCase()}${type.slice(1)}`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parsedList = shapeStateList as any;
    return parsedList[key];
  };
  const getSpecificShape = (type: ShapeEnum) => shapeList[type];

  return {
    getAllShapeStates,
    getAllShapes,
    getSpecificShapeState,
    getSpecificShape,
  };
};

export default useShape;
