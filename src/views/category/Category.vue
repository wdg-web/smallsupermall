<template>
  <div id="category">
    <nav-bar class="nav-bar">
      <div slot="center">商品分类</div>
    </nav-bar>
    <!-- 内容区开始 -->
    <div class="content">
      <tab-menu class="tab-menu" :categories="categories"
                @selectItem="selectItem">
      </tab-menu>

      <scroll id="tab-content" :data="[categoryData]"
      ref="scroll"
      :probe-type="3"
      @scroll="contentScroll">
        <div>
          <tab-content-category :subcategories="showSubcategory"></tab-content-category>
          <tab-control :titles="['综合','新品','销量']" @tabClick="tabClick"/>
          <!-- tab栏部分开始              -->
          <tab-content-detail :category-detail="showCategoryDetail"></tab-content-detail>
        </div>
      </scroll>
    </div>
    <!-- 回到顶部 -->
    <back-top @click.native="backClick" v-show="isshowBackTop"/>
  </div>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'
  import BackTop from 'components/content/backTop/BackTop.vue'

  import TabMenu from './childComps/TabMenu'
  import TabControl from 'components/content/tabControl/TabControl.vue'
  import Scroll from 'components/common/scroll/Scroll'
  import TabContentCategory from './childComps/TabContentCategory'
  import TabContentDetail from './childComps/TabContentDetail'

  import {getCategory, getSubcategory, getCategoryDetail} from "network/category";
  import {POP, SELL, NEW} from "common/const";
  import {tabControlMixin} from "common/mixin";

  export default {
		name: "Category",
    components: {
		  NavBar,
      TabMenu,
      TabControl,
      Scroll,
      BackTop,
      TabContentCategory,
      TabContentDetail
    },
    mixins: [tabControlMixin],
    data() {
		  return {
		    categories: [],
        categoryData: {
        },
        isshowBackTop: false,
        tabOffsetTop: 0,
        isTabFixed: false,
        saveY: 0,
        currentIndex: -1,
      }
    },
    created() {
		  // 1.请求分类数据
      this._getCategory()
    },
    computed: {
		  showSubcategory() {
		    if (this.currentIndex === -1) return {}
        return this.categoryData[this.currentIndex].subcategories;
        console.log(this.categoryData);
      },
      showCategoryDetail() {
		    if (this.currentIndex === -1) return []
		    return this.categoryData[this.currentIndex].categoryDetail[this.currentType]
      }
    },
    activated() {
      this.$refs.scroll.scrollBackTop(0, this.saveY, 0);
      // this.$refs.scroll.refresh()
    },
    deactivated() {
      // 1.保存y
      // this.saveY = this.$refs.scroll.getScrollY();
      // 2.取消全局事件的监听
      // this.$bus.$off('itemImageLoad', this.itemImgListener)
    },
    watch: {
      saveY() {
         this.$refs.scroll.scrollBackTop(0, this.saveY, 0);
        //  this.$refs.scroll.refresh()
      }
    },
    methods: {
		  _getCategory() {
		    getCategory().then(res => {
		      // 1.获取分类数据
		      this.categories = res.data.category.list
          // 2.初始化每个类别的子数据
          for (let i = 0; i < this.categories.length; i++) {
            this.categoryData[i] = {
              subcategories: {},
              categoryDetail: {
                'pop': [],
                'new': [],
                'sell': []
              }
            }
          }
          // 3.请求第一个分类的数据
          this._getSubcategories(0)
        })
      },
      _getSubcategories(index) {
        this.currentIndex = index;
		    const mailKey = this.categories[index].maitKey;
        getSubcategory(mailKey).then(res => {
          this.categoryData[index].subcategories = res.data
          this.categoryData = {...this.categoryData}
          this._getCategoryDetail(POP)
          this._getCategoryDetail(SELL)
          this._getCategoryDetail(NEW)
        })
      },
      _getCategoryDetail(type) {
		    // 1.获取请求的miniWallkey
        const miniWallkey = this.categories[this.currentIndex].miniWallkey;
        // 2.发送请求,传入miniWallkey和type
		    getCategoryDetail(miniWallkey, type).then(res => {
		      // 3.将获取的数据保存下来
		      this.categoryData[this.currentIndex].categoryDetail[type] = res
          this.categoryData = {...this.categoryData}
        })
      },
      /**
       * 事件响应相关的方法
       */
      selectItem(index) {
        this._getSubcategories(index)
      },
      contentScroll(position) {
        // 1.判断backtop是否显示
        this.isshowBackTop = (-position.y) > 1000;
        //  1.保存y
        this.saveY = this.$refs.scroll.getScrollY();
        this.$refs.scroll.refresh()
      },
      backClick() {
        this.$refs.scroll.scrollBackTop(0, 0,)
      }
    }
	}
</script>

<style scoped>
  #category {
    height: 100vh;
  }

  .nav-bar {
    background-color: var(--color-tint);
    font-weight: 700;
    color: #fff;
    z-index: 9999;
  }

  .content {
    position: absolute;
    left: 0;
    right: 0;
    top: 44px;
    bottom: 49px;

    display: flex;
  }
  
  .tab-menu {
    overflow: hidden;
  }
  #tab-content {
    height: 100%;
    flex: 1;
    overflow: hidden;
  }
</style>
