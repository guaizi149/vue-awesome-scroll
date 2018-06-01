
/*
* VueAwesomeSwiper
* Author: surmon@foxmail.com
* Github: https://github.com/surmon-china/vue-awesome-swiper
*/


import _BScroll from 'better-scroll'
import BScrollComponent from './Scroll.vue'

const BScroll = window.BScroll || _BScroll
const bscroll = BScrollComponent

const install = function (Vue, globalOptions) {
  if (globalOptions) {
    BScrollComponent.props.globalOptions.default = () => globalOptions
  }
  Vue.component(BScrollComponent.name, BScrollComponent)
}
const VueAwesomeScroll = { BScroll, bscroll, install }

export default VueAwesomeScroll
export { BScroll, bscroll, install }
