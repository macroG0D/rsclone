import Boot from './boot';
import Preload from './preload';
import MainMenu from './mainMenu';
import MainMenuPlay from './MainMenu/play';
import MainMenuLocalGame from './MainMenu/localGame';
import MainMenuOnlineGame from './MainMenu/onlineGame';
import MainMenuOnlineGameHost from './MainMenu/onlineGameHost';
import MainMenuOnlineGameJoin from './MainMenu/onlineGameJoin';
import MainMenuLeaderBoard from './MainMenu/leaderBoard';
import MainMenuSettings from './MainMenu/settings';
import MainMenuDevelopers from './MainMenu/developers';
import Level1 from './level1';
import GameMenu from './MainMenu/gameMenu';
import GameOver from './MainMenu/gameOver';

export const SCENES = {
  Boot,
  Preload,
  MainMenu,
  MainMenuPlay,
  MainMenuLocalGame,
  MainMenuOnlineGame,
  MainMenuOnlineGameHost,
  MainMenuOnlineGameJoin,
  MainMenuLeaderBoard,
  MainMenuSettings,
  MainMenuDevelopers,
  Level1,
  GameMenu,
  GameOver,
};

export const LOADING_SCENES = [
  Boot,
  Preload,
  MainMenu,
];

export const MENU_SCENES = {
  MainMenu,
  MainMenuPlay,
  MainMenuLocalGame,
  MainMenuOnlineGame,
  MainMenuOnlineGameHost,
  MainMenuOnlineGameJoin,
  MainMenuLeaderBoard,
  MainMenuSettings,
  MainMenuDevelopers,
};

export const GAME_SCENES = {
  GameMenu,
  MainMenuSettings,
  GameOver,
  Level1,
};

export default SCENES;
