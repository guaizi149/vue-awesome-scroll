<template>
  <div class="list-wrapper">
    <div class="scroll-content">
      <div ref="listWrapper">
        <slot></slot>
      </div>
      <slot name="pullup">
        <div class="pullup-wrapper" v-if="pullUpLoad">
          <div class="before-trigger" v-if="!isPullUpLoad">
            <span>{{pullUpTxt}}</span>
          </div>
          <div class="after-trigger" v-else>
            <loading></loading>
          </div>
        </div>
      </slot>
    </div>
  </div>
</template>
<script>
  import _BScroll from 'better-scroll';
  const BScroll = window.BScroll || _BScroll;
  import Loading from './loading/loading.vue';

    // pollfill
  if (typeof Object.assign != 'function') {
    Object.defineProperty(Object, 'assign', {
      value(target, varArgs) {
        if (target == null) {
          throw new TypeError('Cannot convert undefined or null to object')
        }
        const to = Object(target)
        for (let index = 1; index < arguments.length; index++) {
          const nextSource = arguments[index]
          if (nextSource != null) {
            for (const nextKey in nextSource) {
              if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                to[nextKey] = nextSource[nextKey]
              }
            }
          }
        }
        return to
      },
      writable: true,
      configurable: true
    })
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
    name: 'bscroll',
    data() {
      return {
        isPullUpLoad: false,
        pullUpDirty: true,
        scroll: null,
      }
    },
    computed: {
      pullUpLoad() {
        return this.options && this.options.pullUpLoad
      },
      pullUpTxt() {
        const moreTxt = this.pullUpLoad && this.pullUpLoad.txt && this.pullUpLoad.txt.more || "加载更多";

        const noMoreTxt = this.pullUpLoad && this.pullUpLoad.txt && this.pullUpLoad.txt.noMore || "end";

        return this.pullUpDirty ? moreTxt : noMoreTxt
      }
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
      timeToRefresh: {
        type: Number,
        default: -1
      },
    },
    mounted() {
      console.log("zmScroll mounted时>>>>>>>>>>>>>>>>>>>>>>>>>>", this.timeToRefresh);
      this.initScroll();
      // if (this.init === -1) {
      // }
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
        console.log("this.scroll init>>>>>>>>>>>>>>>>>>>>>>:", this.scroll);
        this.bindEvents();
        this.$emit('ready', this.scroll);

        // 是否派发滚动到底部事件，用于上拉加载
        if (this.pullUpLoad) {
          this._initPullUpLoad();
        }

        // // 是否派发顶部下拉事件，用于下拉刷新
        // if (this.pulldown) {
        //   this.scroll.on('touchend', (pos) => {
        //     // 下拉动作
        //     if (pos.y > 50) {
        //       this.$emit('pulldown')
        //     }
        //   })
        // }
      },

      forceUpdate() {
        if (this.pullDownRefresh && this.isPullingDown) {
          this.isPullingDown = false
          this._reboundPullDown().then(() => {
            this._afterPullDown()
          })
        } else if (this.pullUpLoad) { // && this.isPullUpLoad
          console.log("refresh pullup load!");
          this.isPullUpLoad = false
          this.scroll.finishPullUp()
          // this.pullUpDirty = this.noMoreData ? false : true;
          this.scroll.refresh()
        } else {
          this.scroll.refresh()
        }
      },
      _initPullUpLoad() {
        this.scroll.on('pullingUp', () => {
          console.log("pullingup  event  emit: ");
          if (!this.noMoreData) {
            this.isPullUpLoad = true
          }
          this.$emit('pullingUp')
        })
      },
      bindEvents() {
        const vm = this
        DEFAULT_EVENTS.forEach(eventName => {
          this.scroll.on(eventName, function () {
            vm.$emit(eventName, ...arguments)
            // vm.$emit(eventName.replace(/([A-Z])/g, '-$1').toLowerCase(), ...arguments)
          })
        })
      },
      rebuildScroll() {
        this.$nextTick(() => {
          if(this.scroll) {
            this.scroll.destroy();
          }
          this._initScroll();
        })
      }
    },
    watch: {
      noMoreData(nv) {
        if (nv) {
          this.pullUpDirty = false;
        }
      },
      timeToRefresh(nv, ov) {
        if (nv > ov) {
          console.log("time to rebuild>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
          this.rebuildScroll();
          // this.scroll.refresh();
        }
      },
      // pullUpLoad: {
      //   handler(val) {
      //     const scroll = this.scroll;
      //     if (scroll) {
      //       this.$nextTick(() => {
      //         console.log("pull up load changed~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~", val);
      //         // val ? scroll.openPullUp() : scroll.closePullUp();
      //         if (val) {
      //           scroll.openPullUp();
      //         } else {
      //           scroll.closePullUp();
      //         }
      //         scroll.refresh();
      //       })
      //     }
      //   },
      //   deep: true
      // },
    },
    components: {
      Loading,
    }
  }
</script>
