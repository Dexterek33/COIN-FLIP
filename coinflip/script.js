document.addEventListener('DOMContentLoaded', () => {
    // Game elements
    const coin = document.getElementById('coin');
    const flipButton = document.getElementById('flip-button');
    const yellowChoice = document.getElementById('yellow-choice');
    const blueChoice = document.getElementById('blue-choice');
    const result = document.getElementById('result');
    const yellowWins = document.getElementById('yellow-wins');
    const blueWins = document.getElementById('blue-wins');

    // Game state
    let playerChoice = '';
    let isFlipping = false;
    let scores = {
        yellow: 0,
        blue: 0
    };

    // Sound effects (optional - uncomment if you want sound)
    /*
    const flipSound = new Audio('flip.mp3');
    const winSound = new Audio('win.mp3');
    const loseSound = new Audio('lose.mp3');
    */

    // Function to enable/disable choice buttons
    const setChoiceButtonsState = (disabled) => {
        yellowChoice.disabled = disabled;
        blueChoice.disabled = disabled;
        if (!disabled) {
            yellowChoice.style.opacity = '1';
            blueChoice.style.opacity = '1';
            playerChoice = '';
        }
    };

    // Function to update scores
    const updateScores = (winner) => {
        scores[winner]++;
        document.getElementById(`${winner}-wins`).textContent = scores[winner];
    };

    // Function to handle the coin flip
    const flipCoin = () => {
        return new Promise((resolve) => {
            const outcome = Math.random() < 0.5 ? 'yellow' : 'blue';
            
            // Reset any existing transforms
            coin.style.transform = 'rotateY(0deg)';
            
            // Force a reflow
            void coin.offsetWidth;
            
            // Add the animation class
            coin.classList.add('animate');
            
            // Listen for animation end
            const handleAnimationEnd = () => {
                coin.classList.remove('animate');
                coin.style.transform = `rotateY(${outcome === 'blue' ? '180deg' : '0deg'})`;
                coin.removeEventListener('animationend', handleAnimationEnd);
                resolve(outcome);
            };
            
            coin.addEventListener('animationend', handleAnimationEnd);
        });
    };

    // Choice button event listeners
    yellowChoice.addEventListener('click', () => {
        if (!isFlipping) {
            playerChoice = 'yellow';
            yellowChoice.style.opacity = '1';
            blueChoice.style.opacity = '0.5';
            result.textContent = '';
        }
    });

    blueChoice.addEventListener('click', () => {
        if (!isFlipping) {
            playerChoice = 'blue';
            blueChoice.style.opacity = '1';
            yellowChoice.style.opacity = '0.5';
            result.textContent = '';
        }
    });

    // Flip button event listener
    flipButton.addEventListener('click', async () => {
        if (isFlipping) return;
        
        if (!playerChoice) {
            result.textContent = 'Choose your team first!';
            result.style.color = '#ff4444';
            result.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => result.style.animation = '', 500);
            return;
        }

        // Start flip
        isFlipping = true;
        setChoiceButtonsState(true);
        flipButton.disabled = true;
        result.textContent = '';

        try {
            const outcome = await flipCoin();
            
            // Determine if player won
            const hasWon = playerChoice === outcome;
            
            // Update scores
            updateScores(outcome);
            
            // Optional: Play win/lose sound
            // hasWon ? winSound.play() : loseSound.play();
            
            // Display result with animation
            result.style.animation = 'fadeIn 0.5s ease-in-out';
            result.textContent = hasWon 
                ? `🎉 You won! ${outcome.toUpperCase()} team takes it!` 
                : `😔 ${outcome.toUpperCase()} team wins. Try again!`;
            result.style.color = hasWon ? '#2ecc71' : '#ff4444';

            // Reset for next round
            isFlipping = false;
            flipButton.disabled = false;

            // Re-enable choice buttons after a delay
            setTimeout(() => {
                setChoiceButtonsState(false);
                result.style.animation = '';
            }, 1500);
        } catch (error) {
            console.error('Error during coin flip:', error);
            result.textContent = 'Something went wrong. Please try again.';
            isFlipping = false;
            flipButton.disabled = false;
            setChoiceButtonsState(false);
        }
    });

    // Add keypress support for better UX
    document.addEventListener('keydown', (e) => {
        if (isFlipping) return;
        
        switch(e.key.toLowerCase()) {
            case 'y':
                yellowChoice.click();
                break;
            case 'b':
                blueChoice.click();
                break;
            case ' ':
            case 'enter':
                flipButton.click();
                break;
        }
    });
}); 