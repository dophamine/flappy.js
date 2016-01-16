$(document).ready(function game() {

	function update () {

		topBarrier = nextBarrier[0].children('.top');
		botBarrier = nextBarrier[0].children('.bot');
		Bird.top = bird.position().top;
		Bird.left = bird.position().left;
		Barrier.topper.left = topBarrier.position().left;
		Barrier.botter.top = botBarrier.position().top;
		Barrier.botter.left = botBarrier.position().left;
		Barrier.topper.topH = parseInt(topBarrier.css('height'));
	}

	function sound (type) {
		var audio = new Audio(); 
		audio.src = '/assets/sounds/' + type +'.mp3'; 
		audio.autoplay = true;
		audio.volume = 0.2;
	}

	function stop (){
		$('.barrier').each(function (i,el) {
			$(el).children().clearQueue().stop();
		});
		$("#bg").addClass('stop');
		birdAnim.addClass('stop');
		clearInterval(tubeTimer);
		clearInterval(gameTimer);
		$("#result strong").html(points);
		$("#points").fadeOut('fast');
		$("#result").fadeIn('slow');
	}

	function jump () {
		bird.stop().animate({top: '-=100'},300).animate({top: '+=1000'},1500);
		birdAnim.stop().animate({transform: 'rotate(-35deg'},300).animate({transform: 'rotate(155deg'},1500);
		sound('flap');
	}

	function rand (min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function generateTubes () {
		var barrier = $('.barrier').last();
		var deltaH = rand(0,150);
		var delta = !!rand(0, 2) ? -1 : 1;
		var topH = tubeH - delta*deltaH;
		var botH = tubeH + delta*deltaH;
		
		
		if (!start) {
			nextBarrier.push(barrier);
		} else {
			start = false;
		}
		barrier.clone().insertAfter(barrier).children('.top').css({height: topH}).end().children('.bot').css({height: botH});
		barrier.children().animate({right: '+=1500'}, 8000, function () {
			$(this).parent().remove();
		});
		
	}

	function checkpoint () {
		if (Bird.left > (Barrier.topper.left + Barrier.topper.topW) && !cross) {
			points++;
			$('#points').html(points);
			cross = true;
			sound('bading');
			if (cross) {
				nextBarrier.shift();
				cross = false;
			}
		}
	}

	function collisionCheck () {
		if ((Bird.top + Bird.h) < gameElHeight) {
			if (((Bird.top + Bird.h) < Barrier.botter.top || (Bird.left + Bird.w) < Barrier.botter.left) && (Bird.top > Barrier.topper.topH || (Bird.left + Bird.w) < Barrier.topper.left)) {
				return true;
			} else {
				sound('smack');
				stop();
			}
		} else {
			sound('smack');
			stop();
		}
	}
	var topH = 0;
	var botH = 0;
	var cross = false;
	var start = true;
	var points = 0;
	var gameEl = $('#game');
	var gameElWidth = $('#game').width();
	var gameElHeight = $('#game').height();
	var nextBarrier = [$('.barrier')];
	var barrier = $('.barrier');
	var bg = $('#bg');
	var tubeH = 200;
	var TICK_RATE = 100;
	var bird = $('#bird');
	var birdAnim = $("#bird-anim");
	var topBarrier = nextBarrier[0].children('.top');
	var botBarrier = nextBarrier[0].children('.bot');

	var Bird = {
		h : bird.height(),
		w : bird.width()
	};

	var Barrier = {
			topper : {
				
				topW : topBarrier.width()
			},
			botter : {
				botH : botBarrier.height(),
				botW : botBarrier.width()
			}	
	};
	
	
	var tapped = false;
	$(document).keyup(function() {
		if (!tapped) {
			jump();
			tapped = true;
			setTimeout(function() {
				tapped = false;
			}, 300);
		}
	});
	

	generateTubes();
	var tubeTimer = setInterval(function () {
		generateTubes();
	},2000);
		

	var gameTimer = setInterval(function  () {
		update();
		collisionCheck();
		checkpoint();
	},TICK_RATE);


});


