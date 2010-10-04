dojo.provide("ajweb.date");
dojo.declare("ajweb.date", null,
{

	constructor : function(opt){
	},

	/**
	 * inspectメソッド：デバッグ情報を出力
	 * @return {String} デバッグ用出力
	 *
	 * @example
	 *  button.inspect();
	 */
	inspect : function(){
		return "dataStore" + this.id;
	}
});

ajweb.date.now = function(){
	var now = new Date();
	var minutes = now.getMinutes();
	var seconds = now.getMinutes();
	var month = now.getMonth() + 1;
	if(minutes < 10){
		minutes = "0" + minutes;
	}

	if(seconds < 10){
		var seconds = "0" + seconds;
	}

	return now.getFullYear()+"-"+ month +"-"+now.getDate()+" "
		+now.getHours()+":"+ minutes+":"+ seconds;

};



