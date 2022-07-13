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

export interface GroupShapeModel {
  arrows: LineShapeModel[];
  circles: GeneralShapeModel[];
  images: ImageShapeModel[];
  lines: LineShapeModel[];
  rectangles: GeneralShapeModel[];
  texts: TextShapeModel[];
  brushes: LineShapeModel[];
}
