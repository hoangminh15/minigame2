var g_sharedGameLayer;

var GameLayer = cc.Layer.extend({

    state: null,
    mapBackgroundBatch: null,
    mapForestObstacleBatch: null,
    mapCellBatch: null,
    monsterBatRunBatch: null,
    monsterDarkGiantRunBatch: null,
    monsterGiantRunBatch: null,

    mapBackground: null,
    mapHouse: null,
    mapHouseGatePlayer: null,
    obstacles: [],
    waypoints: [],

    ctor: function () {
        this._super();
        this.init();
    },

    init: function () {

        var winSize = cc.winSize;
        g_sharedGameLayer = this;

        // Reset global values
        TD.CONTAINER.MONSTER = [];
        TD.CONTAINER.OBSTACLES = [];
        TD.ACTIVE_MONSTERS = 0;

        this.state = TD.GAME_STATE.PLAYING;

        // Add Sprite frames to SpriteFrameCache
        cc.spriteFrameCache.addSpriteFrames(resource.mapBackground_plist);
        cc.spriteFrameCache.addSpriteFrames(resource.mapCell_plist);
        cc.spriteFrameCache.addSpriteFrames(resource.mapForestObstacle_plist);
        cc.spriteFrameCache.addSpriteFrames(resource.monsterBatRun_plist);
        cc.spriteFrameCache.addSpriteFrames(resource.monsterDarkGiantRun_plist);
        cc.spriteFrameCache.addSpriteFrames(resource.monsterGiantRun_plist);


        //Make use of SpriteNodeBatch to optimize performance
        // this.mapBackgroundBatch = new cc.SpriteBatchNode(res.mapBackground_png);
        var mapCell = cc.textureCache.addImage(resource.mapCell_png);
        this.mapCellBatch = new cc.SpriteBatchNode(mapCell);
        this.addChild(this.mapCellBatch);
        var mapForestObstacle = cc.textureCache.addImage(resource.mapForestObstacle_png);
        this.mapForestObstacleBatch = new cc.SpriteBatchNode(mapForestObstacle);
        this.addChild(this.mapForestObstacleBatch);
        // this.monsterBatRunBatch = new cc.SpriteBatchNode(res.monsterBatRun_png);
        // this.monsterDarkGiantRunBatch = new cc.SpriteBatchNode(res.monsterDarkGiantRun_plist);
        // this.monsterGiantRunBatch = new cc.SpriteBatchNode(res.monsterGiantRun_png);

        // Preset
        // Monster.preset();
        Obstacle.preset();
        MapBackground.preset();

        // Init cells

        // Init map background
        var randomMapTypeIndex = Math.floor(Math.random() * MapType.length);
        this.mapBackground = MapBackground.getOrCreate(MapType[randomMapTypeIndex]);
        this.mapBackground.attr({
            x: winSize.width / 2,
            y: winSize.height / 2,
            // scaleX: winSize.width / this.mapBackground.width,
            scaleX: winSize.width / this.mapBackground.width,

            scaleY: winSize.height / this.mapBackground.height
        });

        this.mapHouse = new cc.Sprite(resource.mapHouse_png);
        this.mapHouse.attr({
            x: TD.CELL_SIZE/2 + (TD.CELLS_PER_EDGE - 1) * TD.CELL_SIZE,
            y: TD.CELL_SIZE/2 + (TD.CELLS_PER_EDGE - 1) * TD.CELL_SIZE
        });
        this.addChild(this.mapHouse, TD.ZORDER.MAP_BACKGROUND, TD.UNIT_TAG.BACKGROUND);

        this.mapHouseGatePlayer = new cc.Sprite(resource.mapMonsterGatePlayer_png);
        this.mapHouseGatePlayer.attr({
            x: TD.CELL_SIZE/2,
            y: TD.CELL_SIZE/2
        })
        this.addChild(this.mapHouseGatePlayer, TD.ZORDER.CELL + 1, TD.UNIT_TAG.BACKGROUND)

        // Draw a grid on background to position obstacles
        var draw = new cc.DrawNode();
        this.mainSquareOriginX = winSize.width / 2 - winSize.height / 2
        this.mainSquareDestinationX = winSize.width / 2 + winSize.height / 2;

        var mainSquareOrigin = cc.p(this.mainSquareOriginX, 0);
        var mainSquareDestination = cc.p(this.mainSquareDestinationX, winSize.height);

        draw.drawRect(mainSquareOrigin, mainSquareDestination, null, 2, cc.color("#000"));
        for (var i = 0; i < TD.CELLS_PER_EDGE; i++) {
            for (var j = 0; j < TD.CELLS_PER_EDGE; j++) {
                var origin = cc.p(this.mainSquareOriginX + i * TD.CELL_SIZE, j * TD.CELL_SIZE);
                var destination = cc.p(this.mainSquareOriginX + (i + 1) * TD.CELL_SIZE, (j + 1) * TD.CELL_SIZE);
                var fillColor = null;
                var lineWidth = 1;
                var lineColor = cc.color("#000");
                draw.drawRect(origin, destination, fillColor, lineWidth, lineColor);
            }
        }
        this.addChild(draw, TD.ZORDER.MAP_BACKGROUND, TD.UNIT_TAG.BACKGROUND);

        // Find path based on obstacles placement
        var waypointsPath = -1;
        while (waypointsPath === -1) {
            this.initObstacles();
            waypointsPath = new PathFindingHelper(this.obstacles).findPath();
        }
        this.waypoints = waypointsPath;

        for (var i = 0; i < TD.CELLS_PER_EDGE; i++) {
            for (var j = 0; j < TD.CELLS_PER_EDGE; j++) {
                var isWaypoint = false;
                for (var k = 0; k < this.waypoints.length; k++) {
                    var waypoint = this.waypoints[k];
                    var waypointRIndex = waypoint[0];
                    var waypointCIndex = waypoint[1];
                    if (i === waypointRIndex && j === waypointCIndex) {
                        isWaypoint = true;
                        break;
                    }
                }
                if (isWaypoint === false) {
                    var randomCellTypeIndex = Math.floor(Math.random() * CellType.length);
                    var cell = Cell.getOrCreate(CellType[randomCellTypeIndex]);
                    var cellPosition = cc.p(j * TD.CELL_SIZE, i * TD.CELL_SIZE);
                    cell.setPosition(cellPosition);
                    cell.setAnchorPoint(cc.p(0, 0));
                }
            }
        }

        // Init map house

        // Sound settings here

        // Add listener or logic functions.

        // Schedule update here
        this.scheduleUpdate();
        this.schedule(this.spawnMonsters, 2);

        return true;
    },

    update: function (dt) {
        if (this.state === TD.GAME_STATE.PLAYING) {
            // Run update functions

        }
    },
    spawnMonsters: function () {
        var randomMonsterIndex = Math.floor(Math.random() * MonsterType.length);
        var monster = Monster.getOrCreate(MonsterType[randomMonsterIndex], this.waypoints);
        monster.setPosition(cc.p(TD.CELL_SIZE / 2, TD.CELL_SIZE / 2 - 15));
    },
    initObstacles: function () {
        this.obstacles = [];
        var numOfObstacles = Math.floor(TD.MIN_OBSTACLES + Math.random() * (TD.MAX_OBSTACLES - TD.MIN_OBSTACLES));
        for (var i = 0; i < numOfObstacles; i++) {
            var obstacle = Obstacle.getOrCreate(ObstacleType[Math.floor(Math.random() * ObstacleType.length)])
            if (obstacle.active === false) {
                this.obstacles.push(obstacle);
                this.mapForestObstacleBatch.addChild(obstacle, TD.ZORDER.OBSTACLE, TD.UNIT_TAG.OBSTACLE);
                obstacle.active = true;
                obstacle.visible = true;
            }

            // Check obstacles overlap
            var obstacleRIndex, obstacleCIndex;
            while (true) {
                var isInvalid = false;
                obstacleRIndex = Math.floor(Math.random() * TD.CELLS_PER_EDGE)
                obstacleCIndex = Math.floor(Math.random() * TD.CELLS_PER_EDGE);

                if ((obstacleRIndex === 0 && obstacleCIndex === 0) || (obstacleCIndex === TD.CELLS_PER_EDGE - 1 && obstacleRIndex === TD.CELLS_PER_EDGE - 1)) {
                    continue;
                }

                for (var j = 0; j < this.obstacles.length; j++) {
                    var addedObstacle = this.obstacles[j];

                    if (obstacleRIndex === addedObstacle[0]) {
                        if (obstacleCIndex === addedObstacle[1] + 1 ||
                            obstacleCIndex === addedObstacle[1] - 1 ||
                            obstacleCIndex === addedObstacle[1]) {
                            isInvalid = true;
                            break;
                        }
                    }
                    if (obstacleCIndex === addedObstacle[1]) {
                        if (obstacleRIndex === addedObstacle[0] + 1 ||
                            obstacleRIndex === addedObstacle[0] - 1 ||
                            obstacleRIndex === addedObstacle[0]) {
                            isInvalid = true;
                        }
                    }

                }
                if (isInvalid === false) {
                    break;
                }
            }

            this.obstacles.push([obstacleRIndex, obstacleCIndex]);
            // Check Validity: Obstacle can't be adjacent with any others.
            // Check Validity: Obstacle can be on the same diagonal, but shouldn't block the path.
            // i.e: there's no 2 obstacles adjacent to (0, 0) cell and (6, 6) cell

            var obstacleY = obstacleRIndex * TD.CELL_SIZE;
            var obstacleX = this.mainSquareOriginX + obstacleCIndex * (TD.CELL_SIZE);

            obstacle.setPosition(cc.p(obstacleX, obstacleY));
            obstacle.attr({
                x: obstacleX + 10,
                y: obstacleY + 10,
                anchorX: 0,
                anchorY: 0,
                // scaleX: TD.CELL_SIZE / obstacle.width,
                // scaleY: TD.CELL_SIZE / obstacle.height
            })
        }
    },
    collide: function (a, b) {
        var ax = a.x, ay = a.y, bx = b.x, by = b.y;
        if (Math.abs(ax - bx) > TD.MAX_CONSTANT_WIDTH || Math.abs(ay - by) > TD.MAX_CONSTANT_HEIGHT) {
            return false;
        }

        var aRect = a.collideRect(ax, ay);
        var bRect = b.collideRect(bx, by);
        return cc.rectIntersectsRect(aRect, bRect);
    }
});

