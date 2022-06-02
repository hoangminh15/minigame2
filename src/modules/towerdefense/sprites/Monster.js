//Where is the monsters moved?
var Monster = cc.Sprite.extend({
    active: true,
    type: null,
    speed: null,
    HP: null,
    weight: null,
    moveDirection: null,

    ctor: function (arg) {
        this._super("#" + arg.textureName);
        this.type = arg.type;
        this.speed = arg.speed;
        this.HP = arg.HP;
        this.weight = arg.weight;

        this.initAnimation(arg);

        //Testing move direction down
        this.moveDirection = TD.MOVE_DIRECTION.DOWN;

    },
    update: function (dt) {
        // Update animation based on move direction
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
            monsterName = "Bat";
        } else if (arg.type === 1) {
            framesPerDirection = TD.FRAMES_PER_DIRECTION.DARK_GIANT;
            frameNamePrefix = "monster_dark_giant_run_00";
            monsterName = "DarkGiant";
        } else if (arg.type === 2) {
            framesPerDirection = TD.FRAMES_PER_DIRECTION.GIANT;
            frameNamePrefix = "monster_giant_run_00";
            monsterName = "Giant";
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
            var animation = new cc.Animation(animationFrames, 0.1);

            cc.AnimationCache.getInstance().addAnimation(animation,"animation" + monsterName + TD.MOVE_DIRECTION[i]);
        }
        // var animate = cc.animate(animation);
        // this.runAction(animate.repeatForever());
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

        if (selMonster.active === false && selMonster.monsterType === arg.monsterType) {
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