import Konva from 'konva';
import * as uuid from 'uuid';

import { Layer } from 'konva/lib/Layer';
import { Stage } from 'konva/lib/Stage';

const addTextWB = (stage: Stage, layer: Layer) => {
  const id = `text~${uuid.v4()}`;
  const textNode = new Konva.Text({
    id,
    text: 'Escriba aquí',
    x: 50,
    y: 80,
    fontSize: 20,
    draggable: true,
    width: 200,
  });
  layer.add(textNode);

  const transformerRef = new Konva.Transformer({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    node: textNode as any,
    enabledAnchors: ['middle-left', 'middle-right'],
    boundBoxFunc: (_, newBox) => ({
      ...newBox,
      width: Math.max(30, newBox.width),
    }),
  });

  stage.on('click', (evt) => {
    if (evt.target === stage) return;
    // CHECK IF TYPE IS TEXT
    const type = evt.target.id().split('~')[0];
    transformerRef.detach();
    if (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      evt.target.id() === (stage as any).mouseClickStartShape.id() &&
      type === 'text'
    ) {
      layer.add(transformerRef);
      transformerRef.nodes([evt.target]);
      layer.draw();
    }
  });

  textNode.on('transform', () => {
    // RESET SCALE, SO ONLY WITH IS CHANGING BY transformer
    textNode.setAttrs({
      width: textNode.width() * textNode.scaleX(),
      scaleX: 1,
    });
  });
  textNode.on('dblclick', () => {
    // HIDE TEXT NODE AND TRANSFORMER
    textNode.hide();
    transformerRef.hide();
    layer.draw();
    // CREATE textarea OVER CANVAS WITH ABSOLUTE POSITION
    const textPosition = textNode.absolutePosition();
    const stageBox = stage.container().getBoundingClientRect();
    const areaPosition = {
      x: stageBox.left + textPosition.x,
      y: stageBox.top + textPosition.y,
    };
    // CREATE textarea AND STYLE IT
    const textareaRef = document.createElement('textarea');
    document.body.appendChild(textareaRef);
    // TRYING TO MATCH THE TEXT ON THE CANVAS
    textareaRef.value = textNode.text();
    textareaRef.classList.add('config-textarea-wb'); // CONFIG POSITION ABSOLUTE
    textareaRef.style.top = `${areaPosition.y}px`;
    textareaRef.style.left = `${areaPosition.x}px`;
    textareaRef.style.width = `${textNode.width() - textNode.padding() * 2}px`;
    textareaRef.style.height = `${
      textNode.height() - textNode.padding() * 2 + 5
    }px`;
    textareaRef.style.fontSize = `${textNode.fontSize()}px`;
    textareaRef.style.lineHeight = textNode.lineHeight().toString();
    textareaRef.style.fontFamily = textNode.fontFamily();
    textareaRef.style.transformOrigin = 'left top';
    textareaRef.style.textAlign = textNode.align();
    textareaRef.style.color = textNode.fill();
    // ROTATION
    const rotation = textNode.rotation();
    let transform = '';
    if (rotation) {
      transform += `rotateZ(${rotation}deg)`;
    }
    let px = 0;
    const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    if (isFirefox) px += 2 + Math.round(textNode.fontSize() / 20);
    transform += `translateY(-${px}px)`;
    textareaRef.style.transform = transform;
    textareaRef.style.height = 'auto';
    textareaRef.style.height = `${textareaRef.scrollHeight + 3}px`;
    textareaRef.focus();

    const removeTextarea = () => {
      textareaRef.parentNode.removeChild(textareaRef);
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      window.removeEventListener('click', handleOutsideClick);
      textNode.show();
      transformerRef.show();
      transformerRef.forceUpdate();
      layer.draw();
    };

    const setTextareaWidth = (newWidth: number) => {
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

    textareaRef.addEventListener('keydown', (evt) => {
      // HIDE ON ENTER BUT DONT HIDE ON SHIFT + ENTER
      if (evt.keyCode === 13 && !evt.shiftKey) {
        textNode.text(textareaRef.value);
        removeTextarea();
      }
      // ON ESC DONT SET VALUE, BACK TO NODE
      if (evt.keyCode === 27) removeTextarea();
      // SCALE textarea
      const scale = textNode.getAbsoluteScale().x;
      setTextareaWidth(textNode.width() * scale);
      textareaRef.style.height = 'auto';
      textareaRef.style.height = `${
        textareaRef.scrollHeight + textNode.fontSize()
      }px`;
    });

    const handleOutsideClick = (evt: Event) => {
      if (evt.target !== textareaRef) removeTextarea();
    };

    setTimeout(() => window.addEventListener('click', handleOutsideClick));
  });

  layer.add(transformerRef);
  layer.draw();

  return id;
};

export default addTextWB;
