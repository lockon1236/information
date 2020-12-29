<template>
  <div id="graphModel">
    <!-- 文字面板 -->
    <a-row style="margin-top: 1%;">
      <a-col :span="1"></a-col>
      <a-col :span="22">
        <div class="radioTitle">选择训练模型:</div>
        <a-radio-group style="float:left;margin-left:6px" :defaultValue="modelType[0]" buttonStyle="solid">
          <a-radio-button :value="item" :key="index" v-for="(item,index) in modelType">{{item}}</a-radio-button>
        </a-radio-group>
      </a-col>
    </a-row>
    <a-row style="margin-top: 1%;">
      <a-col :span="1"></a-col>
      <a-col :span="22">
        <div class="modelDivDiv">
          <div class="modelInnerDiv">
            <a-row>
              <a-col :span="8">
                <div class="trainNumDiv">训练集个数:{{trainNum}}</div>
              </a-col>
              <a-col :span="8">
                <a-button id="trainBtn" shape="circle" size="large" @click="train">{{msg}}</a-button>
              </a-col>
              <a-col :span="8">
                <a-progress type="circle" :percent="percent" :status="status" :width="300" strokeColor="#636b6a" />
              </a-col>
            </a-row>
          </div>
        </div>
      </a-col>
      <a-col :span="1"></a-col>
    </a-row>
  </div>
</template>

<script>
import cytoscape from "cytoscape";
import $ from "jquery";
var cy;
export default {
  name: "graphmodel",
  data() {
    return {
      imageUrl: [],
      spinning: false,
      spinningTip: "拼命加载中...",
      uploadUrl: "http://" + window.server + "/file_upload/",
      headers: {
        authorization: "authorization-text"
      },
      msg: "开始训练",
      status: "normal",
      modelType: ["模型01"],
      interval: undefined,
      percent: 0,
      trainNum: 0
    };
  },
  mounted() {
    // this.$store.state.graphColor6 = "#b8b8b8";
    fetch("http://" + window.server + "/get_marked_file/", {
      method: "GET"
    })
      .then(res => res.json())
      .then(data => {
        this.trainNum = data.total;
      })
      .catch(err => {
        this.$message.error(`提取失败！`);
      });
  },
  destroyed() {
    // this.$store.state.graphColor6 = "#ffffff";
  },
  computed: {
    resultIndex: function() {
      return 0;
    }
  },
  methods: {
    train() {
      window.clearInterval(this.interval);
      this.percent = 0;
      fetch("http://" + window.server + "/train_model/", {
        method: "GET"
      })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          if (data.status == 1) {
            this.status = "normal";
            this.interval = setInterval(() => {
              let percent = this.percent + 10;
              if (percent == 100) {
                this.status = "success";
                this.$message.success(`模型训练成功！！！`);
              } else if (percent > 100) {
                percent = 100;
              }
              this.percent = percent;
            }, 500);
          } else {
            this.percent = 0;
            this.status = "exception";
            this.$message.error(`模型训练失败！！！`);
          }
        })
        .catch(err => {
          this.percent = 0;
          this.status = "exception";
          this.$message.error(`模型训练失败！！！`);
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.homeTest_p {
  color: #fff;
  font-size: 26px;
  margin-top: calc(100vw / 750 * 20);
}

.radioTitle {
  float: left;
  line-height: 36px;
  font-size: 20px;
}

.graphDiv canvas {
  left: 0 !important;
}
#buttons {
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 99999;
}

#trainBtn {
  width: 300px;
  height: 300px;
  border: solid 10px #b8b8b8;
  color: white;
  font-size: 26px;
  background: rgba(0, 0, 0, 0.5);
}

.trainNumDiv {
  width: 300px;
  height: 300px;
  line-height: 300px;
  /* margin: auto; */
  margin-right: 240px;
  color: #ffffff;
  font-size: 26px;
  border: solid 10px #b8b8b8;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
}

.ant-progress-circle .ant-progress-text {
  color: #ffffff;
}

/* .ant-progress-circle-path {
    stroke: #636b6a !important;
} */

.inputfile {
  opacity: 0;
}

.inputLabel {
  color: #fff;
  float: left;
  margin-left: 169px;
  margin-top: -26px;
  font-size: 20px;
}

.img_analyze_bnt {
  border: solid 0px rgba(0, 0, 0, 0.3);
  color: #48564f;
  height: 36px;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.87);
}

#graphModel .modelDivDiv {
  border: solid 1px #b8b8b8;
  width: 100%;
  height: calc(74vh);
  padding: 20px;
}

#graphModel .modelInnerDiv {
  background: rgba(0, 0, 0, 0.5);
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* padding: 190px; */
}

.ant-radio-button-wrapper {
  border: solid 1px #b8b8b8;
  color: #48564f;
  height: 36px;
  line-height: 36px;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.87);
}

.ant-radio-button-wrapper:hover {
  color: #48564f!important;
  background: rgba(255, 255, 255, 0.7)!important;
  border: solid 1px #b8b8b8!important;
}

.ant-radio-group-solid
  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):hover {
  color: #48564f !important;
  background: rgba(255, 255, 255, 0.7) !important;
  border: solid 1px #b8b8b8 !important;
}

.ant-radio-group-solid
  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
  color: #143223 !important;
  background: rgba(255, 255, 255, 0.5) !important;
  border: solid 1px #b8b8b8 !important;
}

.ant-radio-button-wrapper-checked {
  box-shadow: -1px 0 0 0 rgba(255, 255, 255, 0) !important;
}

.ant-radio-button-wrapper-checked:hover {
  box-shadow: -1px 0 0 0 rgba(255, 255, 255, 0) !important;
}
</style>
