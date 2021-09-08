const width = 1000;
const height = width * 0.7;
const header = document.getElementById('header');
const cvs = document.getElementById('game');
const ctxH = header.getContext('2d');
const ctx = cvs.getContext('2d');

let playerName1 = 'Player 1';
let playerName2 = 'Player 2';
let pointsCounter1 = 0;
let pointsCounter2 = 0;

const headerHeight = height * 0.1;
const headerMiddle = headerHeight / 2;
const player1PosX = width / 2 - width / 4;
const player2PosX = width / 2 + width / 4;
const points1PosX = width / 2 - width / 20;
const points2PosX = width / 2 + width / 20;


const centerX = width / 2;
const centerY = height / 2;
const puckRadius = width / 50;

const boardWidth = width / 50;
const boardHeight = height / 5;
const board1PosX = 0;
const board2PosX = width - boardWidth;
const boardPosY = (height / 2) - (boardHeight / 2);


//НАЧАЛЬНЫЙ ЭКРАН--------------------------------------------------------------
function fadeOutEffect(fadeTarget){
	fadeTarget.style.animation = 'fadeOut 1s';
	setTimeout(() => {fadeTarget.style.display = 'none'}, 950);
};

window.addEventListener('load', startScreen);

function startScreen(){
	let startScreen = document.getElementById('startScreen');
	startScreen.style.display = 'flex';
	let inpP1 = document.getElementById('player1');
	let inpP2 = document.getElementById('player2');
	let startBtn = document.getElementById('start');
	let startEvent = startBtn.addEventListener('click', inputCheck);
	let startEvent2 = document.addEventListener('keydown', enterCheck);
	function enterCheck(event) {
		if(event.code == 'Enter'){
			inputCheck();
		}
	};
		
//Проверка	
	function inputCheck(){
		if(inpP1.value === '' || inpP1.value.length > 15){
			inpP1.value = '';
			return inpP1.focus();
		}
		else{
			playerName1 = inpP1.value;
		};
		
		if(inpP2.value === '' || inpP2.value.length > 15){
			inpP2.value = '';
			return inpP2.focus();	
		}
		else{
			playerName2 = inpP2.value;
		};

		startBtn.removeEventListener('click', inputCheck);
		document.removeEventListener('keydown', enterCheck);
		drawHeader();
		start();
		fadeOutEffect(startScreen);
	};

};

//---------------------------------------------------------------------------------------------------- 


//Построения--------------------------------------------------------------

header.setAttribute('width', width);
header.setAttribute('height', headerHeight);
cvs.setAttribute('width', width);
cvs.setAttribute('height', height);

ctx.fillStyle = 'black';
ctx.strokeStyle = '#fff';
ctx.lineWidth = 5;

function drawHeader(){
	ctxH.clearRect(0, 0, width, headerHeight);
	ctxH.fillStyle = '#fff';
	ctxH.font = `bold 50px sans-serif`;
	ctxH.textAlign = 'center';
	ctxH.textBaseline = 'middle';
	ctxH.fillText(playerName1, player1PosX, headerMiddle);
	ctxH.fillText(pointsCounter1, points1PosX, headerMiddle);
	ctxH.fillText(pointsCounter2, points2PosX, headerMiddle);
	ctxH.fillText(playerName2, player2PosX, headerMiddle);
};	

