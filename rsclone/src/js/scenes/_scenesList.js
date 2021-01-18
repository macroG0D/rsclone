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
import Score from './score';
import Level1 from './level1';
import GameMenu from './MainMenu/gameMenu';
import GameOver from './MainMenu/gameOver';

export const SCENE_LIST = [
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
  Score,
  GameOver,
];

export default SCENE_LIST;
