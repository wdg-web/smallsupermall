import { debounce } from 'common/utils'

import { POP, NEW, SELL } from "./const";

export const itemListenerMixin = {
    data() {
        return {
            itemImgListener: null,
        }
    },
    mounted() {
        // 解决商品加载过程中不能滑动或卡顿的问题
        const refresh = debounce(this.$refs.scroll.refresh, 200);

        this.itemImgListener = () => {
            refresh()
        };

        this.$bus.$on('itemImageLoad', this.itemImgListener)
    }
}

export const backTopMixin = {
    data: function() {
        return {
            showBackTop: false
        }
    },
    methods: {
        backTop() {
            this.$refs.scroll.scrollBackTop(0, 0, 300);
        }
    }
}

export const tabControlMixin = {
    data: function() {
        return {
            currentType: POP
        }
    },
    methods: {
        tabClick(index) {
            switch (index) {
                case 0:
                    this.currentType = POP
                    break
                case 1:
                    this.currentType = NEW
                    break
                case 2:
                    this.currentType = SELL
                    break
            }
            console.log(this.currentType);
        }
    }
}