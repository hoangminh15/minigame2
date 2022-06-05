const N = 3;

var PathFindingHelper = cc.Class.extend({

    waypoints: [],

    ctor: function(obstacles) {
        this.rq = new Queue();
        this.cq = new Queue();
        this.moveCount = 0;
        this.nodesLeftInLayer = 1;
        this.nodesInNextLayer = 0;
        this.isEndReached = false;
        this.obstacles = obstacles;

        this.parent = new Array(TD.CELLS_PER_EDGE);
        for (var i = 0; i < TD.CELLS_PER_EDGE; i++) {
            this.parent[i] = new Array(TD.CELLS_PER_EDGE);
        }
        // this.mapMatrix = [
        //     ["S", ".", "."],
        //     ["#", ".", "."],
        //     ["#", "#", "E"],
        // ];
        this.mapMatrix = new Array(TD.CELLS_PER_EDGE);
        for (var i = 0; i < TD.CELLS_PER_EDGE; i++) {
            this.mapMatrix[i] = new Array(TD.CELLS_PER_EDGE).fill('.');
        }
        this.mapMatrix[TD.CELLS_PER_EDGE-1][TD.CELLS_PER_EDGE-1] = "E";

        for (var i = 0; i < obstacles.length; i++) {
            var obstacle = obstacles[i];
            var x = obstacle[0];
            var y = obstacle[1];
            cc.log("obstacle x: " + x);
            cc.log("obstacle y: " + y);
            this.mapMatrix[x][y] = "#";
        }

        this.dr = [-1, 1, 0, 0];
        this.dc = [0, 0, 1, -1];

        this.visited = new Array(TD.CELLS_PER_EDGE);
        for (var i = 0; i < TD.CELLS_PER_EDGE; i++) {
            this.visited[i] = new Array(TD.CELLS_PER_EDGE).fill(false);
        }

        var r, c;
        var result;

        this.rq.enqueue(0);
        this.cq.enqueue(0);

        this.visited[0][0] = true;

        while (this.rq.size() > 0) {
            r = this.rq.dequeue();
            c = this.cq.dequeue();
            // cc.log("r " + r);
            // cc.log("c " + c);
            if (this.mapMatrix[r][c] === "E") {
                this.isEndReached = true;
                break;
            }
            this.exploreNeighbours(r, c);
            this.nodesLeftInLayer--;
            if (this.nodesLeftInLayer === 0) {
                this.nodesLeftInLayer = this.nodesInNextLayer;
                this.nodesInNextLayer = 0;
                this.moveCount++;
            }
        }
        if (this.isEndReached) result = this.moveCount;
        else result = -1;


        if (result !== -1) {
            this.waypoints.push([r, c]);
            while (r !== 0 && c !== 0) {
                var parentPos = this.parent[r][c];
                r = parentPos.x;
                c = parentPos.y;
                this.waypoints.push([r, c]);
            }
            r = 0;
            c = 0;
            this.waypoints.push([r, c]);
        }
        this.waypoints = this.waypoints.reverse();
        cc.log("waypoints m: " + this.waypoints.length);
        cc.log("waypoints n: " + this.waypoints[0].length);
    },
    findPath: function() {
        return this.waypoints;
    },
    exploreNeighbours: function (r, c) {
        for (var i = 0; i < 4; i++) {
            var rr = r + this.dr[i];
            var cc = c + this.dc[i];

            if (rr < 0 || cc < 0) continue;
            if (rr >= TD.CELLS_PER_EDGE || cc >= TD.CELLS_PER_EDGE) continue;

            if (this.visited[rr][cc]) continue;
            if (this.mapMatrix[rr][cc] === "#") continue;

            this.rq.enqueue(rr);
            this.cq.enqueue(cc);

            this.parent[rr][cc] = {x: r, y: c};

            this.visited[rr][cc] = true;
            this.nodesInNextLayer++;
        }
    }
});


