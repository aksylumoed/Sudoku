



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
      board_size: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Board Size',
        default: 'boards2x2',
        description: 'Size of the board to be generated.'
      },
      board_set: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Board Set',
        default: '',
        description: 'So there are no repeats in randomization.'
      },
      timer: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Timer',
        default: true,
        description: 'Remove timer.'
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    var boards = []


    var boards2x4 = [

      
      [6, ,7,1, ,3,4, 
      , , , ,3, ,5, ,8
      , ,2,8, ,4, ,1, 
      ,8, ,4,6, , , ,3
      ,5,8,6,4, ,2,3, 
      , ,6, , ,3, ,2,4
      ,7,4,3,2, ,1,8,5
      ,2, ,1,8, ,4, ,6    //have undefined on last (if empty) cell
      ],

      [ ,1, ,5,4, ,3, 
      ,3,4,1, ,8, ,2,
      ,2, ,6,8,3,5, ,1
      ,5, , ,3, , ,6,7
      , , ,3, ,7,8,1,6
      ,7,6, ,1,2, , , 
      ,8, ,7,4, ,1, ,2
      ,1, ,8, , ,3,7,undefined      //have undefined on last (if empty) cell
      ],

      [6,3, ,7,2, ,8,4
      , , ,8, ,7, , ,2
      ,2,7,3,6, ,8,5, 
      , ,1,2, ,5,3, ,7
      ,3, , ,8,1, , ,5
      ,7,6, ,2, ,5, ,3
      ,1,8,4, ,3,2,7, 
      ,5, , ,3, ,4, ,7    //have undefined on last (if empty) cell
      ],

      [3,2,1,5, ,6, ,4
      , ,7, ,4, , ,8,3
      ,4, ,8, ,1,7,2, 
      , ,8,2,7, ,4, ,1
      ,6, ,4, ,, 2,3, 
      , ,6, , ,3, ,2,4
      ,7,4,3,2, ,1,8,5
      ,2, ,1,8, ,4, ,6    //have undefined on last (if empty) cell
      ],

      [2, ,6, ,4,5,7, 
      , ,6,7, ,2,8, , 
      ,4, , ,8, , ,2,6
      ,3, ,1,2,7, , , 
      , ,2, ,6, ,7,3,8
      , ,3,2, ,8, ,7, 
      ,6, , ,7,5, , ,2
      , ,1, ,5, ,2,4,undefined  //have undefined on last (if empty) cell
      ],

      [4, ,1, , ,7, ,8
      ,1,8,6, , ,5,2, 
      , ,5,2,7,1, ,6, 
      ,3,7,8, ,6, ,5,1
      ,7,3,5,1, ,6, ,2
      ,6, , ,3,2, ,8, 
      , ,4, ,8,7, ,1,6    //have undefined on last (if empty) cell
      ,8, ,4, ,5, ,7,undefined
      ],

      [4,3,2, , ,5,1, 
      , , , ,4,8, , ,2 
      ,5, ,8,3, ,6,7,4
      , ,2, ,7, ,4,5,6
      , ,7,4, ,1, , ,5
      ,2,8, ,5, ,7,6, 
      , ,4,6,1, ,2, ,7    //have undefined on last (if empty) cell
      ,1,5,7, , ,8,4,undefined
      ],

      [6, ,7, ,5,1, ,8
      ,8,3, ,5,7, ,1, 
      ,7, , ,1, ,2,4, 
      ,1,2,3, ,8, , ,7
      ,2, ,5, ,6,3, ,4
      , ,6, ,8,4, ,2, 
      ,3,8,6,4, ,5, ,     //have undefined on last (if empty) cell
      , , ,2,3,1, ,6,5
      ],

      [2,3, ,8, ,7,5, 
      ,8, ,5, ,4,2, ,6
      , ,6,2,1, ,5,8, 
      ,5, , ,3,1, , ,4
      ,7, ,8,6,5, ,4, 
      ,3,8,1, , ,6, ,5 
      , , , ,5,8,3,1,2    //have undefined on last (if empty) cell
      ,1,5,3, , ,4,6,undefined
      ],

      [8, , ,3, ,6,7, 
      ,2,7,6, ,8, , ,5
      , , , ,5,2,1,8, 
      ,5, ,8,2, ,7,6, 
      ,7,5,3, ,6, , ,8
      , ,6, ,8, ,4,5,7
      ,3, ,4, ,7,5,2,     //have undefined on last (if empty) cell
      ,4,2, ,7, , ,3,6
      ],

      [2,5, ,6,3, , ,4
      , ,4, ,2,6, ,1, 
      ,3, ,4, ,2,7, ,8
      , ,1,5,3, , , ,6
      ,6, , ,7,1,2,4,5
      ,5,7,2, ,8,3, , 
      , ,2, ,8, ,6,3,6    //have undefined on last (if empty) cell
      ,1, ,6, , ,4, ,undefined
      ],

      [2, ,1,5, ,3, ,8
      ,7,1, ,6,8, ,2, 
      , , ,7, ,2, ,5,3
      ,5, ,2,8,4,7, , 
      ,6,7, ,3, , ,8,2
      ,3, ,4,1,7, , ,5
      , ,2,8,7, ,6,3,     //have undefined on last (if empty) cell
      ,1, ,6, ,3,8, ,7
      ],
      
      [6,7,1, , ,5,8,4
      ,8,2,5, ,4, , ,1
      , ,1, ,2, ,8,5, 
      ,5, ,8,6,7,1, ,2
      ,1,6, ,4,8, ,2, 
      ,2,3,6, ,5,4, ,8
      , ,8, ,5, , ,4,3    //have undefined on last (if empty) cell
      ,4, ,7,8,3,2, ,6
      ],

      [7,3, ,5, ,2,8,4
      ,2, ,1, , ,6,7,3
      ,5, , ,2,3, , , 
      , ,1,8, ,4, ,5, 
      ,3, , ,6, , ,1, 
      ,4,7,3,1,8, ,2,6
      , ,6,5, , ,3, ,7    //have undefined on last (if empty) cell
      ,8, ,4, ,6,1, ,5
      ],

      [ ,4,1, ,6, ,5,3
      ,6, ,5,3,7, ,4, 
      ,7,3, ,2, ,4, ,1
      , ,5,6, ,3, ,8, 
      ,8,7,3,5,2, ,1, 
      ,3,1, , ,2,5, ,6
      ,4, ,7,1,8, ,2,5    //have undefined on last (if empty) cell
      , ,2, ,6, ,7, ,8
      ],
      
    ]



    var boards2x2 = [

      [4, ,3, 
      ,3,1, , 
      , ,3,2,4
      , , ,1,undefined
      ],

      [1,4,3, 
      , ,3,4, 
      ,3, ,2, 
      , ,2, ,undefined
      ],

      [1, ,3,4
      , , , ,1
      , ,4, , 
      ,3,1, ,2
      ],

      [ ,1,2, 
      , ,2, ,4
      ,1, , ,2
      , , ,3,1
      ],

      [4,3, ,1
      , ,1, , 
      ,1, , ,3
      , ,4, ,2
      ],  

      [ , ,4, 
      ,4,2, , 
      ,2,4, ,3
      , ,3,2,undefined
      ],                    // 5

      [1, , ,3
      , ,2, ,1
      , ,3,1, 
      ,2, , ,4
      ],

      [ , ,3, 
      ,4, ,2, 
      , ,1, ,3
      ,3,4,1,undefined
      ],

      [4, , ,3
      ,2, ,4, 
      ,1,2,3, 
      , , , ,2
      ],

      [ , ,4, 
      ,1,4, ,3
      ,2, ,1, 
      ,4, ,3,undefined
      ],

      [1, ,4,2
      ,4, , , 
      ,3, , ,1
      , ,1,3,undefined
      ],                    // 10

      [2,3,4, 
      , ,4, , 
      ,3, , , 
      ,4, ,1,3
      ],

      [ , ,4, 
      ,3, ,2, 
      , ,3,1,4
      ,4, ,3,undefined
      ],

      [1,3, ,4
      , , ,1, 
      , ,2,3, 
      ,4, , ,2
      ],                    // EDIT

      [ , ,3,2
      ,2,3, , 
      , ,1, ,4
      , ,2, ,3
      ]

    ]

    var boards2x3 = [

      [1,2, , ,3,5
      , ,3, ,2,4, 
      ,4, ,3, ,6, 
      ,2,6, , ,5, 
      ,5,1, ,6, ,3
      ,3, ,2,5, ,6
      ],

      [4, , ,2, , 
      ,5,1, ,4,2, 
      ,3, ,5, ,4,1
      ,2,4, , ,1,3
      ,6, ,2,1,5, 
      , ,5, ,3, ,2
      ],

      [2,6, , ,1,5
      , , ,5,2, , 
      , ,5, ,1,2,4
      ,6,4, ,3, ,1
      , ,3,1,6,4, 
      ,1, , , ,3,6
      ],

      [ ,4, ,2,6,3
      ,3, , ,6, , 
      ,6,5,3, , ,2
      , ,3, ,1,5, 
      ,2,1, ,5, ,4
      , , ,4,3,2,1
      ],

      [2,5,3,1, , 
      ,1, ,4, ,2,5
      , , ,2,5,1, 
      ,1,6, , ,5, 
      , , ,5,2,3,6
      ,5,2, , , ,1
      ],                    // EDIT

      [ ,3,2, ,1, 
      ,6, ,5,1,4,3
      ,5, , ,3, , 
      , ,6,1,5,2, 
      ,2,5,6, ,3, 
      , ,4, ,2, ,6
      ],

      [ , , , ,2, 
      ,2,4, ,3,6,1
      , ,3,2,6, ,5
      , ,6,1,4,3, 
      ,4,1,3, ,5,6
      , , , ,5,1,undefined
      ],

      [6, ,5,3,2,4
      , ,5,2, , ,3
      ,3,2, , ,5, 
      , , , ,1,6, 
      , ,4, ,2,3,5
      ,2,6,3, , ,1
      ],

      [5, ,3, , ,1
      ,3,6,5,1, , 
      ,1, , ,4,3,5
      ,2, ,4, ,5,3
      ,6, , ,3,1, 
      , ,3, ,5, ,6
      ],

      [2,5, ,3, ,4
      ,6, , ,5,1,3
      , , ,4, , , 
      ,5,1, ,2,4, 
      ,3,2,6, , ,1
      ,4, , ,1,3,2
      ],

      [ ,3, ,1,6,5
      , ,1,3, ,2, 
      ,4,6,5, , ,3
      ,6,5,2,3,4, 
      , , ,1, ,5,6
      , ,2, , , ,2
      ],

      [5,6,2, ,3,4
      ,3,2,4, , , 
      , ,1, ,6, , 
      , ,5,6,3,4, 
      ,1, ,5, , ,2
      ,6,4, ,2, ,3
      ],


      [1, ,2, , ,4
      , ,2,5, ,3, 
      ,3, , ,1,5, 
      ,5,6,4, ,1,3
      , ,3,1,5,4, 
      ,4,1,3, , ,5
      ],

      [ ,5,6,1, ,4
      ,2, ,3, ,6,3
      ,4, , ,2,1, 
      ,1, ,4, ,5, 
      , ,4,1, ,3, 
      ,5,3, ,6, ,1
      ],

      [6,5, , ,1,5
      ,3, ,1,5,6, 
      , ,1,6, , ,5
      ,1,4, , ,3, 
      ,2,3,4, , ,6
      ,5, ,3,2, ,1
      ],

      [4, ,3,1,5,2
      ,2, , ,5, ,6
      ,5,3,2,6,1, 
      ,6, ,1,3, ,5
      , ,4,5, ,6,1
      ,1,5,6,4, ,3
      ],

    ]



   var b2x2A = boards2x2.slice(0,5),
       b2x2B = boards2x2.slice(5,10),
       b2x2C = boards.slice();






    if (trial.board_size == 'boards2x4'){
      boards = boards2x4;
    } else if (trial.board_size == 'boards2x3') {
      boards = boards2x3;
    } else {
      boards = boards2x2;
    }

    if (trial.board_set == 'a'){
      boards = boards.slice(0,5);
    } else if (trial.board_set == 'b'){
      boards = boards.slice(5,10);
    } else if (trial.board_set == 'c'){
      boards = boards.slice(10,15);
    } else {
      boards = boards.slice(15,16);
    }



    /* var lastnr = 0;

    var randnr = function () {
      var getrandnr = Math.floor(Math.random() * boards2x2.length);
      if(getrandnr != lastnr){
        lastnr = getrandnr;
        return getrandnr;
      } else {
        return Math.floor(Math.random() * boards2x2.length);
      }
    };

    var rand = randnr(); */

    // $('link[title=jscss]').prop('disabled',true);

    var new_html = '';

    new_html = '<body><div class="wrap">';

    new_html += '<div id="sudoku" class"=sudoku-board">'; 

    if(trial.timer){
      new_html += '<span id="time"></span>';
    } else {
      new_html += '<span id="time" style="color:white"></span>';
    }

    new_html += '</div>';

    new_html += '<p id="result"></p></body>';


    display_element.innerHTML = new_html; 

    reset();

    if (trial.board_size == 'boards2x3'){
      document.getElementById('x2').disabled  = true;
      document.getElementById('x4').disabled  = true;
    } else if (trial.board_size == 'boards2x2') {
      document.getElementById('x3').disabled  = true;
      document.getElementById('x4').disabled  = true;
    } else if (trial.board_size == 'boards2x4') {
      document.getElementById('x2').disabled  = true;
      document.getElementById('x3').disabled  = true;
    } 
    document.getElementById('sudocss').disabled  = false;
    document.getElementById('jscss').disabled = true;



    var index = Math.floor(Math.random() * boards.length);

    var success = false;

    var mySudokuJS = $("#sudoku").sudokuJS({
      board: boards[index],
      //boardSize: 8,
      boardFinishedFn: function(){
      
      Clock.pause();
      alert("Congratulations! You got this one right!");
      success = true;
      end_trial();

    
      }
      
    });
    

    function end_trial() {

      jsPsych.pluginAPI.clearAllTimeouts();

      // gather the data to store for the trial
      var trial_data = {
        board_size:trial.board_size,
        board_set: trial.board_set,
        board_no: index,
        success: success
      };

      // clear the display
      display_element.innerHTML = '';

      document.getElementById('sudocss').disabled  = true;
      document.getElementById('jscss').disabled = false;
      document.getElementById('x2').disabled  = false;
      document.getElementById('x3').disabled  = false;
      document.getElementById('x4').disabled  = false;


      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };
    
    if (trial.trial_duration > 0) {
      jsPsych.pluginAPI.setTimeout(function() {
        alert('Unfortunately, you did not solve this puzzle.')
        end_trial();
        
      }, trial.trial_duration);
    }

  };

  

  return plugin;
})();
