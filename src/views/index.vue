<!--
Name: 抽奖首页
author: xingyuelongchen
QQ    : 237956234
Date  : 2021-09-23
-->
<template>
  <div class="body">
    <el-tooltip effect="dark" content="抽奖设置" placement="right">
      <span class="setting" @click="$router.push('/setting')"></span>
    </el-tooltip>
    <div class="bg"></div>

    <div class="temp_container">
      <div class="temp" v-for="(item,index) in domlist" :key="item.phone+'-'+index" v-bind="item">{{item.phone}}</div>
    </div>
    <div class="box">
      <div class="logo"> </div>
      <div class="title">{{tips}}</div>
      <div class="title">{{msg}}</div>
      <div class="btn" @click="start">
        <span class="start">
          <span>{{btn}}</span>
        </span>
      </div>
    </div>
    <div v-show="show" class="dialog">
      <div class="dialog-bg" @click="show=false"> </div>
      <div class="border"></div>
      <div class="dialog-box">{{winning}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      show: false,
      winning: "",
      tips: "",
      msg: "抽奖即将开始！",
      btn: "开始",
      current: null,
      list: [],
      domlist: [],
      status: false,
      width: null,
      height: null
    };
  },
  mounted() {
    this.list = JSON.parse(localStorage.getItem("list") || "[]");
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    window.onresize = () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
    };
  },
  methods: {
    async start() {
      if (!this.list.length) {
        if (await this.$confirm("无参与抽奖的人员,是否去添加？", "提示！", { type: "warning" })) {
          this.$router.push("/setting");
        }
        return;
      }
      if (this.status) return this.stop();
      if (this.show) return;
      this.tan();
      this.status = true;
      this.current = null;
      this.tips = "正在抽奖";
      this.btn = "停止";
      this.timer = setInterval(() => {
        let index = this.random(0, this.list.length);
        this.current = index;
        let name = this.list[index]?.name || "";
        let phone = this.list[index]?.phone || "";
        this.msg = this.re(name, 1, 2) + " " + this.re(phone, 3, 7, "****");
      }, 50);
    },
    stop() {
      clearInterval(this.timer);
      clearTimeout(this.tanTimer);
      this.status = false;
      this.btn = "继续";
      let { phone } = this.list[this.current];
      this.winning = `${this.re(phone, 3, 7, "****")}`;
      this.show = true;
      let list = this.list.splice(this.current, 1);
      let arr = JSON.parse(localStorage.getItem("draw") || "[]");
      localStorage.setItem("list", JSON.stringify(this.list));
      localStorage.setItem("draw", JSON.stringify(list.concat(arr)));
    },
    tan() {
      clearTimeout(this.tanTimer);
      let arr = new Array(10).fill().map(() => {
        let index = this.random(0, this.list.length);
        let name = this.re(this.list[index]?.name || "", 1, 2);
        let phone = this.re(this.list[index]?.phone || "", 3, 7, "****");
        let left = this.random(0, this.width) + "px";
        let top = this.random(0, this.height) + "px";
        let fontSize = this.random(10, 50) + "px";
        let color = `rgba(255,255,255,${this.random(8, 10) / 10})`;
        let style = { left, top, fontSize, color };
        return { name, phone: Math.ceil(Math.random() * 1 - 0.5) ? name : phone, style };
      });
      this.domlist.push(...arr);
      this.tanTimer = setTimeout(() => this.tan(), 1000);
    },
    random(s, e) {
      return Math.floor(Math.random() * (e - s) + s);
    },
    re(val = "", s = 0, e = 0, k = "*") {
      val = val + "";
      return val.replace(val.slice(s, e), k);
    }
  }
};
</script>
 
<style scoped>
.setting {
  width: 100px;
  height: 100px;
  cursor: pointer;
  position: absolute;
  top: 0%;
  right: 0;
  z-index: 99;
}
.body {
  height: 100%;
  width: 100%;
  background: #db0522;
}

.box {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  width: 300px;
  height: 461px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
.box .logo {
  width: 200px;
  background: #fff;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
}
.box .logo::before {
  width: 60%;
  height: 60%;
  content: "";
  background: url(~@/assets/images/logo.jpg) no-repeat center center / 100% auto;
}
.box .title {
  margin: 0 0 30px;
  min-height: 50px;
  padding: 0;
  font-weight: 400;
  font-size: 32px;
  color: #333;
  white-space: nowrap;
  /* overflow: hidden;
  text-overflow: ellipsis; */
}
.box .title.shake {
  animation: shake 0.4s;
}
.bg {
  /* background: #e9e9e9 url(~@/assets/images/bg.jpg) 50% 0; */
  transform: translate3d(0, 0, 0);
  animation: flow 16s linear infinite;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
}

.playing .bg {
  animation-play-state: paused;
}

.temp_container {
  transform: translate3d(0, 0, 0);
  overflow: hidden;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.temp_container .temp {
  position: absolute;
  color: #777;
  animation: flash 1.6s ease-out both;
  white-space: nowrap;
}
.btn .start {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 40px;
  padding: 5px;
  box-shadow: inset 0 2px 3px rgba(0, 0, 0, 0.07), 0 1px rgba(255, 255, 255, 0.5);
  display: inline-block;
  cursor: pointer;
}

.btn .start span {
  border-radius: 35px;
  width: 180px;
  height: 60px;
  line-height: 60px;
  background: linear-gradient(to bottom, #ffba30, #ff911e);
  color: #fff;
  text-align: center;
  display: block;
  font-size: 32px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 1px #ffd17c, 0 2px 3px rgba(0, 0, 0, 0.2);
  border: 1px solid #e88e1d;
}

.btn .start:hover span {
  background: linear-gradient(to bottom, #ffce44, #ffa532);
  box-shadow: inset 0 1px #ffe696, 0 2px 3px rgba(0, 0, 0, 0.2);
}

.btn .start:active span {
  background: linear-gradient(to bottom, #ff911e, #ffbb30);
  box-shadow: inset 0 1px #ffb050, 0 2px 3px rgba(0, 0, 0, 0.2);
}
.dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  /* background: url(~@/assets/images/bg1.jpeg) center center / 100% 100%; */
  background: rgba(214, 71, 65, 1);
  color: #fff;
  width: 800px;
  height: 375px;
  border-radius: 7px;
  box-shadow: 0 0 50px 10px rgba(0, 0, 0, 0.3);
  z-index: 10000;
  animation: scale 1.2s;
}
.dialog .dialog-bg {
  position: absolute;
  top: -125px;
  left: 0;
  right: 0;
  margin: auto;
  background: url(~@/assets/images/top.png) no-repeat center center / 100% 100%;
  width: 300px;
  height: 106px;
  cursor: pointer;
}
.dialog .border {
  margin: 15px;
  border: 5px solid rgba(255, 245, 33, 0.6);
  height: 340px;
  border-radius: 10px;
}
.dialog .dialog-box {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 450px;
  height: 130px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 7px;
  color: rgba(214, 71, 65, 1);
  font-size: 60px;
  text-align: center;
  line-height: 130px;
}
.bg {
  background: #db0522;
}
.box .title,
.temp_container .temp {
  color: #fff;
}
</style>
