import MovingPlatform from '../sprites/movingPlatform';
import LevelsEntourage from '../levels/levelsEntourage';

const registeredTypes = {
  MovingPlatform,
  LevelsEntourage,
};

export default class LevelObject {
  constructor(type, ...props) {
    return new registeredTypes[type](...props);
  }
}
