var data = {
       
  audio_321GO:"https://haptic-video-shanghai.oss-cn-shanghai.aliyuncs.com/static/321GO.mp3",
  audio_click:"https://haptic-video-shanghai.oss-cn-shanghai.aliyuncs.com/static/click.mp3",
  audio_hitgate:"https://haptic-video-shanghai.oss-cn-shanghai.aliyuncs.com/static/hit_gate.mp3",
  audio_falling:"https://haptic-video-shanghai.oss-cn-shanghai.aliyuncs.com/static/falling.mp3",
  
  audio:[],
  timer: null,
  timePoint: [],
  delay: 0,
  startlong: 26.265,
  endlong: 28.775,

  debug:true,
  playHandler:[],
  can_vibrate:true,
  platform:"V2183A",//设备名称
};

let element = [];
element.length = 0;
let handler = [];
handler.length = 0;
let audioSrcList = [data.audio_321GO,data.audio_click,data.audio_hitgate,data.audio_falling]
for (var i=0;i<4;i++){
  var audio_ =  document.createElement("audio");
  audio_.src = audioSrcList[i];
  audio_.preload = "auto";
  audio_.load();
  console.log(audio_.readyState)
  element[i] = audio_;
  handler[i] = createPlayHandler(i);
}
data.audio = element;
data.playHandler = handler;

let jsondata = ['data/321GO.ah', 'data/click.ah','data/hit_gate.ah', 'data/falling.ah']
jsondata.forEach((element, index) => {
  loadbin(element,index)
});
/**
   猜测：上次测的时候网速好，下载速度快
   没有触发这种情况
  
   应该新设置一个预先加载的操作
 */
//openVibrate()
//设备
console.log(platform);
console.log(platform.name);
console.log(platform.version);
console.log(navigator.userAgent);

let contentElement = document.getElementById("content");
// 初始化元素的文本内容


//data.platform = navigator.userAgent
contentElement.textContent = data.platform;

function openAudio(){
  console.log('open audio')
  for (var i=0;i<4;i++){
    this.data.audio[i].muted = false
    this.data.audio[i].load();
  }
}
function openVibrate(){
  
  this.data.can_vibrate = true;
}
function closeAudio(){
  console.log('close audio')
  for (var i=0;i<4;i++){
    this.data.audio[i].muted = true
  }
}
function closeVibrate(){
  
  this.data.can_vibrate = false;
}

