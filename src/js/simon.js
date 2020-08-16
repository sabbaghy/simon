let gameOrder = [];
let playerOrder = [];
let flash;
let level;
let good;
let compTurn;
let intervalId;
let on= false;
let strict = false;
let noise = true;
let win;
const numberOfLevels = 20;

const displayCounter = document.getElementById('level');
const green = document.getElementById('green');
const red = document.getElementById('red');
const gold = document.getElementById('gold');
const blue = document.getElementById('blue');
const onBtn = document.getElementById('on-btn');
const startBtn = document.getElementById('start-btn');
const strictBtn = document.getElementById('strict-btn');
const activePlayer = document.getElementById('activePlayer');

const colors = [
   {pad: green, normal: 'green', press: 'green--on', clip: 'green-sound'},
   {pad: red, normal: 'red', press: 'red--on', clip: 'red-sound'},
   {pad: gold, normal: 'gold', press: 'gold--on', clip: 'gold-sound'},
   {pad: blue, normal: 'blue', press: 'blue--on', clip: 'blue-sound'},
]

function play(){
   win = false;
   gameOrder = [];
   playerOrder = []
   flash = 0;
   intervalId = 0;
   level = 1;
   displayCounter.innerHTML = 1;
   good = true;

   gameOrder.push(Math.floor(Math.random() * 4 ));

   for (let i = 0; i < 4; i++){
      action(colors[i]);
   }

   compTurn = true;
   intervalId= setInterval(gameTurn, 800);
}

function gameTurn(){
   on = false;
   activePlayer.innerHTML = 'It is computer turn'
   activePlayer.classList = 'activePlayer activePlayer--show'
   if (flash === level) {
      clearInterval(intervalId);
      compTurn = false;
      clearColor();
      on = true;
      if(gameOrder.length <= level){
         gameOrder.push(Math.floor(Math.random() * 4 ));
      }
      console.log('Next play', gameOrder)  // ==> facilitar la prueba del juego y no tener que recordar las secuencia
      activePlayer.innerHTML = `${userName} is your turn`
   }

   if(compTurn){
      clearColor();
      setTimeout(() => {
         if(gameOrder[flash] === 0) action(colors[0]);
         if(gameOrder[flash] === 1) action(colors[1]);
         if(gameOrder[flash] === 2) action(colors[2]);
         if(gameOrder[flash] === 3) action(colors[3]);
         flash++;
      },200)
   }
}

function action(colors){
   if (noise){
      let audio = document.getElementById(colors.clip);
      audio.play();
   }
   noise = true;
   colors.pad.classList.add(`${colors.press}`);
}

function clearColor(){
   for (let i = 0; i < colors.length; i++){
      colors[i].pad.classList.remove(`${colors[i].press}`);
   }
}

function flashColor(){
   for (let i = 0; i < colors.length; i++){
      colors[i].pad.classList.add(`${colors[i].press}`);
   }
}


function errorSound(){
   if (noise){
      let audio = document.getElementById('error');
      audio.play();
   }
   noise = true;
}

function check(){

   if (playerOrder[playerOrder.length -1]  !== gameOrder[playerOrder.length -1]){
      good = false;
   }

   if (playerOrder.length === numberOfLevels && good){
      winGame();
   }

   if (!good){
      errorSound();
      flashColor();
      displayCounter.innerHTML = "NO!";
      setTimeout(() => {
         displayCounter.innerHTML = level;
         clearColor();

         if (strict){
            
            if(userScores !== null){
               userScores.push(level-1);
            } else {
               userScores = [level-1];
               scores.classList.add('scores--show');
               activePlayer.classList.add('activePlayer--show');
            }
            
            order(userScores, userName)

            localStorage.setItem(`userScore-${userName}`, JSON.stringify(userScores));
            localStorage.setItem('bestScore', JSON.stringify(bestScores));
            
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

   if(level === playerOrder.length && good && !win){
      level++;
      playerOrder = [];
      compTurn = true;
      flash = 0;
      displayCounter.innerHTML = level;
      intervalId = setInterval(gameTurn, 800);
  }
}

function order(scores,name){
   let max;
   if(bestScores !== null){
      bestScores.push({player:name, score: scores[scores.length - 1]})
   } else {
      bestScores =[{player:name, score: scores[scores.length - 1]}]
   }

   scores.sort((a,b) => b-a);
   max = Math.min(10,scores.length)
   scores = scores.slice(0,max);
   showUserScores(scores);
   bestScores.sort((a,b) => b.score - a.score);
   max = Math.min(10,bestScores.length)
   bestScores = bestScores.slice(0,max);
   showBestScores(bestScores);
}

function winGame(){
   flashColor();
   displayCounter.innerHTML = "WIN";
   on = false;
   win = true;
}

strictBtn.addEventListener('click', (e) => {
   strict = strictBtn.checked ? true : false;
})

onBtn.addEventListener('click', (e) => {
   if (onBtn.checked === true) {
      displayCounter.innerHTML = '-';
      on = true;
   } else {
      displayCounter.innerHTML = '';
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
   buttonPush(0);
})

red.addEventListener('click', (e) => {
   buttonPush(1);
})

gold.addEventListener('click', (e) => {
   buttonPush(2);
})

blue.addEventListener('click', (e) => {
   buttonPush(3);
})

function buttonPush(buttonNumber) {
   if(on){
      playerOrder.push(buttonNumber);
      check()
      action(colors[buttonNumber]);
      if(!win){
         setTimeout(() => {
            clearColor();
         },300)
      }
   }
}  