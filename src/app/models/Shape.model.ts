import { KonvaEventObject } from 'konva/lib/Node';
import { Stage } from 'konva/lib/Stage';

export interface GeneralShapeModel {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
}

export interface ImageShapeModel extends GeneralShapeModel {
  imageURL: string;
}

export interface LineShapeModel {
  id: string;
  stroke: string;
  strokeWidth: number;
  points: number[];
}

export interface TextShapeModel {
  id: string;
  x: number;
  y: number;
  fontSize: number;
  width: number;
}

export interface ShapePropsModel {
  shapeProps:
    | GeneralShapeModel
    | ImageShapeModel
    | LineShapeModel
    | TextShapeModel;
  isSelected: boolean;
  onSelect: (evt: KonvaEventObject<MouseEvent>) => void;
  onChange: (
    shapeProps:
      | GeneralShapeModel
      | ImageShapeModel
      | LineShapeModel
      | TextShapeModel
  ) => void;
  stage?: Stage;
}
