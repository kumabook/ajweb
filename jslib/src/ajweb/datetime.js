dojo.provide("ajweb.datetime");

//ajweb.datetime = {};

ajweb.datetime.now = function(){
  	var now = new Date();
	var minutes = now.getMinutes();
	var seconds = now.getMinutes();
	var month = now.getMonth() + 1;
	if(minutes < 10){
		minutes = "0" + minutes;
	}

	if(seconds < 10){
	  seconds = "0" + seconds;
	}

	return now.getFullYear()+"-"+ month +"-"+now.getDate()+" "
		+now.getHours()+":"+ minutes+":"+ seconds;

};
