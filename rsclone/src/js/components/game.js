import Phaser from 'phaser';

import Client from '../engine/client';
import MainMenu from '../scenes/mainMenu';

export default class Game extends Phaser.Game {
  constructor(app, config) {
    super(config);
    this.client = new Client();
    this.client.socket.open();

    this.music = {
      current: undefined,
      cache: {},
    };

    this.sounds = {
      volume: {},
      cache: {},
      walk: {
        ibb: {},
        obb: {},
      },
    };

    this.app = app; // link to main class
    this.level = this.app.settings.level;
  }

  spawnPopup(scene, event, data) {
    this.currentScene = scene;
    this.currentScene.input.keyboard.disableGlobalCapture();
    scene.scene.pause();
    const template = {};
    const { position, id, score, time } = data;
    const date = new Date(time);
    const humanTime = `<strong>${date.getUTCMinutes()}</strong> minute(s) and <strong>${date.getUTCSeconds()}</strong> second(s)`;
    template.caption = 'Congratulations!';
    template.content = `<p>You finished the game within ${humanTime} and got <strong>${score}</strong> points. Your rating is <strong>${position}</strong>!</p>`;
    template.cancel = `main.game.closePopup(${id})`;
    switch (event) {
      case ('newRecord'): {
        const pattern = '^[A-Za-z]\\w{2,15}';
        template.content += `<span>Please, enter your name to save it on the scoreboard: <input name="name" id="name" type="text" placeholder="Name" pattern="${pattern}" title="3 to 15 letters/numbers, starts from letter" required/></span>`;
        template.confirm = `main.game.confirmName(${id})`;
        break;
      }

      case ('noRecord'):
      default:
    }
    this.showPopup(id, template);
  }

  confirmName(id) {
    console.log(id);
  }

  showPopup(id, template) {
    this.popupShown = true;
    const popup = document.getElementById('popup');
    const popupCaption = document.getElementById('popup-caption');
    const popupContent = document.getElementById('popup-content');
    const popupConfirm = document.getElementById('popup-confirm');
    const popupCancel = document.getElementById('popup-cancel');
    const {
      caption,
      content,
      confirm,
      cancel,
    } = template;
    popupCaption.innerHTML = caption;
    popupContent.innerHTML = content;
    popupConfirm.innerHTML = 'Confirm';
    popupCancel.innerHTML = 'Cancel';
    popupConfirm.setAttribute('onclick', confirm);
    popupCancel.setAttribute('onclick', cancel);
    popup.classList.remove('hidden');
    popup.removeAttribute('hidden');
  }

  closePopup(id) {
    const popup = document.getElementById('popup');
    popup.classList.add('hidden');
    popup.setAttribute('hidden', true);
    this.popupShown = false;
    this.currentScene.input.keyboard.enableGlobalCapture();
    this.currentScene.scene.stop();
    this.currentScene.scene.run('MainMenu');
  }

  confirm(id) {
    this.closePopup(id);
  }
}
