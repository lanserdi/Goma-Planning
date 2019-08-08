## 使用指南

![](./media/demo.gif)

```html
<div id="elePlanning"></div>
```

```js
var planningInstance = new goma.Planning({
  eleWrap: document.querySelector('#elePlanning'),
  navBarColor: '#fff',
  onClickSendTaskBtn: function(inputEl, e){
    console.log(inputEl.value)
  },
  cardsProp: [
    {
      title: '待完成',
      defaultColor: '#666',
      activeColor: '#0074d0',
    },
    {
      title: '已完成',
      defaultColor: '#666',
      activeColor: '#009688',
    },
    {
      title: '回收站',
      defaultColor: '#666',
      activeColor: '#d05047',
    }
  ]
});
```

## 开发指南

源代码使用```gulp```构建，因此需要全局安装```gulp-cli```，本地安装```gulp```。

```bash
npm i -g gulp-cli
npm i -D gulp
```
