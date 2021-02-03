import Phaser from 'phaser';
import ibbSprite from '../../assets/sprites/ibb/ibb.png';
import obbSprite from '../../assets/sprites/obb/obb.png';
import githubIcon from '../../assets/images/github-logo-face.svg';
import ibbImg from '../../assets/images/ibb_stay.svg';
import obbImg from '../../assets/images/obb_stay.svg';
import ibbBg from '../../assets/images/ibb_bg.png';
import obbBg from '../../assets/images/obb_bg.png';
import ibbKeys from '../../assets/images/ibbKeys.svg';
import obbKeys from '../../assets/images/obbKeys.svg';
import bubble from '../../assets/sprites/environment/bubble.png';
import crystal from '../../assets/sprites/environment/crystal.png';
import spikes from '../../assets/sprites/environment/spikes.svg';
import hedgehogHead from '../../assets/sprites/enemies/hedgehogs/hedgehog_head.svg';
import hedgehogJumper from '../../assets/sprites/enemies/hedgehogs/hedgehog_jumper.svg';
import hedgehogHalfButt from '../../assets/sprites/enemies/hedgehogs/hedgehog_halfButt.svg';
import hedgehogFullButt from '../../assets/sprites/enemies/hedgehogs/hedgehog_fullButt.svg';
import menuMusic from '../../assets/music/main_menu.mp3';
import level1Music from '../../assets/music/level1.mp3';
import level2Music from '../../assets/music/level2.mp3';

import skyLvl1 from '../../assets/sprites/environment/level1_bg/sky.png';
import cloudsLvl1 from '../../assets/sprites/environment/level1_bg/clouds_0.png';
import bg0Lvl1 from '../../assets/sprites/environment/level1_bg/bg_0.png';
import bg1Lvl1 from '../../assets/sprites/environment/level1_bg/bg_1.png';
import bg2Lvl1 from '../../assets/sprites/environment/level1_bg/bg_2.png';

import skyLvl2 from '../../assets/sprites/environment/level2_bg/lvl2_sky.png';
import cloudsLvl2 from '../../assets/sprites/environment/level2_bg/lvl2_clouds.png';
import bg0Lvl2 from '../../assets/sprites/environment/level2_bg/lvl2_bg_0.png';
import bg1Lvl2 from '../../assets/sprites/environment/level2_bg/lvl2_bg_1.png';
import bg2Lvl2 from '../../assets/sprites/environment/level2_bg/lvl2_bg_2.png';

// world interactive environment
import platformLong from '../../assets/sprites/environment/platform-long.png';
import platformPurple from '../../assets/sprites/environment/platform-purple.png';
import platformGreen from '../../assets/sprites/environment/platform-green.png';

// world static environment
import boabab01 from '../../assets/sprites/environment/trees/boabab01.png';
import boabab02 from '../../assets/sprites/environment/trees/boabab02.png';
import boabab03 from '../../assets/sprites/environment/trees/boabab03.png';
import boabab04 from '../../assets/sprites/environment/trees/boabab04.png';
import boabab05 from '../../assets/sprites/environment/trees/boabab05.png';
import boabab06 from '../../assets/sprites/environment/trees/boabab06.png';

import palm01 from '../../assets/sprites/environment/trees/palm01.png';
import palm02 from '../../assets/sprites/environment/trees/palm02.png';
import palm03 from '../../assets/sprites/environment/trees/palm03.png';
import palm04 from '../../assets/sprites/environment/trees/palm04.png';
import palm05 from '../../assets/sprites/environment/trees/palm05.png';
import palm06 from '../../assets/sprites/environment/trees/palm06.png';

import pointer from '../../assets/sprites/environment/pointer.png';

import curved01 from '../../assets/sprites/environment/trees/curved01.png';
import curved02 from '../../assets/sprites/environment/trees/curved02.png';
import curved03 from '../../assets/sprites/environment/trees/curved03.png';

