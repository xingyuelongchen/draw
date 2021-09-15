<!--
Name: setting
author: xingyuelongchen
QQ    : 237956234
Date  : 2021-09-15
-->
<template>
  <div class="page">
    <el-card style="flex:0 0 400px">
      <div slot="header">
        <span>上传列表</span>
        <el-button @click="save" size="mini" type="success" style="float:right">保存</el-button>
      </div>
      <el-upload action="#" :on-change="uploadFile" :accept="accept" :auto-upload="false" :show-file-list="false" drag>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip">只允许（{{accept}}）表格文件</div>
      </el-upload>
    </el-card>
    <el-card header="参与抽奖人员列表" style="flex:1 1 auto;margin-left:20px">
      <el-table :data="tableData" border height="500px" stripe>
        <el-table-column label="姓名" prop="name" />
        <el-table-column label="手机号" prop="phone" />
      </el-table>
    </el-card>
  </div>
</template>
<script>
import XLSX from "xlsx";
export default {
  name: "setting",
  data() {
    return { accept: ".xlsx,.xls", tableData: JSON.parse(localStorage.getItem("list") || "[]") };
  },
  methods: {
    async save() {
      let json = JSON.stringify(this.tableData);
      window.localStorage.setItem("list", json);
      if (!this.tableData.length && (await this.$confirm("添加了0个人，确定离开？", "提示！", { type: "warning" }))) {
        this.$router.push("/");
      }
    },
    async uploadFile(file) {
      if (!/(\.xlsx|\.xls)$/g.test(file.name)) {
        this.$message.error("请上传excel表格文件");
        return;
      }
      let { Sheets, SheetNames } = await this.readWorkbookFromLocalFile(file.raw);
      // let obj = [];
      this.tableData = [];
      SheetNames.forEach((name) => {
        let json = XLSX.utils.sheet_to_json(Sheets[name]);
        this.tableData.push(...json);
      });
      return false;
    },
    async readWorkbookFromLocalFile(file, callback) {
      return new Promise((resolve, reject) => {
        try {
          var reader = new FileReader();
          reader.onload = function (e) {
            var data = e.target.result;
            var workbook = XLSX.read(data, { type: "binary" });
            if (callback) callback(workbook);
            resolve(workbook);
          };
          reader.readAsBinaryString(file);
        } catch (error) {
          reject(error);
        }
      });
    }
  }
};
</script>
<style scoped>
.page {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  margin: 50px;
}
</style>