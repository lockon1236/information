<template>
  <div class="loginAll">
    <a-form
      id="components-form-demo-normal-login"
      class="login-form"
      :form="form"
      @submit="handleSubmit"
    >
      <a-form-item>
        <a-input
          v-decorator="[
                      'userName',
                      { rules: [{ required: true, message: 'Please input your username!' }] }
                    ]"
          placeholder="Username"
        >
          <a-icon
            slot="prefix"
            type="user"
            style="color: rgba(0,0,0,.25)"
          />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input
          v-decorator="[
                      'password',
                      { rules: [{ required: true, message: 'Please input your Password!' }] }
                    ]"
          type="password"
          placeholder="Password"
        >
          <a-icon
            slot="prefix"
            type="lock"
            style="color: rgba(0,0,0,.25)"
          />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-checkbox
          v-decorator="[
                      'remember',
                      {
                        valuePropName: 'checked',
                        initialValue: true,
                      }
                    ]"
          style="margin-top:-22px;margin-left:20px;float:left;"
        >记住密码</a-checkbox>
        <a
          class="login-form-forgot"
          href
        >忘记密码？</a>
        <a-button
          value="submit"
          id="submit"
          html-type="submit"
          class="login-form-button"
        >
          <!-- <router-link to="/first" onclick="myClick()">登录</router-link> -->
          登录
        </a-button>
        <a @click="showRegister">现在注册!</a>
      </a-form-item>
    </a-form>
  </div>
</template>

<!--引用JQuery库-->
<script type="text/javascript" src="js/jquery-1.8.3.js"></script>
<script type="text/javascript">
import { METHODS } from "http";
import { Form } from "ant-design-vue";
import $ from "jquery";
export default {
  data() {
    return {
      system: "XXXXX智能信息挖掘系统",
      form: this.$form.createForm(this)
    };
  },
  methods: {
    // 设置cookie
    setCookie(name, value, day) {
      var oDate = new Date();
      var d = oDate.setDate(oDate.getDate() + day);
      var expires = "expires=" + oDate;
      document.cookie = name + "=" + value + ";" + expires;
    },
    // 获取cookie
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
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);

          var params = {
            username: values.userName,
            password: values.password
          };
          fetch("http://" + window.server + "/users/login_check/", {
            method: "POST",
            body: JSON.stringify(params)
          })
            .then(res => res.json())
            .then(data => {
              if (data.status == 1) {
                this.$store.commit("hideLogin");
                this.$message.success(`登录成功!!!`);
                let userData = {
                  name: values.userName,
                  token: data.token
                };
                this.$store.commit("initToken", userData);
                this.setCookie("username", values.userName, 5);
                this.setCookie("password", values.password, 5);
                this.setCookie("token", data.token, 5);
              } else {
                this.$message.error(`用户名或密码错误！`);
              }
            })
            .catch(err => {
              this.$message.error(`登录失败！`);
            });
        }
      });
    },
    showRegister() {
      this.$store.commit("showRegister");
    }
  }
};
</script>

<style>
/* .loginAll {
  height: 100%;
  width: 100%;
  position: absolute;
} */

.loginPic {
  margin-top: 20%;
  width: 100%;
  padding: 46% 0 46% 0;
  background-image: url(/static/pic/timg.jpg);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  font-size: 25px;
  color: #000000;
  font-weight: bold;
  word-break: break-all;
}

#submit {
  background-color: #0084c5;
  border: solid 2px #0084c5;
  border-radius: 6px;
}

/* #components-form-demo-normal-login {
  margin-top: calc(12vw);
  border: solid 2px #0084c5;
  border-radius: 8px;
  padding-top: 50px;
  padding-right: 14px;
  padding-bottom: 10px;
  padding-left: 14px;
} */

#components-form-demo-normal-login .login-form {
  max-width: 300px;
}

#components-form-demo-normal-login .login-form-forgot {
  float: right;
  margin-top: -22px;
  margin-right: 20px;
}

#components-form-demo-normal-login .login-form-button {
  width: 100%;
}
</style>
