 
<template>
  <el-form ref="form" v-bind="options" :model="formData" v-on="$listeners" @validate="validateFields">
    <el-row v-for="(element,index) in fieldsMap" :key="index+'-'+element.length">
      <!--<el-col v-for="item in element" :key="item.prop" v-bind="item"> -->
      <template v-for="(item,i) in element">
        <el-form-item v-if="item.k == 'button'" :key="item.label+i">
          <template v-for="val in item.option">
            <el-button v-show="getShow(item)" :key="val.label" v-on="val" v-bind="val" :type="val.type||'primary'">{{val.label}}</el-button>
          </template>
        </el-form-item>
        <el-form-item v-else :key="item.prop+i" :prop="item.prop" :label="options.labelShow?item.label:''" v-show="getShow(item)">
          <el-select v-model="formData[item.prop]" v-if="['select'].includes(item.k)" :placeholder="item.placeholder || item.label" v-bind="item" clearable @change="onEvent($event,item,'change')" filterable>
            <el-option v-for="val in item.option" :key="val.value" v-bind="val"></el-option>
          </el-select>
          <!-- <el-upload v-else-if="item.k === 'upload'" class="avatar-uploader" action="#" v-bind="item" :show-file-list="false" :before-upload="(...a)=>beforeAvatarUpload(item,...a)">
            <img v-if="formData[item.prop]" :src="formData[item.prop]" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload> -->
          <el-cascader v-model="formData[item.prop]" v-else-if="item.k === 'cascader'" :options="item.option" v-bind="item" clearable @change="onEvent($event,item,'change')" />
          <el-date-picker v-model="formData[item.prop]" v-else-if="item.k === 'datetime'" v-bind="item" :placeholder="item.placeholder || item.label" />
          <el-switch v-model="formData[item.prop]" v-else-if="item.k === 'switch'" v-bind="item" />
          <el-input v-model.number="formData[item.prop]" v-else-if="item.k === 'number'" :placeholder="item.placeholder || item.label" v-bind="item" clearable @change="onEvent($event,item,'change')" />
          <el-input v-model="formData[item.prop]" v-else :placeholder="item.placeholder || item.label" v-bind="item" clearable @change="onEvent($event,item,'change')" />
        </el-form-item>
      </template>
      <!-- </el-col>-->
    </el-row>
  </el-form>
</template>
<script>
export default {
  name: "mixform",
  data() {
    return {
      options: {},
      formData: {},
      fieldsMap: []
    };
  },
  props: {
    value: {
      type: Object,
      required: true
    },
    fields: {
      type: Array,
      required: true
    }
  },
  watch: {
    fields: {
      deep: true,
      immediate: true,
      handler(a) {
        this.initFields([...a]);
      }
    },
    value: {
      immediate: true,
      handler(a) {
        this.formData = a;
      }
    },
    formData: {
      deep: true,
      handler(a) {
        this.$emit("input", a);
      }
    }
  },
  created() {
    let init = this.$attrs;
    this.options = {
      labelShow: init.labelShow ? init.labelShow : !!init["label-width"] || !init.inline,
      labelWidth: init["label-width"] ? init["label-width"] : init.inline ? "auto" : "80px",
      size: init.inline ? "small" : "large",
      ...init
    };
  },
  methods: {
    async validate() {
      return this.$refs["form"].validate();
    },
    async resetFields() {
      return this.$refs["form"].resetFields();
    },
    validateFields(...val) {
      this.$emit("validate", val);
    },
    async initFields(fields) {
      let newFields = [];
      let index = 0;
      newFields[index] = [];
      for (let i = 0; i < fields.length; i++) {
        const item = { ...fields[i] };
        // 动态获取option选项
        if (item.k !== "button") {
          if (item?.options instanceof Function) {
            item.option = await item.options();
          }
          if (item.option && item.config) {
            item.option = JSON.parse(
              JSON.stringify(item.option, (a, b) => {
                if (b && b instanceof Object && !Array.isArray(b)) {
                  b.label = this.getField(item, b, "label");
                  b.value = this.getField(item, b, "value");
                }
                return b;
              })
            );
          }
        }
        if (item.k === "button" && !item.option) {
          item.option = [item];
        }
        if (item?.wrap) {
          index++;
          newFields[index] = [];
        }
        newFields[index].push({ ...item });
      }
      this.fieldsMap = [...newFields];
    },
    // 自定义字段
    getField(item, k, type) {
      if (item?.config?.[type]) {
        return k[item.config[type]];
      }
      return k[type];
    },
    // 事件处理
    onEvent(event, item, type) {
      let func = item[type];
      let params = { event, item, type };
      if (typeof func === "function") func(params);
      else if (typeof func === "string" && typeof this.$parent[func] === "function") this.$parent[func](params);
    },
    // 是否显示
    getShow(item) {
      if (item.isShow && typeof item.isShow === "function") return item.isShow(this.formData);
      else return true;
    }
  }
};
</script>
 
