<template>
  <div id="detail">
    <!-- 详情页顶部导航 -->
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
    <scroll 
    class="content" 
    ref="scroll" 
    :probe-type="3" @scroll="contentScroll">
       <!-- 轮播图 -->
      <detail-swiper :top-images="topImages"/>
      <!-- 商品信息展示（商品描述价格包邮等） -->
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad" />
      <detail-param-info ref="params" :param-info="paramInfo"/>
      <detail-comment-info ref="comment" :comment-info="commentInfo"/>
      <goods-list ref="recommend" :goods="recommends"/>
    </scroll>
    <detail-bottom-bar @addToCart="addToCart"/>
    <!-- 回到顶部按钮 -->
     <back-top @click.native="backTop" class="back-top" v-show="showBackTop">
      <img src="~assets/img/common/top.png" alt="">
    </back-top>
  </div>
</template>

<script>
// 导入组件
import DetailNavBar from './childComps/DetailNavBar.vue'
import DetailSwiper from './childComps/DetailSwiper.vue'
import DetailBaseInfo from './childComps/DetailBaseInfo.vue'
import DetailShopInfo from './childComps/DetailShopInfo.vue'
import DetailGoodsInfo from './childComps/DetailGoodsInfo.vue'
import DetailParamInfo from './childComps/DetailParamInfo.vue'
import DetailCommentInfo from './childComps/DetailCommentInfo.vue'

import DetailBottomBar from './childComps/DetailBottomBar'
 import BackTop from 'components/content/backTop/BackTop'

import Scroll from 'components/common/scroll/Scroll.vue'
import GoodsList from 'components/content/goods/GoodsList.vue'

import {debounce} from 'common/utils'
import {itemListenerMixin, backTopMixin} from 'common/mixin'
import {BACKTOP_DISTANCE} from "common/const"

// 导入网络请求方法
import { getDetail, Goods, Shop, GoodsParam, getRecommend } from 'network/detail'


export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    Scroll,
    BackTop,
    GoodsList,
  },
  mixins: [itemListenerMixin, backTopMixin],
  data() {
    return {
      iid: null,
      topImages:[],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      itemImgListener: null,
      currentIndex: 0,
      message: '',
      show: false
    }
  },
  created() {
    //1.保存传入的iid
    this.iid = this.$route.params.iid;
    // 2.根据iid请求详情数据

    getDetail(this.iid).then(res => {
      // 获取顶部轮播图片数据
      const data = res.result;
      this.topImages = data.itemInfo.topImages;

      // 3.获取商品信息
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services);

      //4.创建店铺信息的对象
      this.shop = new Shop(data.shopInfo);
       
      // 5.获取商品详细信息
      this.detailInfo = data.detailInfo;

      // 6.获取参数的信息
      this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule);

      //7.取出评论信息
      if(data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0]
      };
    });
  
    // 3.请求推荐数据
    getRecommend().then(res => {
      this.recommends = res.data.list
    })
  },
  mounted() { 
  },
  destroyed() {
    // 2.取消全局事件的监听
      this.$bus.$off('itemImageLoad', this.itemImgListener)
  },
  methods: {
    imageLoad() {
      this.$refs.scroll.refresh();
      console.log("图片已加载");
      // 等图片加载完之后，等到正确的组件offsetTop，实现联动效果（点击标题滑动到指定区域）
      this.themeTopYs = [];
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      this.themeTopYs.push(Number.MAX_VALUE);

      console.log(this.themeTopYs);
    },
    titleClick(index) {
      console.log(index);
      this.$refs.scroll.scrollBackTop(0, -this.themeTopYs[index], 100)
    },
    contentScroll(position) {
      // 1.监听backTop的显示
      this.showBackTop = position.y < -BACKTOP_DISTANCE;

      // 2.监听滚动到哪一个主题
      const positionY = -position.y;

      let length = this.themeTopYs.length;
      for(let i = 0; i < length - 1; i++){
        if(this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])){
          this.currentIndex = i;
          this.$refs.nav.currentIndex = this.currentIndex;
        }
      }
    },
    addToCart() {
      // 1.获取购物车需要展示的信息
      const product = {};
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.nowPrice;
      product.iid = this.iid;

      // 2.将商品增加到购物车里面
      this.$store.dispatch('addToCart', product).then(res => {
        this.$toast.show(res, 2000)
      })
    }
  }
}
</script>

<style scoped>
  #detail {
    position: relative;
    height: 100vh;
    background-color: #fff;
    z-index: 25;
  }
  .content {
    height: calc(100% - 44px - 49px);
  }
  .detail-nav {
    position: relative;
    z-index: 25;
    background-color: #fff;
  }
   .back-top {
    position: fixed;
    right: 10px;
    bottom: 65px;
  }
</style>