function vibrate(i, allay) {
  if (!this.data.can_vibrate) {
    clearTimeout(data.timer);
    return;
  }
  var delay = -5
  if (i == -1) { //当前是第一个震动
    var step = parseFloat(delay) + parseFloat(allay[i + 1][0]) * 1000; //allay中的时间以秒为单位，step以ms为单位
    if (step < 0) step = 1 //已经错过震动，等待1ms后处理下一个震动
  }
  else {
    var step = parseFloat(delay) + parseFloat(allay[i + 1][0] - allay[i][0]) * 1000;
    if (step < 0) step = 1
  }
  if (allay[i + 1][1] > 1) {
    if (this.data.debug) console.log('wait' + step) ///
    //获得手机型号
    if (this.data.platform.includes('V2183A')){
      //改为密集点振动
      data.timer = setTimeout(() => {
        clearTimeout(data.timer)
        navigator.vibrate(15);
        if (this.data.debug) console.log(new Date().getTime()+ ' 短震动') ///
        let currentTime = 0; // 当前已经过去的时间
        if(this.data.debug) console.log("原本长震动"+allay[i + 1][1]) ///
        var intervalHandle = setInterval(() => {
          //振动
          navigator.vibrate(2);//每次振动2ms
          if (this.data.debug) console.log("[密集,time] "+ new Date().getTime())
          currentTime += 3; //interval为3ms

          if (currentTime >= allay[i + 1][1]) {
            clearInterval(intervalHandle);
            intervalHandle = null;
          }
        }, 3);


        if (i < allay.length - 2) vibrate(i + 1, allay)
      }, step)
     

    }else {
      data.timer = setTimeout(() => {
        clearTimeout(data.timer) 
        navigator.vibrate(allay[i + 1][1]);
        if(this.data.debug) console.log(new Date().getTime() + ' 长震动'+allay[i + 1][1]) ///
        if (i < allay.length - 2) vibrate(i + 1, allay)
      }, step)
    }
  } else {
    let stren = 'heavy'
    if (allay[i + 1][1] < 0.3) stren = 'light';
    else if (allay[i + 1][1] < 0.6) stren = 'medium';
    else stren = 'heavy';
    if (this.data.debug) console.log('wait' + step)
    data.timer = setTimeout(() => {
      clearTimeout(data.timer)
      navigator.vibrate(15);
      if (this.data.debug) console.log(new Date().getTime()+ ' 短震动') ///
      if (i < allay.length - 2) vibrate(i + 1, allay)
    }, step)
  }
}
function exitFullScreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}
function loadbin(path,index) {
  fetch(path)
  .then(response => {
    if (!response.ok) {
      throw new Error(`读取文件时出错: ${response.status}`);
    }
    return response.arrayBuffer();
  })
  .then(arrayBuffer => {
    // 在这里进行文件解析，假设是自定义的二进制格式
    const lengthDataView = new DataView(arrayBuffer);
    let transientTime;
    let transientIntensity;

    // 解析数据...
    const lengthIntArray = [
      lengthDataView.getInt32(0, true),
      lengthDataView.getInt32(Int32Array.BYTES_PER_ELEMENT, true),
      lengthDataView.getInt32(Int32Array.BYTES_PER_ELEMENT * 2, true)
    ];
    ///console.log(lengthIntArray)
    const readOrderArray = [
      lengthIntArray[0], lengthIntArray[0],
      lengthIntArray[1], lengthIntArray[1],
      lengthIntArray[2], lengthIntArray[2], lengthIntArray[2]]


    // 读取intensity、sharpness、transient数组
    let offset = Int32Array.BYTES_PER_ELEMENT * 3;
    for (let i = 0; i < readOrderArray.length; i++) {
      const array = new Float32Array(arrayBuffer, offset, readOrderArray[i]);
      offset += readOrderArray[i] * Float32Array.BYTES_PER_ELEMENT;
      switch (i) {
        case 0:
          break;
        case 1:
          break;
        case 2:
          break;
        case 3:
          break;
        case 4:
          transientTime = array;
          break;
        case 5:
          transientIntensity = array;
          break;
        case 6:
          break;
      }
    }
    var timelist = [];
   
    transientTime.forEach((element, index) => {
      console.log(transientIntensity[index])

      timelist.push([element, transientIntensity[index]]);
    });
    ///console.log("timelist")
    ///console.log(timelist)
    
    data.timePoint[index] = timelist
    return timelist
  })
  .catch(error => {
    console.error(`读取文件时出错: ${error}`);
  });
}


/*function play_321GO(){
  /*
  var audio = document.createElement("audio");
  audio.src=data.audioSrcList[0];
  audio.preload = "auto";
  audio.addEventListener('play', function () { //为play函数添加监听器
      setTimeout(()=>{vibrate(-1, data.timePoint[0])},40) //data.delay设定为40ms
  });
  var audio_ = this.data.audio[0];
  if(audio_.readyState!=4){
    console.log("loading")
    audio_.load();
  }
  audio_.play();
}*/


function play_321GO(){
  /*
  var audio = document.createElement("audio");
  audio.src=data.audioSrcList[0];
  audio.preload = "auto";
  audio.addEventListener('play', function () { //为play函数添加监听器
      setTimeout(()=>{vibrate(-1, data.timePoint[0])},40) //data.delay设定为40ms
  });*/
  var audio_ = this.data.audio[0];
  audio_.addEventListener('play', function () { //为play函数添加监听器
    setTimeout(()=>{vibrate(-1, data.timePoint[0])},40) //data.delay设定为40ms
  });
  audio_.play();
}

function play_click(){
  var audio_ = this.data.audio[1];
  audio_.addEventListener('play', function () { //为play函数添加监听器
    setTimeout(()=>{vibrate(-1, data.timePoint[1])},40) //data.delay设定为40ms
  });
  audio_.play();
}

function play_hitgate(){
  var audio_ = this.data.audio[2];
  audio_.addEventListener('play', function () { //为play函数添加监听器
    setTimeout(()=>{vibrate(-1, data.timePoint[2])},40) //data.delay设定为40ms
  });
  audio_.play();
}

function play_falling(){
  var audio_ = this.data.audio[3];
  audio_.addEventListener('play', function () { //为play函数添加监听器
    setTimeout(()=>{vibrate(-1, data.timePoint[3])},40) //data.delay设定为40ms
  });
  audio_.play();
}

function createPlayHandler(i){
  return function(){
    console.log("play "+new Date().getTime())
    console.log(data.audio[i].readyState+" in playhandler")
    console.log(data.audio[i].buffered);
    console.log(data.audio[i].duration);
    setTimeout(()=>{vibrate(-1, data.timePoint[i])},40) //data.delay设定为40ms
  }
}