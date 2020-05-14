class Infector extends Molecule{
    constructor(_i){
        super(_i);
         //recovered is called when the class is created        
        this.recovered()

    }

    /**
     * Function runs, waits 10 seconds (1000ms) and 
     * then runs code inside of setTimeout
     */
    recovered() {
        setTimeout(() => {
            //Function runs, waits 10 seconds (1000ms) and 
            //then runs code inside of setTimeout and makes a new recovered molecule at the same array position x and y position same velocity and radius and iswithinWall boolean
            molecules[this.arrayPosition] = new Recovered(this.arrayPosition);
            molecules[this.arrayPosition].position = this.position;
            molecules[this.arrayPosition].isWithinWall = this.isWithinWall;
            molecules[this.arrayPosition].velocity = this.velocity;
            molecules[this.arrayPosition].radius = this.radius;
            //lifeCycle is how long a infected molecule is infected this can be changed in the sketch
        }, lifeCycle);
    }

    render(){
        noStroke()

            fill(255, 0, 0, );

        push()
        translate(this.position.x, this.position.y);

        ellipse(0, 0, this.radius * 2, this.radius * 2);

        noStroke();

        pop();

        }


    //check health function allows us to check if our infected molecules have come in contact with 
    //a Healthy molecule and if so they have a percentage chance of infecting a healthy.
    //If Healthy becomes infected it takes the same array position and velocity and radius and isWithinWall value as its previous counter part.        
    checkHealth(_indexValue){
        let otherMolecule = molecules[_indexValue];
        if(otherMolecule.constructor.name == "Healthy"){
            let randomNum = random();
            if(randomNum < rateOfInfection) {
            molecules[otherMolecule.arrayPosition] = new Infector(otherMolecule.arrayPosition); 
            molecules[otherMolecule.arrayPosition].position = otherMolecule.position;
            molecules[otherMolecule.arrayPosition].isWithinWall = otherMolecule.isWithinWall;
            molecules[otherMolecule.arrayPosition].velocity = otherMolecule.velocity;
            molecules[otherMolecule.arrayPosition].radius = otherMolecule.radius;
            }
        }
        
    }




}