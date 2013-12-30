var Node = function(dataVal, prevVal, nextVal){
	this.next = nextVal;
	this.prev = prevVal;
	this.data = dataVal;
};

Node.prototype = {
	toArray: function(){
		// implement to array here
	}
};

var Point = function(xVal, yVal){
	this.x = xVal;
	this.y = yVal;
};

Point.prototype = {
	Add: function(argPoint){
		if(argPoint instanceof Point){
			return new Point(
				this.x + argPoint.x, 
				this.y + argPoint.y
			);
		} else {
			// behavior for adding scalars?
		}
	},

	Sub: function(argPoint){
		if(argPoint instanceof Point){
			return new Point(
				this.x - argPoint.x, 
				this.y - argPoint.y
			);
		} else {
			// behavior for adding scalars?
		}
	},

	Avg: function(argPoint){
		if(argPoint instanceof Point){
			return new Point(
				(this.x + argPoint.x) / 2, 
				(this.y + argPoint.y) / 2
			);
		} else {
			// behavior for adding scalars?
		}
	}
};

var Game = {
	// public variables
    canvas_tag:         	document.getElementById("draw_canvas"),
    ctx:                	document.getElementById("draw_canvas").getContext("2d"),
    physics_timer:      	7,
    draw_timer:      		15,
    draw_loop_handle: 		null,
    physics_loop_handle: 	null,
    points: {
    	head: null,		// reference to first point-node of doubly linked list
    	tail: null
    },

    // public functions
    Initialize: 	function(){
    	if( Game.points.head === null ){
    		console.log("Generating points");
    		// perform points setup
    		// create first two point nodes
    		Game.points.head = new Node(new Point(0, 0.5), null, null);
    		Game.points.head.next = new Node(new Point(1, 0.5), null, null);
    		Game.points.tail = Game.points.next; // finish setting up head/tail pointers
    	}

    	// perform terrain generation loops
    	var h = 0.5;
    	var num_iterations = 10;
    	var rand_range = 1;

    	var algorithm_time = performance.now();

    	for(var itr = 0; itr < num_iterations; itr++){
    		var curr_node = Game.points.head;
    		while(curr_node !== null && curr_node.next != null){
    			var newPoint = curr_node.data.Avg(curr_node.next.data); // average two points
    			newPoint.y += Math.random() * (rand_range - (-rand_range)) + (-rand_range);

    			var newNode = new Node(newPoint, curr_node, curr_node.next);
    			curr_node.next = newNode;		// correct next pointer of curr_node
    			newNode.next.prev = newNode;	// correct prev pointer of curr_node.next

    			curr_node = curr_node.next.next;
    		}
    		rand_range *= Math.pow(2, -h); // adjust the h value to lower next random difference
    	}

    	algorithm_time = performance.now() - algorithm_time;
    	console.log(algorithm_time);

    	// initialize game loops
    	//Game.physics_loop_handle = setInterval(Game.Physics, Game.physics_timer);
    	//Game.draw_loop_handle = setInterval(Game.Draw, Game.draw_timer);
    },

    Draw: 	function(){

    },

    Physics: 	function(){

    },

    PrintPoints: function(){
    	var curr = Game.points.head;
    	//Game.ctx.clearRect(0, 0, 1000, 800);
    	Game.ctx.fillStyle = "rgba(255,255,255,0.05)";
    	Game.ctx.fillRect(0,0,1000,800);
    	Game.ctx.beginPath();

    	while(curr !== null && curr.next !== null){
    		
    		Game.ctx.strokeStyle = "#000000";
	      	Game.ctx.moveTo(curr.data.x * 1000, curr.data.y * 100 + 400);
	      	Game.ctx.lineTo(curr.next.data.x * 1000, curr.next.data.y * 100 + 400);

	      	curr = curr.next;
    	}

    	Game.ctx.stroke();
    }

};

Game.canvas_tag.focus();

Game.Initialize(); 
Game.PrintPoints();

