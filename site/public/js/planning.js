"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Planning = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _utils = _interopRequireDefault(require("./utils.js"));

var _main = _interopRequireDefault(require("../css/main.scss"));

var Planning =
/*#__PURE__*/
function () {
  function Planning() {
    (0, _classCallCheck2["default"])(this, Planning);
    this.ANIMATION_DURATION__LOADING = 500;
    var style = document.createElement('style');
    style.setAttribute('rel', 'stylesheet');
    style.setAttribute('type', 'text/css');
    if (style.styleSheet) style.styleSheet.cssText = _main["default"].toString();else style.innerHTML = _main["default"].toString();
    document.getElementsByTagName('head')[0].appendChild(style);
  }

  (0, _createClass2["default"])(Planning, [{
    key: "runApp",
    value: function runApp(_eleWrap) {
      this.stopApp();
      this.eleWrap = _eleWrap;
      this.eleWrap.classList.add('planing-module');
      this.createNavBar();
      this.createTaskListWrap();
      this.createAddTaskComponent();
    }
  }, {
    key: "stopApp",
    value: function stopApp() {
      if (!this.eleWrap) return;
      this.eleWrap.innerHTML = '';
      this.eleWrap.classList.remove('planing-module');
      this.eleWrap = null, this.eleTaskListWrap = null, this.eleTaskList = null, this.eleLoading = null, this.eleAddTaskWrap = null, this.addTaskInputWrap = null, this.eleTaskInput = null, this.eleSendTask = null, this.eleNavBarWrap = null;
    } // ----------NavBar-----------------

  }, {
    key: "createNavBar",
    value: function createNavBar() {
      var that = this;
      this.eleNavBarWrap = document.createElement('div');
      this.eleNavBarWrap.classList.add('navbar-wrap');
      this.eleWrap.appendChild(this.eleNavBarWrap);
      this.eleNavBarWrap.addEventListener('mouseover', this.onMouseOverNavbar, false);
      this.eleNavBarWrap.addEventListener('mouseleave', this.onMouseLeaveNavbar, false);
      this.eleNavBarWrap.addEventListener('click', function (e) {
        that.onMouseClickNavbar(this, e);
      }, false);
      var data = [{
        isActive: true,
        name: '计划',
        color: 'hsl(281, 90%, 50%)',
        feat: 'JIHUA'
      }, {
        isActive: false,
        name: '花开',
        color: 'hsl(231, 92%, 43%)',
        feat: 'HUAKAI'
      }, {
        isActive: false,
        name: '尘封',
        color: 'hsl(24, 91%, 46%)',
        feat: 'CHENFENG'
      }];
      var str = "",
          width = (100 / data.length).toFixed(2),
          activeColor,
          activeP;

      for (var i = 0; i < data.length; i++) {
        var tag = data[i];

        if (tag.isActive) {
          activeColor = tag.color;
          activeP = width * i;
          this.eleWrap.dataset.feat = tag.feat;
          this.renderTasksByTag(tag.feat);
        }

        str += "<div data-type=\"btn\" data-feat=\"".concat(tag.feat, "\" data-p=\"").concat(width * i, "%\" data-c=\"").concat(tag.color, "\" data-state=\"").concat(tag.isActive ? 'on' : 'off', "\" class=\"tag-btn").concat(tag.isActive ? ' active' : '', "\" style=\"width:").concat(width, "%;\"><span class=\"tag-name\" style=\"color:").concat(tag.color, ";\">").concat(tag.name, "</span></div>");
      }

      str += "<div id=\"planning_navbar_pointer\" style=\"background-color:".concat(activeColor, "; left:").concat(activeP, "%;\"></div>");
      this.eleNavBarWrap.innerHTML = str;
    }
  }, {
    key: "onMouseOverNavbar",
    value: function onMouseOverNavbar(e) {
      var target = e.target,
          type = target.dataset.type;
      if (!type || type != 'btn') return;
      var p = target.dataset.p,
          c = target.dataset.c,
          ele = this;
      ele.querySelector('#planning_navbar_pointer').style.left = p;
      ele.querySelector('#planning_navbar_pointer').style.backgroundColor = c;
    }
  }, {
    key: "onMouseLeaveNavbar",
    value: function onMouseLeaveNavbar(e) {
      var ele = this,
          activeNavbarItem = ele.querySelector('.active'),
          p = activeNavbarItem.dataset.p,
          c = activeNavbarItem.dataset.c;
      ele.querySelector('#planning_navbar_pointer').style.left = p;
      ele.querySelector('#planning_navbar_pointer').style.backgroundColor = c;
    }
  }, {
    key: "onMouseClickNavbar",
    value: function onMouseClickNavbar(ele, e) {
      var target = e.target;

      while (target !== ele) {
        var type = target.dataset.type;

        if (type == 'btn') {
          var activeNavbarItem = ele.querySelector('.active'),
              feat = target.dataset.feat;
          activeNavbarItem.dataset.state = 'off';
          activeNavbarItem.classList.remove('active');
          target.dataset.state = 'on';
          target.classList.add('active');
          ele.parentNode.dataset.feat = feat;
          this.renderTasksByTag(feat);
        }

        target = target.parentNode;
      }
    }
  }, {
    key: "renderTasksByTag",
    value: function renderTasksByTag(q) {
      var _this = this;

      this.showLoading();

      var _xhr = new XMLHttpRequest(),
          _url = "/api/get_task?q=".concat(q);

      _xhr.responseType = 'json';

      _xhr.onreadystatechange = function () {
        if (_xhr.status == 200 && _xhr.readyState == 4) {
          var res = _xhr.response;

          if (res.flag) {
            var elesTask = '',
                _i = 0;

            for (; _i < res.result.length; _i++) {
              var task = res.result[_i];
              elesTask += _this.getTaskItemTemplate(q, task.id, task.title, task.create_timestamp, _i);
            }

            _this.eleTaskList.innerHTML = elesTask;
            elesTask = null;
          }

          res = null;
          _xhr.onreadystatechange = null;
          _xhr = null;

          _this.destroyLoading();
        }
      };

      _xhr.open('GET', _url, true);

      _xhr.send(null);
    } // ----------TASKLIST----------START

  }, {
    key: "createTaskListWrap",
    value: function createTaskListWrap() {
      var that = this;
      this.eleTaskListWrap = document.createElement('div');
      this.eleTaskListWrap.classList.add('task-list-wrap');
      this.eleWrap.appendChild(this.eleTaskListWrap);
      this.eleTaskListWrap.addEventListener('click', function (e) {
        that.onClickTaskListWrap(this, e);
      }, false);
      this.eleTaskList = document.createElement('div');
      this.eleTaskList.classList.add('task-list');
      this.eleTaskListWrap.appendChild(this.eleTaskList);
    }
  }, {
    key: "onClickTaskListWrap",
    value: function onClickTaskListWrap(ele, e) {
      var target = e.target,
          type = target.dataset.type,
          feat = target.dataset.feat,
          id = target.dataset.taskId;

      if (type && type == 'btn' && feat && id) {
        switch (feat) {
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
  }, {
    key: "taskGoHUAKAI",
    value: function taskGoHUAKAI(id, ele) {
      var eleWrap = ele.parentNode.parentNode,
          client = new XMLHttpRequest();
      client.responseType = 'json';

      client.onreadystatechange = function () {
        if (client.status == 200 && client.readyState == 4) {
          var res = client.response;
          if (!res.flag) return;
          eleWrap.parentNode.removeChild(eleWrap);
        }
      };

      client.open('PUT', "/api/update_task/".concat(id, "/go_huakai"), true);
      client.send();
    }
  }, {
    key: "taskGoJIHUA",
    value: function taskGoJIHUA(id, ele) {
      var eleWrap = ele.parentNode.parentNode,
          client = new XMLHttpRequest();
      client.responseType = 'json';

      client.onreadystatechange = function () {
        if (client.status == 200 && client.readyState == 4) {
          var res = client.response;
          if (!res.flag) return;
          eleWrap.parentNode.removeChild(eleWrap);
        }
      };

      client.open('PUT', "/api/update_task/".concat(id, "/go_jihua"), true);
      client.send();
    }
  }, {
    key: "appendNewTaskToTaskList",
    value: function appendNewTaskToTaskList(id, title, timestamp) {
      var _eleTemp = document.createElement('div');

      _eleTemp.innerHTML = this.getTaskItemTemplate(id, title, timestamp);
      this.eleTaskList.insertBefore(_eleTemp, document.querySelector('.task-list').querySelector('div'));
    }
  }, {
    key: "getTaskItemTemplate",
    value: function getTaskItemTemplate(q, id, title, timestamp, i) {
      i = i || 0;
      timestamp = Number(timestamp);
      var date = new Date(timestamp),
          lost = new Date(new Date().getTime() - timestamp),
          lostDate = lost.getUTCDate() - 1,
          dateStr = "";

      if (q == 'JIHUA') {
        if (lostDate) {
          dateStr = "\xB7".concat(lostDate, "\u5929<");
        } else {
          dateStr = "".concat(_utils["default"].dealDateNumber(lost.getUTCHours()), ":").concat(_utils["default"].dealDateNumber(lost.getUTCMinutes()));
        }
      }

      return "<div data-feat=\"".concat(q, "\"><div class=\"task-item-wrap\" data-id=\"").concat(id, "\" style=\"animation-delay: ").concat(50 * i, "ms\"><div class=\"check-box\" data-type=\"btn\" data-task-id=\"").concat(id, "\" data-feat=\"").concat(q, "\"></div><p class=\"title\">").concat(title, "</p><span class=\"date\">").concat(dateStr, "</span></div></div>");
    } // ----------ADDTASK----------START

  }, {
    key: "createAddTaskComponent",
    value: function createAddTaskComponent() {
      var _this2 = this;

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
      this.eleSendTask.addEventListener('click', function (e) {
        _this2.onClickSendTask(e);
      }, false);
    }
  }, {
    key: "onClickSendTask",
    value: function onClickSendTask(e) {
      this.showLoading();

      var _o = this.eleTaskInput.value.replace(/^\s+|\s$/g, '');

      this.eleTaskInput.value = '';

      if (!_o || _o.length < 4 || _o.length >= 24) {
        this.eleTaskInput.focus();
        this.destroyLoading();
        return;
      }

      this.sendTask(_o);
    }
  }, {
    key: "sendTask",
    value: function sendTask(_taskContent) {
      var _this3 = this;

      var _xhr = new XMLHttpRequest(),
          _url = '/api/add_task/',
          _fd = new FormData();

      _xhr.responseType = 'json';

      _xhr.onreadystatechange = function () {
        if (_xhr.status == 200 && _xhr.readyState == 4) {
          var res = _xhr.response;

          if (res.flag) {
            var id = res.result.title,
                title = res.result.title,
                create_timestamp = res.result.create_timestamp;

            _this3.appendNewTaskToTaskList(id, title, create_timestamp);
          }

          res = null;
          _xhr.onreadystatechange = null;
          _xhr = null;

          _this3.destroyLoading();
        }
      };

      _fd.append('task_title', _taskContent);

      _xhr.open('POST', _url, true);

      _xhr.send(_fd);

      _fd = null;
    } // ----------LOADING----------START

  }, {
    key: "createLoadingComponent",
    value: function createLoadingComponent() {
      var eleWrap = document.createElement('div'),
          elesLoading = '',
          d = 14,
          count = 4,
          delay = 100,
          colorCube = ['#f44336', '#f9a825', '#5abd5e', '#29b6f6'];

      for (var i = 0; i < count; i++) {
        elesLoading += "<span class=\"loading-dot\" style=\"animation: loading-dot 870ms ".concat(i * delay, "ms cubic-bezier(.21,.02,.78,.98) infinite; background-color: ").concat(colorCube[i], "; margin-left: ").concat((i - Math.ceil(count / 2)) * d, "px;\"></span>");
      }

      eleWrap.classList.add('loading-wrap');
      eleWrap.innerHTML = elesLoading;
      return eleWrap;
    }
  }, {
    key: "showLoading",
    value: function showLoading() {
      var _duration = this.ANIMATION_DURATION__LOADING;
      this.eleLoading = this.createLoadingComponent();
      this.eleLoading.style.transitionDelay = "".concat(_duration, "ms");
      this.eleLoading.dataset.visibility = 'visible';
      this.eleWrap.appendChild(this.eleLoading);
    }
  }, {
    key: "destroyLoading",
    value: function destroyLoading() {
      var _this4 = this;

      if (!this.eleLoading) return;
      var timer = setTimeout(function () {
        _this4.eleLoading && _this4.eleLoading.parentNode.removeChild(_this4.eleLoading);
        _this4.eleLoading = null;
        clearTimeout(timer);
        timer = null;
      }, this.ANIMATION_DURATION__LOADING * 2);
      this.eleLoading.dataset.visibility = 'hidden';
    }
  }]);
  return Planning;
}();

exports.Planning = Planning;