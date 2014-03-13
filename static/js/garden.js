//This is the empty variable array, that we will be pushing 
//new tweets to, everytime they come in from our python app 
var tweetsForDisplay = new Array();
var fortyeightReached;
var globalSinceId = 0;
var currentTweetNum;
var originalTime;
var TOTALDISPLAYTIME = 10000;
var TOTALRAINTIME = 10000;
var randomSelectedFlowers;
var flowerGif = new Array();

//Fire this functions when the document is ready. 
$(document).ready(function(){
	init();
	display();
}); 

function init() {
	if( tweetsForDisplay.length > 48 ) {
		var tempArray = new Array();
		for(var i = 48; i < tweetsForDisplay.length; i++ ) {
			tempArray.push(tweetsForDisplay[i]);
		}
		tweetsForDisplay = new Array ();
		tweetsForDisplay = tempArray;
	}
	else {
		tweetsForDisplay = new Array ();
	}
	
	fortyeightReached = false;
	currentTweetNum = 0;
	randomSelectedFlowers = new Array();
	originalTime = getCurrentMilliSeconds();
	for (var i = 0; i < 7; i++) {
		flowerGif.push('../static/img/gif_' + (i + 1) + '.gif');
	}	
	setupFlowers();
	startProcess();
	$('.fullrain').hide();
	$('#prompt').show();
}

function setupFlowers() {
	var imageTags = $('.image');
	for( var i = 0; i < imageTags.length; i++) {
		$(imageTags[i]).attr('src', flowerGif[parseInt(Math.random(0,7) * 7)]);
	}
}

function showFlower() {

	//grabbings all the images that have this tag in my html
	var imageTags = $('.image');
				
	//add the source randomly from our list 
	var randomPot = getRandomFlower();
	randomSelectedFlowers.push(randomPot);

	if( $(imageTags[randomPot]).parent().attr('id') == "pot1" || $(imageTags[randomPot]).parent().attr('id') == "pot4") {
		if( Math.random(0,1) > .5 ) {
			$(imageTags[randomPot]).animate( {
				height: '105px'
			}, 1000);
		}
		else {
			$(imageTags[randomPot]).animate( {
				height: '80px'
			}, 1000);
		}
	}
	else {
		if( Math.random(0,1) > .5 ) {
			$(imageTags[randomPot]).animate( {
				height: '150px'
			}, 1000);
		}
		else {
			$(imageTags[randomPot]).animate( {
				height: '130px'
			}, 1000);
		}
	}
}

function getRandomFlower() {
	var randomPot = parseInt(Math.random(0, 47) * 48);
	for( var i = 0; i < randomSelectedFlowers.length; i++ ) {
		if( randomPot === randomSelectedFlowers[i] )
			randomPot = getRandomFlower();
	}
	return randomPot;
}

function display() {
	requestAnimationFrame(display);
	if(!fortyeightReached) { 
		
		if((getCurrentMilliSeconds() - originalTime) >= TOTALDISPLAYTIME) {
			console.log(tweetsForDisplay.length);
			console.log("updating", currentTweetNum);
			incrementCurrentTweet();
		}
	}	
	else {
		// rain;
		console.log("I should be raining", getCurrentMilliSeconds(), originalTime);

		if( (getCurrentMilliSeconds() - originalTime) <= TOTALRAINTIME ) {
			makeitRain();
		}
		else {
			console.log("I should be restarting");
			init();
			$('#tweetContainer').text('');
		}
	}
}

function getCurrentMilliSeconds() {
	var date = new Date();
	return date.getTime();
}

function incrementCurrentTweet() {
	originalTime = getCurrentMilliSeconds();
	if( currentTweetNum < tweetsForDisplay.length )
	{
		if( currentTweetNum > 47 ) {
			fortyeightReached = true;
		}
		tweetHtml(tweetsForDisplay[currentTweetNum]);
		currentTweetNum++;
		showFlower();
	}
	else {
		console.log("I've reached the end and I'm going back for more");
		startProcess();
	}
}

function addTweets(newTweets) {
	for ( var i = 0; i < newTweets.length; i++ ) {
		if( newTweets[i].id > globalSinceId ) {
			tweetsForDisplay.push(newTweets[i]); 
		}
		if( (newTweets.length - 1 ) == i ) {
			globalSinceId = newTweets[i].id 
		}
	}
}

function tweetHtml(tweetForDisplay){
	$('#tweetContainer').empty();
	$('#tweetContainer').html('<span>' + tweetForDisplay.text +'<span><br>');
}

function startProcess(){
	processRunning = true;
	console.log("I'm in startProcess about to call ajax");
	$.ajax({
		url: "http://localhost:5003/gettweets", 
		type: "GET",  
		data: { "sinceID" : globalSinceId }, 

		//after sending the parameters above, i then receive the bottom ingo 
		success: function(tweet) {
			console.log("i've got stuff and adding it to the tweets");
			var obj = $.parseJSON(tweet);
			if( obj.length > 0 ) { 
				addTweets(obj); 
			}
			
		}, 
		error: function(err) {
			console.log(err);
		}
	}); 		
}

function makeitRain() {
 console.log("it should be raining");
 	
 	//html text disappears the html text, i can then put a callback inside of the hide parameters 
 	$('#prompt').hide("slow"); 
 	// console.log("there should be no more prompt"); 
 	
 	//flowers shrink
 	var imageTags = $('.image');
 	for( var i = 0; i < imageTags.length; i++ ) { 
 		$(imageTags[i]).animate( {
			height: "0px"
		}, 1000);
 	}

 	//make the rain image appear
 	var rain = $('.fullrain'); 
 	var rainsrc = '../static/img/rain.gif'; 
    if (!$(rain).attr('src')) {
    	$(rain).attr('src', rainsrc)
    	$(rain).css("display", "block") 
    }

 	//make it restart, basically 
 	// startProcess(); 
 	// var timeout = setTimeout(startProcess, 20000); 
 	// console.log ("process should be running again"); 
 	// processRunning = true; 
 	// console.log("ProcessRunning is now:" + processRunning); 

}


