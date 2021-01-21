import { LOCALE } from '../locale';

export function localization(currScene) {
  const scene = currScene;
  const appLocale = scene.game.app.settings.locale;
  const sceneLocale = scene.locale;
  if (appLocale !== sceneLocale) {
    scene.locale = appLocale;
    const locale = LOCALE[appLocale];
    const { menu } = scene;
    const { key } = scene.scene;

    if (menu) {
      menu.items.forEach((menuItem) => {
        const item = menuItem;
        const localeValue = locale[item.name] || item.name;
        const currValue = item.node.innerHTML;
        if (localeValue && localeValue !== currValue) item.node.innerHTML = localeValue;
      });

      if (key && key !== 'MainMenuSettings') {
        const { centerX, centerY } = scene.cameras.main;
        scene.menu.spawn.setPosition(centerX, centerY);
        scene.menu.spawn.setOrigin(0.5);
      }
    }

    if (key && key === 'Score') {
      console.log('here!');
      if (scene.timeLabel) {
        const localeTime = locale.time || 'time';
        const currTime = scene.timeLabel.node.innerHTML;
        if (localeTime && localeTime !== currTime) scene.timeLabel.node.innerHTML = localeTime;
      }
      if (scene.scoreLabel) {
        const localeScore = locale.score || 'score';
        const currScore = scene.scoreLabel.node.innerHTML;
        if (localeScore && localeScore !== currScore) {
          scene.scoreLabel.node.innerHTML = localeScore;
        }
      }
    }
  }
}

export default localization;
