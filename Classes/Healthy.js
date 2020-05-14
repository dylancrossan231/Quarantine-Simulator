class Healthy extends Molecule{
    constructor(_i){
        super(_i);
    }



    render(){
                noStroke()

        
                // if (this.intersecting) {
                //     fill(0, 150, 0, 255);
                // }
                // else {
                    fill(0, 255, 0, 125);
                // }
        
                push()
                translate(this.position.x, this.position.y);
        
                ellipse(0, 0, this.radius * 2, this.radius * 2);
        
                noStroke();

                pop();

    }
//check health function allows us to check if our healthy molecules have come in contact with 
//an infector molecule and if so they have a percentage chance of being infected.
//If infected they will take over the current array position velocity position x , y and keeps the same radius and same iswithinwall value.
    checkHealth(_indexValue){
        let otherMolecule = molecules[_indexValue];
        if(otherMolecule.constructor.name == "Infector"){
            let randomNum = random();
            if(randomNum < rateOfInfection){
            molecules[this.arrayPosition] = new Infector(this.arrayPosition);
            molecules[this.arrayPosition].position = this.position;
            molecules[this.arrayPosition].isWithinWall = this.isWithinWall;
            molecules[this.arrayPosition].velocity = this.velocity;
            molecules[this.arrayPosition].radius = this.radius;
            }
        }
     }


}