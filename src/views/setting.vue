<!--
Name: setting
author: xingyuelongchen
QQ    : 237956234
Date  : 2021-09-15
-->
<template>
  <div>
    <div class="page">
      <el-card style="flex:0 0 400px">
        <div slot="header">
          <span>上传列表</span>
          <el-button @click="down" size="mini" type="success" style="float:right">下载模板</el-button>
        </div>
        <el-upload action="#" :on-change="uploadFile" :accept="accept" :auto-upload="false" :show-file-list="false" drag>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip">只允许（{{accept}}）表格文件</div>
        </el-upload>
        <mixForm class="mix-form" ref="form" v-model="formData" :fields="formFields" :rules="rules" />
      </el-card>
      <el-card style="flex:1 1 auto;margin-left:20px">
        <div slot="header">
          <span>参与抽奖人员列表</span>
          <el-button @click="to" size="mini" type="success" style="float:right">去抽奖</el-button>
        </div>
        <el-table :data="tableData" border height="500px" stripe>
          <el-table-column label="姓名" prop="name" />
          <el-table-column label="手机号" prop="phone" />
          <el-table-column>
            <template slot-scope="{row}">
              <el-button type="danger" size="mini" @click="del(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-card style="flex:0 0 500px;margin-left:20px">
        <div slot="header">
          <span>中奖名单</span>
          <el-button @click="downTable" size="mini" type="success" style="float:right">下载数据</el-button>
        </div>
        <el-table :data="tableDraw" border height="500px" stripe :show-header="false" ref="table" id="table">
          <el-table-column label="姓名" prop="name" />
          <el-table-column label="手机号" prop="phone" />
        </el-table>
      </el-card>
    </div>

  </div>
</template>
<script>
import XLSX from "xlsx";
import FileSaver from "file-saver";
export default {
  name: "setting",
  data() {
    return {
      accept: ".xlsx,.xls",
      tableData: JSON.parse(localStorage.getItem("list") || "[]"),
      tableDraw: JSON.parse(localStorage.getItem("draw") || "[]"),
      formData: {},
      formFields: [
        { label: "姓名", prop: "name" },
        { label: "手机号", prop: "phone", maxLength: 11 },
        { label: "添加", k: "button", click: this.add }
      ],
      rules: {
        name: { required: true, pattern: /^[\u4e00-\u9fa5]{2,10}$/, message: "请输入正确的姓名", trigger: ["blur"] },
        phone: { required: true, pattern: /^1[3-9][0-9]{9}$/, message: "请输入正确的11位手机号", trigger: ["blur"] }
      }
    };
  },
  methods: {
    downTable() {
      let wb = XLSX.utils.table_to_book(document.querySelector("#table"), { raw: true });
      let wbout = XLSX.write(wb, {
        type: "array",
        bookSST: true,
        bookType: "xlsx"
      });
      try {
        FileSaver.saveAs(new Blob([wbout], { type: "appliction/octet-stream" }), "中奖名单.xlsx");
      } catch (error) {
        console.log(error, wbout);
      }
      return wbout;
    },
    down() {
      let a = document.createElement("a");
      a.download = "人员信息上传模板.xlsx";
      a.href = "/template.xlsx";
      a.click();
    },
    del(row) {
      this.tableData = [...this.tableData].filter((e) => e.phone !== row.phone);
      this.save();
    },
    async add() {
      await this.$refs.form.validate();
      this.tableData.push({ ...this.formData });
      this.$refs.form.resetFields();
      this.save();
    },
    save() {
      let json = JSON.stringify(this.tableData);
      window.localStorage.setItem("list", json);
    },
    async to() {
      if (this.tableData.length) this.$router.push("/");
      else if (await this.$confirm("添加了0个人，确定离开？", "提示！", { type: "warning" })) {
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
      this.save();
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
.mix-form {
  margin-top: 20px;
}
</style>