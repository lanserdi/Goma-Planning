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

项目中js使用rollup构建，css使用sass构建。请全局安装rollup和sass。

```bash
npm i -g rollup
npm i -g sass
```
