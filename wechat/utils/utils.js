/**
 * Created by HECH on 12/20/2016.
 */
function formatTime( date ) {

    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');
}

function formatDate( date ) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    return year+'-'+month+'-'+day;
}

function formatDateTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  
  return [year, month, day].map(formatNumber).join('/')
}

function formatNumber(n) {
    n = n.toString();
    return n[1] ? n : '0' + n;
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  formatDateTime:formatDateTime,
  displayHour:displayHour,
  addDays: addDays
}
// 格式化时间戳
function getTime( timestamp ) {
    var time = arguments[ 0 ] || 0;
    var t, y, m, d, h, i, s;
    t = time ? new Date( time * 1000 ) : new Date();
    y = t.getFullYear();    // 年
    m = t.getMonth() + 1;   // 月
    d = t.getDate();        // 日
    h = t.getHours();       // 时
    i = t.getMinutes();     // 分
    s = t.getSeconds();     // 秒

    // 定义时间格式
    return y
        + '-'
        + ( m < 10 ? '0' + m : m )
        + '-'
        + ( d < 10 ? '0' + d : d )
        + ' '
        + ( h < 10 ? '0' + h : h )
        + ':'
        + ( i < 10 ? '0' + i : i )
        + ':'
        + ( s < 10 ? '0' + s : s );
}

function displayHour(dateStr){
    var str = dateStr.replace(/-/g,"/");
    str = str.substring(0,10) + " " + str.substring(11,19)
    var strArr = str.split(" ")
    var time1 = strArr[0].split("/")
    var time2 = strArr[1].split(":")
    var now = new Date();
    var date = Date.UTC(time1[0], time1[1] - 1, time1[2], time2[0], time2[1], time2[2])
    var localTime = new Date(date)
    var diff = now.getTime() - localTime.getTime(); 

    if(diff/(1000)<60){//less then 60secs
        return Math.floor(diff/(1000))+'秒前';
    }
    if(diff/(60*1000)<60){//less then 60mins
        return Math.floor(diff/(60*1000))+'分钟前';
    }
    if(diff/(60*60*1000)<24){//less then 24hours
        return Math.floor(diff/(60*60*1000))+'小时前';
    }
    if(Math.floor(diff/(24*3600*1000))>1){
        return Math.floor(diff/(24*3600*1000))+'天前';
    }
   
        // var formatDate = localTime.getFullYear + "-" + localTime.getMonth + "-" + localTime.getDay + " " + localTime.getHours + ":" + localTime.getMinutes + ":" + localTime.getSeconds
        // console.log(formatDate)



}


function addDays(date,days){
     if(date!=null && date!=undefined && date!=''){
        date.setDate(date.getDate()+days);
        return date;
     }
}