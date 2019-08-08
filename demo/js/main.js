(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.goma = factory());
}(this, function () { 'use strict';

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

  var Planning =
  /*#__PURE__*/
  function () {
    function Planning(opts) {
      _classCallCheck(this, Planning);

      // 判断opts.elewrap是否为div元素
      if (Object.prototype.toString.call(opts.eleWrap) !== '[object HTMLDivElement]') throw new Error('确保eleWrap参数类型为HTMLDivElement！'); // 上方判断为真就给实例添加eleWrap属性

      this._eleWrap = opts.eleWrap; //  判断opts.cardsProp是否为数组 且至少包含一个card对象

      if (Object.prototype.toString.call(opts.cardsProp) !== '[object Array]' || opts.cardsProp.length < 1) throw new Error('确保cards参数为至少包含一个card对象的数组！'); // 上方判断为真就给实例添加cardsProp属性

      this._cardsProp = opts.cardsProp;
      this._navBarColor = opts.navBarColor || '#222';
      this.onSendTask = opts.onSendTask.bind(this); // 通过上方校验后 初始化

      this._init();
    }

    _createClass(Planning, [{
      key: "_init",
      value: function _init() {
        this._singleNavWidth;
        this._eleNavBarWrap; // 为容器元素添加类名

        this._eleWrap.classList.add('goma-planing-scope'); // 默认第一个cardProp对象未激活状态


        this._activeCardPropIndex = 0;
        this._LOAD_TIME = 0; // 渲染顶部导航

        this._renderNavBar();

        this._createTaskListWrap();

        this._createAddTaskComponent();

        this._renderTasks();
      } // ----------NavBar-----------------

    }, {
      key: "_renderNavBar",
      value: function _renderNavBar() {
        var _this = this;

        // 如果顶部导航容器不存在
        if (!this._eleWrap.querySelector('.navbar-wrap')) {
          // 创建顶部导航容器
          this._eleNavBarWrap = document.createElement('div');

          this._eleNavBarWrap.classList.add('navbar-wrap'); // 追加到外部容器中


          this._eleWrap.appendChild(this._eleNavBarWrap); // 添加点击事件监听器


          this._eleNavBarWrap.addEventListener('click', this._onMouseClickNavbar.bind(this), false); // 存储覆盖导航容器全部内容的html片段


          var _html = ''; // 存储cardsProp数组长度

          var _l = this._cardsProp.length; // 存储计算后的单个导航卡的百分比宽度

          this._singleNavWidth = (100 / _l).toFixed(2);

          for (var _i = 0; _i < _l; _i++) {
            // 存储当前遍历到的cardProp
            var _cardProp = this._cardsProp[_i]; // 存储当前遍历到的cardProp的距左百分比

            var _lp = this._singleNavWidth * _i; // 追加导航卡


            _html += "<div data-type=\"btn\" data-i=\"".concat(_i, "\" class=\"tag-btn ").concat(this._activeCardPropIndex == _i ? 'active' : '', "\" style=\"width:").concat(this._singleNavWidth, "%;\">\n  <span class=\"tag-name\" style=\"color:").concat(this._activeCardPropIndex == _i ? _cardProp.activeColor : _cardProp.defaultColor, "\">").concat(_cardProp.title, "</span>\n</div>");
          } // 存储当前激活状态的导航卡的指示器距离导航容器左侧百分比距离 _active_left_position缩写


          var _alp = this._activeCardPropIndex * this._singleNavWidth; // 在当前已激活的导航卡下方追加指示器样式


          _html += "<div class=\"navbar-pointer\" style=\"left:".concat(_alp, "%;color:").concat(this._cardsProp[this._activeCardPropIndex].activeColor, ";width:").concat(this._singleNavWidth, "%;\"></div>"); // 全部覆盖顶部导航容器中的内容

          this._eleNavBarWrap.innerHTML = _html;
          this._eleNavBarWrap.style.backgroundColor = this._navBarColor;
          this._eleWrap.style.backgroundColor = this._cardsProp[this._activeCardPropIndex].activeColor;
        } else {
          // 遍历所有.tag-name
          this._eleNavBarWrap.querySelectorAll('.tag-btn').forEach(function (ele, i) {
            if (_this._activeCardPropIndex == i) {
              ele.classList.add('active');
              ele.querySelector('.tag-name').style.color = _this._cardsProp[_this._activeCardPropIndex].activeColor;
              return;
            }

            ele.classList.remove('active');
            ele.querySelector('.tag-name').style.color = _this._cardsProp[_this._activeCardPropIndex].defaultColor;
          });

          this._eleWrap.style.backgroundColor = this._cardsProp[this._activeCardPropIndex].activeColor;
          this._eleNavBarWrap.querySelector('.navbar-pointer').style.left = "".concat(this._singleNavWidth * this._activeCardPropIndex, "%");
          this._eleNavBarWrap.querySelector('.navbar-pointer').style.color = this._cardsProp[this._activeCardPropIndex].activeColor;
        }
      }
    }, {
      key: "_onMouseClickNavbar",
      value: function _onMouseClickNavbar(e) {
        var target = e.target;

        while (target != this._eleNavBarWrap) {
          // 当前元素类型
          var type = target.dataset.type; // 如果是点击交互的按钮

          if (type == 'btn') {
            this._activeCardPropIndex = +target.dataset.i;

            this._renderNavBar();

            if (this._activeCardPropIndex !== 0) {
              this._eleAddTaskWrap.style.bottom = '-40px';
            } else {
              this._eleAddTaskWrap.style.bottom = '';
            }

            this._renderTasks();

            break;
          }

          target = target.parentNode;
        }
      } // 组件 -> 任务列表

    }, {
      key: "_createTaskListWrap",
      value: function _createTaskListWrap() {
        this._eleTaskListWrap = document.createElement('div');

        this._eleTaskListWrap.classList.add('task-list-wrap');

        this._eleWrap.appendChild(this._eleTaskListWrap);

        this._eleTaskListWrap.addEventListener('click', this._onClickTaskListWrap.bind(this), false);

        this._eleTaskList = document.createElement('div');

        this._eleTaskList.classList.add('task-list');

        this._eleTaskListWrap.appendChild(this._eleTaskList);
      }
    }, {
      key: "_renderTasks",
      value: function _renderTasks() {
        var _tasks = this._cardsProp[this._activeCardPropIndex].tasks;
        var _html = '';
        var _i = 0;

        for (; _i < _tasks.length; _i++) {
          _html += this._getTaskItemTemplate(_tasks[_i], _i);
        }

        this._eleTaskList.innerHTML = _html;
      }
    }, {
      key: "_appendNewTask",
      value: function _appendNewTask(task) {
        var _div = document.createElement('div');

        _div.innerHTML = this._getTaskItemTemplate(task, 0);

        this._eleTaskList.append(_div);

        this._eleTaskInput.focus();

        this._cardsProp[0].tasks.push(task);
      }
    }, {
      key: "_getTaskItemTemplate",
      value: function _getTaskItemTemplate(task, i) {
        return "<div class=\"task-item-wrap\" data-id=\"".concat(task.id, "\" style=\"animation-delay: ").concat(50 * i, "ms\"><div class=\"check-box\" data-type=\"btn\" data-task-id=\"").concat(task.id, "\"></div><p class=\"title\">").concat(task.title, "</p></div>");
      }
    }, {
      key: "_onClickTaskListWrap",
      value: function _onClickTaskListWrap(e) {
        var target = e.target;

        while (target !== this._eleTaskListWrap) {
          target = target.parentNode;
        }
      } // 组件 -> 创建任务

    }, {
      key: "_createAddTaskComponent",
      value: function _createAddTaskComponent() {
        var _this2 = this;

        this._eleAddTaskWrap = document.createElement('div');

        this._eleAddTaskWrap.classList.add('add-task-wrap');

        this._eleWrap.appendChild(this._eleAddTaskWrap);

        this._eleAddTaskInputWrap = document.createElement('div');

        this._eleAddTaskInputWrap.classList.add('add-task-input-wrap');

        this._eleAddTaskWrap.appendChild(this._eleAddTaskInputWrap);

        this._eleTaskInput = document.createElement('input');

        this._eleTaskInput.classList.add('add-task-input');

        this._eleTaskInput.setAttribute('placeholder', '创建新的计划');

        this._eleAddTaskInputWrap.appendChild(this._eleTaskInput);

        this._eleTaskInput.focus();

        this._eleTaskInput.addEventListener('keypress', function (e) {
          if (e.keyCode == 13) _this2._onClickSendTaskBtn();
        });

        this._eleSendTask = document.createElement('div');

        this._eleSendTask.classList.add('send-task');

        this._eleSendTask.style.color = this._cardsProp[0].activeColor;

        this._eleAddTaskInputWrap.appendChild(this._eleSendTask);

        this._eleSendTask.addEventListener('click', this._onClickSendTaskBtn.bind(this), false);
      }
    }, {
      key: "_onClickSendTaskBtn",
      value: function _onClickSendTaskBtn() {
        var _value = this._eleTaskInput.value.trim();

        if (!_value) return;
        this._eleTaskInput.value = '';
        this.onSendTask(_value, this._appendNewTask.bind(this, {
          title: _value
        }));
      } // 组件 -> 加载中...

    }, {
      key: "_createLoadingComponent",
      value: function _createLoadingComponent() {
        var _div = document.createElement('div'),
            elesLoading = '',
            d = 14,
            count = 4,
            delay = 100,
            colorCube = ['#f44336', '#f9a825', '#5abd5e', '#29b6f6'];

        for (var i = 0; i < count; i++) {
          elesLoading += "<span class=\"loading-dot\" style=\"animation: loading-dot 870ms ".concat(i * delay, "ms cubic-bezier(.21,.02,.78,.98) infinite; background-color: ").concat(colorCube[i], "; margin-left: ").concat((i - Math.ceil(count / 2)) * d, "px;\"></span>");
        }

        _div.classList.add('loading-wrap');

        _div.innerHTML = elesLoading;
        return _div;
      }
    }, {
      key: "_showLoading",
      value: function _showLoading() {
        this._eleLoading = this._createLoadingComponent();
        this._eleLoading.style.transitionDelay = "".concat(this._LOAD_TIME, "ms");
        this._eleLoading.dataset.visibility = 'visible';

        this._eleWrap.appendChild(this._eleLoading);
      }
    }, {
      key: "_destroyLoading",
      value: function _destroyLoading() {
        var _this3 = this;

        if (!this._eleLoading) return;
        var timer = setTimeout(function () {
          _this3._eleLoading && _this3._eleLoading.parentNode.removeChild(_this3._eleLoading);
          _this3._eleLoading = null;
          clearTimeout(timer);
          timer = null;
        }, this._LOAD_TIME * 2);
        this._eleLoading.dataset.visibility = 'hidden';
      }
    }]);

    return Planning;
  }();

  var main = {
    Planning: Planning
  };

  return main;

}));
