import Boot from './boot';
import Preload from './preload';
import MainMenu from './mainMenu';
import MainMenuPlay from './MainMenu/play';
import MainMenuLocalGame from './MainMenu/localGame';
import MainMenuOnlineGame from './MainMenu/onlineGame';
import MainMenuDevelopers from './MainMenu/developers';
import mainMenuSettings from './MainMenu/settings';
import MainMenuLeaderBoard from './MainMenu/leaderBoard';
import Level1 from './level1';
import StartScene from './start';

export const SCENE_LIST = [
  Boot,
  Preload,
  MainMenu,
  MainMenuPlay,
  MainMenuLocalGame,
  /*
  MainMenuOnlineGame,
  MainMenuDevelopers,
  mainMenuSettings,
  MainMenuLeaderBoard,
    */
  Level1,
];

export default SCENE_LIST;
