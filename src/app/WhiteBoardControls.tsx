import { useEffect, useRef, useState } from 'react';

import { Stage as StageType } from 'konva/lib/Stage';

import { ShapeEnum } from './models/enums/Shape.enum';
import { GeneralShapeModel, LineShapeModel } from './models/Shape.model';
import { ShapeListModel } from './models/ShapeState.model';
import { ToolType } from './models/types/Tool.type';
import { saveStoredDataUtil } from './utils/storedData.util';
import getRandomIdUtil from './utils/getRandomId.util';

const WhiteBoardControls = ({
  shapeList,
  getSpecificShapeState,
  setTool,
  stageRef,
}: WhiteBoardControlsPropsType) => {
  const lastShapeList = useRef(shapeList);
  // CHECK IF SAVE WHEN EXIST ONE CHANGE
  useEffect(() => {
    if (JSON.stringify(shapeList) !== JSON.stringify(lastShapeList.current)) {
      saveStoredDataUtil(shapeList);
      lastShapeList.current = shapeList;
    }
  }, [shapeList]);
  // SAVE TO IMAGE
  const saveToImage = () => {
    const link = document.createElement('a');
    link.download = 'whiteboard.png';
    // CONFIGURE WITH PIXEL RATIO 1.5 FOR HD IMAGES
    link.href = stageRef.toDataURL({ pixelRatio: 1.5 });
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  // STATE OF COLOR
  const [color, setColor] = useState('#0959AE');
  // FUNCTIONS TO CREATE SHAPES
  const createArrow = () => {
    const setArrows = getSpecificShapeState(ShapeEnum.ARROWS) as React.Dispatch<
      React.SetStateAction<LineShapeModel[]>
    >;
    setArrows((prevState) => [
      ...prevState,
      {
        id: getRandomIdUtil(ShapeEnum.ARROWS),
        points: [window.innerWidth / 2, 100, window.innerWidth / 2, 300], // *[X1, Y1, X2, Y2] -> (X1 === X2)
        stroke: color,
        strokeWidth: 8,
      },
    ]);
  };
  const createCircle = () => {
    const setCircles = getSpecificShapeState(
      ShapeEnum.CIRCLES
    ) as React.Dispatch<React.SetStateAction<GeneralShapeModel[]>>;
    setCircles((prevState) => [
      ...prevState,
      {
        id: getRandomIdUtil(ShapeEnum.CIRCLES),
        x: window.innerWidth / 2,
        y: 300,
        width: 100,
        height: 100,
        fill: color,
      },
    ]);
  };
  const createImage = () => {};
  const createLine = () => {};
  const createRectangle = () => {};
  const createText = () => {};

  return (
    <>
      <button onClick={() => setTool('BRUSH')} type="button">
        Brush me
      </button>
      <button onClick={() => setTool('DEFAULT')} type="button">
        Default
      </button>
      <button onClick={saveToImage} type="button">
        Save to Image
      </button>
      <button onClick={createArrow} type="button">
        Add arrow
      </button>
      <button onClick={createCircle} type="button">
        Add circle
      </button>
      <input
        type="color"
        value={color}
        onChange={(evt) => setColor(evt.target.value)}
      />
    </>
  );
};

type WhiteBoardControlsPropsType = {
  shapeList: ShapeListModel;
  getSpecificShapeState: (type: ShapeEnum) => any;
  setTool: React.Dispatch<React.SetStateAction<ToolType>>;
  stageRef: StageType;
};
export default WhiteBoardControls;
