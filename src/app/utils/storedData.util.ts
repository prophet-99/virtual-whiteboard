import { ShapeEnum } from '../models/enums/Shape.enum';
import { ShapeListModel } from '../models/ShapeState.model';

const S_STORAGE_SHAPES_NAME = 'WHITEBOARD_SHAPES';
const S_STORAGE_IDS_NAME = 'WHITEBOARD_IDS';

export const getStoredShapesUtil = () => {
  const parsedData = JSON.parse(
    sessionStorage.getItem(S_STORAGE_SHAPES_NAME)
  ) as ShapeListModel;

  if (!parsedData) return undefined;
  return parsedData;
};

export const getStoredIdsUtil = () => {
  const parsedData = JSON.parse(
    sessionStorage.getItem(S_STORAGE_IDS_NAME)
  ) as string[];

  if (!parsedData) return undefined;
  return parsedData;
};

export const getSpecificStoredShapesUtil = (shapeType: ShapeEnum) => {
  const storedData = getStoredShapesUtil();

  if (!storedData) return undefined;
  return storedData[shapeType];
};

export const saveStoredShapesUtil = (shapeList: ShapeListModel) => {
  sessionStorage.setItem(S_STORAGE_SHAPES_NAME, JSON.stringify(shapeList));
};

export const saveStoredIdsUtil = (idList: string[]) => {
  sessionStorage.setItem(S_STORAGE_IDS_NAME, JSON.stringify(idList));
};

export const deleteStoredShapesUtil = () => {
  sessionStorage.removeItem(S_STORAGE_SHAPES_NAME);
};

export const deleteStoredIdsUtil = () => {
  sessionStorage.removeItem(S_STORAGE_IDS_NAME);
};
