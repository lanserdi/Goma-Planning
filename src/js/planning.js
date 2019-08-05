import utility from'./utils.js';
import cssfile from '../css/main.scss';

export class Planning {
  constructor(){
    this.ANIMATION_DURATION__LOADING = 500;

    let style = document.createElement('style');
    style.setAttribute('rel','stylesheet');
    style.setAttribute('type','text/css');
    if ( style.styleSheet )
      style.styleSheet.cssText = cssfile.toString();
    else
      style.innerHTML = cssfile.toString();
    document.getElementsByTagName('head')[0].appendChild(style);
  }
  runApp(_eleWrap){
    this.stopApp();
    this.eleWrap = _eleWrap;
    this.eleWrap.classList.add('planing-module');
    this.createNavBar();
    this.createTaskListWrap();
    this.createAddTaskComponent();

  }
  stopApp(){
    if(!this.eleWrap) return;
    this.eleWrap.innerHTML = '';
    this.eleWrap.classList.remove('planing-module');
    this.eleWrap = null,
    this.eleTaskListWrap = null,
    this.eleTaskList = null,
    this.eleLoading = null,
    this.eleAddTaskWrap = null,
    this.addTaskInputWrap = null,
    this.eleTaskInput = null,
    this.eleSendTask = null,
    this.eleNavBarWrap = null;
  }
  // ----------NavBar-----------------
  createNavBar(){
    let that = this;

    this.eleNavBarWrap = document.createElement('div');
    this.eleNavBarWrap.classList.add('navbar-wrap');
    this.eleWrap.appendChild(this.eleNavBarWrap);

    this.eleNavBarWrap.addEventListener('mouseover', this.onMouseOverNavbar, false);
    this.eleNavBarWrap.addEventListener('mouseleave', this.onMouseLeaveNavbar, false);
    this.eleNavBarWrap.addEventListener('click', function(e){that.onMouseClickNavbar(this, e)}, false);

    let data = [
      {
        isActive: true,
        name: '计划',
        color: 'hsl(281, 90%, 50%)',
        feat: 'JIHUA'
      },
      {
        isActive: false,
        name: '花开',
        color: 'hsl(231, 92%, 43%)',
        feat: 'HUAKAI'
      },
      {
        isActive: false,
        name: '尘封',
        color: 'hsl(24, 91%, 46%)',
        feat: 'CHENFENG'
      }
    ]
    let str = ``,
      width = (100/data.length).toFixed(2),
      activeColor,
      activeP;
    for(let i=0; i<data.length; i++){
      let tag = data[i];
      if(tag.isActive){
        activeColor = tag.color;
        activeP = width * i;
        this.eleWrap.dataset.feat = tag.feat;
        this.renderTasksByTag(tag.feat);
      }
      str += `<div data-type="btn" data-feat="${tag.feat}" data-p="${width*i}%" data-c="${tag.color}" data-state="${tag.isActive ? 'on' : 'off'}" class="tag-btn${tag.isActive ? ' active' : ''}" style="width:${width}%;"><span class="tag-name" style="color:${tag.color};">${tag.name}</span></div>`;
    }
    str += `<div id="planning_navbar_pointer" style="background-color:${activeColor}; left:${activeP}%;"></div>`;
    this.eleNavBarWrap.innerHTML = str;
  }
  onMouseOverNavbar(e){
    let target = e.target,
      type = target.dataset.type;
    if(!type || type != 'btn') return;
    let p = target.dataset.p,
      c = target.dataset.c,
      ele = this;
    ele.querySelector('#planning_navbar_pointer').style.left = p;
    ele.querySelector('#planning_navbar_pointer').style.backgroundColor = c;
  }
  onMouseLeaveNavbar(e){
    let ele = this,
      activeNavbarItem = ele.querySelector('.active'),
      p = activeNavbarItem.dataset.p,
      c = activeNavbarItem.dataset.c;

    ele.querySelector('#planning_navbar_pointer').style.left = p;
    ele.querySelector('#planning_navbar_pointer').style.backgroundColor = c;
  }
  onMouseClickNavbar(ele, e){
    let target = e.target;
    while(target !== ele){
      let type = target.dataset.type;
      if(type == 'btn'){
        let activeNavbarItem = ele.querySelector('.active'),
          feat = target.dataset.feat;

        activeNavbarItem.dataset.state = 'off'
        activeNavbarItem.classList.remove('active');

        target.dataset.state = 'on';
        target.classList.add('active');

        ele.parentNode.dataset.feat = feat;

        this.renderTasksByTag(feat);

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
  createTaskListWrap(){
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
        case 'JIHUA':
          this.taskGoHUAKAI(id, target);
          break;
        case 'HUAKAI':
          break;
        case 'CHENFENG':
          this.taskGoJIHUA(id, target);
          break;
      }
    }
  }
  taskGoHUAKAI(id, ele){
    let eleWrap = ele.parentNode.parentNode,
      client = new XMLHttpRequest();
    client.responseType = 'json';
    client.onreadystatechange = ()=>{
      if(client.status == 200 && client.readyState == 4){
        let res = client.response;
        if(!res.flag) return;
        eleWrap.parentNode.removeChild(eleWrap);
      }
    }
    client.open('PUT', `/api/update_task/${id}/go_huakai`, true);
    client.send();
  }
  taskGoJIHUA(id, ele){
    let eleWrap = ele.parentNode.parentNode,
      client = new XMLHttpRequest();
    client.responseType = 'json';
    client.onreadystatechange = ()=>{
      if(client.status == 200 && client.readyState == 4){
        let res = client.response;
        if(!res.flag) return;
        eleWrap.parentNode.removeChild(eleWrap);
      }
    }
    client.open('PUT', `/api/update_task/${id}/go_jihua`, true);
    client.send();
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
        dateStr = `${utility.dealDateNumber(lost.getUTCHours())}:${utility.dealDateNumber(lost.getUTCMinutes())}`;
      }
    }
    return `<div data-feat="${q}"><div class="task-item-wrap" data-id="${id}" style="animation-delay: ${ 50 * i}ms"><div class="check-box" data-type="btn" data-task-id="${id}" data-feat="${q}"></div><p class="title">${title}</p><span class="date">${dateStr}</span></div></div>`;
  }
  // ----------ADDTASK----------START
  createAddTaskComponent(){
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
  onClickSendTask(e){
    this.showLoading();
    let _o = this.eleTaskInput.value.replace(/^\s+|\s$/g, '');
    this.eleTaskInput.value = '';
    if (!_o || _o.length < 4 || _o.length >= 24) {
      this.eleTaskInput.focus();
      this.destroyLoading();
      return;
    }
    this.sendTask(_o);
  }
  sendTask(_taskContent) {
    let _xhr = new XMLHttpRequest(),
      _url = '/api/add_task/',
      _fd = new FormData();
    _xhr.responseType = 'json';
    _xhr.onreadystatechange = ()=>{
      if (_xhr.status == 200 && _xhr.readyState == 4){
        let res = _xhr.response;
        if(res.flag){
          let id = res.result.title,
            title = res.result.title,
            create_timestamp = res.result.create_timestamp;
          this.appendNewTaskToTaskList(id, title, create_timestamp);
        }
        res = null;
        _xhr.onreadystatechange = null;
        _xhr = null;
        this.destroyLoading();
      }
    }
    _fd.append('task_title', _taskContent);
    _xhr.open('POST', _url, true);
    _xhr.send(_fd);
    _fd = null;
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
    let _duration = this.ANIMATION_DURATION__LOADING;
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
    }, this.ANIMATION_DURATION__LOADING*2);
    this.eleLoading.dataset.visibility = 'hidden';
  }
}