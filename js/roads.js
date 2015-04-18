//////////
// INIT //
//////////
console.log("Starting up...");
var runGameLoop = true;
var canvas = new fabric.Canvas('c', {
    renderOnAddRemove: false,
    stateful: false
});
var cars = new Array();
var grid = {};
var semaphores = new Array();
var tileSize = 40;

//////////
// GRID //
//////////

// Grid
grid["08-08"] = 90;
grid["08-12"] = 0;
grid["10-10"] = 90;
grid["10-11"] = 0;
grid["10-13"] = 0;
grid["10-14"] = 0;
grid["10-15"] = 0;
grid["11-10"] = 90;
grid["11-12"] = 270;
grid["11-15"] = 315;
grid["12-10"] = 90;
grid["12-15"] = 270;
grid["13-10"] = 90;
grid["13-14"] = 180;
grid["13-14"] = 225;
grid["13-15"] = 270;
grid["14-10"] = 90;
grid["14-14"] = 270;
grid["15-10"] = 135;
grid["15-12"] = 270;
grid["15-14"] = 270;
grid["16-10"] = 180;
grid["16-11"] = 180;
grid["16-13"] = 180;
grid["16-14"] = 270;
grid["17-12"] = 270;
grid["19-08"] = 180;
grid["19-09"] = 180;
grid["19-10"] = 180;
grid["19-12"] = 270;

// Semaphores
semaphores["17-12"] = {
    state: 'green',
    elements: {}
};

function drawGrid() {
    var tileOutline;
    var tileDirection;
    var tileCoords;
    var x, y;

    for (var i in grid) {
        grid[i] = {
            direction: grid[i]
        };
    }

    for (var i in grid) {
        x = i.split("-")[0] * tileSize;
        y = i.split("-")[1] * tileSize;

        tileOutline = new fabric.Rect({
            fill: 'white',
            strokeWidth: 1,
            stroke: '#ececec',
            width: tileSize,
            height: tileSize,
            originX: 'center',
            originY: 'center',
            selectable: false
        });
        tileDirection = new fabric.Text("↑", {
            angle: grid[i].direction,
            fontSize: 16,
            fill: '#ececec',
            originX: 'center',
            originY: 'center',
            selectable: false
        });
        tileCoords = new fabric.Text(i, {
            fontSize: 12,
            fill: '#ececec',
            originX: 'center',
            originY: 'center',
            top: tileSize / 3,
            selectable: false
        });
        grid[i].element = new fabric.Group([ tileOutline, tileDirection, tileCoords ], {
            left: x,
            top: y,
            selectable: false
        });

        canvas.add(grid[i].element);
    }
}


function showGrid() {
    for (var i in grid) {
        grid[i].element.set({
            opacity: 1
        });
    }
}


function hideGrid() {
    for (var i in grid) {
        grid[i].element.set({
            opacity: 0
        });
    }
}


function switchSemaphores() {
    for (var i in semaphores) {
        //console.log('Countdown: ' + semaphoreCountdown);

        if (semaphores[i].state == 'red') {
            semaphores[i].state = 'green';
        } else {
            semaphores[i].state = 'red';
        }

        if (semaphores[i].state == 'red') {
            semaphores[i].elements.semaphoreRed.set({ 'radius': 6 });
            semaphores[i].elements.semaphoreOrange.set({ 'radius': 4 });
            semaphores[i].elements.semaphoreGreen.set({ 'radius': 4 });
        } else if (semaphores[i].state == 'orange') {
            semaphores[i].elements.semaphoreOrange.set({ 'radius': 6 });
            semaphores[i].elements.semaphoreRed.set({ 'radius': 4 });
            semaphores[i].elements.semaphoreGreen.set({ 'radius': 4 });
        } else if (semaphores[i].state == 'green') {
            semaphores[i].elements.semaphoreGreen.set({ 'radius': 6 });
            semaphores[i].elements.semaphoreRed.set({ 'radius': 4 });
            semaphores[i].elements.semaphoreOrange.set({ 'radius': 4 });
        }

    }
}

