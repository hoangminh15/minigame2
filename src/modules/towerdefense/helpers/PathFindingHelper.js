var PathFindingHelper = cc.Class.extend({

    waypoints: [],
    result: null,

    ctor: function (obstacles) {
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

        this.mapMatrix = new Array(TD.CELLS_PER_EDGE);
        for (var i = 0; i < TD.CELLS_PER_EDGE; i++) {
            this.mapMatrix[i] = new Array(TD.CELLS_PER_EDGE).fill('.');
        }
        this.mapMatrix[TD.CELLS_PER_EDGE - 1][TD.CELLS_PER_EDGE - 1] = "E";


        this.visited = new Array(TD.CELLS_PER_EDGE);
        for (var i = 0; i < TD.CELLS_PER_EDGE; i++) {
            this.visited[i] = new Array(TD.CELLS_PER_EDGE).fill(false);
        }

        // Direction leading to a specific node
        this.lastDirection = new Array(TD.CELLS_PER_EDGE);
        for (var i = 0; i < TD.CELLS_PER_EDGE; i++) {
            this.lastDirection[i] = new Array(TD.CELLS_PER_EDGE);
        }

        for (var i = 0; i < obstacles.length; i++) {
            var obstacle = obstacles[i];
            var x = obstacle[0];
            var y = obstacle[1];
            this.mapMatrix[x][y] = "#";
        }

        this.dr = [-1, 1, 0, 0];
        this.dc = [0, 0, 1, -1];

        var r, c;

        this.rq.enqueue(0);
        this.cq.enqueue(0);

        this.visited[0][0] = true;

        while (this.rq.size() > 0) {
            r = this.rq.dequeue();
            c = this.cq.dequeue();
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

        if (this.isEndReached) this.result = this.moveCount;
        else this.result = -1;


        // Create waypoints if there's a path
        if (this.result !== -1) {
            this.waypoints.push([r, c]);
            while (r !== 0 || c !== 0) {
                var parentPos = this.parent[r][c];
                r = parentPos.x;
                c = parentPos.y;
                this.waypoints.push([r, c]);
            }
            this.waypoints = this.waypoints.reverse();
        }
    },
    findPath: function () {
        if (this.result === - 1) return -1;
        return this.waypoints;
    },
    exploreNeighbours: function (r, c) {
        var rr, cc;
        var ld;
        if ((r === 0 && c === 0) === false) {
            ld = this.lastDirection[r][c];
            rr = r + this.dr[ld];
            cc = c + this.dc[ld];
            if (this.checkValidMove(rr, cc) === true) {
                this.handleValidMove(rr, cc, r, c, ld);
            }
        }

        for (var i = 0; i < 4; i++) {
            if (i !== ld) {
                rr = r + this.dr[i];
                cc = c + this.dc[i];

                if (this.checkValidMove(rr, cc) === false) {
                    continue;
                }
                this.handleValidMove(rr, cc, r, c, i);
            }
        }

    },
    checkValidMove: function (rr, cc) {
        if (rr < 0 || cc < 0) return false;
        if (rr >= TD.CELLS_PER_EDGE || cc >= TD.CELLS_PER_EDGE) return false;

        if (this.visited[rr][cc]) return false;
        if (this.mapMatrix[rr][cc] === "#") return false;

        return true;
    },

    handleValidMove: function(rr, cc, r, c, direction) {
        this.rq.enqueue(rr);
        this.cq.enqueue(cc);

        this.parent[rr][cc] = {x: r, y: c};
        this.lastDirection[rr][cc] = direction;

        this.visited[rr][cc] = true;
        this.nodesInNextLayer++;
    }
});


