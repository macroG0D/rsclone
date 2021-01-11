import Phaser from 'phaser';
import ibbSprite from '../../assets/sprites/ibb/ibb-sprite.png';
import obbSprite from '../../assets/sprites/obb/obb-sprite.png';
import githubIcon from '../../assets/images/github-logo-face.svg';
import ibbImg from '../../assets/images/ibb_stay.png';
import obbImg from '../../assets/images/obb_stay.png';
import ibbBg from '../../assets/images/ibb_bg.png';
import obbBg from '../../assets/images/obb_bg.png';
import hedgehogHead from '../../assets/sprites/hedgehog/hedgehog_head.svg';
import hedgehogJumper from '../../assets/sprites/hedgehog/hedgehog_jumper.svg';
import hedgehogHalfButt from '../../assets/sprites/hedgehog/hedgehog_halfButt.svg';
import hedgehogFullButt from '../../assets/sprites/hedgehog/hedgehog_fullButt.svg';
import ibbKeys from '../../assets/images/ibbKeys.svg';
import obbKeys from '../../assets/images/obbKeys.svg';
import mainMenuMusic from '../../assets/music/main_menu.mp3';
import level1Music from '../../assets/music/level1.mp3';
import level2Music from '../../assets/music/level2.mp3';
import warpCross01Sound from '../../assets/sounds/warp_cross_a_01.mp3';

export default class Preload extends Phaser.Scene {
  constructor() {
    super('Preload');
  }

  preload() {
    this.showBootBg();
    this.load.image('githubIcon', githubIcon);
    this.load.image('obbImg', obbImg);
    this.load.image('ibbImg', ibbImg);
    this.load.image('obbBg', obbBg);
    this.load.image('ibbBg', ibbBg);
    this.load.image('obbKeys', obbKeys);
    this.load.image('ibbKeys', ibbKeys);
    this.load.image('hedgehog-head', hedgehogHead);
    this.load.image('hedgehog-halfbutt', hedgehogHalfButt);
    this.load.image('hedgehog-jumper', hedgehogJumper);
    this.load.image('hedgehog-fullbutt', hedgehogFullButt);

    this.load.audio('main_menu_music', mainMenuMusic);
    this.load.audio('level1_music', level1Music);
    this.load.audio('level2_music', level2Music);

    this.load.audio('warp_cross_01', warpCross01Sound);

    this.load.spritesheet('ibb-sprite', ibbSprite, {
      frameWidth: 47,
      frameHeight: 52,
    });
    this.load.spritesheet('obb-sprite', obbSprite, {
      frameWidth: 47,
      frameHeight: 62,
    });
  }

  create() {
    // this.scene.start('MainMenu');
    this.scene.start('Level1');
  }

  showBootBg() {
    const ratio = this.game.config.width / 1920;
    this.add.sprite(0, 0, 'bootBg').setScale(ratio).setOrigin(0);
  }
}