function drawSemaphores() {
    for (var i in semaphores) {

        this.x = i.split("-")[0] * tileSize;
        this.y = i.split("-")[1] * tileSize;

        semaphores[i].elements.semaphoreBar = new fabric.Line([0, 0, 0, tileSize], {
            fill: 'black',
            stroke: 'black',
            strokeWidth: 4,
            selectable: false,
            originX: 'center',
            originY: 'center',
            selectable: false
        });

        semaphores[i].elements.semaphoreRed = new fabric.Circle({
            radius: 4,
            fill: 'red',
            originX: 'center',
            originY: 'center',
            left: 1,
            top: (tileSize / 4),
            selectable: false
        });

        semaphores[i].elements.semaphoreOrange = new fabric.Circle({
            radius: 4,
            fill: 'orange',
            originX: 'center',
            originY: 'center',
            left: 1,
            top: 2 * (tileSize / 4),
            selectable: false
        });

        semaphores[i].elements.semaphoreGreen = new fabric.Circle({
            radius: 4,
            fill: 'green',
            originX: 'center',
            originY: 'center',
            left: 1,
            top: 3 * (tileSize / 4),
            selectable: false
        });

        semaphores[i].element = new fabric.Group([
            semaphores[i].elements.semaphoreBar,
            semaphores[i].elements.semaphoreRed,
            semaphores[i].elements.semaphoreOrange,
            semaphores[i].elements.semaphoreGreen
        ], {
            left: this.x,
            top: this.y,
            angle: 0,
            selectable: false
        });

        canvas.add(semaphores[i].element);

    }
}

function getTileDirection(tile) {
    return grid[tile] && grid[tile].direction;
}

function getTile(x,y) {

    if (x % tileSize == 20 && y % tileSize == 20) {

        tileX = Math.floor(x / tileSize);
        tileY = Math.floor(y / tileSize);

        // Zero pad tiles
        if (tileX < 10) {
            tileX = "0" + tileX;
        }
        if (tileY < 10) {
            tileY = "0" + tileY;
        }

        return tileX + "-" + tileY;

    } else {

        return undefined;

    }
}


/////////////
// OBJECTS //
/////////////

// Car properties
var carHeight = 25;
var carWidth = 15;
var carColor = "#181818";
var carMoveX = 0;
var carMoveY = -1;
var carAngle = 0;

// Car object
var Car = function(carTile, carSpeed) {

    // Set properties
    this.color = carColor;
    this.width = carWidth;
    this.height = carHeight;
    this.speed = carSpeed;
    this.tile = carTile;
    this.x = (this.tile.split("-")[0] * tileSize) + (tileSize / 2);
    this.y = (this.tile.split("-")[1] * tileSize) + (tileSize / 2);
    this.moveX = carMoveX;
    this.moveY = carMoveY;
    this.angle = carAngle;

    this.chasis = new fabric.Rect({
        fill: this.color,
        width: this.width,
        height: this.height,
        rx: 3,
        ry: 3,
        originX: 'center',
        originY: 'center',
        selectable: false
    });

    this.breakLightLeft = new fabric.Circle({
        radius: 2,
        fill: 'red',
        originX: 'center',
        originY: 'center',
        left: -(this.width / 2) + 3,
        top: this.height / 2 - 1,
        selectable: false
    });

    this.breakLightRight = new fabric.Circle({
        radius: 2,
        fill: 'red',
        originX: 'center',
        originY: 'center',
        left: (this.width / 2) - 3,
        top: this.height / 2 - 1,
        selectable: false
    });

    this.element = new fabric.Group([ this.chasis, this.breakLightLeft, this.breakLightRight ], {
        left: this.x,
        top: this.y,
        originX: 'center',
        originY: 'center',
        angle: this.angle,
        selectable: false
    });

    canvas.add(this.element);

    Car.prototype.turnRight = function(currentAngle) {
        this.moveX = (this.angle / 100) * 3;
        this.angle++;
    }

    Car.prototype.draw = function(canvas) {
        canvas.add(this.element);
    }

    Car.prototype.move = function() {
        var activeSemaphore;

        if ( (typeof this.x === 'number' && (this.x % 1) === 0) && (typeof this.y === 'number' && (this.y % 1) === 0) ) {

            this.direction = getTileDirection(getTile(this.x,this.y));

            if (this.direction !== undefined) {

                if (this.direction == 0) {
                    this.moveY = -this.speed;
                    this.moveX = 0;
                } else if (this.direction == 45) {
                    this.moveY = -0.5 * this.speed;
                    this.moveX = 0.5 * this.speed;
                } else if (this.direction == 90) {
                    this.moveY = 0;
                    this.moveX = this.speed;
                } else if (this.direction == 135) {
                    this.moveY = 0.5 * this.speed;
                    this.moveX = 0.5 * this.speed;
                } else if (this.direction == 180) {
                    this.moveY = this.speed;
                    this.moveX = 0;
                } else if (this.direction == 225) {
                    this.moveY = 0.5 * this.speed;
                    this.moveX = -0.5 * this.speed;
                } else if (this.direction == 270) {
                    activeSemaphore = semaphores[getTile(this.x,this.y)];
                    if (activeSemaphore && activeSemaphore.state == "red") {

                        this.moveX = 0;

                    } else {

                        this.moveY = 0;
                        this.moveX = -this.speed;
                    }
                } else if (this.direction == 315) {
                    this.moveY = -0.5 * this.speed;
                    this.moveX = -0.5 * this.speed;
                }



                this.targetAngle = this.direction;

            }

            if (this.targetAngle > this.angle) {
                this.angle += 15;
            } else if (this.targetAngle < this.angle) {
                this.angle -= 15;
            }

        }

        this.x = this.x + this.moveX;
        this.y = this.y + this.moveY;

        this.element.set({
            left: this.x,
            top: this.y,
            angle: this.angle
        });

    }

};

