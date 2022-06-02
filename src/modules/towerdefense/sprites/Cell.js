
var Cell = cc.Sprite.extend({
    ctor: function(arg) {
        this._super("#" + arg.textureName);
        
    },
    destroy: function() {
        this.visible = false;
        this.active = false;
    }
})

Cell.create = function(arg) {
    var cell = new Cell(arg);
    TD.CONTAINER.CELLS.push(cell);
    g_sharedGameLayer.addChild(cell, TD.ZORDER.CELLS);
    return cell;
};

Cell.getOrCreate = function(arg) {
    var cell;
    for (var j = 0; j < TD.CONTAINER.CELLS; j++) {
        cell = TD.CONTAINER.CELLS[j];
        if (cell.active === false && cell.type === arg.type) {
            cell.active = true;
            cell.visible = true;
            return cell;
        }
    }
    cell = Cell.create(arg);
    return cell;
}

Cell.preset = function() {
    var cell;
    for (var j = 0; j < MapType.length; j++) {
        cell = Cell.create(MapType[j]);
        cell.visible = false;
        cell.active = false;
    }
};