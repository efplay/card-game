newFunction();

function newFunction() {
    document.addEventListener("DOMContentLoaded", () => {
        const cards = document.querySelectorAll(".card"), timeTag = document.querySelector(".time b"), flipsTag = document.querySelector(".flips b"), refreshBtn = document.querySelector('.refresh-btn');
        const startOverBtn = document.querySelector('.start-over-btn');

        let maxTime = 60;
        let timeLeft = maxTime;
        let flips = 0;
        let matchedPairs = 0;
        let disableDeck = false;
        let isPlaying = false;
        let cardOne, cardTwo, timer;

        function handleTimeEnd() {
            clearInterval(timer);
            alert("Time's out!");
            disableDeck = true;
        }

        function updateTimerDisplay() {
            timeTag.innerText = timeLeft;
        }

        function resetTimer() {
            timeLeft = maxTime;
            updateTimerDisplay();
            clearInterval(timer);
        }

        function initTimer() {
            if (timeLeft <= 0) {
                handleTimeEnd();
                return;
            }
            timeLeft--;
            updateTimerDisplay();
        }

        function flipCard({ target: clickedCard }) {
            if (!isPlaying) {
                startTimer();
                isPlaying = true;
            }

            if (canFlipCard(clickedCard)) {
                handleFlip(clickedCard);

                if (!cardOne) {
                    cardOne = clickedCard;
                    return;
                }

                cardTwo = clickedCard;
                disableDeck = true;
                checkMatch(cardOne, cardTwo);
            }
        }

        function startTimer() {
            timer = setInterval(initTimer, 1000);
        }

        function canFlipCard(clickedCard) {
            return clickedCard !== cardOne && !disableDeck && timeLeft > 0 && !clickedCard.classList.contains("flip");
        }

        function handleFlip(clickedCard) {
            flips++;
            updateFlipsDisplay();
            clickedCard.classList.add("flip");
        }

        function updateFlipsDisplay() {
            flipsTag.innerText = flips;
        }

        function checkMatch(cardOne, cardTwo) {
            const cardOneIcon = cardOne.querySelector(".back-view i").classList.value;
            const cardTwoIcon = cardTwo.querySelector(".back-view i").classList.value;

            if (cardOneIcon === cardTwoIcon) {
                matchedPairs++;
                cardOne.removeEventListener('click', flipCard);
                cardTwo.removeEventListener('click', flipCard);
                resetSelection();

                if (matchedPairs === 6) {
                    clearInterval(timer);
                    alert("You won!");
                }
            } else {
                setTimeout(() => {
                    cardOne.classList.remove("flip");
                    cardTwo.classList.remove("flip");
                    resetSelection();
                }, 1000);
            }
        }

        function resetSelection() {
            cardOne = cardTwo = null;
            disableDeck = false;
        }

        function resetGame() {
            resetTimer();
            flips = 0;
            matchedPairs = 0;
            disableDeck = false;
            isPlaying = false;
            cardOne = cardTwo = null;

            updateFlipsDisplay();
            timeTag.innerText = maxTime;

            shuffleCards();
        }

        function shuffleCards() {
            timeLeft = maxTime;
            flips = matchedPairs = 0;
            cardOne = cardTwo = null;
            clearInterval(timer);
            timeTag.innerText = timeLeft;
            flipsTag.innerText = flips;
            disableDeck = isPlaying = false;

            let arr = ["bxl-tiktok", "bxl-instagram-alt", "bxl-facebook-circle", "bxl-twitter", "bxl-whatsapp", "bxl-youtube"];
            arr = [...arr, ...arr];
            arr.sort(() => Math.random() > 0.5 ? 1 : -1);

            cards.forEach((card, index) => {
                card.classList.remove("flip");
                let iconTag = card.querySelector(".back-view i");
                iconTag.classList.value = `bx ${arr[index]}`;
                card.addEventListener("click", flipCard);
            });
        }
        startOverBtn.addEventListener('click', resetGame);
        refreshBtn.addEventListener('click', resetGame);
        shuffleCards();
    });
}

