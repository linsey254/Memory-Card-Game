🃏 Memory Card Game 🃏:


This is a classic memory card game built with vanilla HTML, CSS, and JavaScript. Test your memory by flipping cards to find matching pairs! The game tracks your attempts and time, and features a clean, responsive design with animations and effects.


🎮 How to Play:


Start the Game: Click on any card to begin. The timer will start automatically.

Flip Cards: Click on a card to flip it over and reveal its hidden symbol.

Find Pairs: Click on a second card. If the two cards have the same symbol, they'll stay flipped and a match is counted! If they don't match, they'll flip back over after a short delay.

Win: The game ends when you've successfully matched all 8 pairs of cards. A "Congratulations!" message will appear with your final stats.

New Game: Click the "New Game" button at any time to start fresh, or "Play Again" after you've won to restart.

Pause: Use the "Pause" button to temporarily stop the timer and the game. Click "Resume" to continue where you left off.


✨ Features:


Responsive Design: The game board and stats adjust to fit different screen sizes, from mobile phones to desktop monitors.

Game Stats: Keep track of your Attempts, Time, and Matches in real-time.

Animations: Smooth flipping animations, a pulse effect for matched cards, and a shake animation for incorrect pairs.

Pause & Resume: You can pause the game at any time, which stops the timer and blurs the board, allowing you to take a break without losing your progress.

Game-End Message: A celebratory message pops up when you win, displaying your final score.

Event-driven: Built with a JavaScript class for a clear, modular structure.


📁 Project Structure:


The project is organized into three main files:

index.html: The core HTML file that defines the structure of the game, including the header, stats, card grid, and the win message.

styles.css: This file contains all the styling for the game. It defines the layout, colors, fonts, and keyframe animations for the card flips and other effects. It includes a responsive design using @media queries.

script.js: This is the brain of the game. It's an object-oriented implementation (MemoryGame class) that handles all the game logic, such as shuffling cards, handling card clicks, checking for matches, managing the timer, and updating the UI.


🚀 Getting Started:


To run this project locally, simply clone the repository and open index.html in your web browser. There are no dependencies or build tools required.

'git clone <repository-url>
cd memory-card-game
open index.html'
