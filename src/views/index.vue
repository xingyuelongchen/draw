<template>
  <div class="body">
    <div class="bg"></div>
    <div class="temp_container">
      <div class="temp" v-for="(item,index) in domlist" :key="item.label+'-'+index" v-bind="item">{{item.label}}</div>
    </div>
    <div class="box">
      <div class="title">{{tips}}</div>
      <div class="title">{{msg}}</div>
      <div class="btn" @click="start">
        <span class="start">
          <span>{{btn}}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
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
      this.tan();
      this.status = true;
      this.current = null;
      this.tips = "正在抽奖";
      this.btn = "停止";
      this.timer = setInterval(() => {
        let index = this.random(0, this.list.length);
        this.current = index;
        this.msg = this.list[index];
      }, 50);
    },
    stop() {
      clearInterval(this.timer);
      clearInterval(this.tanTimer);
      this.status = false;
      this.btn = "继续";
    },
    tan() {
      this.tanTimer = setInterval(() => {
        let arr = new Array(3).fill().map(() => {
          let index = this.random(0, this.list.length);
          let label = this.list[index];
          let phone = this.list[index];
          let left = this.random(0, this.width) + "px";
          let top = this.random(0, this.height) + "px";
          let fontSize = this.random(10, 30) + "px";
          let color = `rgba(0,0,0,${this.random(3, 8) / 10})`;
          let style = { left, top, fontSize, color };
          return { label, phone, style };
        });
        this.domlist.push(...arr);
      }, 1000);
    },
    random(s, e) {
      return Math.floor(Math.random() * (e - s) + s);
    }
  }
};
</script>
 
<style scoped>
.body {
  background: #e9e9e9;
}
.box {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  width: 300px;
  height: 61px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
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
  -webkit-animation: shake 0.4s;
  animation: shake 0.4s;
}
.bg {
  background: #e9e9e9 url(~@/assets/images/bg.jpg) 50% 0;
  -webkit-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
  -webkit-animation: flow 16s linear infinite;
  animation: flow 16s linear infinite;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
}

.playing .bg {
  -webkit-animation-play-state: paused;
  animation-play-state: paused;
}

.temp_container {
  -webkit-transform: translate3d(0, 0, 0);
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
  -webkit-animation: flash 1.6s ease-out both;
  animation: flash 1.6s ease-out both;
  white-space: nowrap;
}
.btn .start {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 40px;
  padding: 5px;
  -webkit-box-shadow: inset 0 2px 3px rgba(0, 0, 0, 0.07), 0 1px rgba(255, 255, 255, 0.5);
  box-shadow: inset 0 2px 3px rgba(0, 0, 0, 0.07), 0 1px rgba(255, 255, 255, 0.5);
  display: inline-block;
  cursor: pointer;
}

.btn .start span {
  border-radius: 35px;
  width: 180px;
  height: 60px;
  line-height: 60px;
  background: -webkit-gradient(linear, left top, left bottom, from(#ffba30), to(#ff911e));
  background: -webkit-linear-gradient(top, #ffba30, #ff911e);
  background: linear-gradient(to bottom, #ffba30, #ff911e);
  color: #fff;
  text-align: center;
  display: block;
  font-size: 32px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: inset 0 1px #ffd17c, 0 2px 3px rgba(0, 0, 0, 0.2);
  box-shadow: inset 0 1px #ffd17c, 0 2px 3px rgba(0, 0, 0, 0.2);
  border: 1px solid #e88e1d;
}

.btn .start:hover span {
  background: -webkit-gradient(linear, left top, left bottom, from(#ffce44), to(#ffa532));
  background: -webkit-linear-gradient(top, #ffce44, #ffa532);
  background: linear-gradient(to bottom, #ffce44, #ffa532);
  -webkit-box-shadow: inset 0 1px #ffe696, 0 2px 3px rgba(0, 0, 0, 0.2);
  box-shadow: inset 0 1px #ffe696, 0 2px 3px rgba(0, 0, 0, 0.2);
}

.btn .start:active span {
  background: -webkit-gradient(linear, left top, left bottom, from(#ff911e), to(#ffbb30));
  background: -webkit-linear-gradient(top, #ff911e, #ffbb30);
  background: linear-gradient(to bottom, #ff911e, #ffbb30);
  -webkit-box-shadow: inset 0 1px #ffb050, 0 2px 3px rgba(0, 0, 0, 0.2);
  box-shadow: inset 0 1px #ffb050, 0 2px 3px rgba(0, 0, 0, 0.2);
}
</style>
