

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
# TO DO
- [ ] pull up to load
- [ ] pull down to refresh
- [ ] add exmaple
- [ ] add test
- [ ] add key point to use better-scroll

# API
Scroll's API and configuration can be used.（Scroll官网中的API及配置均可使用）
- [CN Scroll documents](https://github.com/ustbhuangyi/better-scroll/blob/master/README_zh-CN.md)
- [EN Scroll documents](https://github.com/ustbhuangyi/better-scroll)


# Author
[Surmon](xjj518.com)
