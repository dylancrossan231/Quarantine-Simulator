//Molecule variables
let molecules = [];
const numOfMolecules = 1000;
let radiusMin = this.radius;
let radiusMax = this.radius;


//Grid controls and variables
const gridCols = 10;
const gridRows = 10;
let gridWidth;
let gridHeight;
let gridMolecules = [];
let intersectCount = 0;

//How long infected molecules take to recover in m/s
const lifeCycle = 10000;

//Infected molecule controls
let rateOfInfection = .5;

//Show distance between molecules with drawn line if in same grid
showLines = false;

//Graph variables
let visualHeight = 150;
let graphHeight = 100;
let visualData = [];
let graphLeftOffset = 300;
let graphTopOffset = 30;
let graphWidth = 1000;

let rectPositionX = 265;


function setup() {
    //canvas size and background color
    createCanvas(1000, 1000);
    pixelDensity(1)
    background(240);

    
    //All functions that run once
    makeMolecules();
    showGUI();
    gridifyBalls();
    smooth();
    //noLoop();

    //allows us to calculate the distances for each grid if change the gridCols and gridRows values
    gridWidth = width / gridCols;
    gridHeight = (height - visualHeight) / gridRows;


}

function draw() {
    //background fill
    background(240);

    //All of our functions that run 60 times a second due to being inside of our draw function    
    make2dArray();
    resetBalls();
    splitIntoGrids();
    checkIntersections();
    checkWall();
    renderGrid();

    //GUI controlled functions 
    if(guiObj.renderGraph) renderGraph();
    if (guiObj.drawGrid) drawGrid();


}
//default GUI values    

var guiObj = {
    drawGrid: true,
    renderGraph: true

  };
//function to display my GUI and link to my default data set above

function showGUI(){
    let gui = new dat.GUI();
    gui.add(guiObj, "drawGrid");
    gui.add(guiObj, "renderGraph");
}
//Create molecules function
function makeMolecules(){
    for (let i = 0; i < numOfMolecules; i++) {
        let randomNum = random();
        if(i > 0){
            
            molecules.push(new Healthy(i))
        }else{
            //pushes one infected molecule into the array
            molecules.push(new Infector (0))
    }
}
}

//creates a 2d array that stores our amount of grid rows and creates a seperate arrays inside of each row in our case we have 10 rows 10 cols we have 10 arrays
// in the first dimension which represents the rows and then  in the second dimension we have 10 arrays which represents our columns
function make2dArray() {
    gridMolecules = [];
    for (let i = 0; i < gridRows; i++) {
        gridMolecules.push([])
        for (let j = 0; j < gridCols; j++) {
            gridMolecules[i].push([])
        }
    }
}
//creates a 2d array that check agaisnt each other to see if molecules are intersecting if they intersect it runs our check health function found in our classes
function checkIntersections() {
    for (let i = 0; i < gridRows; i++) {
        for (let j = 0; j < gridCols; j++) {
            let tempArray = gridMolecules[i][j];
            let numInArray = tempArray.length
            if (numInArray > 1) {
                for (let z = 0; z < numInArray; z++) {
                    for (let w = z + 1; w < numInArray; w++) {
                        let indexValue01 = tempArray[z];
                        let indexValue02 = tempArray[w];

                        if(molecules[indexValue01].checkIntersecting(indexValue02)){
                            molecules[indexValue01].checkHealth(indexValue02)
                        }
                    }
                }
            }
        }
    }
}
//Draws our grid 
function drawGrid() {
    for (let i = 0; i < gridRows; i++) {
        for (let j = 0; j < gridCols; j++) {
            noFill();
            strokeWeight(1)
            stroke(0, 244, 0, 50);
            //creating each grid
            rect(j * gridWidth, i * gridHeight, gridWidth, gridHeight);

            let intersectCount = 0;

            let tempArray = gridMolecules[i][j];
            let numArray = tempArray.length;

            tempArray.forEach(function (indexValue) {

                if (molecules[indexValue].intersecting == true) {
                    intersectCount++
                }
            })

            if (numArray == 0) {
                numArray = ""
            }

            //displays number of molecules in each grid based on how many are in the array that each grid has
            noStroke();
            fill(255, 255, 255, 255);
            textSize(16);
            textAlign(RIGHT);
            text(numArray, j * gridWidth + gridWidth - 5, i * gridHeight + 20);

            //displays the amount of intersections happening in a grid
            fill(255, 50, 0, 150);
            text(intersectCount, j * gridWidth + gridWidth - 5, i * gridHeight + gridHeight - 5);

        }
    }
   

}

