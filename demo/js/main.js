var goma = (function (exports) {
  'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function dealDateNumber(num) {
    num = '' + num;
    return num.charAt(1) ? num : '0' + num;
  }

  var Planning =
  /*#__PURE__*/
  function () {
    function Planning(opts) {
      _classCallCheck(this, Planning);

      // 判断opts.elewrap是否为div元素
      if (Object.prototype.toString.call(opts.eleWrap) !== '[object HTMLDivElement]') throw new Error('确保eleWrap参数类型为HTMLDivElement！'); // 上方判断为真就给实例添加eleWrap属性

      this.eleWrap = opts.eleWrap; //  判断opts.cardsProp是否为数组 且至少包含一个card对象

      if (Object.prototype.toString.call(opts.cardsProp) !== '[object Array]' || opts.cardsProp.length < 1) throw new Error('确保cards参数为至少包含一个card对象的数组！'); // 上方判断为真就给实例添加cardsProp属性

      this.cardsProp = opts.cardsProp; // 通过上方校验后 初始化

      this._init();
    }

    _createClass(Planning, [{
      key: "_init",
      value: function _init() {
        // 为容器元素添加类名
        this.eleWrap.classList.add('goma-planing-scope'); // 默认第一个cardProp对象未激活状态

        this.activeCardPropIndex = 0; // 渲染顶部导航

        this._renderNavBar(); // this.createTaskListWrap();
        // this.createAddTaskComponent();

      } // ----------NavBar-----------------

    }, {
      key: "_renderNavBar",
      value: function _renderNavBar() {
        // 如果顶部导航容器不存在
        if (!this.eleWrap.querySelector('.navbar-wrap')) {
          // 创建顶部导航容器
          this.eleNavBarWrap = document.createElement('div');
          this.eleNavBarWrap.classList.add('navbar-wrap'); // 追加到外部容器中

          this.eleWrap.appendChild(this.eleNavBarWrap); // 添加点击事件监听器

          this.eleNavBarWrap.addEventListener('click', this.onMouseClickNavbar.bind(this), false);
        } // 存储覆盖导航容器全部内容的html片段


        var _html = ''; // 存储cardsProp数组长度

        var _l = this.cardsProp.length; // 存储计算后的单个导航卡的百分比宽度

        var _singleNavWidth = (100 / _l).toFixed(2);

        for (var _i = 0; _i < _l; _i++) {
          // 存储当前遍历到的cardProp
          var cardProp = this.cardsProp[_i]; // 存储当前遍历到的cardProp的距左百分比


          _html += "<div data-type=\"btn\" data-i=\"".concat(_i, "\" class=\"tag-btn").concat(this.activeCardPropIndex == _i ? ' active' : '', "\" style=\"width:").concat(_singleNavWidth, "%;\"><span class=\"tag-name\">").concat(cardProp.title, "</span></div>");
        } // 存储当前激活状态的导航卡的指示器距离导航容器左侧百分比距离 _active_left_position缩写


        var _alp = this.activeCardPropIndex * _singleNavWidth; // 在当前已激活的导航卡下方追加指示器样式


        _html += "<div class=\"navbar-pointer\" style=\"left:".concat(_alp, "%;\"></div>"); // 全部覆盖顶部导航容器中的内容

        this.eleNavBarWrap.innerHTML = _html;
      }
    }, {
      key: "onMouseClickNavbar",
      value: function onMouseClickNavbar(e) {
        var target = e.target;

        while (target != this.eleNavBarWrap) {
          // 当前元素类型
          var type = target.dataset.type; // 如果是点击交互的按钮

          if (type == 'btn') {
            this.activeCardPropIndex = +target.dataset.i;

            this._renderNavBar();

            break;
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
        var lost = new Date(new Date().getTime() - timestamp),
            lostDate = lost.getUTCDate() - 1,
            dateStr = "";

        if (q == 'JIHUA') {
          if (lostDate) {
            dateStr = "\xB7".concat(lostDate, "\u5929<");
          } else {
            dateStr = "".concat(dealDateNumber(lost.getUTCHours()), ":").concat(dealDateNumber(lost.getUTCMinutes()));
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
        var _duration = this.LOAD_TIME;
        this.eleLoading = this.createLoadingComponent();
        this.eleLoading.style.transitionDelay = "".concat(_duration, "ms");
        this.eleLoading.dataset.visibility = 'visible';
        this.eleWrap.appendChild(this.eleLoading);
      }
    }, {
      key: "destroyLoading",
      value: function destroyLoading() {
        var _this3 = this;

        if (!this.eleLoading) return;
        var timer = setTimeout(function () {
          _this3.eleLoading && _this3.eleLoading.parentNode.removeChild(_this3.eleLoading);
          _this3.eleLoading = null;
          clearTimeout(timer);
          timer = null;
        }, this.LOAD_TIME * 2);
        this.eleLoading.dataset.visibility = 'hidden';
      }
    }]);

    return Planning;
  }();

  exports.Planning = Planning;

  return exports;

}({}));
