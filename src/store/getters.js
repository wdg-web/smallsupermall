export default {
    cartList(state) {
        return state.cartList
    },
    cartCount(state, getters) {
        return getters.cartList.length
    }
}