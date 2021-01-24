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
import Level2 from './level2';
import LevelSwitch from './levelSwitch';
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
  Level2,
  LevelSwitch,
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
  LevelSwitch,
  GameOver,
  Level1,
  Level2,
};

export default SCENES;
