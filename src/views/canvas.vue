<!--
Name: canvas
author: xingyuelongchen
QQ    : 237956234
Date  : 2021-09-23
-->
<template>
  <div>
    <canvas type="2d" id="canvas" ref="canvas"></canvas>
  </div>
</template>
<script>
export default {
  data() {
    return {
      canvasData: [
       
      ]
    };
  },
  mounted() {
    this.onInitCanvas(this.canvasData);
  },
  methods: {
   
  }
};
</script>
<style   scoped>
.canvas {
}
</style>