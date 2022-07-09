import { Layer } from 'konva/lib/Layer';
import { Transformer } from 'konva/lib/shapes/Transformer';
import { Stage } from 'konva/lib/Stage';

export interface BrushModel {
  stage: Stage;
  layer: Layer;
  transformerRef: Transformer;
  mode: 'default' | 'brush';
  minimumSize: number;
}
