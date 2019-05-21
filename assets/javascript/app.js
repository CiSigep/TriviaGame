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
                type: "trueFalse",
                displayType: "True/False",
                question: "This is a true/fase type question",
                timeGiven: 15,
                correctAnswer: 0
            },
            {
                type: "multipleChoice",
                displayType: "Multiple Choice",
                question: "This is a multiple choice type question",
                timeGiven: 15,
                correctAnswer: 0,
                answers: ["one", "two", "three", "four"]
            }
        ],

        // Map for setting up questions of the specified type. 
        questionTypes: {
            trueFalse: {
                setup(question, gameObject) {
                    // Set up variables
                    $('#questionType').text(question.displayType);
                    $('#question').text(question.question);
                    gameObject.setTimer(question.timeGiven);
                    gameObject.setCorrect(question.correctAnswer);

                    // Get the answer area and clear it
                    var answerArea = $('#answers');
                    answerArea.empty();

                    var trueBox = $('<div>');
                    var falseBox = $('<div>');

                    // Set up answers for comparison
                    trueBox.data("which", 0);
                    falseBox.data("which", 1);

                    trueBox.addClass('answer-box col-6');
                    falseBox.addClass('answer-box col-6');
                    trueBox.text('True');
                    falseBox.text('False');

                    answerArea.append(trueBox, falseBox);

                    // Add click event to the boxes.
                    $('.answer-box').click(function(){
                        gameObject.checkAnswer($(this).data('which'));
                    });

                    gameObject.startInterval();
                }
            },
        
            multipleChoice: {
                setup(question, gameObject) {
                    $('#questionType').text(question.displayType);
                    $('#question').text(question.question);
                    gameObject.setTimer(question.timeGiven);
                    gameObject.setCorrect(question.correctAnswer);

                    var answerArea = $('#answers');
                    answerArea.empty();

                    for(var i = 0; i < question.answers.length; i++){
                        var answerBox = $('<div>');
                        answerBox.text(question.answers[i]);
                        answerBox.addClass('answer-box col-12');
                        answerBox.data('which', i);

                        answerArea.append(answerBox);
                    }

                    // Add click event to the boxes.
                    $('.answer-box').click(function(){
                        gameObject.checkAnswer($(this).data('which'));
                    });

                    gameObject.startInterval();
                }
            }
        },

        // Functions

        questionSetup(test) {
            this.questionTypes[this.questions[test].type].setup(this.questions[test], this);
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