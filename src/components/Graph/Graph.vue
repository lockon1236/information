<template>
  <div id="components-layout-demo-basic">
    <a-layout>
      <a-layout-header>
        <a-row style="margin-top: 6px;">
          <a-col :span="22">
            <div
              class="homeIndex_Title"
            >
            <router-link to="/graph/graphindex">
              <div class="sysLogo"></div>
            </router-link>
            </div>
            <div
              class="homeIndex_Title"
              @click="toPage('/graph/graphanalyze')"
            >
              <div
                class="homeIndex_Pic"
                :style="{backgroundImage:this.$store.state.imgUrl1}"
              ></div>
              <div
                class="homeIndex_P"
                :style="{color:this.$store.state.graphColor1}"
              >图谱分析</div>
            </div>
            <!-- <div class="colTitle"></div> -->
            <div
              class="homeIndex_Title"
              @click="toPage('/graph/graphdoc')"
            >
              <div
                class="homeIndex_Pic"
                :style="{backgroundImage:this.$store.state.imgUrl2}"
              ></div>
              <div
                class="homeIndex_P"
                :style="{color:this.$store.state.graphColor2}"
              >文档图谱</div>
            </div>
            <div
              class="homeIndex_Title"
              @click="toPage('/graph/graphexcel')"
            >
              <div
                class="homeIndex_Pic"
                :style="{backgroundImage:this.$store.state.imgUrl3}"
              ></div>
              <div
                class="homeIndex_P"
                :style="{color:this.$store.state.graphColor3}"
              >Excel图谱</div>
            </div>
            <div
              class="homeIndex_Title"
              @click="toPage('/graph/graphvisio')"
            >
              <div
                class="homeIndex_Pic"
                :style="{backgroundImage:this.$store.state.imgUrl4}"
              ></div>
              <div
                class="homeIndex_P"
                :style="{color:this.$store.state.graphColor4}"
              >Visio图谱</div>
            </div>
            <div
              class="homeIndex_Title"
              @click="toPage('/graph/graphmanage/synonymsManage')"
            >
              <div
                class="homeIndex_Pic"
                :style="{backgroundImage:this.$store.state.imgUrl6}"
              ></div>
              <div
                class="homeIndex_P"
                :style="{color:this.$store.state.graphColor6}"
              >配置管理</div>
            </div>
            <div
              class="homeIndex_Title"
              @click="toPage('/graph/graphmap')"
            >
              <div
                class="homeIndex_Pic"
                :style="{backgroundImage:this.$store.state.imgUrl5}"
              ></div>
              <div
                class="homeIndex_P"
                :style="{color:this.$store.state.graphColor5}"
              >地图</div>
            </div>
          </a-col>
          <a-col :span="2">
            <div
              style="cursor:pointer;float: left;color:'#b8b8b8'"
              @click="showModal"
            >{{this.$store.state.userName}}</div>
            <a-dropdown style="float:left;margin-left: 10px;color: #fff;">
              <a
                class="ant-dropdown-link"
                href="#"
              >
                <a-icon type="down" />
              </a>
              <a-menu
                slot="overlay"
                @click="loginOut"
              >
                <a-menu-item key="1">
                  <a-icon type="setting" />注销</a-menu-item>
              </a-menu>
            </a-dropdown>
            <a-modal
              title="登录"
              v-model="this.$store.state.loginvisible"
              @cancel="hideModal"
              :footer="null"
              :width="500"
            >
              <Login></Login>
            </a-modal>
            <a-modal
              title="注册"
              v-model="this.$store.state.registervisible"
              @cancel="hideModalR"
              :footer="null"
              :width="500"
            >
              <Register></Register>
            </a-modal>
          </a-col>
        </a-row>
      </a-layout-header>
      <a-layout-content>
        <router-view></router-view>
      </a-layout-content>
      <!-- <a-layout-footer>
        <span id="footer_0_0-content">Copyright © 2019 The Project by
          <a>中国科学院空天信息研究院苏州研究院</a>. All Rights Reserved</span>
      </a-layout-footer> -->
    </a-layout>
  </div>
</template>

<script>
import Login from "../login.vue";
import Register from "../register.vue";
export default {
  name: "HelloWorld",
  data() {
    return {};
  },
  components: {
    Login,
    Register
  },
  mounted() {
    this.checkCookie();
  },
  methods: {
    checkCookie() {
      var user = this.getCookie("username");
      console.log(user);
      if (user == "") {
        user = "登录";
      }
      var token = this.getCookie("token");
      let userData = {
        name: user,
        token: token
      };
      this.$store.commit("initToken", userData);
    },
    // 设置cookie
    setCookie(name, value, day) {
      var oDate = new Date();
      var d = oDate.setDate(oDate.getDate() + day);
      var expires = "expires=" + oDate;
      document.cookie = name + "=" + value + ";" + expires;
    },
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
    // 移除cookie
    removeCookie(name) {
      // 将cookie的过期时间设置成过去时间,可以将cookie 移除
      this.setCookie(name, "", -1);
    },
    showModal() {
      if (this.$store.state.userName == "登录") {
        this.$store.commit("showLogin");
      }
    },
    hideModal() {
      this.$store.commit("hideLogin");
    },
    hideModalR() {
      this.$store.commit("hideRegister");
    },
    loginOut() {
      this.removeCookie("username");
      this.removeCookie("password");
      this.removeCookie("token");
      let userData = {
        name: "登录",
        token: ""
      };
      this.$store.commit("initToken", userData);
      if (this.$route.path !== "/graph/graphindex") {
        this.$router.push({ path: "/graph/graphindex" });// 注销账号会返回主页
      }
    },
    toPage(url) {
      // if (this.$store.state.userToken == "") {
      //   this.$message.error(`请先登录！`);
      //   return;
      // }
      this.$router.push({ path: url });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#components-layout-demo-basic {
  text-align: center;
  position: absolute;
  width: 100%;
  height: 100%;
}

.ant-layout-footer {
  padding: 20px 50px;
}

.ant-layout-header {
  height: 72px;
}

#components-layout-demo-basic .ant-layout-header,
#components-layout-demo-basic .ant-layout-footer {
  background: linear-gradient(#2f4150, #1c2c35);
  color: #fff;
}

#components-layout-demo-basic .ant-layout-footer {
  line-height: 1.5;
}

#components-layout-demo-basic .ant-layout-sider {
  background: #3ba0e9;
  color: #fff;
  line-height: 120px;
}

#components-layout-demo-basic .ant-layout-content {
  /* min-height: 510px; */
  /* min-height: 510px; */
  background: #ebf1f5;
  /* background-image: url(/static/pic/背景.png);
  background-repeat: no-repeat;
  background-size: 100% 100%; */
  /* line-height: 120px; */
}

#components-layout-demo-basic > .ant-layout {
  margin-bottom: 48px;
}

#components-layout-demo-basic > .ant-layout:last-child {
  margin: 0;
  height: 100%;
}

.homeIndex_Title {
  float: left;
  font-size: 24px;
  padding-left: 10px;
  padding-right: 10px;
  cursor: pointer;
}

.homeIndex_Pic {
  margin: auto;
  cursor: pointer;
  width: 40px;
  height: 40px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.homeIndex_P {
  line-height: 14px;
  font-size: 14px;
  padding-left: 20px;
  padding-right: 20px;
}

.colTitle {
  float: left;
  margin: auto;
  width: 2px;
  height: 24px;
  border: solid 1px white;
  margin-top: 20px;
}

.sysLogo {
  margin-top: 4%;
  width: 60px;
  height: 52px;
  background-image: url(/static/pic/iecas.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
</style>
