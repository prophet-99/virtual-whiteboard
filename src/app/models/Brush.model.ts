import { Layer } from 'konva/lib/Layer';
import { Transformer } from 'konva/lib/shapes/Transformer';
import { Stage } from 'konva/lib/Stage';
import { ToolType } from './types/Tool.type';

export interface BrushModel {
  stage: Stage;
  layer: Layer;
  transformerRef: Transformer;
  mode: ToolType;
  color: string;
  minimumSize: number;
}
