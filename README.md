##开发环境

源代码使用```gulp```构建，因此需要全局安装```gulp-cli```，本地安装```gulp```。

```bash
npm i -g gulp-cli
npm i -D gulp
```

## Planning使用方法

![](./resource/planning.gif)

```html
<div id="planning"></div>
```

```javascript
var planningTool = new Planning();
planingTool.runApp(document.querySelector('#planning'));
// planing.stopApp();
```