///////////////
// FUNCTIONS //
///////////////

function drawCars() {

	for (var i in cars) {
	    cars[i].draw(canvas);
    }

}

function moveCars() {

    for (var i in cars) {
        cars[i].move();
    }

}

function simStatus() {
    for (i in cars) {
        console.log("car: " + i + " x: " + cars[i].x + ", y: " + cars[i].y + ", tile: " + cars[i].tile + ", angle: " + cars[i].angle);
    }
}

function collisionDetection() {
    if (Math.abs(cars[0].x - cars[1].x) < carHeight && Math.abs(cars[0].y - cars[1].y) < carHeight) {
        simStatus();
        console.log("CRASH!!");
        runGameLoop = false;
    }
}

// SPAWN
cars[0] = new Car("10-13", 1);
cars[1] = new Car("19-10", 2);
cars[2] = new Car("15-14", 1);

var gameRunning = false;
var gameLastLoopTimestamp = 0;
var gameJobs = [];

function job(each, callback) {
    gameJobs.push({
        each: each,
        callback: callback,
        lastRun: 0
    });
}

function runJobs() {
    var job;
    for (var index in gameJobs) {
        job = gameJobs[index];
        if ((job.lastRun + job.each) <= gameLastLoopTimestamp) {
            job.callback();
            job.lastRun = gameLastLoopTimestamp;
        }
    }
}

(function gameLoop() {
    setTimeout(function() {
        if (gameRunning) {
            gameLastLoopTimestamp += 10;
            runJobs();
            gameRunning = false;
        }
        gameLoop();
    }, 10);
})();

job(2000, function() {
    switchSemaphores();
});
job(10, function() {
    moveCars();
    collisionDetection();
});


///////////////
// GAME LOOP //
///////////////

// Render the game
function render() {

    if (runGameLoop == true) {

        // Debug
        //simStatus();

        // Render canvas
        canvas.renderAll();

    }

}

window.requestAnimFrame = (function() {
	return  window.requestAnimationFrame       ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame    || 
	window.oRequestAnimationFrame      || 
	window.msRequestAnimationFrame     || 
	function( callback ) {
	    window.setTimeout(callback, 1000 / 60);
	};
})();

// Draw grid
document.getElementById('displaygrid').addEventListener('change', function() {
    if (this.checked) {
        showGrid();
    } else {
        hideGrid();
    }
});

drawGrid();
drawSemaphores();
switchSemaphores();
drawCars();

(function animloop(){
    gameRunning = true;
	requestAnimFrame(animloop);
	render();
})();
