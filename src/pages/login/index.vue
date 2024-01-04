<template>
  <div class="login-container">
    <userLogin></userLogin>
  </div>
</template>

<script>
import userLogin from "./userlogin.vue";
export default {
  name: "Login",
  components: {userLogin },
  data() {
    return {};
  },

  methods: {
    onload(){
      // this.$vue = new vue({ i18n });
    }
  },
  created() {
    this.onload()
  },
};
</script>
<style lang='scss' scoped>
::v-deep.login-container {
  width: 100%;
  height: 100%;
  background: url(https://images.weserv.nl/?url=https://gd-hbimg.huaban.com/fe9233a2a926e68c5dca32e0be54c91e0c02bedc20431f-4jZl0x_fw1200)
    0 bottom repeat-x #049ec4;;
  background-size: 100% 100%;
  overflow: hidden;
   display: flex;
  justify-content: center;
  align-items: center;
}
</style>