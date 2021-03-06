import { useEffect, useRef } from 'react';

import { Rect as RectType } from 'konva/lib/shapes/Rect';
import { Transformer as TransformerType } from 'konva/lib/shapes/Transformer';
import { Rect, Transformer } from 'react-konva';

import { ShapePropsModel } from '../models/Shape.model';

const RectangleWB = ({
  minimumSize,
  shapeProps,
  isSelected,
  onSelect,
  onChange,
}: ShapePropsModel) => {
  const shapeRef = useRef<RectType>();
  const transformRef = useRef<TransformerType>();

  useEffect(() => {
    if (isSelected) {
      transformRef.current.nodes([shapeRef.current]);
      transformRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      {/* INIT SHAPE SECTION */}
      <Rect
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        onDragEnd={(evt) =>
          onChange({
            ...shapeProps,
            x: evt.target.x(),
            y: evt.target.y(),
          })
        }
        onTransformEnd={() => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);

          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            // SET MINIMAL VALUE
            width: Math.max(minimumSize, node.width() * scaleX),
            height: Math.max(minimumSize, node.height() * scaleY),
          });
        }}
      />
      {/* END SHAPE SECTION */}
      {/* INIT TRANSFORMER SECTION */}
      {isSelected && (
        <Transformer
          ref={transformRef}
          boundBoxFunc={(oldBox, newBox) =>
            newBox.width < minimumSize || newBox.height < minimumSize
              ? oldBox
              : newBox
          }
        />
      )}
      {/* END TRANSFORMER SECTION */}
    </>
  );
};

export default RectangleWB;
