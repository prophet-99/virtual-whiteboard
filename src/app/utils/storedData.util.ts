import { ShapeEnum } from '../models/enums/Shape.enum';
import { ShapeListModel } from '../models/ShapeState.model';

export const getStoredDataUtil = () => {
  const parsedData = JSON.parse(
    sessionStorage.getItem('WHITEBOARD')
  ) as ShapeListModel;

  if (!parsedData) return undefined;
  return parsedData;
};

export const getSpecificStoredDataUtil = (shapeType: ShapeEnum) => {
  const storedData = getStoredDataUtil();

  if (!storedData) return undefined;
  return storedData[shapeType];
};

export const saveStoredDataUtil = (shapes: ShapeListModel) => {
  sessionStorage.setItem('WHITEBOARD', JSON.stringify(shapes));
};

export const deleteStoredDataUtil = () => {
  sessionStorage.removeItem('WHITEBOARD');
};