function splitIntoGrids() {


    molecules.forEach(function (molecule) {
        let iNum = floor(molecule.position.y / gridHeight);
        let jNum = floor(molecule.position.x / gridWidth);
                //calculating which grid each molecule is in

        if(iNum<0)
        {
            iNum=0
        }
        if(iNum>gridRows-1)
        {
            iNum=gridRows-1
        }
        if(jNum<0)
        {
            jNum=0
        }
        if(jNum>gridCols-1)
        {
            jNum=gridCols-1
        }
        //pushes the current array position of the molecule into the gridMolecules array based on what grid its in
        gridMolecules[iNum][jNum].push(molecule.arrayPosition);

        //check if molecule is in current grid and grid to left of it
        if (molecule.position.x % width < molecule.radius && molecule.position.x > width) {    
            gridMolecules[iNum][jNum - 1].push(molecule.arrayPosition);
            molecule.left = true;
        }

        //check if molecule is in current grid and grid to right of it
        if (molecule.position.x % width > width - molecule.radius && molecule.position.x < width - width) {
            gridMolecules[iNum][jNum + 1].push(molecule.arrayPosition);
            molecule.right = true;
        }

        //check if molecule is in current grid and grid on bottom of it
        if (molecule.position.y % height < molecule.radius && molecule.position.y > height) {   
            gridMolecules[iNum - 1][jNum].push(molecule.arrayPosition);
            molecule.bottom = true;
        }
        
        //check if molecule is in current grid and grid on top of it
        if (molecule.position.y % height > height - molecule.radius && molecule.position.y < height - visualHeight - width) {
            gridMolecules[iNum + 1][jNum].push(molecule.arrayPosition);
            molecule.top = true;
        }

        
        //check if molecule is in current grid and grid on top of it and grid on the left of molecule if these two are true then so is top left grid
        if(molecule.top && molecule.left){
            gridMolecules[jNum-1][iNum - 1].push(molecule.arrayPosition);
        }
        //check if molecule is in current grid and grid on top of it and grid on the right of molecule if these two are true then so is top right grid
        if(molecule.top && molecule.right){
            gridMolecules[jNum+1][iNum - 1].push(molecule.arrayPosition);
        }
        //check if molecule is in current grid and grid on top of it
        if(molecule.bottom && molecule.left){
            gridMolecules[jNum - 1][iNum + 1].push(molecule.arrayPosition);
        }
        //check if molecule is in current grid and grid on top of it
        if(molecule.bottom && molecule.right){
            gridMolecules[jNum + 1][iNum + 1].push(molecule.arrayPosition);
        }
    });

}

