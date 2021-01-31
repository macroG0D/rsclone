import StandartHedgehog from '../sprites/enemies/standartHedgehog';
import JumpingHedgehog from '../sprites/enemies/jumpingHedgehog';

const registeredTypes = {
  StandartHedgehog,
  JumpingHedgehog,
};

export default class Enemy {
  constructor(type, ...props) {
    return new registeredTypes[type](...props);
  }
}
