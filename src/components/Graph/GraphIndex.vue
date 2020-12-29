<template>
  <a-spin :spinning="spinning" tip="加载中..." size="large">
    <div id="graphModel">
      <!-- 文字面板 -->
      <a-row style="margin-top: 7vh;">
        <div style="font-size: 50px;font-weight: 600;">目标知识图谱</div>
      </a-row>
      <a-row>
        <a-col :span="11"></a-col>
        <a-col :span="2">
          <div class="index_logo"></div>
        </a-col>
        <a-col :span="11"></a-col>
      </a-row>
      <a-row style="margin-top: 6vh;">
        <a-col :span="6"></a-col>
        <a-col :span="12">
          <a-input-search placeholder="请输入检索内容" @search="onSearch" enterButton="检索" size="large" />
        </a-col>
        <a-col :span="6"></a-col>
      </a-row>
      <a-row style="margin-top: 4vh;">
        <a-col :span="6"></a-col>
        <a-col :span="12">
          <a-radio-group @change="changeShowType" v-model="showType">
            <a-radio value="summary">概述</a-radio>
            <a-radio value="graph">图表</a-radio>
          </a-radio-group>
          <a-row style="padding:16px;margin-top: 4vh;" v-if="showType=='summary'">
            <a-col :span="7">
              <a-row class="index_dataBox">
                <a-col :span="12">
                  <img width="100" height="100" src="/static/pic/icon/entity.png" />
                </a-col>
                <a-col :span="12">
                  <div class="index_numTitle">已录入实体数</div>
                  <div class="index_numP">{{entityNum}}</div>
                </a-col>
              </a-row>
            </a-col>
            <a-col :span="1"></a-col>
            <a-col :span="7">
              <a-row class="index_dataBox">
                <a-col :span="12">
                  <img width="100" height="100" src="/static/pic/icon/relation.png" />
                </a-col>
                <a-col :span="12">
                  <div class="index_numTitle">已录入关系数</div>
                  <div class="index_numP">{{relationNum}}</div>
                </a-col>
              </a-row>
            </a-col>
            <a-col :span="1"></a-col>
            <a-col :span="7">
              <a-row class="index_dataBox">
                <a-col :span="12">
                  <img width="100" height="100" src="/static/pic/icon/doc.png" />
                </a-col>
                <a-col :span="12">
                  <div class="index_numTitle">已录入文档数</div>
                  <div class="index_numP">{{docNum}}</div>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
          <a-row :gutter="16" style="padding:16px;margin-top: 4vh;" v-show="showType=='graph'">
            <a-col :span="8">
              <div id="chartEntity" class="pieChart"></div>
            </a-col>
            <a-col :span="8">
              <div id="chartRelation" class="pieChart"></div>
            </a-col>
            <a-col :span="8">
              <div id="chartDoc" class="pieChart"></div>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="6"></a-col>
      </a-row>
    </div>
  </a-spin>
</template>

