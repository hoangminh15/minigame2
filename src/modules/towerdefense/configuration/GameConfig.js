var TD = TD || {};

TD.GAME_STATE = {
    HOME: 0,
    PLAYING: 1,
    OVER: 2
}

TD.UNIT_TAG = {
    MONSTER: 0,
    OBSTACLE: 1,
    HOUSE: 2,
    BACKGROUND: 4,
    CELL: 5
}

TD.CONTAINER = {
    MONSTERS: [],
    OBSTACLES: [],
    MAP_BACKGROUNDS: [],
    CELLS: []
}

TD.PRESET_AMOUNT = {
    MONSTER: 10,
    OBSTACLES: 5
}

TD.ENERGY = 10;

TD.ZORDER = {
    MONSTER: 1000,
    OBSTACLE: 1000,
    MAP_BACKGROUND: -1000,
    CELL: -500
}

TD.DIRECTION = {

}

TD.SOUND = false;

TD.SPAWN_RATE = 2;

TD.ACTIVE_MONSTERS = 0;

TD.WIDTH = 1136;

TD.HEIGHT = 640;

TD.MIN_OBSTACLES = 5;
TD.MAX_OBSTACLES = 7;

TD.CELLS_PER_EDGE = 7;

TD.CELL_SIZE = TD.HEIGHT/TD.CELLS_PER_EDGE;

TD.MAX_CONSTANT_WIDTH = 40;
TD.MAX_CONSTANT_HEIGHT = 40;

TD.FRAMES_PER_DIRECTION = {
    BAT: 8,
    DARK_GIANT: 14,
    GIANT: 16
}

TD.MOVE_DIRECTION = ["Down", "DownRight", "Right", "UpRight", "Up"];

TD.NUM_OF_MOVE_DIRECTIONS = 5;