<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

  export default {
    name: "Scroll",
    props: {
      probeType: {
        type:Number,
        default:0
      },
      pullUpLoad: {
        type:Boolean,
        default:false
      }
    },
    data() {
      return {
        scroll: null,
        message: '哈哈哈'
      }
    },
    updated() {
      this.scroll && this.scroll.refresh()
    },
    mounted() {
      this.initBetterScroll();
    },
    methods: {
      // 1.创建BScroll对象;
    // initBetterScroll() {
    //     this.scroll = new BScroll(this.$refs.wrapper, {
    //     click: true,
    //     probeType: this.probeType, //这个属性设置之后可以监听得到了
    //     pullUpLoad: this.pullUpLoad,
    //     mouseWheel: true
    //    });
      
    //   console.log(this.scroll);

    //   // 监听滚动的位置
    //       if (this.probeType === 2 || this.probeType === 3) {
    //       this.scroll.on('scroll',(position) =>{
    //       this.$emit('scroll',position)
    //     })
    //   }
    //   //监听上拉加载更多事件
    //   if (this.pullUpLoad) {
    //     this.scroll.on('pullingUp', () =>{
    //       this.$emit('pullingUp')
    //     })
    //   }
    // },

      initBetterScroll() {
        this.$nextTick(() => {
        this.scroll = new BScroll(this.$refs.wrapper, {
        click: true,
        probeType: this.probeType, //这个属性设置之后可以监听得到了
        pullUpLoad: this.pullUpLoad,
        mouseWheel: true
       });

      // 监听滚动的位置
          if (this.probeType === 2 || this.probeType === 3) {
          this.scroll.on('scroll',(position) =>{
          this.$emit('scroll',position)
        })
      }
      //监听上拉加载更多事件
      if (this.pullUpLoad) {
        this.scroll.on('pullingUp', () =>{
          this.$emit('pullingUp')
        })
      }
      });
    },
      finishPullUp() {
        this.scroll && this.scroll.finishPullUp()
      },
      refresh() {
        this.scroll && this.scroll.refresh();
      },
      // 回到顶部方法
      scrollBackTop(x, y, time=1200) {
        this.scroll && this.scroll.scrollTo && this.scroll.scrollTo(x, y, time)
      },
      getScrollY() {
        return this.scroll ? this.scroll.y : 0
      }
    }
  }
</script>

<style scoped>
</style>
