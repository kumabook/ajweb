/**
 * @fileOverview dateオブジェクト
 *
 * @author Hiroki Kumamoto
 * @version 1.0.0
 */
dojo.provide("ajweb.date");
dojo.declare("ajweb.date", null,
/** @lends ajweb.date.prototype */
{
  /**
   * @constructs
   */
  constructor : function(opt){
    this.date = new Date();
    if(!opt)
      return;
    if(opt.year)
      this.date.setFullYear(opt.year);
    if(opt.months)
      this.date.setMonth(opt.months);
    if(opt.date)
      this.date.setDate(opt.date);
    if(opt.hours)
      this.date.setHours(opt.hours);
    if(opt.minutes)
      this.date.setMinutes(opt.minutes);
    if(opt.seconds)
      this.date.setSeconds(opt.seconds);
/*
    this.year = opt.year;
    this.month = opt.month;
    this.day = opt.day;
    this.hour = opt.hour;
    this.minute = opt.minute;
    this.second = opt.second;
*/
    this.type = opt.type;
    this.isRelative = opt.isRelative;
  },
  toJSON: function(){
      return this.toDateString(this.date.getFullYear())+"-"+ this.toDateString(this.date.getMonth()) +"-"+
	this.toDateString(this.date.getDate())+" "+this.toDateString(this.date.getHours())+":" +
	  this.toDateString(this.date.getMinutes())+":"+ this.toDateString(this.date.getSeconds());
  },
  toDateString: function(param){
    if(param < 10){
	return  "0" + param;
    }
    else
      return param;
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

/**
 * 現在の時刻を取得
 * @methodOf ajweb.date#
 */
if(!ajweb.date){
  ajweb.date = {};
}
if(!ajweb.time){
  ajweb.time = {};
}
if(!ajweb.datetime){
  ajweb.datetime = {};
}

ajweb.date.now = function(){
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
ajweb.datetime.parse = function(str){
  var dateTime = str.split(" ");
  var dateArray = dateTime[0].split("-");
  var timeArray = dateTime[1].split(":");
  if(dateArray.length < 3)
    dateArray = ajweb.date.now().split(" ")[0].split("-");
  if(timeArray.length < 4)
    timeArray = ajweb.date.now().split(" ")[1].split(":");
    return new Date(dateArray[0], parseInt(dateArray[1])-1, dateArray[2], 
		    timeArray[0], timeArray[1], timeArray[2]);//, timeArray[3]);
  };
ajweb.date.parse = function(str){
  var dateArray = str.split("-");
  if(dateArray.length < 3)
    dateArray = ajweb.date.now().split(" ")[0].split("-");

  var timeArray = ajweb.date.now().split(" ")[1].split(":");
    return new Date(dateArray[0], parseInt(dateArray[1])-1, dateArray[2], 
		    timeArray[0], timeArray[1], timeArray[2]);//, timeArray[3]);
  };
ajweb.time.parse = function(str){
  console.log(str);
  var timeArray = str.split(":");
  var dateArray = ajweb.date.now().split(" ")[0].split("-");
  if(timeArray.length < 4)
   timeArray = ajweb.date.now().split(" ")[1].split(":");
  return new Date(dateArray[0], parseInt(dateArray[1])-1, dateArray[2], 
		    timeArray[0], timeArray[1], timeArray[2]);//, timeArray[3]);
  };
ajweb.date.format = function(date){
    return dojo.date.locale.format(date, {datePattern: "yyyy-MM-dd", selector: "date"});
};



ajweb.datetime.format = function(date, time){
    return dojo.date.locale.format(date, {datePattern: "yyyy-MM-dd", selector: "date"}) + " "
	       + dojo.date.locale.format(time, {timePattern: "HH:mm:dd:ss", selector: "time"});
};

ajweb.time.format = function(time){
    return dojo.date.locale.format(time, {timePattern: "HH:mm:dd:ss", selector: "time"});
};

