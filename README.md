

# Vue-Awesome-Scroll
[better-scroll](https://ustbhuangyi.github.io/better-scroll/doc/zh-hans/options.html#directionlockthreshold) component for Vue, support pc and mobile, SPA.

基于 [better-scroll](https://ustbhuangyi.github.io/better-scroll/doc/zh-hans/options.html#directionlockthreshold)、适用于 Vue 的滚动组件。


# Install

#### CDN

``` html
<script type="text/javascript" src="path/to/better-scroll.js"></script>
<script type="text/javascript" src="path/to/vue.min.js"></script>
<script type="text/javascript" src="path/to/dist/vue-awesome-scroll.js"></script>
<script type="text/javascript">
  Vue.use(window.VueAwesomeScroll)
</script>
```

#### NPM

``` bash
npm install vue-awesome-scroll --save
```

### Mount

#### mount with global

``` javascript
import Vue from 'vue'
import VueAwesomeScroll from 'vue-awesome-scroll'


Vue.use(VueAwesomeScroll, /* { default global options } */)
```

#### mount with component

```javascript

import { bscroll } from 'vue-awesome-scroll'

export default {
  components: {
    bscroll
  }
}
```


### SPA

```vue
<!-- The ref attr used to find the scroll instance -->
<template>
  <bscroll :options="scrollOption" ref="myScroll" @someScrollEvent="callback">

  </bscroll>
</template>

<script>
  export default {
    name: 'carrousel',
    data() {
      return {
        scrollOption: {
          // some scroll options/callbacks
          // 所有的参数同 scroll 官方 api 参数
          // ...
           pullUpLoad: {
                    threshold: 0, //负数表示向上拉多少更新，正数表示距离底部还有多少时就去更新
                    txt: {
                        more: "加载更多...",
                        noMore: "没有更多历史版本了"
                    }
           },
           pullDownRefresh: {
                        threshold: 60,
                        stopTime: 1000,
                        txt: '更新成功'
           },
           bounceTime: 1000,
        }
      }
    },
    computed: {
      scroll() {
        return this.$refs.myScroll.scroll
      }
    },
    mounted() {
      // current scroll instance
      // 然后你就可以使用当前上下文内的scroll对象去做你想做的事了
      console.log('this is current scroll instance object', this.scroll)
    }
  }
</script>
```

# Props 配置：

| 参数    | 说明                                                         | 类型   | 可选值 | 默认值                                                       |
| ------- | ------------------------------------------------------------ | ------ | ------ | ------------------------------------------------------------ |
| options | better-scroll 配置项，具体请参考[BS 官方文档](https://ustbhuangyi.github.io/better-scroll/doc/zh-hans/options.html) | Object | -      | { observeDOM: true, click: true, probeType: 1, scrollbar: false, pullDownRefresh: false, pullUpLoad: false } |

 `options`中 better-scroll 的几个常用配置项，`pullDownRefresh`、`pullUpLoad`这两个配置即可设为 `Boolean`（`false` 关闭该功能，`true` 开启该功能，并使用默认子配置），也可设为`Object`，开启该功能并具体定制其子配置项。 

- `pullDownRefresh` 子配置项

| 参数      | 说明                       | 类型   | 可选值 | 默认值                                       |
| --------- | -------------------------- | ------ | ------ | -------------------------------------------- |
| threshold | 下拉刷新动作的下拉距离阈值 | Number | -      | 90                                           |
| stop      | 回弹停留的位置             | Number | -      | 组件会自动计算回弹时显示的元素高度作为默认值 |
| stopTime  | 刷新成功的文案显示时间     | Number | -      | 600                                          |
| txt       | 刷新成功的文案             | String | -      | 'Refresh success'                            |

- `pullUpLoad` 子配置项

| 参数      | 说明                       | 类型   | 可选值 | 默认值                   |
| --------- | -------------------------- | ------ | ------ | ------------------------ |
| threshold | 上拉刷新动作的上拉距离阈值 | Number | -      | 0                        |
| txt       | 上拉加载的相关文案         | Object | -      | { more: '', noMore: '' } |

# TO DO
- [x] pull up to load
- [x] pull down to refresh
- [ ] add exmaple
- [ ] add test
- [ ] add key point to use better-scroll

# API
Scroll's API and configuration can be used.（Scroll官网中的API及配置均可使用）
- [CN Scroll documents](https://github.com/ustbhuangyi/better-scroll/blob/master/README_zh-CN.md)
- [EN Scroll documents](https://github.com/ustbhuangyi/better-scroll)


# Author
[Surmon](xjj518.com)
