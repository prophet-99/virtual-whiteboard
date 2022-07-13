import React from 'react';

import { Stage as StageType } from 'konva/lib/Stage';

import { ShapeEnum } from './models/enums/Shape.enum';
import {
  GeneralShapeModel,
  ImageShapeModel,
  LineShapeModel,
  TextShapeModel,
} from './models/Shape.model';
import { ShapeListModel, ShapeStateListModel } from './models/ShapeState.model';
import { ToolType } from './models/types/Tool.type';
import { saveStoredDataUtil } from './utils/storedData.util';

const WhiteBoardControls = ({
  shapeList,
  // shapeStateList,
  // getSpecificShape,
  // getSpecificShapeState,
  setTool,
  stageRef,
}: WhiteBoardControlsPropsType) => {
  console.log('aea');
  return (
    <>
      <button onClick={() => setTool('BRUSH')} type="button">
        Brush me
      </button>
      <button onClick={() => setTool('DEFAULT')} type="button">
        Default
      </button>
      <button
        onClick={() => {
          saveStoredDataUtil(shapeList);
        }}
        type="button"
      >
        Save
      </button>
      <button
        onClick={() => {
          const link = document.createElement('a');
          link.download = 'whiteboard.png';
          // CONFIGURE WITH PIXEL RATIO 1.5 FOR HD IMAGES
          link.href = stageRef.toDataURL({ pixelRatio: 1.5 });
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }}
        type="button"
      >
        Save to Image
      </button>
    </>
  );
};

type WhiteBoardControlsPropsType = {
  shapeStateList: ShapeStateListModel;
  shapeList: ShapeListModel;
  getSpecificShape: (type: ShapeEnum) => any;
  getSpecificShapeState: (
    type: ShapeEnum
  ) =>
    | LineShapeModel[]
    | GeneralShapeModel[]
    | ImageShapeModel[]
    | TextShapeModel[];
  setTool: React.Dispatch<React.SetStateAction<ToolType>>;
  stageRef: StageType;
};
export default WhiteBoardControls;
