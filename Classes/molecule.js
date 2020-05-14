class Molecule {
    constructor(_i) {
        this.position = createVector(random(radiusMax, width - radiusMax), random(radiusMax, height - radiusMax));
        this.velocity = createVector(random(-2, 2), random(-2, 2));
        this.arrayPosition = _i;
        this.radius = 5;
        this.intersecting = false;
        this.bounce = true;
        this.isWithinWall = false;
    }




    render() {
        noStroke()



        push()
        translate(this.position.x, this.position.y);

        ellipse(0, 0, this.radius * 2, this.radius * 2);

        noStroke();
        // fill(255, 255, 255, 255);
        // textSize(15);
        // textAlign(CENTER, CENTER);
        // text(this.arrayPosition, 0, 0);
        pop();
    }

    step() {
        this.position.add(this.velocity);
}

checkEdges() {
    //allows our molecules to bounce within the borders of the canvas

        //left                                                          //right
        if (this.position.x < this.radius || this.position.x > width - this.radius) {

            this.velocity.x = this.velocity.x * -1
        }
        //top                                                                          //bottom
        if (this.position.y < this.radius || this.position.y > height - visualHeight - this.radius) {
            this.velocity.y = this.velocity.y * -1
        }
        //code added to stop other molecules being able to push their counter parts out of the screen
        
        //checks if their position is greater than the bottom of the canvas if it is it substracts 2 from the current y position
        if(this.position.y + this.radius > height - visualHeight){
            this.position.y = this.position.y - 2
        }
        //checks if there position is less than the top of the canvas if it is it adds 2 to the current y position
        if(this.position.y < this.radius ){
            this.position.y = this.position.y + 2
        }
        //checks if the x position
        if(this.position.x  < this.radius ){
            this.position.x = this.position.x + 2
        }
        if(this.position.x + this.radius  > width ){
            this.position.x = this.position.x - 2
        }

    
    }

    checkIntersecting(_indexValue) {

        let dist = p5.Vector.sub(this.position, molecules[_indexValue].position);
        // console.log(dist)
        if(showLines){
            line(this.position.x,this.position.y,molecules[_indexValue].position.x,molecules[_indexValue].position.y);
        }
        if (dist.mag() < this.radius + molecules[_indexValue].radius) {
            // console.log("changed")
            this.intersecting = true;
            molecules[_indexValue].intersecting = true;

            if(dist.mag() > 0.0){
            let heading = dist.heading();
            let moveDistance = abs(dist.mag() - this.radius - molecules[_indexValue].radius);

            let dy = moveDistance * Math.sin(heading);
            let dx = moveDistance * Math.cos(heading);

            this.position.x += dy / 2;
            this.position.y += dy / 2;

            molecules[_indexValue].position.x -= dx / 2
            molecules[_indexValue].position.y -= dy / 2
        }
            if (this.bounce) {

                let dx = this.position.x - molecules[_indexValue].position.x;
                let dy = this.position.y - molecules[_indexValue].position.y;
                let dist = Math.sqrt(dx * dx + dy * dy);

                let normalX = dx / dist;
                let normalY = dy / dist;

                let midpointX = (this.position.x.x + molecules[_indexValue].position.x) / 2;
                let midpointY = (this.position.x.y + molecules[_indexValue].position.y) / 2;

                let dVector = (this.velocity.x - molecules[_indexValue].velocity.x) * normalX;
                dVector += (this.velocity.y - molecules[_indexValue].velocity.y) * normalY;

                let dvx = dVector * normalX;
                let dvy = dVector * normalY;

                this.velocity.x -= dvx;
                this.velocity.y -= dvy;
                molecules[_indexValue].velocity.x += dvx;
                molecules[_indexValue].velocity.y += dvy;

                let tempVector = p5.Vector.sub(this.position, molecules[_indexValue].position);
                let heading = tempVector.heading();
                let moveDistance = abs(tempVector.mag() - this.radius - molecules[_indexValue].radius)

                let dxNew = (moveDistance * Math.cos(heading));
                let dyNew =(moveDistance * Math.sin(heading));

                this.position.x += (dxNew / 2);
                molecules[_indexValue].position.x -= (dxNew / 2);

                this.position.y += (dyNew / 2);
                molecules[_indexValue].position.y -= (dyNew / 2);

                this.breakApart(_indexValue);

            }

            return true;    

        }
     
    }
    breakApart(molecule)
    {

        var tempVec = p5.Vector.sub(this.position,molecules[molecule].position);
        var heading = tempVec.heading();
        var moveDis = abs(tempVec.mag() - this.radius - molecules[molecule].radius);

        var dis = dist(this.position.x,this.position.y,molecules[molecule].position.x,molecules[molecule].position.y);

        var dx = Math.cos(heading) * (moveDis/2);

        var dy = Math.sin(heading) * (moveDis/2);

        this.position.x += dx;
        this.position.y += dx;

        molecules[molecule].position.x -= dy;
        molecules[molecule].position.y -= dy;

    }


    reset() {
        this.left = false;
        this.right = false;
        this.top = false;
        this.bottom = false;
        this.intersecting = false;

    }

}







