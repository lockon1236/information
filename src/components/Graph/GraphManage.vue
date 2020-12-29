<template>
  <div id="graphModel">
    <!-- 文字面板 -->
    <a-row >
      <div style="float:left;width: 10vw">
        <a-menu :defaultSelectedKeys="['1_1']" :defaultOpenKeys="['1','2']" mode="inline" style="height: 93vh">
          <a-sub-menu :key="item.key" v-for="(item) in list">
            <span slot="title">
              <a-icon type="setting" />
              <span>{{item.title}}</span>
            </span>
            <a-menu-item
              :key="subitem.key"
              @click="onClick(subitem)"
              v-for="(subitem) in item.children"
            >{{subitem.title}}</a-menu-item>
          </a-sub-menu>
        </a-menu>
      </div>
      <div style="float:right;width: 88vw">
      <router-view></router-view>
      </div>
    </a-row>
  </div>
</template>

<script>
import cytoscape from "cytoscape";
import ErManage from "./manage/modelManage.vue";
import $ from "jquery";
var cy;
export default {
  name: "HelloWorld",
  components: {
    "sub-menu": ErManage
  },
  data() {
    return {
      list: [
        {
          key: "1",
          title: "词典管理",
          children: [
            {
              key: "synonymsManage",
              title: "同义词"
            },
            {
              key: "keyManage",
              title: "关键词"
            }
          ]
        },
        {
          key: "2",
          title: "其他管理",
          children: [
            {
              key: "modelManage",
              title: "模型管理"
            }
            // {
            //   key: "routerManage",
            //   title: "路由器管理"
            // }
          ]
        }
      ]
    };
  },
  mounted() {
    var token = this.getCookie("token");
    if (token == "") {
      this.$message.error("请先登录！");
      this.$router.push({ path: "/graph/graphindex" }); // 没有登录会返回主页
      return;
    }
    this.$store.state.graphColor6 = "#02d4ff";
    this.$store.state.imgUrl6 = "url(/static/pic/iconClick/manageBtn.png)";
  },
  destroyed() {
    this.$store.state.graphColor6 = "#b8b8b8";
    this.$store.state.imgUrl6 = "url(/static/pic/icon/manageBtn.png)";
  },
  computed: {},
  methods: {
    getCookie(name) {
      var strCookie = document.cookie; //获取所有的cookie值
      var oArr = strCookie.split(";");
      for (var i = 0; i < oArr.length; i++) {
        var c = oArr[i].trim();
        var oArr2 = c.split("=");
        if (oArr2[0].indexOf(name) > -1) {
          return oArr2[1];
        }
      }
      return "";
    },
    toggleCollapsed() {
      this.collapsed = !this.collapsed;
    },
    onClick(subitem) {
      console.log(subitem);
      this.$router.push({ path: `/graph/graphmanage/${subitem.key}` });
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
  color: #48564f !important;
  background: rgba(255, 255, 255, 0.7) !important;
  border: solid 1px #b8b8b8 !important;
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
