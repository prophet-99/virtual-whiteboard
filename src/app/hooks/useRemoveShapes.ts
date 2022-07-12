import React, { useEffect } from 'react';

import { NodeConfig } from 'konva/lib/Node';
import { Layer as LayerType } from 'konva/lib/Layer';
import { Transformer as TransformerType } from 'konva/lib/shapes/Transformer';
import {
  GeneralShapeModel,
  ImageShapeModel,
  LineShapeModel,
  TextShapeModel,
} from '../models/Shape.model';

/**
 * Custom hook to delete shapes
 * @param shapeList List of shapes that can be removed
 * @param shapeStateList List of shape states that hep to remove this
 * @param selectShape Current shape id selected in actual state
 * @param forceUpdate Help render events outside of React context
 * @param transformerRef Transformer specifically for brush hook
 * @param layerRef Canvas layer
 */
const useRemoveShapes = (
  shapeList: ShapeType,
  shapeStateList: ShapeStateType,
  selectShape: string,
  forceUpdate: () => void,
  transformerRef: TransformerType,
  layerRef: LayerType
) => {
  useEffect(() => {
    const { arrows, circles, images, lines, rectangles, texts, brushes } =
      shapeList;
    const {
      setArrows,
      setCircles,
      setImages,
      setLines,
      setRectangles,
      setTexts,
      setBrushes,
    } = shapeStateList;

    const deleteEvtRef = ({ code }: KeyboardEvent) => {
      if (code === 'Delete') {
        let selectedIdx = arrows.findIndex(({ id }) => id === selectShape);
        if (selectedIdx !== -1) {
          arrows.splice(selectedIdx, 1);
          setArrows(arrows);
          forceUpdate();
          return;
        }
        selectedIdx = circles.findIndex(({ id }) => id === selectShape);
        if (selectedIdx !== -1) {
          circles.splice(selectedIdx, 1);
          setCircles(circles);
          forceUpdate();
          return;
        }
        selectedIdx = images.findIndex(({ id }) => id === selectShape);
        if (selectedIdx !== -1) {
          images.splice(selectedIdx, 1);
          setImages(images);
          forceUpdate();
          return;
        }
        selectedIdx = lines.findIndex(({ id }) => id === selectShape);
        if (selectedIdx !== -1) {
          lines.splice(selectedIdx, 1);
          setLines(lines);
          forceUpdate();
          return;
        }
        selectedIdx = rectangles.findIndex(({ id }) => id === selectShape);
        if (selectedIdx !== -1) {
          rectangles.splice(selectedIdx, 1);
          setRectangles(rectangles);
          forceUpdate();
          return;
        }
        selectedIdx = texts.findIndex(({ id }) => id === selectShape);
        if (selectedIdx !== -1) {
          texts.splice(selectedIdx, 1);
          setTexts(texts);
          forceUpdate();
          return;
        }
        selectedIdx = brushes.findIndex(({ id }) => id === selectShape);
        if (selectedIdx !== -1) {
          transformerRef.nodes([]);
          layerRef
            .findOne((shape: NodeConfig) => shape.getId() === selectShape)
            .destroy();
          brushes.splice(selectedIdx, 1);
          setBrushes(brushes);
          forceUpdate();
        }
      }
    };
    document.addEventListener('keydown', deleteEvtRef);
    return () => document.removeEventListener('keydown', deleteEvtRef);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectShape]);
};

type ShapeType = {
  arrows: LineShapeModel[];
  circles: GeneralShapeModel[];
  images: ImageShapeModel[];
  lines: LineShapeModel[];
  rectangles: GeneralShapeModel[];
  texts: TextShapeModel[];
  brushes: LineShapeModel[];
};

type ShapeStateType = {
  setArrows: React.Dispatch<React.SetStateAction<LineShapeModel[]>>;
  setCircles: React.Dispatch<React.SetStateAction<GeneralShapeModel[]>>;
  setImages: React.Dispatch<React.SetStateAction<ImageShapeModel[]>>;
  setLines: React.Dispatch<React.SetStateAction<LineShapeModel[]>>;
  setRectangles: React.Dispatch<React.SetStateAction<GeneralShapeModel[]>>;
  setTexts: React.Dispatch<React.SetStateAction<TextShapeModel[]>>;
  setBrushes: React.Dispatch<React.SetStateAction<LineShapeModel[]>>;
};

export default useRemoveShapes;
