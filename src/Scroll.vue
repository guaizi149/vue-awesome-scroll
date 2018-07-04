<template>
  <div class="l-scroll-wrapper">
    <div class="l-scroll-content">
      <div ref="listWrapper" class="l-scroll-list-wrapper">
        <slot></slot>
      </div>
      <slot name="pullup">
        <div class="l-pullup-wrapper" v-if="pullUpLoad">
          <div class="after-trigger" v-if="isPullUpLoad || isLoading">
            <loading></loading>
          </div>
          <div class="before-trigger" v-else>
            <span>{{pullUpTxt}}</span>
          </div>
        </div>
      </slot>
    </div>
    <div v-if="pullDownRefresh" class="l-pulldown" ref="pulldown">
      <slot name="pulldown">
        <div class="l-pulldown-wrapper" :style="pullDownStyle">
          <div class="before-trigger" v-show="beforePullDown">
            <bubble :y="bubbleY" class="bubble"></bubble>
          </div>
          <div class="after-trigger" v-show="!beforePullDown">
            <div v-show="isPullingDown" class="loading">
              <loading></loading>
            </div>
            <div v-show="!isPullingDown" class="l-pulldown-loaded">
              <span>{{ refreshTxt }}</span>
            </div>
          </div>
        </div>
      </slot>
    </div>
  </div>
