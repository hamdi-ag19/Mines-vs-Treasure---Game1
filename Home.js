
// Play background music
const bgMusic = document.getElementById('bgMusic');
bgMusic.play().then(() => {
  console.log('Background music is playing.');
}).catch(error => {
  console.error('Error playing background music:', error);
});


document.addEventListener('DOMContentLoaded', function() {
  const easyButton = document.getElementById('easyButton');
  const hardButton = document.getElementById('hardButton');
  const gameLevelInput = document.getElementById('gameLevel');
  
  

  easyButton.addEventListener('click', function() {
    gameLevelInput.value = 'easy';
   easyButton.classList.add('selected');
    hardButton.classList.remove('selected', 'selected-hard');
    easyButton.classList.remove('selected-hard');
  });

  hardButton.addEventListener('click', function() {
    gameLevelInput.value = 'hard';
   hardButton.classList.add('selected', 'selected-hard');
    easyButton.classList.remove('selected');
    hardButton.classList.remove('selected');
 });

  document.getElementById('gameForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const playerName = document.getElementById('playerName').value;
    const gameLevel = gameLevelInput.value;
  
    
    localStorage.setItem('playerName', playerName);
    localStorage.setItem('gameLevel', gameLevel);

    window.location.href = 'game.html';
  });
  });

  let selectedLevel = null;

  document.getElementById('easyButton').addEventListener('click', function() {
    selectedLevel = 'easy';
    localStorage.setItem('gameLevel', 'easy');
    localStorage.setItem('attempts', '20');
  });

  document.getElementById('hardButton').addEventListener('click', function() {
    selectedLevel = 'hard';
    localStorage.setItem('gameLevel', 'hard');
    localStorage.setItem('attempts', '10');
  });

  document.getElementById('startGameButton').addEventListener('click', function() {
    const playerName = document.getElementById('playerNameInput').value;

    if (selectedLevel && playerName) {
      localStorage.setItem('playerName', playerName);
      window.location.href = 'game.html';
    } else {
      alert('Please enter your name and select a difficulty level before starting the game.');

    }
  });