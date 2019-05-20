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
        numberUnanswered: 0,
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
                this.timeout();
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

        toggleView() {
            $('.question-block').toggleClass('d-none');
            $('.answer-block').toggleClass('d-none');
        },

        showResults(){
            $('.question-block').addClass('d-none');
            $('.answer-block').addClass('d-none');
            $('.results-block').toggleClass('d-none');
        },

        // Player gave incorrect answer
        incorrect() {
            this.numberIncorrect++;
        },

        timeout() {
            this.numberUnanswered++;
        },

        // Get and Set
        setTimer(time) {
            this.time = time;
        },

        setCorrect(correct) {
            this.correct = correct;
        }

    };

    $('#toggler').click(function() {
        game.toggleView();
    });

    $('#results').click(function() {
        game.showResults();
    })

});