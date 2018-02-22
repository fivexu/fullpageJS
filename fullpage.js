class fullPage {
  constructor(dom, obj = {}) {
    if (!dom) {
      return
    }
    this.set = {
      runTime: obj.runTime || 300,
      mouseTime: obj.mouseTime || 300,
      isScrollBar: obj.isScrollBar || false
    }
    this.set.mouseTime = this.set.mouseTime <= 300 ? this.set.runTime : this.set.mouseTime
    this.dom = dom.nodeType ? dom : document.querySelector(dom)
    this.start = 0 // 滚轮开始滚动时的时间
    this.end = 0 // 滚轮结束滚动时的时间
    this.page = 0 // 当前滚动的页码
    this.touched = false // 确保touch事件触发一次
    this.wrapper = this.dom
    if (!this.wrapper.children[0]) {
      return
    }
    this.scrollItem = this.wrapper.children[0]
    this.children = this.scrollItem.children
    this.obj = {}
    this.initFullPage()
    window.addEventListener('resize', () => {
      this.isPC() ? this.mouseWheeling() : this.touching()
    })
  }
  
  initFullPage() {
    this.children.length <= 0 ? this.refresh() : this.setFullPageStyle()
    this.isPC() ? this.mouseWheeling() : this.touching()
  }
  
  on(event, fn) {
    if (event === 'scroll') {
      this.isPC() ? this.mouseWheeling(fn) : this.touching(fn)
    }
  }
  
  setFullpageData(path, maxPage, currentPage) {
    this.obj.path = path
    this.obj.maxPage = maxPage
    this.obj.currentPage = currentPage
    return this.obj
  }
  
  getStyle(element, attr) {
    if (element.currentStyle) {
      return element.currentStyle[attr]
    } else {
      return parseInt(getComputedStyle(element, null)[attr].substring(7).split(',')[5])
    }
  }
  
  initScrollTo(toY, allTime = this.set.runTime) {
    let timer = null
    let n = this.getScrollTop()
    let clientH = document.documentElement.clientHeight
    clearInterval(timer)
    timer = setInterval(() => {
      if (parseInt(n / clientH) < toY) {
        n += clientH * 30 / allTime
        window.scrollTo(0, n)
        if (n >= clientH * toY) {
          window.scrollTo(0, clientH * toY)
          clearInterval(timer)
        }
      } else {
        n -= clientH * 30 / allTime
        window.scrollTo(0, n)
        if (n <= clientH * toY) {
          window.scrollTo(0, clientH * toY)
          clearInterval(timer)
        }
      }
    }, 30)
  }
  
  initTranslate(toY, allTime = this.set.runTime) {
    let timer = null
    let n = Math.abs(this.getStyle(this.scrollItem, 'transform'))
    let clientH = document.documentElement.clientHeight
    clearInterval(timer)
    timer = setInterval(() => {
      if (parseInt(n / clientH) < toY) {
        n += clientH * 30 / allTime
        this.scrollItem.style.webkitTransform = `translateY(${-n}px)`
        if (n >= clientH * toY) {
          n = clientH * toY
          this.scrollItem.style.webkitTransform = `translateY(${-clientH * toY}px)`
          clearInterval(timer)
        }
      } else {
        n -= clientH * 30 / allTime
        this.scrollItem.style.webkitTransform = `translateY(${-n}px)`
        if (n <= clientH * toY) {
          n = clientH * toY
          this.scrollItem.style.webkitTransform = `translateY(${-clientH * toY}px)`
          clearInterval(timer)
        }
      }
    }, 30)
  }
  
  setFullPageStyle() {
    let height = `${document.documentElement.clientHeight}px`
    this.wrapper.style.width = `100%`
    this.wrapper.style.height = height
    this.scrollItem.style.width = `100%`
    this.scrollItem.style.height = height
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].style.width = `100%`
      this.children[i].style.height = height
      this.children[i].style.overflow = `hidden`
    }
    if (!this.set.isScrollBar) {
      this.wrapper.style.overflow = 'hidden'
      this.scrollItem.style.webkitTransform = 'translateY(0)'
    }
  }
  
  isPC() {
    let userAgentInfo = navigator.userAgent
    let Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']
    let flag = true
    for (let v = 0; v < Agents.length; v++) {
      if (userAgentInfo.indexOf(Agents[v]) > 0) {
        flag = false
        break
      }
    }
    return flag
  }
  
  getScrollTop() {
    let scrollTop = 0
    if (document.documentElement && document.documentElement.scrollTop) {
      scrollTop = document.documentElement.scrollTop
    } else if (document.body) {
      scrollTop = document.body.scrollTop
    }
    return scrollTop
  }
  
  addMouseWheel(fn, dom = this.wrapper) {
    if ((navigator.userAgent.toLowerCase().indexOf('firefox') !== -1)) {
      dom.addEventListener('DOMMouseScroll', fn, false)
    } else if (document.addEventListener) {
      dom.addEventListener('mousewheel', fn, false)
    } else if (document.attachEvent) {
      dom.attachEvent('onmousewheel', fn)
    } else {
      dom.onmousewheel = fn
    }
  }
  
  mouseWheeling(fn = null) {
    this.addMouseWheel((ev) => {
      ev = ev || event
      ev.preventDefault()
      let delta = ev.wheelDelta || -ev.detail
      this.start = new Date().getTime()
      this.page = this.set.isScrollBar ? Math.ceil(this.getScrollTop() / document.documentElement.clientHeight) : Math.abs(parseInt(this.getStyle(this.scrollItem, 'transform') / document.documentElement.clientHeight))
      if (this.end - this.start <= -this.set.mouseTime) {
        if (delta < 0) {
          this.page++
          if (this.page >= this.children.length - 1) {
            this.page = this.children.length - 1
          }
          this.obj = {
            path: true,
            maxPage: this.children.length,
            currentPage: this.page
          }
          this.set.isScrollBar ? this.initScrollTo(this.page) : this.initTranslate(this.page)
        }
        if (delta > 0) {
          this.page--
          if (this.page <= 0) {
            this.page = 0
          }
          this.obj = {
            path: false,
            maxPage: this.children.length,
            currentPage: this.page
          }
          this.set.isScrollBar ? this.initScrollTo(this.page) : this.initTranslate(this.page)
        }
        this.end = new Date().getTime()
      } else {
        ev.preventDefault()
      }
      if (fn) {
        fn(this.obj)
      }
    })
  }
  
  touching(fn = null) {
    let distaY = 0
    let initTouch = {}
    let startY = {}
    this.page = this.set.isScrollBar ? parseInt(this.getScrollTop() / document.documentElement.clientHeight) : Math.abs(parseInt(this.getStyle(this.scrollItem, 'transform') / document.documentElement.clientHeight))
    this.wrapper.addEventListener('touchstart', (ev) => {
      ev = ev || event
      ev.stopPropagation()
      ev.preventDefault()
      const touch = ev.touches[0]
      initTouch = true
      startY = touch.pageY
    })
    this.wrapper.addEventListener('touchmove', (ev) => {
      if (!initTouch) {
        return
      }
      ev = ev || event
      ev.stopPropagation()
      ev.preventDefault()
      const touch = ev.touches[0]
      distaY = touch.pageY - startY
    })
    this.wrapper.addEventListener('touchend', (ev) => {
      ev = ev || event
      ev.stopPropagation()
      ev.preventDefault()
      initTouch = false
      if (!this.touched) {
        if (distaY < -50) {
          this.page++
          if (this.page >= this.children.length - 1) {
            this.page = this.children.length - 1
          }
          this.obj = {
            path: true,
            maxPage: this.children.length,
            currentPage: this.page
          }
          this.setFullpageData(true, this.children.length, this.page)
          this.set.isScrollBar ? this.initScrollTo(this.page) : this.initTranslate(this.page)
        }
        if (distaY > 50) {
          this.page--
          if (this.page <= 0) {
            this.page = 0
          }
          this.obj = {
            path: false,
            maxPage: this.children.length,
            currentPage: this.page
          }
          this.setFullpageData(false, this.children.length, this.page)
          this.set.isScrollBar ? this.initScrollTo(this.page) : this.initTranslate(this.page)
        }
        this.touched = true
      }
      if (fn) {
        fn(this.obj)
      }
      setTimeout(() => {
        this.touched = false
      }, this.set.mouseTime)
    })
  }
  
  refresh() {
    let timer = null
    clearInterval(timer)
    timer = setInterval(() => {
      if (this.children.length) {
        this.initFullPage()
        clearInterval(timer)
      }
    }, 30)
    setTimeout(() => {
      clearInterval(timer)
    }, 10000)
  }
}

export default fullPage