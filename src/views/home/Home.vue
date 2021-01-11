<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control :titles="['流行','新款','精选']" @tabClick="tabClick"
          ref="tabControl1"
          class="tab-control" v-show="isTabFixed"/>
     <scroll class="home-scroll" ref="scroll"
     :probe-type="3"
     @scroll="contentScroll"
     :pull-up-load="true"
     @pullingUp="loadMore">
          <!-- 轮播图 -->
          <home-swiper :banners="banners"
          @swiperImageLoad="swiperImageLoad"/>
          <!-- 推荐 -->
          <recommend-view :recommends="recommends" />
          <!-- 本周流行 -->
          <feature-view/>
          <!-- tab标题栏 -->
          <tab-control :titles="['流行','新款','精选']" @tabClick="tabClick"
          ref="tabControl2"/>
          <goods-list :goods="showGoods"/>
    </scroll>
    <!-- 回到顶部 -->
    <back-top @click.native="backClick" v-show="isshowBackTop"/>
  </div>
</template>

<script>

import HomeSwiper from './childComps/HomeSwiper.vue';
import RecommendView from './childComps/RecommendView'
// 本周流行
import FeatureView from './childComps/FeatureView' 

import NavBar from 'components/common/navbar/NavBar.vue';
import TabControl from 'components/content/tabControl/TabControl.vue';
import GoodsList from 'components/content/goods/GoodsList.vue'
import Scroll from 'components/common/scroll/Scroll.vue'
import BackTop from 'components/content/backTop/BackTop.vue'

import {
  getHomeMultidata,
  getHomeGoods
  } from "network/home"
import {debounce} from 'common/utils'
import {itemListenerMixin} from 'common/mixin'


  export default {
    name: "Home",
    components: {
      NavBar,
      HomeSwiper,
      RecommendView,
      FeatureView,
      TabControl,
      GoodsList,
      Scroll,
      BackTop
    },
    mixins: [itemListenerMixin],
    data() {
      return {
        banners: [],
        recommends: [],
        controlTabType: 'pop',
        isshowBackTop: false,
        tabOffsetTop: 0,
        isTabFixed: false,
        saveY: 0,
        goods: {
          'pop':{page: 0, list: []},
          'new':{page: 0, list: []},
          'sell':{page: 0, list: []}
        }
        }
    },

    created() {
      // 当组件创建完成之后，请求数据
      this.getHomeMultidata1();
      // this.getHomeMultidata();
      // 请求商品数据
      this.getHomeGoods('pop');
      this.getHomeGoods('new');
      this.getHomeGoods('sell');

    },
    computed: {
      showGoods() {
        return this.goods[this.controlTabType].list;
      }
    },
    activated() {
      this.$refs.scroll.scrollBackTop(0, this.saveY, 0);
      this.$refs.scroll.refresh()
    },
    deactivated() {
      // 1.保存y
      this.saveY = this.$refs.scroll.getScrollY();
      // 2.取消全局事件的监听
      this.$bus.$off('itemImageLoad', this.itemImgListener)
    },
    mounted() {
    },
    methods: {
      // 事件监听相关方法
      tabClick(index) {
        switch(index) {
          case 0:
            this.controlTabType = 'pop'
            break;
          case 1:
            this.controlTabType = 'new'
            break;
          case 2:
            this.controlTabType = 'sell'
            break;
        }
        this.$refs.tabControl1.currentIndex = index;
        this.$refs.tabControl2.currentIndex = index;
      },
      backClick() {
        this.$refs.scroll.scrollBackTop(0, 0,)
      },
      contentScroll(position) {
        // 1.判断backtop是否显示
        this.isshowBackTop = (-position.y) > 1000;
        // 2.决定tabControl是否吸顶（fixed）
        this.isTabFixed = (-position.y) > this.tabOffsetTop
      },
      loadMore() {
        this.getHomeGoods(this.controlTabType)
      },
      swiperImageLoad() {
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
      },
      // 网络请求相关方法
      // 1.获取首页流行数据
      getHomeMultidata1() {
         getHomeMultidata().then(res => {
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;   
      })
      },
       // 2.获取首页新款数据
      getHomeGoods(type) {
        let page = this.goods[type].page + 1;
        getHomeGoods(type,page).then(res => {
          this.goods[type].list.push(...res.data.list);
          this.goods[type].page += 1;
          console.log(res.data.list);

          //完成上拉加载更多
          this.$refs.scroll.finishPullUp();
          // this.$refs.scroll.finishPullUp();
          // this.$refs.scroll.initBetterScroll();
          // console.log(this.$refs.scroll.scroll);
      }) 
    }
  }
}
</script>

<style scoped>
  #home {
    /* padding-top: 44px; */
    height: 100vh;
    /* width: 100vw; */
    /* position: relative; */
  }
    .home-nav {
    /* position: fixed;
    top: 0;
    left: 0;
    right: 0; */
    background-color: var(--color-tint);
    font-weight: 700;
    color: #fff;
    /* z-index: 5; */
  }
    .tab-control {
      position: relative;
      top: -1px;
      left: 0;
      right: 0;
      z-index: 5;
    }

  .home-scroll {
    height: calc(
        100vh - 93px
    );
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
  /* .content {
    height: calc(100% - 93px);
    overflow: hidden;
    margin-top: 44px;
  } */
</style>
