import Phaser from 'phaser';
import ibbSpriteMove from '../../assets/sprites/ibb/ibb-move.png';
import obbSpriteMove from '../../assets/sprites/obb/obb-move.png';
import githubIcon from '../../assets/images/github-logo-face.svg';
import ibbImg from '../../assets/images/ibb_stay.png';
import obbImg from '../../assets/images/obb_stay.png';
import ibbBg from '../../assets/images/ibb_bg.png';
import obbBg from '../../assets/images/obb_bg.png';
import ibbKeys from '../../assets/images/ibbKeys.svg';
import obbKeys from '../../assets/images/obbKeys.svg';
import bubble from '../../assets/images/bubble.png';
import crystal from '../../assets/images/crystal.png';
import hedgehogHead from '../../assets/sprites/enemies/hedgehogs/hedgehog_head.svg';
import hedgehogJumper from '../../assets/sprites/enemies/hedgehogs/hedgehog_jumper.svg';
import hedgehogHalfButt from '../../assets/sprites/enemies/hedgehogs/hedgehog_halfButt.svg';
import hedgehogFullButt from '../../assets/sprites/enemies/hedgehogs/hedgehog_fullButt.svg';
import menuMusic from '../../assets/music/main_menu.mp3';
import level1Music from '../../assets/music/level1.mp3';
import level2Music from '../../assets/music/level2.mp3';

import sky from '../../assets/images/background/sky.png';
import clouds0 from '../../assets/images/background/clouds_0.png';
import bg0 from '../../assets/images/background/bg_0.png';
import bg1 from '../../assets/images/background/bg_1.png';
import bg2 from '../../assets/images/background/bg_2.png';

// world environment
import platformLong from '../../assets/sprites/environment/platform-long.png';

import LoadingBar from '../utils/loadingBar';
import { soundLoader } from '../utils/soundLoader';

export default class Preload extends Phaser.Scene {
  constructor() {
    super('Preload');
  }

  preload() {
    this.showBootBg();
    this.loadingBar = new LoadingBar(this);
    this.load.image('githubIcon', githubIcon);
    this.load.image('obbImg', obbImg);
    this.load.image('ibbImg', ibbImg);
    this.load.image('obbBg', obbBg);
    this.load.image('ibbBg', ibbBg);
    this.load.image('obbKeys', obbKeys);
    this.load.image('ibbKeys', ibbKeys);
    this.load.image('bubble', bubble);
    this.load.image('crystal', crystal);
    this.load.image('hedgehog-head', hedgehogHead);
    this.load.image('hedgehog-halfbutt', hedgehogHalfButt);
    this.load.image('hedgehog-jumper', hedgehogJumper);
    this.load.image('hedgehog-fullbutt', hedgehogFullButt);

    // Loading parallax's images
    this.load.image('sky', sky);
    this.load.image('clouds_0', clouds0);
    this.load.image('bg_0', bg0);
    this.load.image('bg_1', bg1);
    this.load.image('bg_2', bg2);

    // Loading world environment sprites
    this.load.image('platform-long', platformLong);

    // Loading music
    this.load.audio('menu_music', menuMusic);
    this.load.audio('level1_music', level1Music);
    this.load.audio('level2_music', level2Music);

    this.load.spritesheet('ibb-move', ibbSpriteMove, {
      frameWidth: 47,
      frameHeight: 52,
    });

    this.load.spritesheet('obb-move', obbSpriteMove, {
      frameWidth: 47,
      frameHeight: 62,
    });

    // Loading Sounds
    soundLoader(this);
  }

  create() {
    this.scene.start('MainMenu');
    // this.scene.start('Level1');
  }

  showBootBg() {
    const ratio = this.game.config.width / 1920;
    this.add.sprite(0, 0, 'bootBg').setScale(ratio).setOrigin(0, 0);
  }
}
