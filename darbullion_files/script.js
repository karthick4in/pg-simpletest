var key='darbullion';
var oldDataFeedVal={};
var ratingArrow=1;
var loadLog = 0;
function init$$after()
{
	console.log('test');
	setInterval(updateFeeds, 1800);
}

function isInteger(x) {
        return x % 1 === 0;
}

function updateFeeds()
{
	var dataConvert = function(val)
	{
		//console.log((Math.round(val * 100) / 100).toFixed(2));
		if(isFinite(val))
			return (Math.round(val * 100) / 100).toFixed(2);
		else
			return val;
	}

	var roundHalf = function (num) {
	if(!isFinite(num))
	 	return num;
	 
    num = Math.round(num*2)/2;
    return num.toFixed(2);;
	}

	var ratingArrowRender = function(oldVal, Val)
	{
	//	console.log(oldVal, Val);
		var result='';
		if(oldVal < Val)
			result = 'up';
		else if(oldVal > Val)
			result = 'down';
		
		//console.log(result);
		return result;
	}
	var renderData = function(data)
	{
		// feed Update Process
		datafeed = data[0]['data'];
		jsonFeed =  JSON.parse(datafeed);
	 	var htmlTag = '';
		var valLen= 3;
		for(var j=0;j < valLen && j< jsonFeed.length; j++)
		{
			var that = jsonFeed[j];
			htmlTag += "<tr><td>"+dataConvert(that[0])+"</td><td>"+dataConvert(that[1])+"</td><td>"+dataConvert(that[2])+"</td><td>"+dataConvert(that[3])+"</td><td>"+dataConvert(that[4])+"</td></tr>";
		}
		$("#feedPannel").html(htmlTag);
		//return 0;
		ratefeed = JSON.parse(data[1]['data']);
		oldratefeed = JSON.parse(oldDataFeedVal[1]['data']);
		//ratefeed
		var htmlTag = '';
		
		// check any settings is activeated.
		if(!(data[1]['setup'] == '1'))
		{
		  var pageValue = data[1]['setup']||'';
		  var template  = Array('','','Market Closed','Market Open Shortly','-')

		  if(isInteger(data[1]['setup']))
		     pageValue = template[data[1]['setup']];
		     
			htmlTag = '<tr><td colspan="6" style="height: 130px; vertical-align: middle;text-transform: uppercase;">'+pageValue+'</td></tr>';
			$("#ratePannel").html(htmlTag);
			$('#LastUpdateTime span').html(data[0]['DOE']);
		   return 0;
		}
		
		var htmlTag = '';
		for(var i=0; i< ratefeed.length; i++ )
		{	
			var that = ratefeed[i];
			var oldthat = oldratefeed[i];
			//	that = JSON.parse(that);
			if(ratingArrow)
				htmlTag += "<tr><td >"+that.lname+"</td><td class='"+ratingArrowRender(oldthat.buyrate,that.buyrate)+"'>"+roundHalf(that.buyrate)+"<span></span></td><td class='"+ratingArrowRender(oldthat.sellrate,that.sellrate)+"'>"+roundHalf(that.sellrate)+"<span></span></td></tr>";
			else
				htmlTag += "<tr><td>"+that.lname+"</td><td>"+roundHalf(that.buyrate)+"</td><td>"+roundHalf(that.sellrate)+"</td></tr>";
		}
		$("#ratePannel").html(htmlTag);
		$('#LastUpdateTime span').html(data[0]['DOE']);
		oldDataFeedVal = data;
	}
	//$.ajax({url:"http://bullionfeed.jangadi.net/",success:function(result){
	var urlLink ="http://bullionfeed.jangadi.net/?"+(key!=''?'key='+key:'');
        //var urlLink = "http://marchforth.us/bullion_user/feedlive.php?"+(key!=''?'key='+key:'');
 var urlLink ="http://bullion.jangadi.info/feedlive.php?"+(key!=''?'key='+key:'');
	$.ajax({url:urlLink,timeout: 1000,success:function(result){
		if(loadLog == 0)
		{	
			oldDataFeedVal = result;
			$('#main_Mask').hide();
		}
		loadLog++;	
		DataFeedVal= result;
		renderData(result);
 	}});
}
function init()
{
	init$$after();
	
}