import grassSet01 from '../../assets/sprites/environment/onFloor/grass_set01.png';
import grassSet02 from '../../assets/sprites/environment/onFloor/grass_set02.png';
import rocksSet01 from '../../assets/sprites/environment/onFloor/rocks_set01.png';
import rocksSet02 from '../../assets/sprites/environment/onFloor/rocks_set02.png';
import grassUnderWorldSet01 from '../../assets/sprites/environment/onFloor/grass_underWorld_set01.png';
import grassUnderWorldSet02 from '../../assets/sprites/environment/onFloor/grass_underWorld_set02.png';
import grassUnderWorldSet03 from '../../assets/sprites/environment/onFloor/grass_underWorld_set03.png';
import grassUnderWorldSet04 from '../../assets/sprites/environment/onFloor/grass_underWorld_set04.png';
import flowersSet01 from '../../assets/sprites/environment/onFloor/flowers_set01.png';

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
    this.load.image('spikes', spikes);
    this.load.image('hedgehog-head', hedgehogHead);
    this.load.image('hedgehog-halfbutt', hedgehogHalfButt);
    this.load.image('hedgehog-jumper', hedgehogJumper);
    this.load.image('hedgehog-fullbutt', hedgehogFullButt);

    // Loading LEVEL 1 parallax's images
    this.load.image('lvl1_sky', skyLvl1);
    this.load.image('lvl1_clouds', cloudsLvl1);
    this.load.image('lvl1_bg0', bg0Lvl1);
    this.load.image('lvl1_bg1', bg1Lvl1);
    this.load.image('lvl1_bg2', bg2Lvl1);

    // Loading LEVEL 2 parallax's images
    this.load.image('lvl2_sky', skyLvl2);
    this.load.image('lvl2_clouds', cloudsLvl2);
    this.load.image('lvl2_bg0', bg0Lvl2);
    this.load.image('lvl2_bg1', bg1Lvl2);
    this.load.image('lvl2_bg2', bg2Lvl2);

    // Loading world interactive environment sprites
    this.load.image('platform-long', platformLong);
    this.load.image('platform-purple', platformPurple);
    this.load.image('platform-green', platformGreen);

    // Loading world static environment sprites
    this.load.image('boabab01', boabab01);
    this.load.image('boabab02', boabab02);
    this.load.image('boabab03', boabab03);
    this.load.image('boabab04', boabab04);
    this.load.image('boabab05', boabab05);
    this.load.image('boabab06', boabab06);

    this.load.image('palm01', palm01);
    this.load.image('palm02', palm02);
    this.load.image('palm03', palm03);
    this.load.image('palm04', palm04);
    this.load.image('palm05', palm05);
    this.load.image('palm06', palm06);

    this.load.image('pointer', pointer);

    this.load.image('curved01', curved01);
    this.load.image('curved02', curved02);
    this.load.image('curved03', curved03);

    this.load.image('grassSet01', grassSet01);
    this.load.image('grassSet02', grassSet02);
    this.load.image('rocksSet01', rocksSet01);
    this.load.image('rocksSet02', rocksSet02);
    this.load.image('grassUnderWorldSet01', grassUnderWorldSet01);
    this.load.image('grassUnderWorldSet02', grassUnderWorldSet02);
    this.load.image('grassUnderWorldSet03', grassUnderWorldSet03);
    this.load.image('grassUnderWorldSet04', grassUnderWorldSet04);
    this.load.image('flowersSet01', flowersSet01);

    // Loading music
    this.load.audio('menu_music', menuMusic);
    this.load.audio('level1_music', level1Music);
    this.load.audio('level2_music', level2Music);

    this.load.spritesheet('ibb-sprite', ibbSprite, {
      frameWidth: 47,
      frameHeight: 52,
    });

    this.load.spritesheet('obb-sprite', obbSprite, {
      frameWidth: 47,
      frameHeight: 62,
    });

    // Loading Sounds
    soundLoader(this);
  }

  create() {
    this.scene.start('MainMenu');
  }

  showBootBg() {
    const ratio = this.game.config.width / 1920;
    this.add.sprite(0, 0, 'bootBg').setScale(ratio).setOrigin(0, 0);
  }
}
