function catmullRomInterpolate( P0, P1, P2, P3, u ){
	var u3 = u * u * u;
	var u2 = u * u;
	var f1 = -0.5 * u3 + u2 - 0.5 * u;
	var f2 =  1.5 * u3 - 2.5 * u2 + 1.0;
	var f3 = -1.5 * u3 + 2.0 * u2 + 0.5 * u;
	var f4 =  0.5 * u3 - 0.5 * u2;
	var x = P0.x * f1 + P1.x * f2 + P2.x * f3 + P3.x * f4;
	var y = P0.y * f1 + P1.y * f2 + P2.y * f3 + P3.y * f4;

	return new Point(x, y);
}

var Node = function(dataVal, prevVal, nextVal){
	this.next = nextVal;
	this.prev = prevVal;
	this.data = dataVal;
};

Node.prototype = {
	toArray: function(){
		var new_array = [];
		var curr_node = this;
		while(curr_node != null){
			new_array.push(curr_node);
			curr_node = curr_node.next;
		}
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
    	head: 				null,	// reference to first point-node of doubly linked list
    	tail: 				null,
    	point_array: 		[]
    },

    // public functions
    Initialize: 	function(){
    	if( Game.points.head === null ){
    		console.log("Generating points");
    		// perform points setup
    		// create first two point nodes
    		var headNode = new Node(new Point(0, 0.5), null, null);
    		var tailNode = new Node(new Point(1, 0.5), null, null);

    		headNode.next = tailNode;
    		tailNode.prev = headNode;

    		Game.points.head = headNode;
    		Game.points.tail = tailNode;

    		//Game.points.point_array.push(headNode.data);
    		//Game.points.point_array.push(tailNode.data);
    	}

    	// perform terrain generation loops
    	var h = 0.7;
    	var num_iterations = 6;				// 6 is enough
    	var catmull_interpolations  = 1;	// 6 is still enough
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


    	// perform catmull rom interpolation to smooth path
    	// must run at least 1 time to yield any points for final draw
    	var curr_node = Game.points.head;

    	while( curr_node != null 
    		&& curr_node.next != null 
    		&& curr_node.next.next != null
    		&& curr_node.next.next.next != null){

			var p0 = curr_node.data;
			var p1 = curr_node.next.data;
			var p2 = curr_node.next.next.data;
			var p3 = curr_node.next.next.next.data;

			for(var itr = 0; itr < catmull_interpolations; itr++){
				var newPoint = catmullRomInterpolate(p0, p1, p2, p3, itr/catmull_interpolations);
				Game.points.point_array.push(newPoint);
			}

			curr_node = curr_node.next;
    	}

    	// handle end point special case interpolation

    	algorithm_time = performance.now() - algorithm_time;
    	console.log("Algorithm Time: " + algorithm_time.toFixed(2));
    	console.log("Number of points pre-interpolation: " + Game.points.point_array.length / catmull_interpolations);
    	console.log("Number of points: " + Game.points.point_array.length);


    	/*
    	 * Array implementation saved for benchmark purposes
	    	// generate with array, because #yolo
	    	rand_range = 1;
	    	algorithm_time = performance.now();

	    	for(var itr = 0; itr < num_iterations; itr++){
	    		for(var i = 0; i < Game.points.point_array.length-1; i+=2){
	    			var newPoint = Game.points.point_array[i].Avg(Game.points.point_array[i+1]); // average two points
	    			newPoint.y += Math.random() * (rand_range - (-rand_range)) + (-rand_range);
	    			Game.points.point_array.splice(i+1, 0, newPoint);
	    		}
	    		rand_range *= Math.pow(2, -h); // adjust the h value to lower next random difference
	    	}

	    	algorithm_time = performance.now() - algorithm_time;
	    	console.log("Array Time: " + algorithm_time.toFixed(2));
    	*/


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

    	for(var pos = 0; pos < Game.points.point_array.length-1 && Game.points.point_array.length > 1; pos++){
    		var curr = Game.points.point_array[pos];
    		var next = Game.points.point_array[pos+1];

    		Game.ctx.strokeStyle = "#000000";
	      	Game.ctx.moveTo(curr.x * 1000, curr.y * 100 + 400);
	      	Game.ctx.lineTo(next.x * 1000, next.y * 100 + 400);
    	}

    	Game.ctx.stroke();
    }

};

Game.canvas_tag.focus();

	Game.Initialize(); 
	Game.PrintPoints();



