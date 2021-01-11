<template>
    <div>
      <div class="icon-selector" :class="{'selector-active': checked}" @click="selectItem">
        <img src="~/assets/img/cart/tick.svg" alt="">
      </div>
    </div>
</template>

<script>
	export default {
		name: "CheckButton",
    props: {
		  value: {
		    type: Boolean,
        default: false
      }
    },
    data: function () {
		  return {
		    checked: this.value
      }
    },
    methods: {
      selectItem: function () {
        this.$emit('checkBtnClick')
      }
    },
    watch: {
		  value: function (newValue) {
        this.checked = newValue;
      }
    }
	}
</script>

<style scoped>
  .icon-selector {
    position: relative;
    margin: 0;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid #ccc;
    cursor: pointer;
  }

  .selector-active {
    background-color: red;
    border-color: red;
  }
</style>
