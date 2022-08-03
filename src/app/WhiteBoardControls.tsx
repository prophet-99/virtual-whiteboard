import { ChangeEvent, useEffect, useState } from 'react';

import Compressor from 'compressorjs';

import { Stage as StageType } from 'konva/lib/Stage';
import { Layer as LayerType } from 'konva/lib/Layer';

import { ShapeEnum } from './models/enums/Shape.enum';
import {
  GeneralShapeModel,
  ImageShapeModel,
  LineShapeModel,
  TextShapeModel,
} from './models/Shape.model';
import { ShapeListModel } from './models/ShapeState.model';
import { ToolType } from './models/types/Tool.type';
import {
  saveStoredIdsUtil,
  saveStoredShapesUtil,
} from './utils/storedData.util';
import getRandomIdUtil from './utils/getRandomId.util';

const WhiteBoardControls = ({
  shapeList,
  getSpecificShapeState,
  tool,
  setTool,
  stageRef,
  layerRef,
  onChangeColor,
}: WhiteBoardControlsPropsType) => {
  // CHECK IF SAVE WHEN EXIST ONE CHANGE
  useEffect(() => {
    // STORE IDS
    if (layerRef) {
      const idList = layerRef
        .getChildren()
        .map((shape) => (shape ? shape.id() : undefined))
        .filter((idRef) => idRef.length > 0);
      saveStoredIdsUtil(idList);
    }
    // STORE SHAPES
    saveStoredShapesUtil(shapeList);
  }, [layerRef, shapeList]);
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
  const [color, setColor] = useState('#2D2E2F');
  useEffect(() => {
    onChangeColor(color);
  }, [color, onChangeColor]);
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
  const createImage = async (evt: ChangeEvent<HTMLInputElement>) => {
    const targetFile = (evt.target as HTMLInputElement).files[0];
    // COMPRESS IMAGE
    const base64Result = await new Promise((resolve, reject) => {
      // eslint-disable-next-line no-new
      new Compressor(targetFile, {
        quality: 0.5,
        convertSize: 300,
        success(resultFile) {
          const reader = new FileReader();
          reader.readAsDataURL(resultFile);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (err) => reject(err);
        },
        error(err) {
          reject(err);
        },
      });
    });
    // GET DIMENSIONS OF IMAGE
    const [imgWidth, imgHeight]: [number, number] = await new Promise(
      (resolve, reject) => {
        const imgRef = new Image();
        imgRef.onload = () => resolve([imgRef.width, imgRef.height]);
        imgRef.onerror = (err) => reject(err);
        imgRef.src = base64Result as string;
      }
    );
    // SET IMAGES
    const setImages = getSpecificShapeState(ShapeEnum.IMAGES) as React.Dispatch<
      React.SetStateAction<ImageShapeModel[]>
    >;
    setImages((prevState) => [
      ...prevState,
      {
        id: getRandomIdUtil(ShapeEnum.IMAGES),
        x: window.innerWidth / 2,
        y: 300,
        width: imgWidth,
        height: imgHeight,
        imageURI: base64Result as string,
      },
    ]);
  };
  const createLine = () => {
    const setLines = getSpecificShapeState(ShapeEnum.LINES) as React.Dispatch<
      React.SetStateAction<LineShapeModel[]>
    >;
    setLines((prevState) => [
      ...prevState,
      {
        id: getRandomIdUtil(ShapeEnum.LINES),
        stroke: color,
        strokeWidth: 5,
        points: [window.innerWidth / 2, 100, window.innerWidth / 2, 300], // *[X1, Y1, X2, Y2] -> (X1 === X2)
      },
    ]);
  };
  const createRectangle = () => {
    const setRectangles = getSpecificShapeState(
      ShapeEnum.RECTANGLES
    ) as React.Dispatch<React.SetStateAction<GeneralShapeModel[]>>;
    setRectangles((prevState) => [
      ...prevState,
      {
        id: getRandomIdUtil(ShapeEnum.RECTANGLES),
        x: window.innerWidth / 2,
        y: 300,
        width: 100,
        height: 100,
        fill: color,
      },
    ]);
  };
  const createText = () => {
    const setTexts = getSpecificShapeState(ShapeEnum.TEXTS) as React.Dispatch<
      React.SetStateAction<TextShapeModel[]>
    >;
    setTexts((prevState) => [
      ...prevState,
      {
        id: getRandomIdUtil(ShapeEnum.TEXTS),
        fontSize: 16,
        width: 200,
        x: window.innerWidth / 2,
        y: 80,
        text: 'Escriba aquí',
      },
    ]);
  };

  return (
    <section className="wb-controls">
      <button
        className={`wb-controls__item ${tool === 'DEFAULT' ? 'is-active' : ''}`}
        onClick={() => setTool('DEFAULT')}
        type="button"
      >
        <i className="fa-solid fa-arrow-pointer" />
      </button>
      <button
        className={`wb-controls__item ${tool === 'BRUSH' ? 'is-active' : ''}`}
        onClick={() => setTool('BRUSH')}
        type="button"
      >
        <i className="fa-solid fa-pen" />
      </button>
      <button
        className="wb-controls__item wb-controls__item--rotate-45"
        onClick={createArrow}
        type="button"
      >
        <i className="fa-solid fa-down-long" />
      </button>
      <button
        className="wb-controls__item"
        onClick={createCircle}
        type="button"
      >
        <i className="fa-regular fa-circle" />
      </button>
      <button
        className="wb-controls__item wb-controls__item--rotate-135"
        onClick={createLine}
        type="button"
      >
        <i className="fa-solid fa-minus" />
      </button>
      <button
        className="wb-controls__item"
        onClick={createRectangle}
        type="button"
      >
        <i className="fa-regular fa-square" />
      </button>
      <button className="wb-controls__item" onClick={createText} type="button">
        <i className="fa-solid fa-t" />
      </button>
      <label className="wb-controls__item wb-controls__item--input">
        <i className="fa-regular fa-image" />
        <input
          type="file"
          accept="image/*"
          onChange={(evt) => createImage(evt)}
        />
      </label>
      <label className="wb-controls__item wb-controls__item--input">
        <i className="wb-controls__color-pck" style={{ background: color }} />
        <input
          type="color"
          value={color}
          onChange={(evt) => setColor(evt.target.value)}
        />
      </label>
      <button className="wb-controls__item" onClick={saveToImage} type="button">
        <i className="fa-solid fa-download" />
      </button>
    </section>
  );
};

type WhiteBoardControlsPropsType = {
  shapeList: ShapeListModel;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getSpecificShapeState: (type: ShapeEnum) => any;
  tool: string;
  setTool: React.Dispatch<React.SetStateAction<ToolType>>;
  stageRef: StageType;
  layerRef: LayerType;
  onChangeColor: (color: string) => void;
};
export default WhiteBoardControls;
