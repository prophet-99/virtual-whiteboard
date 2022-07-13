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

export interface ImageShapeModel {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  imageURI: string;
}

export interface LineShapeModel {
  id: string;
  stroke: string;
  strokeWidth: number;
  points: number[];
  rotation?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  skewY?: number;
  skewX?: number;
  scaleX?: number;
  scaleY?: number;
}

export interface TextShapeModel {
  id: string;
  x: number;
  y: number;
  fontSize: number;
  width: number;
  text: string;
}

export interface ShapePropsModel {
  minimumSize: number;
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
