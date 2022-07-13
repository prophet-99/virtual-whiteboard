import {
  GeneralShapeModel,
  ImageShapeModel,
  LineShapeModel,
  TextShapeModel,
} from './Shape.model';

export interface ShapeListModel {
  arrows: LineShapeModel[];
  circles: GeneralShapeModel[];
  images: ImageShapeModel[];
  lines: LineShapeModel[];
  rectangles: GeneralShapeModel[];
  texts: TextShapeModel[];
  brushes: LineShapeModel[];
}

export interface ShapeStateListModel {
  setArrows: React.Dispatch<React.SetStateAction<LineShapeModel[]>>;
  setCircles: React.Dispatch<React.SetStateAction<GeneralShapeModel[]>>;
  setImages: React.Dispatch<React.SetStateAction<ImageShapeModel[]>>;
  setLines: React.Dispatch<React.SetStateAction<LineShapeModel[]>>;
  setRectangles: React.Dispatch<React.SetStateAction<GeneralShapeModel[]>>;
  setTexts: React.Dispatch<React.SetStateAction<TextShapeModel[]>>;
  setBrushes: React.Dispatch<React.SetStateAction<LineShapeModel[]>>;
}
