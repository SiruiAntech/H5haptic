# H5haptic
## SDK接入

1. 音频文件的下载地址填充到`audioVibrate.js`中的audio_321GO、audio_click、audio_hitgate、audio_falling中
2. `audioVibrate.js`通过`<script type="text/javascript" src="audioVibrate.js"></script>`嵌入html文件使用
3. `demo.html`是一个简单的示例，为按钮的onclick分别绑定`audioVibrate.js`中的`play_321GO()`、`play_click()`、`play_hitgate()`、`play_falling()`方法可以实现点击时触发播放音频及对应触觉的效果
