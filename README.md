# 介绍
* fullpageJS是基于es6开发的组件
* fullpageJS的大小由父级盒子大小决定所以必须保证其父级盒子充分100%,body,html都要宽高100%
* pc,移动端均可使用
* 组件自行判断终端设备,自适应移动端,并触发touch事件
* 屏幕大小改变时,组件自行重新渲染设备,适应当前窗口
* es5语法,请下载后使用fullpageJS.es5.js
## 安装
```cmd
npm install fullpages --save
```
## 使用

```html
<script src="fullpageJS.es5.js"></script> // es5引入方式

<div id="fullpage">
  <div> // 必写内部盒子,为适应无滚动条,没有时将无法运行
    <div></div> // 整页页面
    <div></div> // 整页页面
    <div></div> // 整页页面
    <div></div> // 整页页面
  </div>
</div>
```
```javascript
import FullPage from 'fullpages' // es5略去

let fullpage=new fullPage('#fullpage',{
  isScrollBar:false // 参数填写方式
})
```

## 参数

#### isScrollBar
* 属性:Boolean
* 默认值:false
* 作用:设置是否需要滚动条,false时无滚动条

#### runTime
* 属性:Number
* 默认值:300
* 作用:设置滚动时间,单位ms

#### mouseTime
* 属性:Number
* 默认值:300 // 默认会和runTime时间相同
* 作用:设置鼠标滚轮可以使用的时间,即滚动开始,经过此时间后,滚轮才能使用,单位ms
* 备注:此时间用于当滚屏后,需要动画交互的场景,可自行计算出时间,让用户看完动画后,才能进入下一页
* 注意:为确保整屏滚动的正常运行,mouseTime将不得小于runTime,当小于时,会默认改为与runTime相同

## 回调
```javascript
// 此函数将在滚动时执行
fullpage.on('scroll',(res) => {
  console.log(res)
  // res为一个对象
})

```
#### res.currentPage
* Number 返回当前滚动至的页面索引值,第一页索引为0

#### res.maxPage
* Number 返回页面总数

#### res.path
* Boolean 返回当前滚动方向,true为向下,false为向上

