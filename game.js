document.addEventListener('DOMContentLoaded', function() {
  const playerName = localStorage.getItem('playerName') || 'Player';
  const gameLevel = localStorage.getItem('gameLevel');
  let attempts = parseInt(localStorage.getItem('attempts'), 10);
  const mineCount = gameLevel === 'hard' ? 20 : 10;

  let bombChances = gameLevel === 'hard' ? 1 : 3;

    // تحضير/استادعاء الأصوات
  const clickSound = document.getElementById('clickSound');
  const winSound = document.getElementById('winSound');
  const loseSound = document.getElementById('loseSound');



  // عرض اسم اللاعب وعدد المحاولات وعدد فرص القنبلة على الصفحة
  document.getElementById('playerNameDisplay').textContent = `Player: ${playerName}`;
  document.getElementById('attemptsDisplay').textContent = `Attempts left: ${attempts}`;
  document.getElementById('bombChancesDisplay').textContent = `Bomb chances left: ${bombChances}💣`;

  
  // تحديد مكان لعرض الرسائل (فوز أو خسارة)
  const messageDisplay = document.getElementById('messageDisplay');
  // دالة لعرض الرسائل (فوز أو خسارة)
  function showMessage(message, isWin) {
    messageDisplay.textContent = message;
    if (isWin) {
      messageDisplay.classList.remove('lose-message');
      messageDisplay.classList.add('win-message');
    } else {
      messageDisplay.classList.remove('win-message');
      messageDisplay.classList.add('lose-message');
    }
    messageDisplay.style.display = 'block';
  }
    
  

    // دالة لإخفاء الرسائل
  function hideMessage() {
    const messageDisplay = document.getElementById('messageDisplay');
    messageDisplay.style.display = 'none';
  }
  



  // تعريف شبكة الأزرار
  const grid = document.querySelector('.grid');
  const buttons = [];


// إنشاء 64 زر (شبكة بحجم 8x8)
  for (let i = 0; i < 64; i++) {
    const button = document.createElement('button');
    button.addEventListener('click', () => handleButtonClick(button, i));
    grid.appendChild(button);
    buttons.push(button);
  }


  // تحديد المواقع العشوائية للكنز والقنابل
  const indices = [...Array(64).keys()];
  shuffleArray(indices);

  const treasureIndex = indices.pop();
  const mineIndices = indices.splice(0, mineCount);
  let foundTreasure = false;


  // زر إعادة اللعبة
  const restartButton = document.getElementById('restartButton');

  function handleButtonClick(button, index) {
    if (button.classList.contains('clicked')) return;
    hideMessage();
    button.classList.add('clicked');
    clickSound.currentTime = 0;
    clickSound.play();

    // نصوص حكمة عشوائية
    const wisdomTexts = [
      "A smile is a free way to brighten someone’s day.",
      "You are perfect because of your imperfections.",
      "The journey is the reward.",
      "Believe in yourself and all that you are.",
      "You are stronger than you think.",
    ];

    // دالة لاختيار حكمة عشوائية
    function getRandomWisdom() {
      const randomIndex = Math.floor(Math.random() * wisdomTexts.length);
      return wisdomTexts[randomIndex];
    }
    
    // التحقق إذا تم العثور على الكنز
    if (index === treasureIndex) {
      button.textContent = '💎';
      button.style.backgroundColor = 'blue';
      winSound.currentTime = 0;
      winSound.play();
      setTimeout(() => {
        const wisdomText = getRandomWisdom(); 
        showMessage(`You found the treasure!  (${wisdomText})\nYou win! `, true);
        showMessage(`Congratulations! You found the treasure! (${wisdomText})\nYou win`, true);

    }, 500);
     
    foundTreasure = true;
    disableAllButtons();
   restartButton.style.display = 'inline-block';
      return;

    // التحقق إذا تم الضغط على قنبلة
    } else if (mineIndices.includes(index)) {
      bombChances--;
    document.getElementById('bombChancesDisplay').textContent = `Bomb chances left: ${bombChances}`;
    if (bombChances > 0) {
      button.textContent = '💣';
      button.style.backgroundColor = 'red';
     // loseSound.currentTime = 0;
      loseSound.play();
      setTimeout(() => {
        showMessage(`Boom! You hit a mine! ${bombChances} chances left.`, false);
      }, 500);
   restartButton.style.display = 'inline-block';

  } else {
    button.textContent = '💣';
    button.style.backgroundColor = 'red';
    loseSound.currentTime = 0;
    loseSound.play();
    setTimeout(() => {
      showMessage('Boom! You hit a mine and lost all chances!', false);
      setTimeout(() => {
        let countdown = 20;
        const countdownInterval = setInterval(() => {
          showMessage(`You lost! Redirecting to end page in ${countdown} seconds.`, false);
          countdown--;
          if (countdown === 0) {
            clearInterval(countdownInterval);
            window.location.href = 'end.html';
          }
        }, 1000);
      }, 500);
    }, 500);
    restartButton.style.display = 'inline-block';
    disableAllButtons();
    return;
  }


    // في حالة الضغط على زر ليس كنز أو قنبلة
   } else {
      button.textContent = '✔️';
     button.style.backgroundColor = 'white'; 

    }

    
  
    // تقليل عدد المحاولات
    attempts--;
    document.getElementById('attemptsDisplay').textContent = `Attempts left: ${attempts}`;
    if (attempts === 0 ) {
        if (foundTreasure) {
        winSound.currentTime = 0;
        winSound.play();
        const wisdomText = getRandomWisdom();
        setTimeout(() => {
          showMessage(`Congratulations! You found the treasure! (${wisdomText})\nYou win`, true);
        }, 500);
        disableAllButtons();
        restartButton.style.display = 'inline-block';
      
      } else{
      loseSound.currentTime = 0;
      loseSound.play();
      setTimeout(() => {
        showMessage('No more attempts left! You lose!', false);
        setTimeout(() => {
          let countdown = 20;
          const countdownInterval = setInterval(() => {
            showMessage(`You lost! Redirecting to end page in ${countdown} seconds.`, false);
            countdown--;
            if (countdown === 0) {
              clearInterval(countdownInterval);
              window.location.href = 'end.html';
            }
          }, 1000);
        }, 500);
      }, 500);
      disableAllButtons();
      restartButton.style.display = 'inline-block';
      disableAllButtons();
      restartButton.style.display = 'inline-block'; 


       // التحقق من الخلايا المجاورة للقنابل وتلوينها باللون البرتقالي
  }
    }  else {const nearbyMines = getNearbyMines(index);
      if (nearbyMines.length > 0  && !mineIndices.includes(index) && index !== treasureIndex) {
        button.style.backgroundColor = 'orange';
      }
     }
 
         // التحقق من الخلايا المجاورة للكنز وتلوينها بالأخضر
     const nearbyTreasureIndices = getNearbyTreasure(index);
      if (nearbyTreasureIndices ){
        showMessage('You are close to the treasure!',true);
         button.style.backgroundColor = ' green';
     }
   }

 
  function getNearbyMines(index) {
    const row = Math.floor(index / 8);
    const col = index % 8;
    const neighbors = [-1, 0, 1];
    let nearbyMines = [];

    neighbors.forEach(dr => {
      neighbors.forEach(dc => {
        const newRow = row + dr;
        const newCol = col + dc;
        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
          const newIndex = newRow * 8 + newCol;
         if (mineIndices.includes(newIndex)) {
          nearbyMines.push(newIndex);
        }

        }
      });
    });

    return nearbyMines;
  }



  

  function getNearbyTreasure(index) {
    const row = Math.floor(index / 8);
    const col = index % 8;
    const neighbors = [-1, 0, 1];
    let nearbyTreasure = false;
   

    neighbors.forEach(dr => {
      neighbors.forEach(dc => {
        if (dr !== 0 || dc !== 0) {

        const newRow = row + dr;
        const newCol = col + dc;
        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
          const neighborIndex = newRow * 8 + newCol;
          if (neighborIndex === treasureIndex) {
           nearbyTreasure = true;


         

          }
        }
      }
      });
    });

    return nearbyTreasure;

  }
 
  

  function disableAllButtons() {
    buttons.forEach(button => {
      button.classList.add('clicked');
    });
  }



  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }


// عند الضغط على زر "إعادة اللعبة"
restartButton.addEventListener('click', function() {
  window.location.reload(); 
});


  // زر العودة إلى الصفحة الرئيسية
  document.getElementById('homeButton').addEventListener('click', function() {
    window.location.href = 'home.html';
  });

  //زر الخروج من اللعبة
  document.getElementById('quitButton').addEventListener('click', function() {
    window.location.href = 'end.html';
  });
});
      