import { useCallback, useEffect } from 'react';

import { NodeConfig } from 'konva/lib/Node';
import { Layer as LayerType } from 'konva/lib/Layer';

import { getStoredIdsUtil } from '../utils/storedData.util';

/**
 * Custom hook to configure the highest z-index for shape
 * @param selectShape Current shape id selected in actual state
 * @param layerRef Canvas layer
 * @returns Functions to help z-index on shapes
 */
const useZIndexShape = (selectShape: string, layerRef: LayerType) => {
  const handleTransformerMoveToTop = useCallback(() => {
    setTimeout(() => {
      layerRef?.findOne((node: NodeConfig) => node.getId() === '')?.moveToTop();
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layerRef, selectShape]);
  useEffect(() => {
    handleTransformerMoveToTop();
  }, [handleTransformerMoveToTop]);

  // BRING FORWARD
  const bringForward = () => {
    const currentShape = layerRef.findOne(
      (shape: NodeConfig) => shape.getId() === selectShape
    );
    currentShape.moveUp(); // IS ON TRANSFORMER
    currentShape.moveUp(); // IS ON THE FOLLOWING SHAPE
    // MOVE TO TOP THE TRANSFORMER SHAPE
    handleTransformerMoveToTop();
  };
  // BRING TO FRONT
  const bringToFront = () => {
    const currentShape = layerRef.findOne(
      (shape: NodeConfig) => shape.getId() === selectShape
    );
    currentShape.moveToTop();
    // MOVE TO TOP THE TRANSFORMER SHAPE
    handleTransformerMoveToTop();
  };
  // SEND BACKWARD
  const sendBackward = () => {
    const currentShape = layerRef.findOne(
      (shape: NodeConfig) => shape.getId() === selectShape
    );
    currentShape.moveDown();
  };
  // SEND TO BACK
  const sendToBack = () => {
    const currentShape = layerRef.findOne(
      (shape: NodeConfig) => shape.getId() === selectShape
    );
    currentShape.moveToBottom();
  };
  // SET Z INDEX IN FIRST INIT
  const initializeZIndex = (layerScopeRef: LayerType) => {
    const idList = getStoredIdsUtil();
    idList?.forEach((id) =>
      layerScopeRef
        .findOne((shape: NodeConfig) => shape.getId() === id)
        .moveToTop()
    );
  };

  return {
    initializeZIndex,
    bringForward,
    bringToFront,
    sendBackward,
    sendToBack,
  };
};

export default useZIndexShape;
