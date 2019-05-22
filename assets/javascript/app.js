var game;


$(function() {
    game = {
        // Variables
        numberCorrect: 0,
        numberIncorrect: 0,
        numberUnanswered: 0,
        currentQuestion: null,
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

        usedQuestions: [],

        // Functions
        start() {
            this.questionSetup();
            $('.start-block').toggleClass('d-none');
            $('.question-block').toggleClass('d-none');
        },

        // Setup view for question
        questionSetup() {
            var index = Math.floor(Math.random() * this.questions.length);
            this.currentQuestion = this.questions[index];
            this.questions.splice(index, 1);
            this.usedQuestions.push(this.currentQuestion);

            $('#questionType').text(this.currentQuestion.displayType);
            $('#question').text(this.currentQuestion.question);
            this.setTimer(this.currentQuestion.timeGiven);

            var answerArea = $('#answers');
            answerArea.empty();

            for(var i = 0; i < this.currentQuestion.answers.length; i++){
                var answerBox = $('<div>');
                answerBox.text(this.currentQuestion.answers[i]);
                if(this.currentQuestion.type === "multi")
                    answerBox.addClass("col-12");
                else if(this.currentQuestion.type === "truth")
                    answerBox.addClass("col-6");
                    
                answerBox.addClass('answer-box');
                answerBox.data('which', i);

                answerArea.append(answerBox);
            }

            // Add click event to the boxes.
            $('.answer-box').click(function(){
                game.checkAnswer($(this).data('which'));
            });

            this.startIntervalQuestion();
        },

        renderAnswer(){
            $('#correctAnswer').text(this.currentQuestion.answers[this.currentQuestion.correctAnswer]);
            this.toggleView();
            this.setTimer(5);
            this.startIntervalAnswer();
        },
    
        // Start the timer if it isn't already running
        startIntervalQuestion() {
            if(!this.runningTimer){
                this.renderTimer();
                this.interval = setInterval(function() {
                    game.decrementTimerQuestion();
                }, 1000);
                this.runningTimer = true;
            }
        },

        startIntervalAnswer(){
            this.interval = setInterval(function() {
                game.decrementTimerAnswer();
            }, 1000);
        },

        // Countdown functions
        decrementTimerQuestion() {
            this.time--;

            this.renderTimer();
            // Timer reached zero without an answer
            if(this.time === 0) {
                this.stopInterval();
                this.timeout();
            }
        },

        decrementTimerAnswer(){
            this.time--;
            if(this.time === 0) {
                this.stopInterval();
                if(this.questions.length > 0){
                    this.questionSetup();
                    this.toggleView();
                }
                else
                    this.showResults();
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
        
            $('#correct').text(this.numberCorrect);
            $('#incorrect').text(this.numberIncorrect);
            $('#unanswered').text(this.numberUnanswered);
            $('.results-block').toggleClass('d-none');
        },

        // Checks the players answer against the correct one
        checkAnswer(answer){
            if(!this.runningTimer)
                return;

            this.stopInterval()
            if(answer === this.currentQuestion.correctAnswer){
                $('#status').text('Correct!');
                this.numberCorrect++;
            }
            else {
                $('#status').text('Incorrect!');
                this.numberIncorrect++;
            }

            this.renderAnswer();
        },

        // Player timed out
        timeout() {
            $('#status').text('Time is up!');
            this.numberUnanswered++;
            this.renderAnswer();
        },


        reset() {
            this.questions = this.usedQuestions;
            this.usedQuestions = [];
            this.numberCorrect = 0;
            this.currentQuestion = null;
            this.numberIncorrect = 0;
            this.numberUnanswered = 0;
            this.time = 0;
            this.runningTimer = false;
            this.interval = 0;

            this.showStart();
        },

        showStart(){
            $('.results-block').toggleClass('d-none');

            $('.start-block').toggleClass('d-none');
        },

        // Get and Set
        setTimer(time) {
            this.time = time;
        }

    };

    $('.start').click(function(){
        game.start();
    });

    $('.reset').click(function(){
        game.reset();
    });

});