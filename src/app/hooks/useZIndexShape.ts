import { useEffect } from 'react';

import { NodeConfig } from 'konva/lib/Node';
import { Layer as LayerType } from 'konva/lib/Layer';

import { getStoredIdsUtil } from '../utils/storedData.util';

/**
 * Custom hook to configure the highest z-index for shape
 * @param selectShape Current shape id selected in actual state
 * @param layerRef Canvas layer
 * @returns A function to render z-indez in first init
 */
const useZIndexShape = (selectShape: string, layerRef: LayerType) => {
  // TODO: IN FUTURE ONE EVENT CAN ACTIVE THE SHAPE
  useEffect(() => {
    // MOVE TO TOP THE SELECTED SHAPE
    layerRef
      ?.findOne((shape: NodeConfig) => shape.getId() === selectShape)
      ?.moveToTop();
    // MOVE TO TOP THE TRANSFORMER SHAPE
    setTimeout(() => {
      layerRef?.findOne((node: NodeConfig) => node.getId() === '')?.moveToTop();
    }, 0);
  }, [selectShape, layerRef]);

  // SET Z INDEX IN FIRST INIT
  const renderZIndex = (layerScopeRef: LayerType) => {
    const idList = getStoredIdsUtil();
    idList?.forEach((id) =>
      layerScopeRef
        .findOne((shape: NodeConfig) => shape.getId() === id)
        .moveToTop()
    );
  };

  return { renderZIndex };
};

export default useZIndexShape;
