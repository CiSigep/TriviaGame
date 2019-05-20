var game;
var questions = [];

// Map for setting up questions of the specified type. 
var questionTypes = {
    trueFalse: {
        setup(question, gameObject) {

        }
    },

    multipleChoice: {
        setup(question, gameObject) {

        }
    }
}

$(function() {
    game = {
        // Variables
        correct: -1,
        numberCorrect: 0,
        numberIncorrect: 0,
        totalAnswered: 0,
        time: 0,
        runningTimer: false,
        interval: 0,

        // Functions
    
        // Start the timer if it isn't already running
        startInterval() {
            if(!this.runningTimer){
                this.renderTimer();
                this.interval = setInterval(function() {
                    game.decrementTimer();
                }, 1000);
            }
        },

        // Countdown function
        decrementTimer() {
            this.time--;

            this.renderTimer();
            // Timer reached zero without an answer, incorrect
            if(this.time === 0) {
                this.stopInterval();
                this.incorrect();
            }
        },

        // Stops the interval.
        stopInterval() {
            this.runningTimer = false;
            clearInterval(this.interval);
        },

        // Renders remaining time to the user.
        renderTimer(){
            $('#time').text(this.time);
        },

        // Player gave incorrect answer or ran out of time.
        incorrect() {
            this.numberIncorrect++;
        },

        // Get and Set
        setTimer(time) {
            this.time = time;
        },

        setCorrect(correct) {
            this.correct = correct;
        }

    };

    $('#testTimer').click(function () {
        game.setTimer(30);
        game.startInterval();
    });
});