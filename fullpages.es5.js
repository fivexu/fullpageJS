var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fullPage = function () {
  function fullPage(dom) {
    var _this = this;
    
    var obj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    
    _classCallCheck(this, fullPage);
    
    if (!dom) {
      return;
    }
    this.set = {
      runTime: obj.runTime || 300,
      mouseTime: obj.mouseTime || 300,
      isScrollBar: obj.isScrollBar || false
    };
    this.set.mouseTime = this.set.mouseTime <= 300 ? this.set.runTime : this.set.mouseTime;
    this.dom = dom.nodeType ? dom : document.querySelector(dom);
    this.start = 0; // 滚轮开始滚动时的时间
    this.end = 0; // 滚轮结束滚动时的时间
    this.page = 0; // 当前滚动的页码
    this.touched = false; // 确保touch事件触发一次
    this.wrapper = this.dom;
    if (!this.wrapper.children[0]) {
      return;
    }
    this.scrollItem = this.wrapper.children[0];
    this.children = this.scrollItem.children;
    this.obj = {};
    this.initFullPage();
    window.addEventListener('resize', function () {
      _this.isPC() ? _this.mouseWheeling() : _this.touching();
    });
  }
  
  _createClass(fullPage, [{
    key: 'initFullPage',
    value: function initFullPage() {
      this.children.length <= 0 ? this.refresh() : this.setFullPageStyle();
      this.isPC() ? this.mouseWheeling() : this.touching();
    }
  }, {
    key: 'on',
    value: function on(event, fn) {
      if (event === 'scroll') {
        this.isPC() ? this.mouseWheeling(fn) : this.touching(fn);
      }
    }
  }, {
    key: 'setFullpageData',
    value: function setFullpageData(path, maxPage, currentPage) {
      this.obj.path = path;
      this.obj.maxPage = maxPage;
      this.obj.currentPage = currentPage;
      return this.obj;
    }
  }, {
    key: 'getStyle',
    value: function getStyle(element, attr) {
      if (element.currentStyle) {
        return element.currentStyle[attr];
      } else {
        return parseInt(getComputedStyle(element, null)[attr].substring(7).split(',')[5]);
      }
    }
  }, {
    key: 'initScrollTo',
    value: function initScrollTo(toY) {
      var allTime = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.set.runTime;
      
      var timer = null;
      var n = this.getScrollTop();
      var clientH = document.documentElement.clientHeight;
      clearInterval(timer);
      timer = setInterval(function () {
        if (parseInt(n / clientH) < toY) {
          n += clientH * 30 / allTime;
          window.scrollTo(0, n);
          if (n >= clientH * toY) {
            window.scrollTo(0, clientH * toY);
            clearInterval(timer);
          }
        } else {
          n -= clientH * 30 / allTime;
          window.scrollTo(0, n);
          if (n <= clientH * toY) {
            window.scrollTo(0, clientH * toY);
            clearInterval(timer);
          }
        }
      }, 30);
    }
  }, {
    key: 'initTranslate',
    value: function initTranslate(toY) {
      var _this2 = this;
      
      var allTime = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.set.runTime;
      
      var timer = null;
      var n = Math.abs(this.getStyle(this.scrollItem, 'transform'));
      var clientH = document.documentElement.clientHeight;
      clearInterval(timer);
      timer = setInterval(function () {
        if (parseInt(n / clientH) < toY) {
          n += clientH * 30 / allTime;
          _this2.scrollItem.style.webkitTransform = 'translateY(' + -n + 'px)';
          if (n >= clientH * toY) {
            n = clientH * toY;
            _this2.scrollItem.style.webkitTransform = 'translateY(' + -clientH * toY + 'px)';
            clearInterval(timer);
          }
        } else {
          n -= clientH * 30 / allTime;
          _this2.scrollItem.style.webkitTransform = 'translateY(' + -n + 'px)';
          if (n <= clientH * toY) {
            n = clientH * toY;
            _this2.scrollItem.style.webkitTransform = 'translateY(' + -clientH * toY + 'px)';
            clearInterval(timer);
          }
        }
      }, 30);
    }
  }, {
    key: 'setFullPageStyle',
    value: function setFullPageStyle() {
      var height = document.documentElement.clientHeight + 'px';
      this.wrapper.style.width = '100%';
      this.wrapper.style.height = height;
      this.scrollItem.style.width = '100%';
      this.scrollItem.style.height = height;
      for (var i = 0; i < this.children.length; i++) {
        this.children[i].style.width = '100%';
        this.children[i].style.height = height;
        this.children[i].style.overflow = 'hidden';
      }
      if (!this.set.isScrollBar) {
        this.wrapper.style.overflow = 'hidden';
        this.scrollItem.style.webkitTransform = 'translateY(0)';
      }
    }
  }, {
    key: 'isPC',
    value: function isPC() {
      var userAgentInfo = navigator.userAgent;
      var Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
      var flag = true;
      for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
          flag = false;
          break;
        }
      }
      return flag;
    }
  }, {
    key: 'getScrollTop',
    value: function getScrollTop() {
      var scrollTop = 0;
      if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop;
      } else if (document.body) {
        scrollTop = document.body.scrollTop;
      }
      return scrollTop;
    }
  }, {
    key: 'addMouseWheel',
    value: function addMouseWheel(fn) {
      var dom = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.wrapper;
      
      if (navigator.userAgent.toLowerCase().indexOf('firefox') !== -1) {
        dom.addEventListener('DOMMouseScroll', fn, false);
      } else if (document.addEventListener) {
        dom.addEventListener('mousewheel', fn, false);
      } else if (document.attachEvent) {
        dom.attachEvent('onmousewheel', fn);
      } else {
        dom.onmousewheel = fn;
      }
    }
  }, {
    key: 'mouseWheeling',
    value: function mouseWheeling() {
      var _this3 = this;
      
      var fn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      
      this.addMouseWheel(function (ev) {
        ev = ev || event;
        ev.preventDefault();
        var delta = ev.wheelDelta || -ev.detail;
        _this3.start = new Date().getTime();
        _this3.page = _this3.set.isScrollBar ? Math.ceil(_this3.getScrollTop() / document.documentElement.clientHeight) : Math.abs(parseInt(_this3.getStyle(_this3.scrollItem, 'transform') / document.documentElement.clientHeight));
        if (_this3.end - _this3.start <= -_this3.set.mouseTime) {
          if (delta < 0) {
            _this3.page++;
            if (_this3.page >= _this3.children.length - 1) {
              _this3.page = _this3.children.length - 1;
            }
            _this3.obj = {
              path: true,
              maxPage: _this3.children.length,
              currentPage: _this3.page
            };
            _this3.set.isScrollBar ? _this3.initScrollTo(_this3.page) : _this3.initTranslate(_this3.page);
          }
          if (delta > 0) {
            _this3.page--;
            if (_this3.page <= 0) {
              _this3.page = 0;
            }
            _this3.obj = {
              path: false,
              maxPage: _this3.children.length,
              currentPage: _this3.page
            };
            _this3.set.isScrollBar ? _this3.initScrollTo(_this3.page) : _this3.initTranslate(_this3.page);
          }
          _this3.end = new Date().getTime();
        } else {
          ev.preventDefault();
        }
        if (fn) {
          fn(_this3.obj);
        }
      });
    }
  }, {
    key: 'touching',
    value: function touching() {
      var _this4 = this;
      
      var fn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      
      var distaY = 0;
      var initTouch = {};
      var startY = {};
      this.page = this.set.isScrollBar ? parseInt(this.getScrollTop() / document.documentElement.clientHeight) : Math.abs(parseInt(this.getStyle(this.scrollItem, 'transform') / document.documentElement.clientHeight));
      this.wrapper.addEventListener('touchstart', function (ev) {
        ev = ev || event;
        ev.stopPropagation();
        ev.preventDefault();
        var touch = ev.touches[0];
        initTouch = true;
        startY = touch.pageY;
      });
      this.wrapper.addEventListener('touchmove', function (ev) {
        if (!initTouch) {
          return;
        }
        ev = ev || event;
        ev.stopPropagation();
        ev.preventDefault();
        var touch = ev.touches[0];
        distaY = touch.pageY - startY;
      });
      this.wrapper.addEventListener('touchend', function (ev) {
        ev = ev || event;
        ev.stopPropagation();
        ev.preventDefault();
        initTouch = false;
        if (!_this4.touched) {
          if (distaY < -50) {
            _this4.page++;
            if (_this4.page >= _this4.children.length - 1) {
              _this4.page = _this4.children.length - 1;
            }
            _this4.obj = {
              path: true,
              maxPage: _this4.children.length,
              currentPage: _this4.page
            };
            _this4.setFullpageData(true, _this4.children.length, _this4.page);
            _this4.set.isScrollBar ? _this4.initScrollTo(_this4.page) : _this4.initTranslate(_this4.page);
          }
          if (distaY > 50) {
            _this4.page--;
            if (_this4.page <= 0) {
              _this4.page = 0;
            }
            _this4.obj = {
              path: false,
              maxPage: _this4.children.length,
              currentPage: _this4.page
            };
            _this4.setFullpageData(false, _this4.children.length, _this4.page);
            _this4.set.isScrollBar ? _this4.initScrollTo(_this4.page) : _this4.initTranslate(_this4.page);
          }
          _this4.touched = true;
        }
        if (fn) {
          fn(_this4.obj);
        }
        setTimeout(function () {
          _this4.touched = false;
        }, _this4.set.mouseTime);
      });
    }
  }, {
    key: 'refresh',
    value: function refresh() {
      var _this5 = this;
      
      var timer = null;
      clearInterval(timer);
      timer = setInterval(function () {
        if (_this5.children.length) {
          _this5.initFullPage();
          clearInterval(timer);
        }
      }, 30);
      setTimeout(function () {
        clearInterval(timer);
      }, 10000);
    }
  }]);
  
  return fullPage;
}();