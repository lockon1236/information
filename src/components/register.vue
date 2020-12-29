<template>
  <a-form
    :form="form"
    @submit="handleSubmit"
  >
    <a-row>
      <a-col
        :span="24"
        style="margin-right:10px; padding-left:10px;"
      >
        <a-form-item>
          <span slot="label">
            用户名
            <a-tooltip title="What do you want others to call you?">
              <a-icon type="question-circle-o" />
            </a-tooltip>
          </span>
          <a-input v-decorator="[
          'nickname',
          {
            rules: [{ required: true, message: 'Please input your nickname!', whitespace: true }]
          }
        ]" />
        </a-form-item>
        <a-form-item>
          <a-input
            v-decorator="[
                      'password',
                      { rules: [{ required: true, message: 'Please input your Password!' },{
              validator: validateToNextPassword,
            }] }
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
          <a-input
            v-decorator="[
                      'confirmpassword',
                      { rules: [{ required: true, message: 'Please confirm your password!' },{
              validator: compareToFirstPassword,
            }] }
                    ]"
            placeholder="Confirm Password"
            type="password"
            @blur="handleConfirmBlur"
          >
            <a-icon
              slot="prefix"
              type="lock"
              style="color: rgba(0,0,0,.25)"
            />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input
            v-decorator="[
                      'email',
                      { rules: [{
              type: 'email', message: 'The input is not valid E-mail!',
            }, {
              required: true, message: 'Please input your E-mail!',
            }] }
                    ]"
            placeholder="E-mali"
          >
            <a-icon
              slot="prefix"
              type="mail"
              style="color: rgba(0,0,0,.25)"
            />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input
            v-decorator="[
                      'phonenumber',
                      { rules: [{ required: true, message: 'Please input your phone number!' }] }
                    ]"
            placeholder="Phone Number"
          >
            <a-icon
              slot="prefix"
              type="phone"
              style="color: rgba(0,0,0,.25)"
            />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-cascader
            v-decorator="[
            'residence',
            {
              initialValue: ['zhejiang', 'hangzhou', 'xihu'],
              rules: [{ type: 'array', required: true, message: 'Please select your habitual residence!' }],
            }
          ]"
            placeholder="Habitual Residence"
            :options="residences"
          />
          <a-icon
            slot="prefix"
            type="home"
            style="color: rgba(0,0,0,.25)"
          />
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            style="width:40%;"
          >注册</a-button>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>
<script type="text/javascript" src="js/jquery-1.8.3.js"></script>
<script>
import { METHODS } from "http";
import { Form } from "ant-design-vue";
import $ from "jquery";
const residences = [
  {
    value: "美国",
    label: "美国"
  },
  {
    value: "中国",
    label: "中国"
  },
  {
    value: "朝鲜",
    label: "朝鲜"
  },
  {
    value: "日本",
    label: "日本"
  }
];
export default {
  data() {
    return {
      confirmDirty: false,
      form: this.$form.createForm(this),
      residences,
      userName: "",
      password: "",
      confirmpassword: "",
      email: "",
      phone: "",
      residence: []
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },
  methods: {
    handleConfirmBlur(e) {
      const value = e.target.value;
      this.confirmDirty = this.confirmDirty || !!value;
    },
    compareToFirstPassword(rule, value, callback) {
      const form = this.form;
      if (value && value !== form.getFieldValue("password")) {
        callback("Two passwords that you enter is inconsistent!");
      } else {
        callback();
      }
    },
    validateToNextPassword(rule, value, callback) {
      const form = this.form;
      if (value && this.confirmDirty) {
        form.validateFields(["confirmpassword"], { force: true });
      }
      callback();
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          var params = {
            username: values.nickname,
            password: values.password,
            repassword: values.confirmpassword,
            email: values.email,
            phonenum: values.phonenumber,
            country: values.residence[0]
          };
          fetch(
            "http://" + window.server + "/users/register/",
            {
              method: "POST",
              body: JSON.stringify(params)
            }
          )
            .then(res => res.json())
            .then(data => {
              if (data.status == 1) {
                this.$message.success(`注册成功!!!`);
                this.$store.commit("hideRegister");
              } else {
                this.$message.error(`用户名已存在，请重新注册!`);
              }
            })
            .catch(err => {
              this.$message.error(`注册失败！`);
            });
        }
      });
    }
  }
};
</script>
<style>
#reg_back {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url(/static/pic/背景.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
</style>