</template>
<script>
  import BScroll from 'better-scroll'
  import Loading from './loading/loading.vue'
  import Bubble from './bubble/bubble.vue'

  const DEFAULT_REFRESH_TXT = '更新成功'
  const DEFAULT_STOP_TIME = 600

  const EVENT_CLICK = 'click'
  const EVENT_PULLING_DOWN = 'pulling-down'
  const EVENT_PULLING_UP = 'pulling-up'

  const DEFAULT_OPTIONS = {
    observeDOM: true,
    click: true,
    probeType: 1,
    scrollbar: false,
    pullDownRefresh: false,
    pullUpLoad: false
  }

  const DEFAULT_EVENTS = [
    'beforeScrollStart',
    'scrollStart',
    'scroll',
    'scrollCancel',
    'scrollEnd',
    'touchEnd',
    'flick',
    'refresh',
    'destroy',
    'pullingDown',
    // 'pullingUp',
    'zoomStart',
    'zoomEnd'
  ]

  export default {
    data() {
      return {
        isPullUpLoad: false,
        isLoading: false,
        pullUpDirty: true,
        scroll: null,
        beforePullDown: true,
        isPullingDown: false,
        bubbleY: 0,
        pullDownStyle: '',
        pullDownStop: 40,
        pullDownHeight: 60
      }
    },
    computed: {
      pullUpLoad() {
        return this.options.pullUpLoad
      },
      pullUpTxt() {
        const moreTxt = this.pullUpLoad && this.pullUpLoad.txt && this.pullUpLoad.txt.more || "加载更多";

        const noMoreTxt = this.pullUpLoad && this.pullUpLoad.txt && this.pullUpLoad.txt.noMore || "end";

        return this.pullUpDirty ? moreTxt : noMoreTxt
      },
      pullDownRefresh() {
        let pullDownRefresh = this.options.pullDownRefresh
        if (!pullDownRefresh) {
          return pullDownRefresh
        }
        if (pullDownRefresh === true) {
          pullDownRefresh = {}
        }
        return Object.assign({
          stop: this.pullDownStop
        }, pullDownRefresh)
      },
      refreshTxt() {
        const pullDownRefresh = this.pullDownRefresh
        return (pullDownRefresh && pullDownRefresh.txt) || DEFAULT_REFRESH_TXT
      },
    },
    props: {
      options: {
        type: Object,
        default: () => ({})
      },
      globalOptions: {
        type: Object,
        required: false,
        default: () => ({})
      },
      noMoreData: {
        type: Boolean,
        default: false
      },
    },
    mounted() {
      this.initScroll();
    },
    methods: {
      initScroll() {
        if (!this.scroll) {
          setTimeout(() => {
            this._initScroll();
          }, 0)
        } else {
          this.scroll.refresh();
        }
      },
      _initScroll() {
        const scrollOptions = Object.assign({}, this.globalOptions, this.options)
        this.scroll = new BScroll(this.$el, scrollOptions);
        this.bindEvents();
        this.$emit('ready', this.scroll);

        // 是否派发滚动到底部事件，用于上拉加载
        if (this.pullUpLoad) {
          this._initPullUpLoad();
        }

        // 是否派发顶部下拉事件，用于下拉刷新
        if (this.pullDownRefresh) {
          this._getPullDownEleHeight()
          this._onPullDownRefresh()
        }
      },
      bindEvents() {
        const vm = this
        DEFAULT_EVENTS.forEach(eventName => {
          this.scroll.on(eventName, function () {
            vm.$emit(eventName, ...arguments)
          })
        })
      },
      rebuildScroll() {
        this.$nextTick(() => {
          if (this.scroll) {
            this.scroll.destroy();
          }
          this._initScroll();
        })
      },
      forceUpdate(dirty) {
        if (this.pullDownRefresh && this.isPullingDown) {
          this.isPullingDown = false
          this._reboundPullDown(() => {
            this._afterPullDown(dirty)
          })
        } else if (this.pullUpLoad) { // && this.isPullUpLoad
          this.isPullUpLoad = false;
          this.isLoading = false;
          this.scroll.finishPullUp()
          this.scroll.refresh()
        } else {
          this.scroll.refresh()
        }
      },
      forceLoading(val = true) {
        this.isPullUpLoad = val;
      },
      _initPullUpLoad() {
        this.scroll.on('pullingUp', () => {
          if (!this.noMoreData) {
            this.isPullUpLoad = true
          }
          this.$emit('pullingUp')
        })
      },
      _reboundPullDown(next) {
        const {
          stopTime = DEFAULT_STOP_TIME
        } = this.pullDownRefresh
        setTimeout(() => {
          this.scroll.finishPullDown()
          next()
        }, stopTime)
      },
      _afterPullDown(dirty) {
        this.resetPullDownTimer = setTimeout(() => {
          this.pullDownStyle = `top: -${this.pullDownHeight}px`;
          this.beforePullDown = true;
          dirty && this.scroll.refresh();
        }, this.scroll.options.bounceTime);
      },
      _getPullDownEleHeight() {
        const pulldown = this.$refs.pulldown.firstChild
        this.pullDownHeight = this._getRect(pulldown).height

        this.beforePullDown = false
        this.isPullingDown = true
        this.$nextTick(() => {
          this.pullDownStop = this._getRect(pulldown).height

          this.beforePullDown = true
          this.isPullingDown = false
        })
      },
      _calculateMinHeight() {
        if (this.$refs.listWrapper) {
          this.$refs.listWrapper.style.minHeight = this.pullDownRefresh || this.pullUpLoad ? `${this._getRect(this.$refs.wrapper).height + 1}px` : 0
        }
      },
      _onPullDownRefresh() {
        this.scroll.on('pullingDown', this._pullDownHandle)
        this.scroll.on('scroll', this._pullDownScrollHandle)
      },
      _offPullDownRefresh() {
        this.scroll.off('pullingDown', this._pullDownHandle)
        this.scroll.off('scroll', this._pullDownScrollHandle)
      },
      _pullDownHandle() {
        if (this.resetPullDownTimer) {
          clearTimeout(this.resetPullDownTimer)
        }
        this.beforePullDown = false
        this.isPullingDown = true
        this.$emit('pulling-down')
      },
      _pullDownScrollHandle(pos) {
        if (this.beforePullDown) {
          this.bubbleY = Math.max(0, pos.y - this.pullDownHeight)
          this.pullDownStyle = `top:${Math.min(pos.y - this.pullDownHeight, 0)}px`
        } else {
          this.bubbleY = 0
          this.pullDownStyle = `top:${Math.min(pos.y - this.pullDownStop, 0)}px`
        }
      },
      _getRect(el) {
        return {
          top: el.offsetTop,
          left: el.offsetLeft,
          width: el.offsetWidth,
          height: el.offsetHeight
        }
      }
    },
    watch: {
      noMoreData(nv) {
        if (nv) {
          this.pullUpDirty = false;
        }
      },
      pullDownRefresh: {
        handler(newVal, oldVal) {
          if (newVal) {
            this.scroll.openPullDown(newVal)
            if (!oldVal) {
              this._onPullDownRefresh()
              this._calculateMinHeight()
            }
          }

          if (!newVal && oldVal) {
            this.scroll.closePullDown()
            this._offPullDownRefresh()
            this._calculateMinHeight()
          }
        },
        deep: true
      },
    },
    components: {
      Loading,
      Bubble
    }
  }
</script>
<style>
  .l-pullup-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 100%;
  }

  .l-pullup-wrapper .before-trigger {
    padding: 22px 0;
    min-height: 1em;
  }

  .l-pullup-wrapper .after-trigger {
    padding: 19px 0;
  }

  .l-scroll-wrapper {
    position: relative;
    height: 100%;
    overflow: hidden;
  }

  .l-pulldown-wrapper {
    position: absolute;
    width: 100%;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all;
  }

  .l-pulldown-wrapper .before-trigger {
    height: 54px;
    line-height: 0;
    padding-top: 6px;
  }

  .l-pulldown-wrapper .after-trigger .loading {
    padding: 8px 0
  }

  .l-pulldown-wrapper .after-trigger .l-pulldown-loaded {
    padding: 12px 0
  }

  .l-scroll-content {
    position: relative;
    z-index: 1;
  }
</style>
