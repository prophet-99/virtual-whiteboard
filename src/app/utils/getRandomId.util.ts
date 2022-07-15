import * as uuid from 'uuid';

import { ShapeEnum } from '../models/enums/Shape.enum';

const getRandomIdUtil = (shapeType: ShapeEnum) => {
  switch (shapeType) {
    case ShapeEnum.ARROWS:
      return `arrow~${uuid.v4()}`;
    case ShapeEnum.BRUSHES:
      return `brush~${uuid.v4()}`;
    case ShapeEnum.CIRCLES:
      return `circle~${uuid.v4()}`;
    case ShapeEnum.IMAGES:
      return `image~${uuid.v4()}`;
    case ShapeEnum.LINES:
      return `line~${uuid.v4()}`;
    case ShapeEnum.RECTANGLES:
      return `rectangle~${uuid.v4()}`;
    case ShapeEnum.TEXTS:
      return `text~${uuid.v4()}`;
    default:
      return uuid.v4();
  }
};

export default getRandomIdUtil;