<script>
import cytoscape from "cytoscape";
import $ from "jquery";
import { setTimeout } from "timers";
var echarts = require("echarts");
var cy;
export default {
  name: "HelloWorld",
  data() {
    return {
      spinning: false,
      showType: "summary",
      entityNum: 0,
      relationNum: 0,
      docNum: 0,
      entityData: [],
      relationData: [],
      docData: [],
      listData: [
        {
          title: `已录入实体数`,
          pic: "/static/pic/entity.png",
          content: "12888"
        },
        {
          title: `已录入文档数`,
          pic: "/static/pic/doc.png",
          content: "358"
        }
      ]
    };
  },
  mounted() {
    fetch("http://" + window.server + "/information/summary_count/", {
      method: "GET"
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data.status == 1) {
          console.log(data);
          this.entityNum = data.summary.nodes_total;
          this.docNum = data.summary.file_total;
          this.relationNum = data.summary.relations_total;
          this.entityData = data.summary.recent_nodes;
          this.relationData = data.summary.recent_relations;
          this.docData = data.summary.recent_files;
        }
      })
      .catch(err => {
        this.$message.error(`提取信息失败！`);
      });
  },
  destroyed() {},
  computed: {},
  methods: {
    onSearch(value) {
      if (this.$store.state.userToken == "") {
        this.$message.error(`请先登录！`);
        return;
      }
      if (value == ""||value == " ") {
        this.$message.error(`请输入检索关键词！`);
        return;
      }
      this.spinning = true;
      var formData = {
        keyword: value,
        page_size: 100000
      };
      fetch("http://" + window.server + "/information/search_all/", {
        method: "POST",
        body: JSON.stringify(formData)
      })
        .then(res => res.json())
        .then(data => {
          if (data.status == 1) {
            this.$store.commit("initSearch");
            this.$store.commit("getSearchValue", value);
            this.$store.commit("getSearch", data.result);
            this.spinning = false;
            this.$router.push({ path: "/graph/graphsearch" });
          }
        })
        .catch(err => {});
    },
    changeShowType(e) {
      this.showType = e.target.value;
      if (this.showType == "graph") {
        this.initChartLeft(this.entityData);
        this.initChartMid(this.relationData);
        this.initChartRight(this.docData);
      }
    },
    initChartLeft(data) {
      let myChart = (myChart = echarts.init(
        document.getElementById("chartEntity")
      ));
      let xData = [];
      let yData = [];
      data.map((item, index) => {
        xData.push(item[0]);
        yData.push(item[1]);
      });
      let option = {
        title: {
          text: "已录入实体数统计"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: xData,
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              interval: 0,
              rotate: -20
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            minInterval: 1
          }
        ],
        series: [
          {
            name: "数量",
            type: "bar",
            barMaxWidth: "30",
            label: {
              normal: {
                show: true,
                position: "inside"
              }
            },
            data: yData
          }
        ]
      };
      myChart.setOption(option);
      setTimeout(() => {
        myChart.resize();
      }, 500);
    },
    initChartMid(data) {
      let myChart = (myChart = echarts.init(
        document.getElementById("chartRelation")
      ));
      let xData = [];
      let yData = [];
      data.map((item, index) => {
        xData.push(item[0]);
        yData.push(item[1]);
      });
      let option = {
        title: {
          text: "已录入关系数统计"
        },
        color: ["#faad14"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: xData,
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              interval: 0,
              rotate: -20
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            minInterval: 1
          }
        ],
        series: [
          {
            name: "数量",
            type: "bar",
            barMaxWidth: "30",
            label: {
              normal: {
                show: true,
                position: "inside"
              }
            },
            data: yData
          }
        ]
      };
      myChart.setOption(option);
      setTimeout(() => {
        myChart.resize();
      }, 500);
    },
    initChartRight(data) {
      let myChart = (myChart = echarts.init(
        document.getElementById("chartDoc")
      ));
      let xData = [];
      let yData = [];
      data.map((item, index) => {
        xData.push(item[0]);
        yData.push(item[1]);
      });
      let option = {
        title: {
          text: "已录入文档数统计"
        },
        color: ["#3398DB"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: xData,
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              interval: 0,
              rotate: -20
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            minInterval: 1
          }
        ],
        series: [
          {
            name: "数量",
            type: "bar",
            barMaxWidth: "30",
            label: {
              normal: {
                show: true,
                position: "inside"
              }
            },
            data: yData
          }
        ]
      };
      myChart.setOption(option);
      setTimeout(() => {
        myChart.resize();
      }, 500);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.index_logo {
  background-image: url(/static/pic/icon/logo.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 90%;
  height: 160px;
  margin: auto;
}

.index_dataBox {
  background: rgb(255, 255, 255);
  padding: 10px;
  border-radius: 6px;
  border: solid 1px #000;
}

.index_numTitle {
  font-size: 20px;
}

.index_numP {
  font-size: 32px;
  color: #0084c5;
}

.pieChart {
  width: 100%;
  height: 280px;
}
</style>
