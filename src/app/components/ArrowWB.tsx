import { useEffect, useRef } from 'react';

import { Arrow as ArrowType } from 'konva/lib/shapes/Arrow';
import { Transformer as TransfomerType } from 'konva/lib/shapes/Transformer';
import { Arrow, Transformer } from 'react-konva';

import { LineShapeModel, ShapePropsModel } from '../models/Shape.model';

const ArrowWB = ({
  minimumSize,
  shapeProps,
  isSelected,
  onSelect,
  onChange,
}: ShapePropsModel) => {
  const shapeRef = useRef<ArrowType>();
  const transformRef = useRef<TransfomerType>();

  useEffect(() => {
    if (isSelected) {
      transformRef.current.nodes([shapeRef.current]);
      transformRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      {/* INIT SHAPE SECTION */}
      <Arrow
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...(shapeProps as LineShapeModel)}
        draggable
        onDragEnd={(evt) => {
          onChange({
            ...shapeProps,
            x: evt.target.x(),
            y: evt.target.y(),
          });
        }}
        onTransformEnd={() => {
          const node = shapeRef.current;
          const height = Math.max(minimumSize, node.height() + node.scaleY());
          const newPoints = [
            node.points()[0],
            node.points()[1],
            node.points()[2],
            node.points()[1] + height,
          ];

          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            points: newPoints,
            width: node.width(),
            height: node.height(),
            rotation: node.rotation(),
            scaleX: node.scaleX(),
            scaleY: node.scaleY(),
          });
        }}
      />
      {/* END SHAPE SECTION */}
      {/* INIT TRANSFORMER SECTION */}
      {isSelected && (
        <Transformer
          ref={transformRef}
          enabledAnchors={['top-center', 'bottom-center']}
          boundBoxFunc={(oldBox, newBox) =>
            newBox.height < minimumSize ? oldBox : newBox
          }
        />
      )}
      {/* END TRANSFORMER SECTION */}
    </>
  );
};

export default ArrowWB;
