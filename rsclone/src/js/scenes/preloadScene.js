import Phaser from 'phaser';
import ibbSprite from '../../assets/ibb/ibb-sprite.png';
import obbSprite from '../../assets/obb/obb-sprite.png';
import mainMenuMusic from '../../assets/music/main_menu.mp3';
import level1Music from '../../assets/music/level1.mp3';
import level2Music from '../../assets/music/level2.mp3';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super('Preload');
  }

  preload() {
    this.load.spritesheet('ibb-sprite', ibbSprite, { frameWidth: 47, frameHeight: 53 });
    this.load.spritesheet('obb-sprite', obbSprite, { frameWidth: 47, frameHeight: 64 });
    this.load.audio('main_menu_music', mainMenuMusic);
    this.load.audio('level1_music', level1Music);
    this.load.audio('level2_music', level2Music);
  }

  create() {
    this.scene.start('Start');
  }
}
