import { useEffect } from 'react';

import { NodeConfig } from 'konva/lib/Node';
import { Layer as LayerType } from 'konva/lib/Layer';

/**
 * Custom hook to configure the highest z-index for shape
 * @param selectShape Current shape id selected in actual state
 * @param layerRef Canvas layer
 */
const useZIndexShape = (selectShape: string, layerRef: LayerType) => {
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
};

export default useZIndexShape;
