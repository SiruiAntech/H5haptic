var data ={
    duration:15    
}
//解析
const queryString = window.location.search;
const queryParams = parseQueryString(queryString)
const durationValue = queryParams.duration;
this.data.duration = durationValue;
vibrate()

function vibrate(){
    console.log(this.data.duration)
    navigator.vibrate(this.data.duration);
}


function parseQueryString(queryString) {
    const params = {};
    const queryStringWithoutQuestionMark = queryString.substring(1); // 去掉问号
    const keyValuePairs = queryStringWithoutQuestionMark.split('&');
  
    keyValuePairs.forEach(pair => {
      const [key, value] = pair.split('=');
      params[key] = decodeURIComponent(value);
    });
  
    return params;
  }
  