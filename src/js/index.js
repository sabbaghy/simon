const mainNav = document.getElementById('nav__links');
const toggleMenu = document.getElementById('toggle-menu');
const navList = document.getElementById('nav__list');
const navItems = document.querySelectorAll('.nav__item');
const navLenght = navItems.length;
let menuOpen = false;

/*----------------------------------------------------------------
   Control animacion toggle menu
----------------------------------------------------------------*/
toggleMenu.addEventListener('click', () =>{
   mainNav.classList.toggle('show-menu');
   toggleMenu.classList.toggle('open');
   menuOpen ? menuOpen = false : menuOpen = true;
})

/* -----------------------------------------------------------------------------------------
  Revisa en que link se hizo click, busca el link que tenia la clase active para removerla 
  y luego agregarle al link donde se hizo click la clase active
------------------------------------------------------------------------------------------*/
navItems.forEach(link => {
   link.addEventListener('click', function(){
      navList.querySelector('.nav__item--active').classList.remove('nav__item--active');
      link.classList.add('nav__item--active');
      
      if (menuOpen) {
         mainNav.classList.toggle('show-menu');
         toggleMenu.classList.toggle('open');
         menuOpen = false;
      }
   })
});

/* -----------------------------------------------------------------------------------------
  si pulsa el btn de inicio para comenzar el juego
------------------------------------------------------------------------------------------*/
let userName;
const btnIntro = document.getElementById('btn-intro');
const intro = document.getElementById('intro');

/*
const bestScores = [
   {player: 'pepe', score: 100},
   {player: 'paco', score: 70},
   {player: 'juan', score: 50},
   {player: 'luis', score: 40},
   {player: 'maria', score: 20},
]

const userScorePepe = [100, 19, 10, 5, 3, 2];
const userScorePaco = [70, 15, 10, 5]; 
const userScoreMaria = [20, 10]; 


localStorage.setItem('bestScore', JSON.stringify(bestScores));
localStorage.setItem('userScore-Pepe', JSON.stringify(userScorePepe));
localStorage.setItem('userScore-Paco', JSON.stringify(userScorePaco));
localStorage.setItem('userScore-Maria', JSON.stringify(userScoreMaria));
*/



btnIntro.addEventListener('click', (e) => {
   e.preventDefault()
   
   userName = document.getElementById('user').value.trim();
   const scores = document.getElementById('scores');
   const bestScores = JSON.parse(localStorage.getItem('bestScore')) || null;
   if (bestScores !== null) showBestScores(bestScores);

   if (userName === 0  || userName === null || userName === '') {
      console.log('no se registra niveles')
   } else{
      scores.classList.add('scores--show');
      const userScores = JSON.parse(localStorage.getItem(`userScore-${userName}`))|| null; 
      if (userScores !== null) showUserScores(userScores);
   }

   intro.classList.remove('intro--show')
})

function showBestScores(best){
   const bestScore = document.getElementById('best-score')
   bestScore.innerHTML ='';
   best.forEach(best => {bestScore.innerHTML  += `<li> ${best.player} - ${best.score}</li>`})
}

function showUserScores(user){
   const userScore = document.getElementById('user-score')
   userScore.innerHTML ='';
   for(let i = 0; i < user.length; i++){
      userScore.innerHTML  += `<li> score ${i+1} = ${user[i]}</li>`
   }
}