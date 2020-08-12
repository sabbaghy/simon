let gameOrder = [];
let playerOrder = [];
let flash;
let turn;
let good;
let compTurn;
let intervalId;
let on= false;
let strict = false;
let noise = true;
let win;
const numberOfLevels = 5;

const turnCounter = document.getElementById('turn');
const green = document.getElementById('green');
const red = document.getElementById('red');
const gold = document.getElementById('gold');
const blue = document.getElementById('blue');
const onBtn = document.getElementById('on-btn');
const startBtn = document.getElementById('start-btn');
const strictBtn = document.getElementById('strict-btn');

const colors = [
   {pad: green, normal: 'darkgreen', press: 'lightgreen', clip: 'green-sound'},
   {pad: red, normal: 'darkred', press: 'tomato', clip: 'red-sound'},
   {pad: gold, normal: 'goldenrod', press: 'yellow', clip: 'gold-sound'},
   {pad: blue, normal: 'darkblue', press: 'lightskyblue', clip: 'blue-sound'},
]

function play(){
   win = false;
   gameOrder = [];
   playerOrder = []
   flash = 0;
   intervalId = 0;
   turn = 1;
   turnCounter.innerHTML = 1;
   good = true;
   
   console.log('inicia un nuevo juego');

   for (let i = 0; i < numberOfLevels; i++){
      gameOrder.push(Math.floor(Math.random() * 4 ) + 1);
   }

   for (let i = 0; i < 4; i++){
      accion(colors[i]);
   }

   compTurn = true;
   intervalId= setInterval(gameTurn, 800);
}

function gameTurn(){
   on = false;
   if (flash === turn) {
      clearInterval(intervalId);
      compTurn = false;
      clearColor();
      on = true;
   }

   if(compTurn){
      clearColor();
      setTimeout(() => {
         if(gameOrder[flash] === 1) accion(colors[0]);
         if(gameOrder[flash] === 2) accion(colors[1]);
         if(gameOrder[flash] === 3) accion(colors[2]);
         if(gameOrder[flash] === 4) accion(colors[3]);
         flash++;
      },200)
   }
}

function accion(colors){
   if (noise){
      let audio = document.getElementById(colors.clip);
      audio.play();
   }
   noise = true;
   colors.pad.style.background = colors.press;
}

function clearColor(){
   green.style.background = "darkgreen";
   red.style.background = "darkred";
   gold.style.background = "goldenrod";
   blue.style.background = "darkblue";
}

function flashColor(){
   green.style.background = "lightgreen";
   red.style.background = "tomato";
   gold.style.background = "yellow";
   blue.style.background = "lightskyblue";
}


function check(){

   if (playerOrder[playerOrder.length -1]  !== gameOrder[playerOrder.length -1]){
      good = false;
   }

   if (playerOrder.length === numberOfLevels && good){
      winGame();
   }

   if (!good){
      flashColor();
      turnCounter.innerHTML = "NO!";
      setTimeout(() => {
         turnCounter.innerHTML = turn;
         clearColor();
         if (strict){
            play();
         } else{
            compTurn = true;
            flash = 0;
            playerOrder =[];
            good = true;
            intervalId = setInterval(gameTurn, 800);
         }
      },800);

      noise = false; 
   }

   if(turn === playerOrder.length && good && !win){
      turn++;
      playerOrder = [];
      compTurn = true;
      flash = 0;
      turnCounter.innerHTML = turn;
      intervalId = setInterval(gameTurn, 800);
  }
}

function winGame(){
   flashColor();
   turnCounter.innerHTML = "WIN";
   on = false;
   win = true;
   localStorage.setItem(`userScore-${userName}`, 'el score es 121')
}

strictBtn.addEventListener('click', (e) => {
   strict = strictBtn.checked ? true : false;
   console.log('el boton strict = ', strict)
})

onBtn.addEventListener('click', (e) => {
   if (onBtn.checked === true) {
      turnCounter.innerHTML = '-';
      on = true;
   } else {
      turnCounter.innerHTML = '';
      on = false;
      clearColor();
      clearInterval(intervalId);
   };
})

startBtn.addEventListener('click', (e) => {
   if (on || win) {
      play();

   };
})

green.addEventListener('click', (e) => {
   if(on){
      playerOrder.push(1);
      check()
      accion(colors[0])
      if(!win){
         setTimeout(() => {
            clearColor();
         },300)
      }
   }
})

red.addEventListener('click', (e) => {
   if(on){
      playerOrder.push(2);
      check()
      accion(colors[1]);
      if(!win){
         setTimeout(() => {
            clearColor();
         },300)
      }
   }
})

gold.addEventListener('click', (e) => {
   if(on){
      playerOrder.push(3);
      check()
      accion(colors[2]);
      if(!win){
         setTimeout(() => {
            clearColor();
         },300)
      }      
   }
})

blue.addEventListener('click', (e) => {
   if(on){
      playerOrder.push(4);
      check()
      accion(colors[3]);
      if(!win){
         setTimeout(() => {
            clearColor();
         },300)
      }
   }
})
