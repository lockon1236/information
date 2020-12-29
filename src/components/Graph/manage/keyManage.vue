<template>
  <div id="keyManage">
    <a-row style="margin-top: 1%;">
      <a-col :span="16">
        <div style="font-size:40px;">关键词管理</div>
      </a-col>
      <a-col :span="6">
        <a-input-search
          placeholder="请输入检索内容"
          @search="onSearch"
          enterButton="检索"
          size="large"
        />
      </a-col>
      <a-col :span="2">
      </a-col>
    </a-row>
    <a-row style="margin-top: 1%;">
      <a-col
        :span="6"
        class="syRightPanel"
      >
        <a-row style="margin-top: 1%;">
          <div class="radioTitle">数据导入:</div>
          <a-upload
            style="float:left;margin-left:30px;line-height: 36px;"
            accept=".xlsx"
            :showUploadList="false"
            :multiple="true"
            :fileList="fileList"
            :remove="handleRemove"
            :beforeUpload="beforeUpload"
          >
            <a-button>
              <a-icon type="upload" />上传文件
            </a-button>
          </a-upload>
        </a-row>
        <a-row style="margin-top: 1%;">
          <div class="radioTitle">文件名:</div>
          <div class="fileBox">{{fileName}}</div>
        </a-row>
        <a-divider />
        <a-row style="margin-top: 2vh;">
          <a-tree
            :treeData="treeData"
            showIcon
            @expand="onExpand"
            :expandedKeys="expandedKeys"
            :selectedKeys="expandedKeys"
            :autoExpandParent="autoExpandParent"
            @select="onSelect"
            @check="onCheck"
            style="text-align: left;"
          >
            <a-icon
              slot="smile"
              type="copy"
            />
          </a-tree>
        </a-row>
      </a-col>
      <a-col :span="17">
        <div class="syLeftPanel">

          <a-popover
            title="请选择操作"
            trigger="click"
            :key="index"
            v-for="(item,index) in keyList"
          >
            <a
              @click="editKey"
              slot="content"
              style="margin-left: 20px;"
            >编辑</a>
            <a
              @click="removeKey"
              slot="content"
              style="float: right;margin-right: 20px;"
            >删除</a>
            <a-button
              name="keyBtn"
              class="keyBtn"
              type="primary"
              @click="btnKeyClick(item)"
            >{{item}}
            </a-button>
          </a-popover>
          <a-button
            type="primary"
            shape="circle"
            icon="plus"
            style="float: right; margin-top: 62vh;"
            @click="showAdd"
          ></a-button>
        </div>
      </a-col>
      <a-col :span="1"></a-col>
    </a-row>
    <!-- 增加关键词面板 -->
    <a-modal
      title="新增关键词"
      v-model="addState"
      :mask="false"
      :width="400"
      :footer="null"
    >
      <a-row>
        <a-col :span="2"></a-col>
        <a-col :span="6">
          <div>关键词名:</div>
        </a-col>
        <a-col :span="14">
          <a-input
            placeholder="请输入关键词"
            :value="addName"
            @change="addNameChange"
          />
        </a-col>
        <a-col :span="2"></a-col>
      </a-row>
      <a-row style="margin-top: 20px">
        <a-col :span="2"></a-col>
        <a-col :span="10">
          <a-button
            type="primary"
            @click="addToDatabase"
          >确定</a-button>
        </a-col>
        <a-col :span="10">
          <a-button
            style="float:right"
            type="primary"
            @click="hideAdd"
          >取消</a-button>
        </a-col>
        <a-col :span="2"></a-col>
      </a-row>
    </a-modal>
    <!-- 编辑关键词面板 -->
    <a-modal
      title="编辑关键词"
      v-model="editState"
      :mask="false"
      :width="500"
      :footer="null"
    >
      <a-row>
        <a-col :span="2"></a-col>
        <a-col :span="6">
          <div>关键词名:</div>
        </a-col>
        <a-col :span="14">
          <a-input
            placeholder="请输入关键词"
            :value="editName"
            @change="editNameChange"
          />
        </a-col>
        <a-col :span="2"></a-col>
      </a-row>
      <a-row style="margin-top: 2%">
        <a-col :span="2"></a-col>
        <a-col :span="6">
          <div>关键词类型:</div>
        </a-col>
        <a-col :span="14">
          <a-cascader
            style="width: 100%"
            :options="types"
            @change="typeChange"
            placeholder="请选择关键词类型"
            :value="cascaderVal"
          />
        </a-col>
        <a-col :span="2"></a-col>
      </a-row>
      <a-row style="margin-top: 20px">
        <a-col :span="2"></a-col>
        <a-col :span="10">
          <a-button
            type="primary"
            @click="editToDatabase"
          >确定</a-button>
        </a-col>
        <a-col :span="10">
          <a-button
            style="float:right"
            type="primary"
            @click="hideEdit"
          >取消</a-button>
        </a-col>
        <a-col :span="2"></a-col>
      </a-row>
    </a-modal>
    <!-- 删除面板 -->
    <a-modal
      title="删除关键词"
      v-model="removeState"
      :mask="false"
      :width="400"
      :footer="null"
    >
      <a-row>
        <a-col :span="2"></a-col>
        <a-col :span="20">
          <div>{{removeTitle}}</div>
        </a-col>
        <a-col :span="2"></a-col>
      </a-row>
      <a-row style="margin-top: 20px">
        <a-col :span="2"></a-col>
        <a-col :span="10">
          <a-button
            type="primary"
            @click="removeToDatabase"
          >确定</a-button>
        </a-col>
        <a-col :span="10">
          <a-button
            style="float:right"
            type="primary"
            @click="hideDelete"
          >取消</a-button>
        </a-col>
        <a-col :span="2"></a-col>
      </a-row>
    </a-modal>
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
      radioValue: "keyword",
      types: [
        {
          value: "person_element",
          label: "人员及其要素",
          color: "#ef6f73",
          children: [
            { value: "person_name", label: "人员名" },
            { value: "place_name", label: "地名" }
          ]
        },
        {
          value: "organization_element",
          label: "组织机构及其要素",
          color: "#d296ef",
          children: [{ value: "organization_name", label: "组织名" }]
        },
        {
          value: "network_agent_element",
          label: "网络行为体及其要素",
          color: "#9ca6ff",
          children: [{ value: "network_agent_name", label: "网络行为体名" }]
        },
        {
          value: "software_element",
          label: "软件及其要素",
          color: "#afe8ff",
          children: [{ value: "software_element", label: "软件名" }]
        },
        {
          value: "device_element",
          label: "设备及其要素",
          color: "#9bdace",
          children: [{ value: "device_name", label: "设备名" }]
        },
        {
          value: "platform_element",
          label: "平台及其要素",
          color: "#81c19c",
          children: [
            { value: "airport_name", label: "机场名" },
            { value: "harbor_name", label: "港口名" },
            { value: "building_name", label: "建筑名" },
            { value: "weaponry_name", label: "武器装备名" }
          ]
        },
        {
          value: "information_system_element",
          label: "信息系统及其要素",
          color: "#b9da74",
          children: [{ value: "information_system_name", label: "信息系统名" }]
        },
        {
          value: "policy_element",
          label: "政策法规及其要素",
          color: "#f8dc6e",
          children: [{ value: "policy_name", label: "政策法规名" }]
        },
        {
          value: "event_element",
          label: "事件及其要素",
          color: "#f1ae8a",
          children: [{ value: "event_name", label: "事件名" }]
        },
        {
          value: "cyber_armament_element",
          label: "网络武器装备及其要素",
          color: "#ff9e9b",
          children: [{ value: "cyber_armament_name", label: "网络武器名" }]
        }
      ],
      expandedKeys: [],
      autoExpandParent: true,
      addState: false,
      uploadData: undefined,
      headers: {
        authorization: "authorization-text"
      },
      uploadUrl: "http://" + window.server + "/file_upload/",
      fileName: "",
      fileList: [],
      wordParentEn: "",
      wordEn: "",
      wordClassType: "",
      wordType: "",
      uploading: false,
      treeData: [],
      keyList: [],
      shinning: [],
      addName: "",
      editState: false,
      cascaderVal: [],
      editName: "",
      oldName: "",
      oldType: "",
      oldClassType: "",
      removeState: false,
      removeTitle: ""
    };
  },
  mounted() {
    // 获取色标柱
    fetch("http://" + window.server + "/init_interface/", {
      method: "GET"
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        this.types = data.entity_label_color;
        this.types.map((type1, index1) => {
          let child = [];
          type1.children.map((type2, index2) => {
            child.push({
              title: type2.label,
              key: type1.label + "_" + type2.label,
              slots: {
                icon: "smile"
              }
            });
          });
          this.treeData.push({
            title: type1.label,
            key: type1.label,
            slots: {
              icon: "smile"
            },
            children: child
          });
        });
      })
      .catch(err => {
        this.$message.error(`提取失败！`);
      });
  },
  destroyed() {
    // this.$store.state.graphColor6 = "#ffffff";
  },
  methods: {
    updateKeys(key) {
      this.expandedKeys = key;
      const expandedKeys = this.expandedKeys;
      Object.assign(this, {
        expandedKeys,
        autoExpandParent: true
      });
    },
    recoverColor() {
      setTimeout(() => {
        let x = document.getElementsByName("keyBtn");
        for (var i = 0; i < x.length; i++) {
          x[i].style.backgroundColor = "#0084c5";
        }
      }, 500);
    },
    onSearch(value) {
      var formData = {
        keyword: value
      };
      fetch("http://" + window.server + "/search_word_in_dicts/", {
        method: "POST",
        body: JSON.stringify(formData)
      })
        .then(res => res.json())
        .then(data => {
          if (data.status == 1) {
            console.log(data.result.value);
            this.wordClassType = data.result.sup;
            this.wordType = data.result.sub;
            this.getEnType(data.result.sup, data.result.sub);
            this.updateKeys([data.result.sup + "_" + data.result.sub]);
            this.getDataList(data.result.sup, data.result.sub);

            setTimeout(() => {
              let x = document.getElementsByName("keyBtn");
              for (var i = 0; i < x.length; i++) {
                let cssText = x[i].innerText.replace(/\s*/g, "");
                data.result.value.map(resultName => {
                  if (resultName == cssText) {
                    x[i].style.backgroundColor = "#52c41a";
                  }
                });
              }
            }, 800);
          } else {
            this.$message.error(`无检索结果！`);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
    },
    beforeUpload(file) {
      this.fileList = [...this.fileList, file];
      this.handleUpload();
      return false;
    },
    handleUpload() {
      const { fileList } = this;
      const formData = new FormData();
      console.log(fileList);
      fileList.forEach(file => {
        formData.append("file", file);
      });
      formData.append("flag", "keyword");
      this.uploading = true;
      fetch("http://" + window.server + "/parse_excel/", {
        method: "POST",
        body: formData
      })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          if (data.status == 0) {
            this.$message.error(`上传失败！`);
          } else {
            this.fileName = fileList[fileList.length - 1].name;
            this.$message.success(data.content);
          }
        })
        .catch(err => {});
    },
    getEnType(type1, type2) {
      this.types.map(type => {
        if (type.label == type1) this.wordParentEn = type.value;
        type.children.map(child => {
          if (child.label == type2) this.wordEn = child.value;
        });
      });
    },
    onSelect(selectedKeys, info) {
      if (selectedKeys[0].indexOf("_") == -1) {
        this.$message.error(`请点击二级分类！`);
        return;
      }
      let type1 = selectedKeys[0].substr(0, selectedKeys[0].indexOf("_"));
      let type2 = selectedKeys[0].substr(
        selectedKeys[0].indexOf("_") + 1,
        selectedKeys[0].length
      );
      console.log("selected", type1, type2);
      this.getEnType(type1, type2);
      this.updateKeys([type1 + "_" + type2]);
      this.wordClassType = type1;
      this.wordType = type2;
      this.getDataList(type1, type2);
    },
    getDataList(type1, type2) {
      var formData = {
        class_label: type1,
        label: type2
      };
      fetch("http://" + window.server + "/get_words_in_dict/", {
        method: "POST",
        body: JSON.stringify(formData)
      })
        .then(res => res.json())
        .then(data => {
          if (data.status == 1) {
            this.keyList = data.words;
            this.recoverColor();
          }
        })
        .catch(err => {});
    },
    onCheck(checkedKeys, info) {
      console.log("onCheck", checkedKeys, info);
    },
    showAdd() {
      if (this.wordType == "") {
        this.$message.error(`请先选择关键词类型！`);
        return;
      }
      this.addState = true;
    },
    addNameChange(e) {
      const { value } = e.target;
      this.addName = value;
    },
    hideAdd() {
      this.addState = false;
    },
    addToDatabase() {
      var formData = {
        sup_label: this.wordClassType,
        sub_label: this.wordType,
        word: this.addName
      };
      fetch("http://" + window.server + "/add_new_word/", {
        method: "POST",
        body: JSON.stringify(formData)
      })
        .then(res => res.json())
        .then(data => {
          if (data.status == 1) {
            this.addState = false;
            this.$message.success(`新增关键词成功`);
            this.getDataList(this.wordClassType, this.wordType);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    btnKeyClick(val) {
      this.editName = val;
      this.cascaderVal = [this.wordParentEn, this.wordEn];
    }, // 点击每个关键词按钮
    hideDelete() {
      this.removeState = false;
    },
    removeKey() {
      this.removeTitle = `确定删除关键词:${this.editName}?`;
      this.removeState = true;
    },
    removeToDatabase() {
      var formData = {
        sup_label: this.wordClassType,
        sub_label: this.wordType,
        word: this.editName
      };
      fetch("http://" + window.server + "/del_word_in_dict/", {
        method: "POST",
        body: JSON.stringify(formData)
      })
        .then(res => res.json())
        .then(data => {
          if (data.status == 1) {
            this.removeState = false;
            this.$message.success(`删除关键词成功`);
            this.getDataList(this.wordClassType, this.wordType);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    hideEdit() {
      this.editState = false;
    },
    editKey() {
      this.editState = true;
      this.oldName = this.editName;
      this.oldType = this.wordType;
      this.oldClassType = this.wordClassType;
    },
    editNameChange(e) {
      const { value } = e.target;
      this.editName = value;
    },
    typeChange(val) {
      this.cascaderVal = val;
    },
    editToDatabase() {
      var newType;
      var newClassType;
      this.types.map(type => {
        type.children.map(child => {
          if (type.value == this.cascaderVal[0]&&child.value == this.cascaderVal[1]) {
            newType = child.label;
            newClassType = type.label;
            }
        });
      });
      var formData = {
        old_sup_label: this.oldClassType,
        old_sub_label: this.oldType,
        old_word: this.oldName,
        new_sup_label: newClassType,
        new_sub_label: newType,
        new_word: this.editName
      };
      fetch("http://" + window.server + "/update_word_in_dict/", {
        method: "POST",
        body: JSON.stringify(formData)
      })
        .then(res => res.json())
        .then(data => {
          if (data.status == 1) {
            this.editState = false;
            this.$message.success(`更新关键词成功`);
            this.getDataList(this.wordClassType, this.wordType);
          }
        })
        .catch(err => {
          console.log(err);
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

.syLeftPanel {
  background: #ffffff;
  padding: 20px;
  height: 74vh;
  margin-left: 2vw;
  overflow-y: auto;
}

.syRightPanel {
  background: rgb(255, 255, 255);
  padding: 20px;
  height: 74vh;
  overflow-y: auto;
}

.radioTitle {
  float: left;
  line-height: 36px;
  font-size: 20px;
}

.fileBox {
  float: left;
  margin-left: 52px;
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

#inputManage .ant-upload-list {
  color: #000;
}

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

.ant-popover {
  z-index: 1;
}

.keyBtn {
  float: left;
  margin-left: 14px;
  margin-top: 10px;
}

@keyframes fade {
  from {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
  to {
    opacity: 1;
  }
}

@-webkit-keyframes fade {
  from {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
  to {
    opacity: 1;
  }
}
</style>