function start() {
	
	function gameStartCountdown(){
		let timeLeft = 3;
		let countdown = document.getElementById('countdown');
		countdown.style.display = 'block';
		let timer = setInterval(() => {
			if(timeLeft < 0){
				countdown.style.display = 'none';
				clearInterval(timer);
				return game();
			}
			else{
				if(timeLeft === 0){
					countdown.textContent = 'Go!';
				}
				else{
					countdown.textContent = timeLeft;
				};
				--timeLeft;
			};
		}, 1000);
	};
	gameStartCountdown();

	let paddle1 = {
		s: 12,
		y: boardPosY,
		w: boardWidth,
		h: boardHeight,
		upPressed: false,
		downPressed: false,
	};
	let paddle2 = {
		s: 12,
		y: boardPosY,
		w: boardWidth,
		h: boardHeight,
		upPressed: false,
		downPressed: false,
	};

	//Player 1
	document.addEventListener("keydown", keyDownHandler1, false);
	document.addEventListener("keyup", keyUpHandler1, false);
	
	function keyDownHandler1(e) {
		if(e.code == "ShiftLeft") {
			e.preventDefault();
			paddle1.upPressed = true;
		}
		else if(e.code == "ControlLeft") {
			paddle1.downPressed = true;
		}
	}
	function keyUpHandler1(e) {
		if(e.code == "ShiftLeft") {
			paddle1.upPressed = false;
		}
		else if(e.code == "ControlLeft") {
			paddle1.downPressed = false;
		}
	}
	
	function paddle1Move() {
		if(paddle1.upPressed){
			paddle1.y -= paddle1.s;
			if(paddle1.y < 0){
				paddle1.y = 0;
			}; 
		}
		else if(paddle1.downPressed){
			paddle1.y += paddle1.s;
			if(paddle1.y > height - paddle1.h){
				paddle1.y = height - paddle1.h
			};
		};
	};

	//Player 2
	document.addEventListener("keydown", keyDownHandler2, false);
	document.addEventListener("keyup", keyUpHandler2, false);
	
	function keyDownHandler2(e) {
		if(e.code == "ArrowUp") {
			paddle2.upPressed = true;
		}
		else if(e.code == "ArrowDown") {
			paddle2.downPressed = true;
		}
	}
	function keyUpHandler2(e) {
		if(e.code == "ArrowUp") {
			paddle2.upPressed = false;
		}
		else if(e.code == "ArrowDown") {
			paddle2.downPressed = false;
		}
	}
	
	function paddle2Move() {
		if(paddle2.upPressed){
			paddle2.y -= paddle2.s;
			if(paddle2.y < 0){
				paddle2.y = 0;
			}; 
		}
		else if(paddle2.downPressed){
			paddle2.y += paddle2.s;
			if(paddle2.y > height - paddle2.h){
				paddle2.y = height - paddle2.h;
			};
		};
	};

	//Шайба
	let puck = {
		x: centerX,
		y: centerY,
		sX: Math.round(Math.random() > 0.5? 5 : -5),
		sY: Math.floor(Math.random() * (8 - (-8) + 1)) + (-8),
		accel: 1.0001,
		r: puckRadius,
	};

	function puckMove() {
		puck.sX *= puck.accel;
		puck.x += puck.sX;
		puck.y += puck.sY;

		// вылетел ли мяч левее стены?
		if(puck.x < 0){
			pointsCounter2++;
			drawHeader();
			return ;
		};
		// вылетел ли мяч правее стены?
		if(puck.x + puck.r > width){
			pointsCounter1++;
			drawHeader();
			return;
		};
		// вылетел ли мяч выше потолка?
		if (puck.y - puck.r < 0) {
			puck.sY = -puck.sY;
			puck.y = 0 + puck.r;
		};
		// вылетел ли мяч ниже пола?
		if (puck.y + puck.r > height) {
			puck.sY = -puck.sY;
			puck.y = height - puck.r;
		}

		//столкнулся ли мяч с левой доской?
		if(puck.x - puck.r < paddle1.w 
		&& puck.y + puck.r > paddle1.y
		&& puck.y - puck.r < paddle1.y + paddle1.h){
			puck.sX = -puck.sX;
			puck.x = paddle1.w + puck.r;
			if(paddle1.upPressed && puck.sY < 0){
				puck.sY -= Math.abs(paddle1.s) / 10;
			}
			else{
				puck.sY += Math.abs(paddle1.s) / 10;
			};
		};
		// столкнулся ли мяч с правой доской?
		if(puck.x + puck.r > width - paddle2.w 
		&& puck.y + puck.r> paddle2.y 
		&& puck.y - puck.r < paddle2.y + paddle2.h
		){
			puck.sX = -puck.sX;
			puck.x = width - paddle2.w - puck.r;
			if(paddle2.upPressed && puck.sY < 0){
				puck.sY -= Math.abs(paddle2.s) / 10;
			}
			else{
				puck.sY += Math.abs(paddle2.s) / 10;
			};
		};
	};

	function drawGame(){
		ctx.clearRect(0, 0, width, height);

		ctx.beginPath();
		ctx.moveTo(centerX, 0);
	  	ctx.lineTo(centerX, height);
		ctx.stroke();

		ctx.fillStyle = '#fff';

		ctx.beginPath();
		ctx.arc(puck.x, puck.y, puck.r, 0, Math.PI*2, false);
		ctx.fill();

		ctx.fillRect(board1PosX, paddle1.y, paddle1.w, paddle1.h);	
		ctx.fillRect(board2PosX, paddle2.y, paddle2.w, paddle2.h);	
	};
	drawGame();

	function game() {
		if(puck.x < 0 || puck.x + puck.r > width){
			console.log('stop');
			puck.x = centerX;
			puck.y = centerY;
			pointsCounter1 === 5 || pointsCounter2 === 5? winner() : start();;
			return;
		};
		paddle1Move();
		paddle2Move();
		puckMove();
		drawGame();
		requestAnimationFrame(game);
	}
};

function winner() {
	let victorious;
	if(pointsCounter1 === 5){
		victorious = playerName1;
	}
	else if(pointsCounter2 === 5){
		victorious = playerName2;
	}
	fadeOutEffect(header);
	fadeOutEffect(cvs);
	let winner = document.getElementById('winner');
	winner.innerHTML = `<div>Winner is </div> <div>${victorious}</div>`;
	winner.style.display = 'flex';
}