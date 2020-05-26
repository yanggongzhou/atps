<template>
  <div class="header">
    <h4 class="center">本地header，node_module/header信息待引入......</h4>
  </div>
</template>
<script>
  export default{
    data(){
      return{

      }
    },
    created(){

    }
  }
</script>
<style scoped>
  .header{
    position: fixed;
    top:0;
    left: 0;
    width: 100%;
    height: 40px;
    min-width: 750px;
    background-color: #eee !important;
  }
</style>
