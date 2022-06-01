var TD = TD || {};

TD.GAME_STATE = {
    HOME: 0,
    PLAYING: 1,
    OVER: 2
}

TD.UNIT_TAG = {
    MONSTER: 0,
    OBSTACLE: 1,
    HOUSE: 2
}

TD.CONTAINER = {
    MONSTERS: [],
    OBSTACLES: [],
    MAP_BACKGROUNDS: []
}

TD.PRESET_AMOUNT = {
    MONSTER: 10,
    OBSTACLES: 5
}

TD.ENERGY = 10;

TD.ZORDER = {
    MONSTER: 1000,
    OBSTACLE: 1000,
    MAP_BACKGROUND: -1000
}

TD.SOUND = false;

TD.SPAWN_RATE = 2;

TD.ACTIVE_MONSTERS = 0;

TD.WIDTH = 1136;

TD.HEIGHT = 640;

TD.MIN_OBSTACLES = 5;
TD.MAX_OBSTACLES = 7;