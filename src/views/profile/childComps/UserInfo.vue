<template>
  <div id="user-info">
    <a href="#" class="clear-fix">
      <slot name="user-icon">
        <!-- <svg class="privateImage-svg left">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#avatar-default"></use>
        </svg> -->
        <svg-icon icon-class="header" class="privateImage-svg left"></svg-icon>
      </slot>
      <div class="login-info left">
        <slot name="user-nickname">
          <div>登录/注册</div>
        </slot>
        <div class="phone">
          <span class="span">
            <!-- <svg data-v-735ff1be="" fill="#fff" class="icon-mobile">
              <use data-v-735ff1be="" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#mobile"></use>
              </svg> -->
              <svg-icon icon-class="iphone1" class="icon-mobile"></svg-icon>
          </span>
          <slot name="user-phone" class="slot">暂无绑定手机号</slot>
        </div>
      </div>
      <!-- <svg data-v-735ff1be="" fill="#fff" class="arrow-svg right"><use data-v-735ff1be="" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use></svg> -->
      <svg-icon icon-class="right" class="arrow-svg right"></svg-icon>
    </a>
  </div>
</template>

<script>
	export default {
		name: "UserInfo"
	}
</script>

<style scoped>
  #user-info {
    background-color: var(--color-tint);
    padding: 15px;
    margin-top: -5px;
  }

  #user-info .privateImage-svg {
    width: 60px;
    height: 60px;
    background-color: #fff;
    border-radius: 30px;
  }

  .left {
    float: left;
    width: 110px
  }

  #user-info .arrow-svg {
    width: 30px;
    height: 24px;
    margin-top: 18px;
  }

  #user-info .login-info {
    color: #fff;
    margin: 10px 0 0 10px;
  }

  #user-info .login-info .phone {
    position: relative;

    font-size: 13px;
    margin-top: 11px;
    margin-left: 10px;
    font-weight: 300;
  }

  .phone .icon-mobile {
    position: absolute;
    width: 22px;
    height: 28px;
    left: -15px;
    top: -7px;
  }

  .span {
    /* margin-top: 8px; */
    padding-right: 8px;
  }
</style>
