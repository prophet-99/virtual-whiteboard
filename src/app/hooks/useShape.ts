import { ShapeEnum } from '../models/enums/Shape.enum';
import {
  ShapeListModel,
  ShapeStateListModel,
} from '../models/ShapeState.model';

/**
 * Custom hook to manage all shapes with their states
 * @param shapeList List of all shapes
 * @param shapeStateList List of all shape states
 * @returns Functions to handle the state of shapes
 */
const useShape = (
  shapeList: ShapeListModel,
  shapeStateList: ShapeStateListModel
) => {
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
