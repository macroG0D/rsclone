import { LOCALE } from '../locale';

export function localization(currScene) {
  const scene = currScene;
  const appLocale = scene.game.app.settings.locale;
  const sceneLocale = scene.locale;
  if (appLocale !== sceneLocale) {
    scene.locale = appLocale;
    const locale = LOCALE[appLocale];
    const { menu, range, board } = scene;

    if (menu) {
      menu.items.forEach((menuItem) => {
        const item = menuItem;
        const localeValue = locale[item.name] || item.name;
        const currValue = item.node.innerHTML;
        if (localeValue && localeValue !== currValue) item.node.innerHTML = localeValue;
      });
    }

    if (range) {
      Object.values(range.items).forEach((rangeItem) => {
        const item = rangeItem;
        if (item.left && item.left.name) {
          const localeValue = locale[item.left.name] || item.left.name;
          const currValue = item.left.node.innerHTML;
          if (localeValue && localeValue !== currValue) item.left.node.innerHTML = localeValue;
        }
        if (item.right && item.right.name) {
          const localeValue = locale[item.right.name] || item.right.name;
          const currValue = item.right.node.innerHTML;
          if (localeValue && localeValue !== currValue) item.right.node.innerHTML = localeValue;
        }
      });
    }

    if (board) {
      Object.values(board.caption).forEach((captionItem) => {
        const item = captionItem;
        if (item.name) {
          const localeValue = locale[item.name] || item.name;
          const currValue = item.node.innerHTML;
          if (localeValue && localeValue !== currValue) item.node.innerHTML = localeValue;
        }
      });
    }
  }
}

export default localization;
