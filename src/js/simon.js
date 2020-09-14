let userScores =[];
let bestScores =[];
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
let userName;

const numberOfLevels = 100;

const displayCounter = document.getElementById('level');
const pads = document.getElementById('pads');
const green = document.getElementById('green');
const red = document.getElementById('red');
const gold = document.getElementById('gold');
const blue = document.getElementById('blue');
const onBtn = document.getElementById('on-btn');
const startBtn = document.getElementById('start-btn');
const strictBtn = document.getElementById('strict-btn');
const activePlayer = document.getElementById('activePlayer');
const btnIntro = document.getElementById('btn-intro');
const intro = document.getElementById('intro');

const colors = [
   {pad: green, normal: 'green', press: 'green--on', clip: 'green-sound'},
   {pad: red, normal: 'red', press: 'red--on', clip: 'red-sound'},
   {pad: gold, normal: 'gold', press: 'gold--on', clip: 'gold-sound'},
   {pad: blue, normal: 'blue', press: 'blue--on', clip: 'blue-sound'},
]

/* --------------------------------------------------------------------------------------------
  Muestra los mejores puntajes en el juego (hasta 10 mejores resultados de todos los jugadores)
----------------------------------------------------------------------------------------------*/
function showBestScores(best){
   let i = 1;
   const bestScore = document.getElementById('best-score')
   bestScore.innerHTML ='';
   best.forEach(best => {
      bestScore.innerHTML  += `<li> ${i}.- ${best.player} ${best.score}</li>`
      i++;
      })
}

/* -----------------------------------------------------------------------------------------
  Si el usuario esta registraso muestra sus mejores puntajes (se guardan los diez mejores)
------------------------------------------------------------------------------------------*/
function showUserScores(user){
   const userTitle = document.getElementById('user-title')
   const userScore = document.getElementById('user-score')
   userTitle.innerHTML = ` ${userName} scores`;
   userScore.innerHTML ='';
   for(let i = 0; i < user.length; i++){
      userScore.innerHTML  += `<li> ${i+1}.- ${user[i]}</li>`
   }
}

/* -----------------------------------------------------------------------------------------
  Inicializa las variables y comienza el juego
------------------------------------------------------------------------------------------*/
function play(){
   win = false;
   gameOrder = [];
   playerOrder = []
   flash = 0;
   intervalId = 0;
   level = 1;
   displayCounter.innerHTML = 1;
   good = true;

   // se genera un numero aleatorio entre 0 - 3 paa inidcar la jugada de la computadora
   gameOrder.push(Math.floor(Math.random() * 4 ));

   for (let i = 0; i < 4; i++){
      action(colors[i]);
   }

   compTurn = true;
   intervalId= setInterval(gameTurn, 800);
}

/* ---------------------------------------------------------------------------------------------------
  Se repite la secuenca de luces de la computadora (y se genera la proxima luz a de la computadora
----------------------------------------------------------------------------------------------------*/
function gameTurn(){
   on = false;
   activePlayer.innerHTML = 'It is computer turn';
   activePlayer.classList = 'activePlayer activePlayer--show';
   
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
         if(gameOrder[flash] === 0) action(colors[0]);  // produce el sonido y el parpadeo del color 
         if(gameOrder[flash] === 1) action(colors[1]);
         if(gameOrder[flash] === 2) action(colors[2]);
         if(gameOrder[flash] === 3) action(colors[3]);
         flash++;
      },200)
   }
}

// produce el sonido y el parpadeo del color 
function action(colors){
   if (noise) document.getElementById(colors.clip).play();
   noise = true;
   colors.pad.classList.add(`${colors.press}`);
}

// "apaga" las luces al quitar la clase del color que este "encendido" 
function clearColor(){
   for (let i = 0; i < colors.length; i++){
      colors[i].pad.classList.remove(`${colors[i].press}`);
   }
}

// "prende" la luces al agregar la clase del color que esta "apagado" 
function flashColor(){
   for (let i = 0; i < colors.length; i++){
      colors[i].pad.classList.add(`${colors[i].press}`);
   }
}

// produce el sonido de error cuando el jugado se equivoca en la secuencia
function errorSound(){
   if (noise) document.getElementById('error').play();
   noise = true;
}

/*----------------------------------------------------------------------------------------------
En esta funcion se verifica :
1.- si el jugador hizo la secuencia de manera correcta (good)
2.- Si se alcanzo el nivel numberOfLevels (100) sin cometer errores y asi gana el juego
    en caso que no se ha alcanzado el nivel 100, se genera la proxima jugada del computador
3.- Si se ha equivocado en la secuencia y el modo de juego es estricto
       guarda el resultado e inicializa el nivel
    en caso que no es estricto se repite la secuencia y permite al jugador seguir en el nivel
-----------------------------------------------------------------------------------------------*/
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

/*-------------------------------------------------------------------------------------
   Se ordenan los resultados y almacen en el localstorage (se toman solo los 10 mejores)
--------------------------------------------------------------------------------------*/
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

/*-------------------------------------------------------------------------------------
   Si se alcanza las 100 niveles sin error se finaliza el juego
--------------------------------------------------------------------------------------*/
function winGame(){
   flashColor();
   displayCounter.innerHTML = "WIN";
   on = false;
   win = true;
}

/*-------------------------------------------------------------------------------------
   Se verifica si se introduce un nombre para iniciar el juego y mostrar 
   los resultados almacenados en el localstorage
--------------------------------------------------------------------------------------*/
btnIntro.addEventListener('click', (e) => {
   e.preventDefault()

   userName = document.getElementById('user').value.trim();
   const scores = document.getElementById('scores');
   const activePlayer = document.getElementById('activePlayer');
   const msgErrors = document.getElementById('msg-errors');

   bestScores = JSON.parse(localStorage.getItem('bestScore')) || null;
   console.log('bestscore= ', bestScores)

   if (userName === 0  || userName === null || userName === '') {
      msgErrors.innerHTML = ' Enter your name to play';
   } else{
      userScores = JSON.parse(localStorage.getItem(`userScore-${userName}`))|| null;
      if (userScores !== null){
         scores.classList.add('scores--show');
         activePlayer.classList.add('activePlayer--show');
         showUserScores(userScores);
      }
      intro.classList.remove('intro--show')
   }

   if (bestScores !== null) showBestScores(bestScores);
});


/*-------------------------------------------------------------------------------------
   El switch de modo de juego estricto
--------------------------------------------------------------------------------------*/
strictBtn.addEventListener('click', (e) => {
   strict = strictBtn.checked ? true : false;
})

/*-------------------------------------------------------------------------------------
   El switch para encender el juego
--------------------------------------------------------------------------------------*/
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

/*-------------------------------------------------------------------------------------
   Si se pulsa el boton de iniciar el juego
--------------------------------------------------------------------------------------*/
startBtn.addEventListener('click', (e) => {
   if (on || win) {
      play();
   };
})

// si se pulsa algun panel del juego
pads.addEventListener('click', (e) => {
   switch (e.target.id) {
      case 'green':
         buttonPush(0);
         break;
      case 'red':
         buttonPush(1);
         break;
      case 'gold':
         buttonPush(2);
         break;
      case 'blue':
         buttonPush(3);
         break;
      default:
         break;
   }
})

/*----------------------------------------------------------------------------------------
   Si el juego esta "prendido"
      se agrega al array de la secuencia del jugador y se verifica la misma 
      se produce el sonido del color y el parpadeo del mismo
-----------------------------------------------------------------------------------------*/
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