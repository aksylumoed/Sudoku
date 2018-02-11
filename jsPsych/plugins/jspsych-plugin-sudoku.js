



// -----------------------------------------------------------------------------------





jsPsych.plugins["sudoku_trial"] = (function() {

  var plugin = {};
  
  plugin.info = {
    name: "sudoku_trial",
    parameters: {
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: -1,
        description: 'How long to show the trial.'
      },
    }
  }

  plugin.trial = function(display_element, trial) {



    var new_html = '<div class="wrap"><button type="button" class"js-solve-all-btn">solve</button>';

    new_html += '<div id="sudoku" class"=sudoku-board"></div>'; 

    new_html += '<span id="time"></span></div>';


    display_element.innerHTML = new_html; 

    reset();

    var  mySudokuJS = $("#sudoku").sudokuJS({
      boardSize: 9
      ,boardFinishedFn: function(){
      //ONLY IF board was solved by solver:
      //data.difficultyInfo {
      //  level: "easy", "medium", "hard"
      //  ,score: int [experimental]
      //}
      Clock.pause();
      alert("Good!");
      mySudokuJS.generateBoard("medium");
      reset();
    }
      
    });
    
    $(".js-solve-all-btn").on("click", mySudokuJS.solveAll); 

    function end_trial() {

      jsPsych.pluginAPI.clearAllTimeouts();

      // gather the data to store for the trial
      var trial_data = {
        parameter_name: 'parameter value'
      };

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };
    
    if (trial.trial_duration > 0) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.trial_duration);
    }

  };

  return plugin;
})();
