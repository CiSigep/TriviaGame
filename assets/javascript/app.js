var game;


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

        questions: [
            {
                type: "truth",
                displayType: "True/False",
                question: "This is a true/fase type question",
                timeGiven: 15,
                correctAnswer: 0,
                answers: ["True", "False"]
            },
            {
                type: "multi",
                displayType: "Multiple Choice",
                question: "This is a multiple choice type question",
                timeGiven: 15,
                correctAnswer: 0,
                answers: ["one", "two", "three", "four"]
            }
        ],

        // Functions

        // Setup view for question
        questionSetup(test) {
            $('#questionType').text(this.questions[test].displayType);
            $('#question').text(this.questions[test].question);
            this.setTimer(this.questions[test].timeGiven);
            this.setCorrect(this.questions[test].correctAnswer);

            var answerArea = $('#answers');
            answerArea.empty();

            for(var i = 0; i < this.questions[test].answers.length; i++){
                var answerBox = $('<div>');
                answerBox.text(this.questions[test].answers[i]);
                if(this.questions[test].type === "multi")
                    answerBox.addClass("col-12");
                else if(this.questions[test].type === "truth")
                    answerBox.addClass("col-6");
                    
                answerBox.addClass('answer-box');
                answerBox.data('which', i);

                answerArea.append(answerBox);
            }

            // Add click event to the boxes.
            $('.answer-box').click(function(){
                game.checkAnswer($(this).data('which'));
            });

            this.startInterval();
        },
    
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

        checkAnswer(answer){
            this.stopInterval()
            if(answer === this.correct)
                this.numberCorrect++;
            else
                this.numberIncorrect++;
        },

        // Player timed out
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

    $('#truth').click(function(){
        game.questionSetup(0);
    });

    $('#multi').click(function(){
        game.questionSetup(1);
    });

});