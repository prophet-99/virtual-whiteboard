import { useEffect, useRef } from 'react';

import { Text as TextType } from 'konva/lib/shapes/Text';
import { Transformer as TransformerType } from 'konva/lib/shapes/Transformer';
import { Text, Transformer } from 'react-konva';

import { ShapePropsModel } from '../models/Shape.model';

const MIMINAL_SIZE = 50;

const TextWB = ({
  shapeProps,
  isSelected,
  onSelect,
  onChange,
  stage,
}: ShapePropsModel) => {
  const shapeRef = useRef<TextType>();
  const transformRef = useRef<TransformerType>();

  useEffect(() => {
    if (isSelected) {
      transformRef.current.nodes([shapeRef.current]);
      transformRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const editTextNode = () => {
    // HIDE TEXT NODE AND TRANSFORMER
    shapeRef.current.hide();
    transformRef.current.hide();
    // CREATE textarea OVER CANVAS WITH ABSOLUTE POSITION
    const textPosition = shapeRef.current.absolutePosition();
    const stageBox = stage.container().getBoundingClientRect();
    const areaPosition = {
      x: stageBox.left + textPosition.x,
      y: stageBox.top + textPosition.y,
    };
    // CREATE textarea AND STYLE IT
    const textareaRef = document.createElement('textarea');
    document.body.appendChild(textareaRef);
    // TRYING TO MATCH THE TEXT ON THE CANVAS
    textareaRef.value = shapeRef.current.text();
    textareaRef.classList.add('config-textarea-wb'); // CONFIG POSITION ABSOLUTE
    textareaRef.style.top = `${areaPosition.y}px`;
    textareaRef.style.left = `${areaPosition.x}px`;
    textareaRef.style.width = `${
      shapeRef.current.width() - shapeRef.current.padding() * 2
    }px`;
    textareaRef.style.height = `${
      shapeRef.current.height() - shapeRef.current.padding() * 2 + 5
    }px`;
    textareaRef.style.fontSize = `${shapeRef.current.fontSize()}px`;
    textareaRef.style.lineHeight = shapeRef.current.lineHeight().toString();
    textareaRef.style.fontFamily = shapeRef.current.fontFamily();
    textareaRef.style.transformOrigin = 'left top';
    textareaRef.style.textAlign = shapeRef.current.align();
    textareaRef.style.color = shapeRef.current.fill();
    // ROTATION
    const rotation = shapeRef.current.rotation();
    let transform = '';
    if (rotation) {
      transform += `rotateZ(${rotation}deg)`;
    }
    let px = 0;
    const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    if (isFirefox) px += 2 + Math.round(shapeRef.current.fontSize() / 20);
    transform += `translateY(-${px}px)`;
    textareaRef.style.transform = transform;
    textareaRef.style.height = 'auto';
    textareaRef.style.height = `${textareaRef.scrollHeight + 3}px`;
    textareaRef.focus();
    // SCOPE FUNCTIONS
    const scopeRemoveTextarea = () => {
      textareaRef.parentNode.removeChild(textareaRef);
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      window.removeEventListener('click', scopeHandleOutsideClick);
      shapeRef.current.show();
      transformRef.current.show();
      transformRef.current.forceUpdate();
    };
    const scopeSetTextareaWidth = (newWidth: number) => {
      let newWidthScope = newWidth;

      const isSafariScope = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent
      );
      const isFirefoxScope =
        navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
      if (isSafariScope || isFirefoxScope) {
        newWidthScope = Math.ceil(newWidthScope);
      }
      textareaRef.style.width = `${newWidthScope}px`;
    };
    // LISTENER FOR textarea
    textareaRef.addEventListener('keydown', (evt) => {
      // HIDE ON ENTER BUT DONT HIDE ON SHIFT + ENTER
      if (evt.keyCode === 13 && !evt.shiftKey) {
        shapeRef.current.text(textareaRef.value);
        scopeRemoveTextarea();
      }
      // ON ESC DONT SET VALUE, BACK TO NODE
      if (evt.keyCode === 27) scopeRemoveTextarea();
      // SCALE textarea
      const scale = shapeRef.current.getAbsoluteScale().x;
      scopeSetTextareaWidth(shapeRef.current.width() * scale);
      textareaRef.style.height = 'auto';
      textareaRef.style.height = `${
        textareaRef.scrollHeight + shapeRef.current.fontSize()
      }px`;
    });
    // HANDLE FUNCTIONS
    const scopeHandleOutsideClick = (evt: Event) => {
      if (evt.target !== textareaRef) scopeRemoveTextarea();
    };

    setTimeout(() => window.addEventListener('click', scopeHandleOutsideClick));
  };

  return (
    <>
      {/* INIT SHAPE SECTION */}
      <Text
        onClick={onSelect}
        onDblClick={editTextNode}
        onTap={onSelect}
        onDblTap={editTextNode}
        ref={shapeRef}
        text="Escriba aquí"
        {...shapeProps}
        draggable
        onDragEnd={(evt) =>
          onChange({
            ...shapeProps,
            x: evt.target.x(),
            y: evt.target.y(),
          })
        }
        onTransform={() => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          node.scaleX(1);

          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            // SET MINIMAL VALUE
            width: Math.max(MIMINAL_SIZE, node.width() * scaleX),
          });
        }}
      />
      {/* END SHAPE SECTION */}
      {/* INIT TRANSFORMER SECTION */}
      {isSelected && (
        <Transformer
          ref={transformRef}
          enabledAnchors={['middle-left', 'middle-right']}
          boundBoxFunc={(oldBox, newBox) =>
            newBox.width < MIMINAL_SIZE ? oldBox : newBox
          }
        />
      )}
      {/* END TRANSFORMER SECTION */}
    </>
  );
};

export default TextWB;
