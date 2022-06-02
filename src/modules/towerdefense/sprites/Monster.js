//Where is the monsters moved?
var Monster = cc.Sprite.extend({
    active: true,
    type: null,
    monsterName: null,
    speed: null,
    HP: null,
    weight: null,
    moveDirection: null,
    currentMoveDirectionIndex: 0,
    nextMoveDirection: null,
    currentAnimation: null,

    ctor: function (arg) {
        this._super("#" + arg.textureName);
        this.monsterName = arg.monsterName;
        this.type = arg.type;
        this.speed = arg.speed;
        this.HP = arg.HP;
        this.weight = arg.weight;

        this.initAnimation(arg);

        //Testing move direction down
        this.moveDirection = "Down";
        this.nextMoveDirection = "Down";
        if (this.moveDirection === "Down") {
            var animation = cc.AnimationCache.getInstance().getAnimation("animation" + this.monsterName + "Down");
            var animate = cc.animate(animation);
            this.currentAnimation = animate.repeatForever();
            this.runAction(this.currentAnimation);
        }

        //Schedule animation update every 2 seconds.
        this.schedule(this.updateNextMoveDirection, 2);
        this.scheduleUpdate();
    },
    updateNextMoveDirection: function() {
        this.currentMoveDirectionIndex = this.currentMoveDirectionIndex + 1;
        var newDirectionIndex = (this.currentMoveDirectionIndex) % TD.NUM_OF_MOVE_DIRECTIONS;
        this.nextMoveDirection = TD.MOVE_DIRECTION[newDirectionIndex];
        cc.log(this.nextMoveDirection);
    },
    update: function (dt) {
        // Update animation based on move direction
        if (this.nextMoveDirection !== this.moveDirection) {
            this.stopAction(this.currentAnimation);
            var animationName = "animation" + this.monsterName +  this.nextMoveDirection;
            var animation = cc.AnimationCache.getInstance().getAnimation(animationName);
            var animate = cc.animate(animation);
            this.currentAnimation = animate.repeatForever();
            this.runAction(this.currentAnimation);
            this.moveDirection = this.nextMoveDirection;
        }
    },
    destroy: function () {
        this.visible = false;
        this.active = false;
        this.stopAllActions();
        this.unscheduleUpdate();
        TD.ACTIVE_MONSTERS--;
    },
    //some action. e.g: Follow specified path.

    collideRect: function (x, y) {
        var w = this.width;
        var h = this.height;
        return cc.rect(x - w / 2, y - h / 2, w, h);
    },
    initAnimation: function (arg) {
        cc.log("Enter init animation function");
        var framesPerDirection, frameNamePrefix, monsterName;
        if (arg.type === 0) {
            framesPerDirection = TD.FRAMES_PER_DIRECTION.BAT;
            frameNamePrefix = "monster_bat_run_00";
        } else if (arg.type === 1) {
            framesPerDirection = TD.FRAMES_PER_DIRECTION.DARK_GIANT;
            frameNamePrefix = "monster_dark_giant_run_00";
        } else if (arg.type === 2) {
            framesPerDirection = TD.FRAMES_PER_DIRECTION.GIANT;
            frameNamePrefix = "monster_giant_run_00";
        }
        cc.log("Frames per direction: " + framesPerDirection);
        cc.log("Prefix: " + frameNamePrefix);
        for (var i = 0; i < TD.NUM_OF_MOVE_DIRECTIONS; i++) {
            var animationFrames = [];
            for (var j = 0; j < framesPerDirection; j++) {
                var frameIndex = (i*framesPerDirection+j);
                if (frameIndex < 10) {
                    frameIndex = "0" + frameIndex;
                }
                var frameName = frameNamePrefix + frameIndex + ".png";
                cc.log(frameName);
                var frame = cc.spriteFrameCache.getSpriteFrame(frameName);
                animationFrames.push(frame);
            }
            var animation = new cc.Animation(animationFrames, 0.05);
            var animationName = "animation" + this.monsterName + TD.MOVE_DIRECTION[i];
            cc.AnimationCache.getInstance().addAnimation(animation, animationName);
        }
    }
});

Monster.create = function (arg) {
    var monster = new Monster(arg);
    g_sharedGameLayer.addChild(monster, TD.ZORDER.MONSTER, TD.UNIT_TAG.MONSTER);
    TD.CONTAINER.MONSTER.push(monster);
    return monster;
};

Monster.getOrCreate = function (arg) {
    var selMonster = null;
    for (var j = 0; j < TD.CONTAINER.MONSTERS.length; j++) {
        selMonster = TD.CONTAINER.MONSTERS[j];

        if (selMonster.active === false && selMonster.type === arg.type) {
            selMonster.speed = arg.speed;
            selMonster.HP = arg.HP;
            selMonster.weight = arg.weight;

            // Schedule action

            selMonster.visible = true;
            TD.ACTIVE_MONSTERS++;
            return selMonster;
        }
    }
    selMonster = Monster.create(arg);
    TD.ACTIVE_MONSTERS++;
    return selMonster;
};

Monster.preset = function () {
    var monster = null;
    for (var i = 0; i < TD.PRESET_AMOUNT.MONSTER; i++) {
        for (var j = 0; j < MonsterType.length; j++) {
            monster = Monster.create(MonsterType[j]);
            monster.visible = false;
            monster.active = false;
            monster.stopAllActions();
            // monster.unscheduleAllCallbacks();
        }
    }
}