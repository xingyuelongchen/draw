<!--
Template Name: 分页
Create author: qinglong
Create Time  : 2020-07-27
-->
<template>
  <div class="mix-page">
    <slot name="left"></slot>
    <el-pagination background v-bind="$attrs" :current-page.sync="page.page" :layout="page.layout || 'total,sizes,prev,pager,next'" :page-size="page.size" :page-sizes="sizes" :total="page.total || 0" @size-change="sizeChange" @current-change="currentChange" />
    <slot name="right"></slot>
  </div>
</template>
<script>
export default {
  name: "MixPage",
  props: {
    value: {
      type: Object,
      default() {
        return {
          page: 1,
          size: 15,
          total: 0
        };
      }
    }
  },
  data() {
    return {
      page: {},
      sizes: [10, 15, 20, 30, 50]
    };
  },
  watch: {
    value: {
      deep: true,
      handler() {
        this.page = this.value;
      }
    }
    // if (!this.sizes.includes(this.value.size)) this.sizes.unshift(this.value.size);
  },
  methods: {
    sizeChange(size) {
      this.page.size = size;
      this.page.page = 1;
      this.currentChange();
    },
    currentChange() {
      this.$emit("input", { ...this.page });
      if (this.$attrs.getData && this.$attrs.getData instanceof Function) {
        this.$attrs.getData();
      } else if (typeof this.value.event == "function") {
        this.value.event();
      } else if (typeof this.event == "function") {
        this.event();
      } else {
        this.$parent.getData();
      }
    }
  }
};
</script>
<style scoped>
.mix-page {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 20px;
  height: 40px;
}
</style>