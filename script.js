class MemoryGame{
    constructor(){
        this.cards = ['🎈', '🎯', '🎲', '🎮', '🎵', '🎨', '🎭', '🎪'];
        this.gameBoard = document.getElementById('game-board');
        this.attemptsElement = document.getElementById('attempts');
        this.timerElement = document.getElementById('timer');
        this.matchesElement = document.getElementById('matches');
        this.gameMessage = document.getElementById('game-message');
        this.resetBtn = document.getElementById('reset-btn');
        this.playAgainBtn = document.getElementById('play-again-btn');
        this.pauseBtn = document.getElementById('pause-btn');
        this.resumeBtn = document.getElementById('resume-btn');

        this.elapsedPausedTime = 0;
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.attempts = 0;
        this.startTime = null;
        this.timerInterval = null;
        this.gameStarted = false;
        this.isProcessing = false;
        this.isPaused = false;

        this.init();
    }

    init(){
        this.createBoard();
        this.bindEvents();
        this.updateStats();
    }

    createBoard(){
        //Create pair of cards
        const cardPairs = [...this.cards, ...this.cards];
        //Shuffle the cards
        const shuffledCards = this.shuffle(cardPairs);

        this.gameBoard.innerHTML = '';

        shuffledCards.forEach((symbol,index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.symbol = symbol;
            card.dataset.index = index;

            card.innerHTML = `
                <div class="card-face card-back"></div>
                <div class="card-face card-front">${symbol}</div>
            `;

            card.addEventListener('click', () => this.flipCard(card));
            this.gameBoard.appendChild(card);
        });
    }

    shuffle(array){
        const shuffled = [...array];
        for(let i = shuffled.length - 1; i > 0; i--){
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    flipCard(card){
        // Prevent flipping if paused
        if (this.isPaused) return;
        
        //Prevent flipping if already processing or card is flipped/matched
        if(this.isProcessing || 
            card.classList.contains('flipped') || 
            card.classList.contains('matched') || 
            this.flippedCards.length >= 2){
            return;
        }

        //Start the game timer on the first flip
        if (!this.gameStarted){
            this.startGame();
        }

        //Add flip animation
        card.classList.add('flipped');
        this.flippedCards.push(card);

        //Check for match when two cards are flipped
        if(this.flippedCards.length === 2){
            this.attempts ++;
            this.updateStats();
            this.checkForMatch();
        }
    }

    checkForMatch(){
        this.isProcessing = true;
        const [card1, card2] = this.flippedCards;
        const symbol1 = card1.dataset.symbol;
        const symbol2 = card2.dataset.symbol;

        if(symbol1 === symbol2){
            //Cards match / Match found
            setTimeout(() => {
                card1.classList.add('matched', 'match-animation');
                card2.classList.add('matched', 'match-animation');

            //Remove match animation after it completes but keep matched class
                setTimeout(() => {
                    card1.classList.remove('match-animation');
                    card2.classList.remove('match-animation');
                }, 600);
                
                this.matchedPairs++;
                this.updateStats();
                this.flippedCards = []; // Reset flipped cards after match
                this.isProcessing = false;

                //Check if game is won
                if(this.matchedPairs === this.cards.length){
                    this.endGame();
                }
            }, 500);
        } else {
            // No match - show no-match animation before flipping back
            card1.classList.add('no-match');
            card2.classList.add('no-match');
            setTimeout(() => {
                setTimeout(() => {
                    card1.classList.remove('flipped', 'no-match');
                    card2.classList.remove('flipped', 'no-match');
                    this.flippedCards = [];
                    this.isProcessing = false;
                }, 500);
            }, 1200);
        }
    }

    startGame(){
        this.gameStarted = true;
        this.startTime = Date.now();
        this.elapsedPausedTime = 0;
        this.timerInterval = setInterval(() => {
            this.updateTimer();
        }, 1000);
    }

    updateTimer(){
        if(!this.startTime) return;
        //Calculate elapsed time including paused time
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000 + this.elapsedPausedTime / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;

        this.timerElement.textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    updateStats(){
        this.attemptsElement.textContent = this.attempts;
        this.matchesElement.textContent = `${this.matchedPairs} / ${this.cards.length}`;
    }

    endGame(){
        clearInterval(this.timerInterval);

        //Update final stats
        document.getElementById('final-attempts').textContent = this.attempts;
        document.getElementById('final-time').textContent = this.timerElement.textContent;

        //Show this celebration message 
        setTimeout(() => {
            this.gameMessage.style.display = 'flex';
            this.gameMessage.innerHTML = `
             <div>
                <h2>🎉Congratulations!🎉</h2>
                <p>You found all pairs!</p>
                <p>Attempts: <span>${this.attempts}</span></p>
                <p>Time: <span>${this.timerElement.textContent}</span></p>
                <button id="play-again-btn" class="play-again-btn">Play Again</button>
             </div>
            `;

            //Re-bind play again button
            document.getElementById('play-again-btn').addEventListener('click', () => {
                this.resetGame();
            });
        }, 1000);
    }

    resetGame(){
        //Reset game state
        this.elapsedPausedTime = 0;
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.attempts = 0;
        this.startTime = null;
        this.gameStarted = false;
        this.isProcessing = false;
        this.isPaused = false;

        //Clear timer
        clearInterval(this.timerInterval);
        this.timerInterval = null;

        //Hide game message
        this.gameMessage.style.display = 'none';
        this.gameMessage.innerHTML = '';

        //Reset timer display
        this.timerElement.textContent = '00:00';

        //Create a new board
        this.createBoard();
        this.updateStats();
    }

    bindEvents(){
        this.resetBtn.addEventListener('click', () => {
            this.resetGame();
        });

        this.playAgainBtn.addEventListener('click', () => {
            this.resetGame();
        });

        //Pause button functionality
        if(this.pauseBtn){
            this.pauseBtn.addEventListener('click', () => {
                this.pauseGame();
            });
        }

        //Resume button functionality
        if(this.resumeBtn){
            this.resumeBtn.addEventListener('click', () => {
                this.resumeGame();
            });
        }

        //Add keyboard support
        document.addEventListener('keydown', (event) => {
            if(event.key === 'Escape' && this.gameMessage.style.display === 'flex') {
                this.resetGame();
            }
        });
    }
    // Pause the game
    pauseGame() {
        if (this.isPaused || !this.gameStarted) return;
        clearInterval(this.timerInterval);
        //Store the elapsed paused time
        this.elapsedPausedTime += Date.now() - this.startTime;
        this.isPaused = true;
        this.gameBoard.classList.add('paused');
    }

    // Resume the game
    resumeGame() {
        if (!this.isPaused || !this.gameStarted) return;
        // Set startTime to now, so timer resumes from where it left off
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            this.updateTimer();
        }, 1000);
        this.isPaused = false;
        this.gameBoard.classList.remove('paused');
    }

}// <-- Close the MemoryGame class here

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new MemoryGame();
});

