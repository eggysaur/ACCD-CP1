let meow = document.getElementById("meow");

let r,g,b;
let rgbColor;
const catIma = document.getElementById("nyancat");
const imgButt = document.getElementById("imgToggle");
const imgTrig = document.getElementById("imgTrigger");

//let meowChanger = function(){}
//let meowChanger = () => {}
function meowChanger(){ 

    r = Math.random()*256;
    g = Math.random()*256;
    b = Math.random()*256;
    rgbColor = "rgb("+r+","+g+","+b+")";
    meow.style.backgroundColor = rgbColor;
}

let toggleImage = () => {
    console.log("image toggled");
    if(catIma.src.includes("nyancat")){
        catIma.src = "images/technyancolor.gif";
    }
    else{
        catIma.src = "images/nyancat.gif";
    }

}   
//let meowButton = document.getElementById("meowButton");
//meowButton.addEventListener("click", meowChanger);
//window.addEventListener("load", meowChanger);

imgButt.addEventListener("click", toggleImage);
imgTrig.addEventListener("click", toggleImage);