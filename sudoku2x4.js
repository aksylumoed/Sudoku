(function (window, $, undefined) {


	'use strict';
	



	/**
	* Define a jQuery plugin
	*/
    $.fn.sudokuJS = function(opts) {

		/*
		 * constants
		 *-----------*/

		var DIFFICULTY_MEDIUM = "medium";

		var DIFFICULTIES = [
			DIFFICULTY_MEDIUM,
		],


		opts = opts || {};
		
		var	difficulty = "unknown",
			boardFinished = false,
			boardError = false,

			board = [],
			boardSize, //boardH*boardV
			boardNumbers,  // change to letters


			houses = [
				//hor. rows
				[],
				//vert. rows
				[],
				//boxes
				[]
			];


		var $board = $(this),
			$boardInputs; //created


		function log(msg){
			if(window.console && console.log)
			 console.log(msg);
		}


		var contains = function(a, obj) {
			for (var i = 0; i < a.length; i++) {
				if (a[i] === obj) {
					return true;
				}
			}
			return false;
		};


		/* isBoardFinished
		 * -----------------------------------------------------------------*/
		var isBoardFinished = function(){
			for (var i=0; i < boardSize*boardSize; i++){
				if(board[i].val === null)
					return false;
			}
			return true;
		};




		/* EDIT THIS */

		var generateHouseIndexList = function(){
        // reset houses
        houses = [
				//hor. rows
				[ /*[0,1,2,3,4,5,6,7], 
				[8,9,10,11,12,13,14,15], 
				[16,17,18,19,20,21,22,23], 
				[24,25,26,27,28,29,30,31],
				[32,33,34,35,36,37,38,39],
				[40,41,42,43,44,45,46,47],
				[48,49,50,51,52,53,54,55],
				[56,57,58,59,60,61,62,63]*/],
				//vert. rows
				[ /* [0,8,16,24,32,40,48,56],
				[4,9,17,25,33,41,49,57],
				[2,10,18,26,34,42,50,58],
				[3,11,19,27,35,43,51,59],
				[4,12,20,28,36,44,52,60],
				[5,13,21,29,37,45,53,61],
				[6,14,22,30,38,46,54,62],
				[7,15,23,31,39,47,55,33] */ ],
				//boxes
				[/*[0,1,8,9,16,17,24,25],
				[2,3,10,11,18,19,26,27],
				[4,5,12,13,20,21,28,29],
				[6,7,14,15,22,23,30,31],
				[32,33,40,41,48,49,56,57],
				[34,35,42,43,50,51,58,59],
				[36,37,44,45,52,53,60,61],
				[38,39,46,47,54,55,62,63] */]
			]
			

			for(var i=0; i < 8; i++){
				var hrow = [], //horisontal row
					vrow = [], //vertical row
					box = [],
					boardV = boardSize/2,
					boardH = 2;

				for(var j=0; j < boardSize; j++){
					hrow.push(boardSize*i + j);
					vrow.push(boardSize*j + i);

					if(j < boardV){
						for(var k=0; k < 2; k++){
							//0, 0,0, 27, 27,27, 54, 54, 54 for a standard sudoku
							//0, 0, 0, 0, 32, 32, 32, 32
							var a = Math.floor(i/boardV) * boardSize * boardV;
							//[0-2] for a standard sudoku
							var b = (i%boardV) * 2;
							var boxStartIndex = a + b;  // 0, 2, 4, 6, 32, 34, 36, 38
							//0 3 6 27 30 33 54 57 60 on standard sudoku


							box.push(boxStartIndex + boardSize*j + k);
						}
					}
				}
				houses[0].push(hrow);
				houses[1].push(vrow);
				houses[2].push(box);
			}  
		};


		/* initBoard
		 * --------------
		 *  inits board, variables.
		 * -----------------------------------------------------------------*/
		var initBoard = function(opts){
			var alreadyEnhanced = (board[0] !== null && typeof board[0] === "object");
			
      		boardNumbers = [];
			boardSize = Math.sqrt(board.length); //(!board.length && opts.boardSize) || Math.sqrt(board.length) || 9
			$board.attr("data-board-size", boardSize);

			/* if(boardSize % 1 !== 0 || Math.sqrt(boardSize) % 1 !== 0) {
				log("invalid boardSize: "+boardSize);
				if(typeof opts.boardErrorFn === "function")
					opts.boardErrorFn({msg: "invalid board size"});
				return;
			} */

			for (var i=0; i < boardSize; i++){
				boardNumbers.push(i+1);
			}
			generateHouseIndexList();

			if(!alreadyEnhanced){
				//enhance board to handle candidates, and possibly other params
				for(var j=0; j < boardSize*boardSize ; j++){
					var cellVal = (typeof board[j] === "undefined") ? null : board[j];
					board[j] = {
						val: cellVal,
						//title: "" possibl add in 'A1. B1...etc
					};
				}
			}
		};


		/* renderBoard
		 * --------------
		 *  dynamically renders the board on the screen (into the DOM), based on board variable
		 * -----------------------------------------------------------------*/
		var renderBoard = function(){
			//log("renderBoard");
			//log(board);
			var htmlString = "";
			for(var i=0; i < boardSize*boardSize; i++){
				htmlString += renderBoardCell(board[i], i);

				

				if((i+1) % boardSize === 0) {
					htmlString += "<br>";
				}

			}
			//log(htmlString);
			$board.append(htmlString);

			//save important board elements
			$boardInputs = $board.find("input");
		};



		/* renderBoardCell
		 * -----------------------------------------------------------------*/
		var renderBoardCell = function(boardCell, id){
			var val = (boardCell.val === null) ? "" : String.fromCharCode(64 + boardCell.val);
			var maxlength = (boardSize < 9) ? " maxlength='1'" : "";
			if(val){

				return"<div class='sudoku-board-cell'>" +
						"<input type='text' pattern='[A-Z]' novalidate id='input-"+id+"' value='"+val+"'readonly>" +
						// "<div id='input-"+id+"-candidates' class='candidates'>" + candidatesString + "</div>" +
					  "</div>";
			} else {
				if (boardSize == 4){
					return "<div class='sudoku-board-cell'>" +
						"<input type='text' onkeypress='return ((event.charCode >= 65 && event.charCode <= 68) || (event.charCode >= 97 && event.charCode <= 100))' oninput='this.value = this.value.toUpperCase()' novalidate id='input-"+id+"' value='"+val+"'"+maxlength+">" +
						//"<div id='input-"+id+"-candidates' class='candidates'>" + candidatesString + "</div>" +
					   "</div>";
				} else if (boardSize == 6){
					return "<div class='sudoku-board-cell'>" +
						"<input type='text' onkeypress='return ((event.charCode >= 65 && event.charCode <= 70) || (event.charCode >= 97 && event.charCode <= 102))' oninput='this.value = this.value.toUpperCase()' novalidate id='input-"+id+"' value='"+val+"'"+maxlength+">" +
						//"<div id='input-"+id+"-candidates' class='candidates'>" + candidatesString + "</div>" +
					   "</div>";
				} else {
					return "<div class='sudoku-board-cell'>" +
						"<input type='text' onkeypress='return ((event.charCode >= 65 && event.charCode <= 72) || (event.charCode >= 97 && event.charCode <= 104))' oninput='this.value = this.value.toUpperCase()' novalidate id='input-"+id+"' value='"+val+"'"+maxlength+">" +
						//"<div id='input-"+id+"-candidates' class='candidates'>" + candidatesString + "</div>" +
					   "</div>";
				}	
			}
			
		};


		var updateUIBoard = function(paintNew){
			
			$boardInputs
				.removeClass("highlight-val")
				.each(function(i,v){
					var $input = $(this);
					var newVal = board[i].val;
					//if(newVal && parseInt($input.val()) !== newVal) {
						$input.val(newVal);
						if(paintNew)
							$input.addClass("highlight-val");
					//}
					
				});
		};



		/* updateUIBoardCell -
		 * --------------
		 *  updates ONE cell on the board with our latest values
		 * -----------------------------------------------------------------*/
		 var updateUIBoardCell = function(cellIndex, opts){
			opts = opts || {};


			var newVal = board[cellIndex].val;

			$("#input-"+cellIndex)
				.val(newVal)
				.addClass("highlight-val");
			//}
		};



		var resetBoardVariables = function() {
			boardFinished = false;
			boardError = false;

		};

		/* clearBoard
		-----------------------------------------------------------------*/
		var clearBoard = function(){
			resetBoardVariables();

			//reset board variable

			for(var i=0; i <boardSize*boardSize;i++){
				board[i] = {
					val: null,
				};
			}

			//reset UI
			$boardInputs
				.removeClass("highlight-val")
				.val("");

			updateUIBoard(false);
		};

		var setBoardCell = function(cellIndex, val){
			var boardCell = board[cellIndex];
			//update val
			boardCell.val = val;
			
		};


		var indexInHouse = function(digit, house){
			for(var i=0; i < boardSize; i++){
				if(board[house[i]].val===digit)
					return i;
			}
			//not in house
			return false;
		};



		/* housesWithCell
		 * --------------
		 *  returns houses that a cell belongs to
		 * -----------------------------------------------------------------


		 		EDIT THIS 		*/

		var housesWithCell = function(cellIndex){
			// var boxSideSize = Math.sqrt(boardSize);
			var boardV = boardSize/2;
			var houses = [];
			//horisontal row
			var hrow = Math.floor(cellIndex/boardSize);
			houses.push(hrow);
			//vertical row
			var vrow = Math.floor(cellIndex%boardSize);
			houses.push(vrow);
			//box
			var box = (Math.floor(hrow/boardV)*boardV) + Math.floor(vrow/2);
			houses.push(box);

			return houses;
		};


		







		/* keyboardMoveBoardFocus - puts focus on adjacent board cell
		 * -----------------------------------------------------------------*/
		var keyboardMoveBoardFocus = function(currentId, keyCode){
			var newId = currentId;
			//right
			if(keyCode ===39)
				newId++;
			//left
			else if(keyCode === 37)
				newId--;
			//down
			else if(keyCode ===40)
				newId = newId + boardSize;
			//up
			else if(keyCode ===38)
				newId = newId - boardSize;

			//out of bounds
			if(newId < 0 || newId > (boardSize*boardSize))
				return;

			//focus input
			$("#input-"+newId).focus();
		};


		/* keyboardNumberInput - update our board model
		 * -----------------------------------------------------------------*/
		var keyboardNumberInput = function(input, id){
			var val = input.val().charCodeAt() - 64;
			


			if (val > 0) { //invalidates Nan
				//check that this doesn't make board incorrect
				var temp = housesWithCell(id);
				//for each type of house
				for(var i=0; i < houses.length; i++){

					if(indexInHouse(val, houses[i][temp[i]])){
						//digit already in house - board incorrect with user input
						// log("board incorrect!");
						var alreadyExistingCellInHouseWithDigit = houses[i][temp[i]][indexInHouse(val, houses[i][temp[i]])];

						//this happens in candidate mode, if we highlight on ui board before entering value, and user then enters before us.
						if(alreadyExistingCellInHouseWithDigit === id)
							continue;

						$("#input-" + alreadyExistingCellInHouseWithDigit + ", #input-"+id)
							.addClass("board-cell--error");
						//make as incorrect in UI

						//input was incorrect, so don't update our board model
						return;
					}
				}

				
				
				//update board
				
				board[id].val = val;

				//check if that finished board
				if(isBoardFinished()){
					boardFinished = true;
					if(typeof opts.boardFinishedFn === "function"){
						opts.boardFinishedFn({
							//we rate the board via what strategies was used to solve it
							//we don't have this info if user solved it, unless we
							//always analyze board on init.. but that could be slow.

							//difficultyInfo: null
						});
					}
				}
			} else {
				boardError = false; //reset, in case they fixed board - otherwise, we'll find the error again
				val = null;
				//add back candidates to UI cell
				
				//needs to happen before we resetCandidates below
				board[id].val = val;

				//update candidates (if we could reverse remove candidates from this cell and outwards, we wouldn't have to redo all board)
			}
			//log(board[1].candidates);

			//HACK: remove all errors as soon as they fix one - the other cells just get emptied on board (in UI; already were null in model)
			if($("#input-"+id).hasClass("board-cell--error"))
				$boardInputs.removeClass("board-cell--error");

			if(typeof opts.boardUpdatedFn === "function")
				opts.boardUpdatedFn({cause: "user input", cellsUpdated: [id]});

			
		};






		/*
		 * init/API/events
		 *-----------*/
		if(opts.board) {
			board = opts.board;
			initBoard(opts);
			renderBoard();
		}


		$boardInputs.on("keyup", function(e){
			var $this = $(this);
			var id = parseInt($this.attr("id").replace("input-",""));
			//allow keyboard movements
			if(e.keyCode >=37 && e.keyCode <= 40){// || e.keyCode ===48){
				keyboardMoveBoardFocus(id, e.keyCode);
			}
		});
		//listen on change because val is incorrect all the time on keyup, because have to filter out all other keys.
		$boardInputs.on("change", function(){
			var $this = $(this);
			var id = parseInt($this.attr("id").replace("input-",""));
			keyboardNumberInput($this, id);
		});



		var getBoard = function(){
			return board;
		};

		var setBoard = function(newBoard){
      		clearBoard(); // if any pre-existing
			board = newBoard;
			initBoard();
			//visualEliminationOfCandidates();
			updateUIBoard(false);
		};


		return {
			
			clearBoard : clearBoard,
			getBoard : getBoard,
			setBoard : setBoard,

			/* solveAll : solveAll,
			solveStep : solveStep,
			analyzeBoard : analyzeBoard,
			hideCandidates : hideCandidates,
			showCandidates : showCandidates,
			setEditingCandidates: setEditingCandidates,
			generateBoard : generateBoard */
		};
	};


})(window, jQuery);





















































		
		


		