//Adding  extra visual effects
document.addEventListener('DOMContentLoaded', () => {
    //Add sparkle effect to matched cards
    const createSparkle = (x, y) => {
        const sparkle = document.createElement('div');
        sparkle.style.cssText = `
            position: fixed;
            top: ${y}px;
            left: ${x}px;
            width: 10px;
            height: 10px;
            background-color: gold;
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            animation: sparkleAnimation 1s ease-out forwards;
        `;
    
        // Example usage: add sparkles when a card is matched (optional)
        document.body.appendChild(sparkle);

            setTimeout(() => {
                sparkle.remove();
            }, 1000);
    };

    const style = document.createElement('style');
    style.textContent = `
        @keyframes sparkleAnimation {
            0% {
                transform: scale(1) rotate(0deg);
                opacity: 1;
            }
            50% {
                transform: scale(1) rotate(180deg);
                opacity: 1;
            }
            100% {
                transform: scale(0) rotate(360deg);
                opacity: 0;
            }
}
`;
    document.head.appendChild(style);

    //Listen for match events
    document.addEventListener('click', (event) => {
        if(event.target.closest('.card.matched')) {
            const rect = event.target.getBoundingClientRect();
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    createSparkle(
                        rect.left + rect.width / 2 + (Math.random() - 0.5) * 100,
                        rect.top + rect.height / 2 + (Math.random() - 0.5) * 100
                    );
                }, i * 100);
            }
        }
    });
});