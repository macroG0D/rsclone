import Phaser from 'phaser';

import Client from '../utils/client';

import { MENU_SCENES, GAME_SCENES, SCENES } from '../scenes/_scenesList';

export default class Game extends Phaser.Game {
  constructor(app, config) {
    super(config);
    this.client = new Client();
    this.scenes = SCENES;

    this.music = {
      current: undefined,
      cache: {},
    };

    this.sounds = {
      volume: {},
      cache: {},
      walk: { ibb: {}, obb: {} },
    };

    this.app = app; // link to main class

    this.levelsSequence = ['Level1', 'Level2'];
  }

  sceneExists(key) {
    const existsScenes = Object.keys(this.scene.keys);
    return existsScenes.includes(key);
  }

  cleanScenes() {
    Object.keys(this.scene.keys).forEach((sceneKey) => {
      this.scene.remove(sceneKey);
    });
  }

  loadSceneSet(sceneSet) {
    Object.keys(sceneSet).forEach((sceneKey) => {
      if (!this.sceneExists(sceneKey)) {
        const sceneObj = sceneSet[sceneKey];
        this.scene.add(sceneKey, sceneObj);
      }
    });
  }

  runScene(key, gameData) {
    this.cleanScenes();
    const newScene = this.scenes[key];
    this.scene.add(key, newScene);
    this.scene.start(key, gameData);
  }

  loadMenuScenes() {
    this.loadSceneSet(MENU_SCENES);
  }

  runLevel(number, gameData) {
    this.cleanScenes();
    this.loadSceneSet(GAME_SCENES);
    this.scene.start(`Level${number}`, gameData);
  }

  startNextLevel(scene, gameData) {
    const currLevelKey = scene.sys.settings.key;
    const nextLevel = this.pickNextLevel(currLevelKey);
    const betweenLevelsScene = this.scene.getScene('LevelSwitch');
    betweenLevelsScene.nextLevelIndex = nextLevel.index;
    scene.scene.switch(betweenLevelsScene, gameData);
  }

  pickNextLevel(currLevelKey) {
    const currLevelIndex = this.levelsSequence.indexOf(currLevelKey);
    const nextLevelIndex = currLevelIndex + 1;
    const nextLevelKey = this.levelsSequence[currLevelIndex + 1];
    return {
      key: nextLevelKey,
      index: nextLevelIndex,
    };
  }
}
