<template>
  <div id="cart">
    <!-- 导航 -->
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{cartCount}})</div>
    </nav-bar>
    <!-- 商品列表 -->
    <cart-list class="cart-list"></cart-list>
    <!-- 底部汇总 -->
    <bottom-bar/>
  </div>
</template>

<script>
  import CartList from './childComps/CartList.vue'
  import BottomBar from './childComps/BottomBar'

  import NavBar from 'components/common/navbar/NavBar.vue'

  import { mapGetters } from 'vuex'

  export default {
    name: "Cart",
    components: {
      NavBar,
      CartList,
      BottomBar,
    },
    computed: {
      // cartLength() {
      //   return this.$store.state.cartList.length
      // }
      ...mapGetters([
        'cartCount'
      ])
    }
  }
</script>

<style scoped>
  #cart {
    /*position: relative;*/
    height: 100vh;
  }

  .nav-bar {
    background-color: var(--color-tint);
    font-weight: 700;
    color: #fff;
    z-index: 99999;
  }

   .cart-list {
    position: absolute;
    top: 44px;
    bottom: 49px;
    width: 100%;
  }
</style>
