class Recovered extends Molecule{
    constructor(_i){
        super(_i);

    }

    render(){

        noStroke();
        // if (this.intersecting) {
        //     fill(0, 0, 100, 255);
        // }
        // else {
            fill(0, 0, 255, 255);
        // }

        push()
        translate(this.position.x, this.position.y);

        ellipse(0, 0, this.radius * 2, this.radius * 2);


        pop();

    }



    checkHealth(_indexValue){
        //blank check health function as on intersecting it expects the molecule to have a check health function.
    }

}