//creates our graph
function renderGraph(){

    //filters our molecules array and makes a new array with any molecule with the name Healthy
    let healthy = molecules.filter(function (molecule){
        return molecule.constructor.name === "Healthy";
    });

    //filters our molecules array and makes a new array with any molecule with the name Infector
    let infected = molecules.filter(function (molecule){
        return molecule.constructor.name === "Infector";
    });

    //filters our molecules array and makes a new array with any molecule with the name Recovered
    let recovered = molecules.filter(function (molecule){
        return molecule.constructor.name === "Recovered";
    });

    //we use a map function on all of our arrays to get all of our values between 0 and 100 e.g we have 250/500 molecules healthy mapping will change it to 50 / 100
    let healthyHeight= map(healthy.length,0,numOfMolecules,0,graphHeight);
    let infectedHeight= map(infected.length,0,numOfMolecules,0,graphHeight);
    let recoveredHeight= map(recovered.length,0,numOfMolecules,0,graphHeight);

    // when the visualData array reaches the same length as graph width = 1000 then shift this begins removing the oldest data in the array one by one
    if(visualData.length > graphWidth){
        visualData.shift();
    }

    //pushes our mapped data into a visualData array so we can graph that data against each other
    visualData.push({
        healthy:healthyHeight,
        infected:infectedHeight,
        recovered: recoveredHeight
    });

    push();
    translate(0,height-visualHeight);

    visualData.forEach(function(data,index) {
    //graphing our 
    fill(255,0,0);
    noStroke();
    rect(index++, graphTopOffset + data.healthy + data.recovered ,1, data.infected)

    fill(0,255,0);
    noStroke();
    rect(index++,graphTopOffset + data.recovered , 1 ,data.healthy)

    fill(0,0,255);
    noStroke();
    rect(index++,graphTopOffset  , 1 ,data.recovered)

    });
    
    

    pop();


    

};


function checkWall(){

    //rectantgle variables    
    let gapInWall = 40 ;
    let rectWidth = 5;
    let rectHeight = 905 / 2 - 50;
    let rectPositionXoffset = 2.5;
    let rectPositionY = 0;
    strokeWeight(3);
    stroke(0);
    noFill();
    //drawing the rectangles for wall
    rect(rectPositionX + rectPositionXoffset, rectPositionY, rectWidth, rectHeight );         
    rect(rectPositionX + rectPositionXoffset, 445, rectWidth, rectHeight );  

    molecules.forEach(molecule => {
        if(molecule.isWithinWall) {
            if(molecule.position.y > rectHeight && molecule.position.y < (rectHeight + gapInWall) && molecule.position.x >= (rectPositionX -5)) {
                
                //Move the molecule to the other side of the wall (left to right)
                
                molecule.isWithinWall = false
            } else if(molecule.position.x >= rectPositionX + 5 - molecule.radius) {
                
                 // Bounce on left hand side
                 
                molecule.position.x = rectPositionX - 5
                molecule.velocity.x = molecule.velocity.x * -1;
            }
        } else {
            if(molecule.position.y > rectHeight && molecule.position.y < (rectHeight + gapInWall) && molecule.position.x <= rectPositionX + 15) {
                
                 //Move the molecule to the other side of the wall (right to left)
                
                molecule.isWithinWall = true
            } else if(molecule.position.x <= 265 + molecule.radius + rectWidth) {
                
                 //Bounce right hand side
                 
                molecule.position.x = rectPositionX + 15

                molecule.velocity.x = molecule.velocity.x * -1;
            }
        }
    

        
    });
}
function gridifyBalls(){

    let iNum = Math.ceil( Math.sqrt(numOfMolecules)); //10
    let jNum = iNum; //10
    let iSize = width / iNum; //1000width / 10 = 100
    let jSize = (height-visualHeight) / jNum;

    molecules.map((molecule,index) =>{
        let iPos = index % iNum; //1
        let jPos = Math.floor(index / jNum);
        if(iPos * iSize + 50 < rectPositionX) 
           //1  x 100 + 200 
        // console.log(dat.isWithinWall);
        molecule.isWithinWall = true
        
        molecule.position.x = iPos * iSize + 10;
        molecule.position.y = jPos * jSize + 10;

    })
    
}

function renderGrid() {


    molecules.forEach(function (molecule) {
        molecule.step();
        molecule.checkEdges();
        molecule.render();
        

    });

   
}

function resetBalls() {
 
    for (let i = 0; i < numOfMolecules; i++) {
        molecules[i].reset();
    }



   
}
