import Phaser from 'phaser';

import Client from '../engine/client';
import Music from '../engine/music';

import { playSound } from '../utils/playSound';

import addConfetti from './confetti';

export default class Game extends Phaser.Game {
  constructor(app, config) {
    super(config);
    this.client = new Client();
    this.client.socket.open();

    this.music = new Music(this);

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
    this.addConfetti = addConfetti;
  }

  pause() {
    this.music.pause();
    const scenes = this.scene.getScenes();
    scenes.forEach((scene) => {
      const { key } = scene.scene;
      if (key && key === 'gameUI') scene.toggleGameMenu();
    });
  }

  continue() {
    this.music.play();
    const scenes = this.scene.getScenes();
    scenes.forEach((scene) => {
      const { key, isActive } = scene.scene;
      if (key && isActive) scene.scene.restart();
    });
  }

  spawnPopup(scene, event, data) {
    scene.input.keyboard.disableGlobalCapture();
    playSound(scene, 'win');
    scene.scene.pause();
    if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen();
    this.currentScene = scene;
    const {
      position,
      id,
      score,
      time,
    } = data;
    const newRecord = (event === 'newRecord');
    const date = new Date(time);
    const { locale } = this.app.settings;
    const template = {};

    if (locale === 'en') {
      const humanTime = `${date.getUTCMinutes()} minutes and ${date.getUTCSeconds()} seconds`;
      template.caption = 'congratulations';
      template.content = `<p>you finished the game within <span class="popup-time">${humanTime}</span> and earned <span class="popup-points">${score} points</span>. your <span class="popup-position" id="popup-position">rating position is #${position}</span>.`;
      template.textNoRecord = ' but it is not enough to get <strong>top 100</strong> position in the leaderboard</p>';
      template.textOnRecord = `</p><div class="popup-onrecord">
        <hr>
        <span>if you want to save your result on the leaderboard, please</span>
        <input class="popup-name" id="popup-name" type="text" placeholder="input your name" pattern="^[A-Za-z]\\w{2,15}" title="from 3 to 15 letters/numbers, starts from letter" required />
      `;
    } else {
      const humanTime = `${date.getUTCMinutes()} минут и ${date.getUTCSeconds()} секунд`;
      template.caption = 'поздравляем';
      template.content = `<p>вы закончили игру за <span class="popup-time">${humanTime}</span> и заработали <span class="popup-points">${score} очков</span>. вы на <span class="popup-position" id="popup-position">#${position} месте</span>.`;
      template.textNoRecord = ' но, этого не достаточно для того, чтобы попасть в <strong>100 лучших</strong> позиций в нашей таблице рекордов</p>';
      template.textOnRecord = `</p><div class="popup-onrecord">
        <hr>
        <span>если вы хотите сохранить свой реузльтат в таблице рекордов, пожалуйста</span>
        <input class="popup-name" id="popup-name" type="text" placeholder="введите ваше имя" pattern="^[A-Za-z]\\w{2,15}" title="от 3 до 15 букв/цифр, начинается с буквы" required />
      `;
    }
    template.content += (newRecord) ? template.textOnRecord : template.textNoRecord;
    template.confirm = (newRecord) ? `main.game.confirmName("${id}")` : 'main.game.closePopup()';
    template.cancel = 'main.game.closePopup()';
    this.showPopup(template, newRecord);
  }

  confirmName(id) {
    const nameInput = document.getElementById('popup-name');
    if (!nameInput.checkValidity()) return;
    const name = nameInput.value;
    const data = {
      id,
      name,
    };
    this.client.sendData('updateName', data);
    setTimeout(() => {
      const popup = document.getElementById('popup');
      popup.classList.add('hidden');
      popup.setAttribute('hidden', true);
      this.popupShown = false;
      this.currentScene.input.keyboard.enableGlobalCapture();
      this.currentScene.scene.stop();
      this.currentScene.scene.start('MainMenuLeaderBoard', { id });
    }, 2500);
  }

  showPopup(template, newRecord = false) {
    this.popupShown = true;
    const { locale } = this.app.settings;
    const isEN = (locale === 'en');
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
    popupConfirm.innerHTML = (isEN) ? 'Confirm' : 'Подтвердить';
    popupCancel.innerHTML = (isEN) ? 'Cancel' : 'Отмена';
    popupConfirm.setAttribute('onclick', confirm);
    popupCancel.setAttribute('onclick', cancel);
    if (newRecord) {
      popupCancel.classList.remove('hidden');
    } else {
      popupCancel.classList.add('hidden');
    }
    popup.classList.remove('hidden');
    popup.removeAttribute('hidden');
    this.addConfetti();
  }

  closePopup() {
    const popup = document.getElementById('popup');
    popup.classList.add('hidden');
    popup.setAttribute('hidden', true);
    this.popupShown = false;
    this.currentScene.input.keyboard.enableGlobalCapture();
    this.currentScene.scene.stop();
    this.currentScene.scene.run('MainMenu');
  }
}
