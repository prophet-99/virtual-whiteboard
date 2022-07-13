import { ShapeEnum } from '../models/enums/Shape.enum';
import { GroupShapeModel } from '../models/Shape.model';

export const getStoredDataUtil = () => {
  const parsedData = JSON.parse(
    window.sessionStorage.getItem('WHITEBOARD')
  ) as GroupShapeModel;

  if (!parsedData) return undefined;
  return parsedData;
};

export const getSpecificStoredDataUtil = (shapeType: ShapeEnum) => {
  const storedData = getStoredDataUtil();

  if (!storedData) return undefined;
  return storedData[shapeType];
};

export const saveStoredDataUtil = (shapes: GroupShapeModel) => {
  window.sessionStorage.setItem('WHITEBOARD', JSON.stringify(shapes));
};

export const deleteStoredDataUtil = () => {
  window.sessionStorage.removeItem('WHITEBOARD');
};
