import { dealDateNumber } from'./utils.js';

export default class Planning {
  constructor(opts){
    // 判断opts.elewrap是否为div元素
    if(Object.prototype.toString.call(opts.eleWrap) !== '[object HTMLDivElement]')
      throw new Error('确保eleWrap参数类型为HTMLDivElement！');

    // 上方判断为真就给实例添加eleWrap属性
    this.eleWrap = opts.eleWrap;

    //  判断opts.cardsProp是否为数组 且至少包含一个card对象
    if(Object.prototype.toString.call(opts.cardsProp) !== '[object Array]' || opts.cardsProp.length < 1)
      throw new Error('确保cards参数为至少包含一个card对象的数组！');

    // 上方判断为真就给实例添加cardsProp属性
    this.cardsProp = opts.cardsProp;

    this.navBarColor = opts.navBarColor || '#222';

    // 通过上方校验后 初始化
    this._init();
  }
  _init(){
    this._singleNavWidth;
    this._eleNavBarWrap;

    // 为容器元素添加类名
    this.eleWrap.classList.add('goma-planing-scope');

    // 默认第一个cardProp对象未激活状态
    this._activeCardPropIndex = 0;

    // 渲染顶部导航
    this._renderNavBar();
    this._createTaskListWrap();
    this._createAddTaskComponent();
  }
  // ----------NavBar-----------------
  _renderNavBar(){

    // 如果顶部导航容器不存在
    if(!this.eleWrap.querySelector('.navbar-wrap')){
      // 创建顶部导航容器
      this._eleNavBarWrap = document.createElement('div');
      this._eleNavBarWrap.classList.add('navbar-wrap');

      // 追加到外部容器中
      this.eleWrap.appendChild(this._eleNavBarWrap);

      // 添加点击事件监听器
      this._eleNavBarWrap.addEventListener('click', this._onMouseClickNavbar.bind(this), false);

      // 存储覆盖导航容器全部内容的html片段
      let _html = '';

      // 存储cardsProp数组长度
      let _l = this.cardsProp.length;

      // 存储计算后的单个导航卡的百分比宽度
      this._singleNavWidth = (100 / _l).toFixed(2);

      for(let _i = 0; _i < _l; _i++){
        // 存储当前遍历到的cardProp
        let _cardProp = this.cardsProp[_i];
        // 存储当前遍历到的cardProp的距左百分比
        let _lp = this._singleNavWidth * _i;

        // 追加导航卡
        _html += `<div data-type="btn" data-i="${_i}" class="tag-btn ${this._activeCardPropIndex==_i?'active':''}" style="width:${this._singleNavWidth}%;">
  <span class="tag-name" style="color:${this._activeCardPropIndex==_i?_cardProp.activeColor:_cardProp.defaultColor}">${_cardProp.title}</span>
</div>`;
      }

      // 存储当前激活状态的导航卡的指示器距离导航容器左侧百分比距离 _active_left_position缩写
      let _alp = this._activeCardPropIndex * this._singleNavWidth;
      // 在当前已激活的导航卡下方追加指示器样式
      _html += `<div class="navbar-pointer" style="left:${_alp}%;color:${this.cardsProp[this._activeCardPropIndex].activeColor};width:${this._singleNavWidth}%;"></div>`;

      // 全部覆盖顶部导航容器中的内容
      this._eleNavBarWrap.innerHTML = _html;
      this._eleNavBarWrap.style.backgroundColor = this.navBarColor;
      this.eleWrap.style.backgroundColor = this.cardsProp[this._activeCardPropIndex].activeColor;
    }else{
      // 遍历所有.tag-name
      this._eleNavBarWrap.querySelectorAll('.tag-btn').forEach((ele, i) => {
        if(this._activeCardPropIndex == i){
          ele.classList.add('active');
          ele.querySelector('.tag-name').style.color = this.cardsProp[this._activeCardPropIndex].activeColor;
          return
        }
        ele.classList.remove('active');
        ele.querySelector('.tag-name').style.color = this.cardsProp[this._activeCardPropIndex].defaultColor;
      })
      this.eleWrap.style.backgroundColor = this.cardsProp[this._activeCardPropIndex].activeColor;
      this._eleNavBarWrap.querySelector('.navbar-pointer').style.left = `${this._singleNavWidth * this._activeCardPropIndex}%`;
      this._eleNavBarWrap.querySelector('.navbar-pointer').style.color = this.cardsProp[this._activeCardPropIndex].activeColor;
    }
  }
  _onMouseClickNavbar(e){
    let target = e.target;

    while(target != this._eleNavBarWrap){
      // 当前元素类型
      let type = target.dataset.type;
      // 如果是点击交互的按钮
      if(type == 'btn'){
        this._activeCardPropIndex = +target.dataset.i
        this._renderNavBar()
        break;
      }
      target = target.parentNode;
    }
  }
  renderTasksByTag(q){
    this.showLoading();
    let _xhr = new XMLHttpRequest(),
      _url = `/api/get_task?q=${q}`;
    _xhr.responseType = 'json';
    _xhr.onreadystatechange = ()=>{
      if (_xhr.status == 200 && _xhr.readyState == 4){
        let res = _xhr.response;
        if(res.flag){
          let elesTask = '', _i = 0;
          for(; _i<res.result.length; _i++){
            let task = res.result[_i];
            elesTask += this.getTaskItemTemplate(q, task.id, task.title, task.create_timestamp, _i);
          }
          this.eleTaskList.innerHTML = elesTask;
          elesTask = null;
        }
        res = null;
        _xhr.onreadystatechange = null;
        _xhr = null;
        this.destroyLoading();
      }
    }
    _xhr.open('GET', _url, true);
    _xhr.send(null);
  }
  // ----------TASKLIST----------START
  _createTaskListWrap(){
    let that = this;

    this.eleTaskListWrap = document.createElement('div');
    this.eleTaskListWrap.classList.add('task-list-wrap');
    this.eleWrap.appendChild(this.eleTaskListWrap);

    this.eleTaskListWrap.addEventListener('click', function(e){that.onClickTaskListWrap(this, e)}, false);

    this.eleTaskList = document.createElement('div');
    this.eleTaskList.classList.add('task-list');
    this.eleTaskListWrap.appendChild(this.eleTaskList);
  }
  onClickTaskListWrap(ele, e){
    let target = e.target,
      type = target.dataset.type,
      feat = target.dataset.feat,
      id = target.dataset.taskId;
    if(type && type == 'btn' && feat && id){
      switch(feat){
        default:
          break;
      }
    }
  }
  appendNewTaskToTaskList(id,title,timestamp){
    let _eleTemp = document.createElement('div');
    _eleTemp.innerHTML = this.getTaskItemTemplate(id,title,timestamp)
    this.eleTaskList.insertBefore(_eleTemp, document.querySelector('.task-list').querySelector('div'));
  }
  getTaskItemTemplate(q, id,title,timestamp, i){
    i = i || 0;
    timestamp = Number(timestamp);
    let date = new Date(timestamp),
      lost = new Date(new Date().getTime() - timestamp),
      lostDate = lost.getUTCDate() - 1,
      dateStr = ``;
    if(q == 'JIHUA'){
      if(lostDate){
        dateStr = `·${lostDate}天<`;
      }else{
        dateStr = `${dealDateNumber(lost.getUTCHours())}:${dealDateNumber(lost.getUTCMinutes())}`;
      }
    }
    return `<div data-feat="${q}"><div class="task-item-wrap" data-id="${id}" style="animation-delay: ${ 50 * i}ms"><div class="check-box" data-type="btn" data-task-id="${id}" data-feat="${q}"></div><p class="title">${title}</p><span class="date">${dateStr}</span></div></div>`;
  }
  // ----------ADDTASK----------START
  _createAddTaskComponent(){
    this.eleAddTaskWrap = document.createElement('div');
    this.eleAddTaskWrap.classList.add('add-task-wrap');
    this.eleWrap.appendChild(this.eleAddTaskWrap);

    this.addTaskInputWrap = document.createElement('div');
    this.addTaskInputWrap.classList.add('add-task-input-wrap');
    this.eleAddTaskWrap.appendChild(this.addTaskInputWrap);

    this.eleTaskInput = document.createElement('input');
    this.eleTaskInput.classList.add('add-task-input');
    this.eleTaskInput.setAttribute('placeholder', '创建新的计划');
    this.addTaskInputWrap.appendChild(this.eleTaskInput);
    this.eleTaskInput.focus();

    this.eleSendTask = document.createElement('div');
    this.eleSendTask.classList.add('send-task');
    this.addTaskInputWrap.appendChild(this.eleSendTask);
    this.eleSendTask.addEventListener('click', (e) => { this.onClickSendTask(e)}, false);
  }
  // ----------LOADING----------START
  createLoadingComponent(){
    let eleWrap = document.createElement('div'),
      elesLoading = '',
      d = 14,
      count = 4,
      delay = 100,
      colorCube = ['#f44336', '#f9a825', '#5abd5e','#29b6f6'];
    for (let i = 0; i < count; i++) {
      elesLoading += `<span class="loading-dot" style="animation: loading-dot 870ms ${i * delay}ms cubic-bezier(.21,.02,.78,.98) infinite; background-color: ${colorCube[i]}; margin-left: ${(i - Math.ceil(count / 2)) * d}px;"></span>`;
    }
    eleWrap.classList.add('loading-wrap');
    eleWrap.innerHTML = elesLoading;
    return eleWrap;
  }
  showLoading() {
    let _duration = this.LOAD_TIME;
    this.eleLoading = this.createLoadingComponent();
    this.eleLoading.style.transitionDelay = `${_duration}ms`;
    this.eleLoading.dataset.visibility = 'visible';
    this.eleWrap.appendChild(this.eleLoading);
  }
  destroyLoading() {
    if(!this.eleLoading) return;
    let timer = setTimeout(()=>{
      this.eleLoading && this.eleLoading.parentNode.removeChild(this.eleLoading);
      this.eleLoading = null;
      clearTimeout(timer);
      timer = null;
    }, this.LOAD_TIME*2);
    this.eleLoading.dataset.visibility = 'hidden';
  }
}