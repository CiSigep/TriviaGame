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
                question: "Duna is the planet the Kerbals are from.",
                timeGiven: 10,
                correctAnswer: 1,
                answers: ["True", "False"]
            },
            {
                type: "multi",
                displayType: "Multiple Choice",
                question: "What is the lowest stable circular orbit you can achieve over Kerbin?",
                timeGiven: 15,
                correctAnswer: 2,
                answers: ["100km", "80km", "70km", "150km"]
            },
            {
                type: "truth",
                displayType: "True/False",
                question: "Laythe has an atmosphere.",
                timeGiven: 10,
                correctAnswer: 0,
                answers: ["True", "False"]
            },
            {
                type: "multi",
                displayType: "Multiple Choice",
                question: "Which one of these is a starting Kerbonaut when you start a new game?",
                timeGiven: 15,
                correctAnswer: 1,
                answers: ["Kim Kerman", "Jebediah Kerman", "Arthur Kerman", "Timothy Kerman"]
            },
            {
                type: "multi",
                displayType: "Multiple Choice",
                question: "Which one of these is not a moon of Jool?",
                timeGiven: 15,
                correctAnswer: 2,
                answers: ["Laythe", "Tylo", "Gilly", "Bop"]
            },
            {
                type: "multi",
                displayType: "Multiple Choice",
                question: "This planet has a 4.6km hole near its north pole.",
                timeGiven: 15,
                correctAnswer: 3,
                answers: ["Kerbin", "Eeloo", "Duna", "Moho"]
            },
            {
                type: "truth",
                displayType: "True/False",
                question: "Jool is a Gas Giant.",
                timeGiven: 10,
                correctAnswer: 0,
                answers: ["True", "False"]
            },
            {
                type: "truth",
                displayType: "True/False",
                question: "It is possible to reach Minmus' orbit from its ground level with just the Kerbonaut's jetpack.",
                timeGiven: 10,
                correctAnswer: 0,
                answers: ["True", "False"]
            },
            {
                type: "multi",
                displayType: "Multiple Choice",
                question: "How many moons does Kerbin have?",
                timeGiven: 15,
                correctAnswer: 1,
                answers: ["1 moon", "2 moons", "3 moons", "4 moons"]
            },
            {
                type: "multi",
                displayType: "Multiple Choice",
                question: "Which of these objects has the lowest gravitational force.",
                timeGiven: 15,
                correctAnswer: 0,
                answers: ["Gilly", "Kerbol", "Ike", "Tylo"]
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
                    
                answerBox.addClass('answer-box p-2 text-center clickable-div');
                answerBox.data('which', i);

                answerArea.append(answerBox);
            }

            // Add click event to the boxes.
            $('.answer-box').click(function(){
                game.checkAnswer($(this).data('which'));
            });

            this.startIntervalQuestion();
        },

        renderAnswer(isCorrect){
            var img = $('#resultImage');
            var select = Math.floor(Math.random() * 3);
            if(isCorrect){
                img.attr('src', 'assets/images/correct-' + select + '.gif');
                img.attr('alt', 'Correct');
            }
            else{
                img.attr('src', 'assets/images/incorrect-' + select + '.gif');
                img.attr('alt', 'Incorrect');
            }

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

        // Swaps between the queston and answer views
        toggleView() {
            $('.question-block').toggleClass('d-none');
            $('.answer-block').toggleClass('d-none');
        },

        // Show results.
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
            var isCorrect = (answer === this.currentQuestion.correctAnswer);
            if(isCorrect){
                $('#status').text('Correct!');
                this.numberCorrect++;
            }
            else {
                $('#status').text('Incorrect!');
                this.numberIncorrect++;
            }

            this.renderAnswer(isCorrect);
        },

        // Player timed out
        timeout() {
            $('#status').text('Time is up!');
            this.numberUnanswered++;
            this.renderAnswer(false);
        },

        // Reset the quiz
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

    $('#start').click(function(){
        game.start();
    });

    $('#reset').click(function(){
        game.reset();
    });

});