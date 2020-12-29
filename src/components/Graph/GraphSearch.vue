<template>
  <a-spin
    :spinning="spinning"
    tip="加载中..."
    size="large"
  >
    <div id="graphSearch">
      <a-row style="margin-top: 4vh;">
        <a-col :span="1"></a-col>
        <a-col :span="14">
          <a-row style="margin-top: 2vh;">
            <a-col :span="12">
              <a-input-search
                style="margin-top: 1vh;"
                placeholder="请输入检索内容"
                @search="onSearch"
                v-model="searchValue"
                enterButton="检索"
                size="large"
              />
            </a-col>
            <a-col :span="12"></a-col>
          </a-row>
          <a-row style="margin-top: 2vh;">
            <div class="search_title">检索列表</div>
          </a-row>
          <a-row style="margin-top: 2vh;">
            <a-col :span="16">
              <a-select
                style="float: left;width: 180px"
                v-show="listType == 'entity'"
                @change="typeChange"
                :value="selectedType"
              >
                <a-select-option
                  :value="item.value"
                  :key="index"
                  v-for="(item,index) in types"
                >{{item.label}}</a-select-option>
                <a-select-option
                  value="all_element"
                  key="all"
                >全部</a-select-option>
              </a-select>

              <a-radio-group
                style="float: left;margin-left: 20px"
                @change="changeListType"
                v-model="listType"
              >
                <a-radio value="entity">实体</a-radio>
                <a-radio value="doc">文档</a-radio>
              </a-radio-group>
            </a-col>
            <a-col
              :span="8"
              v-show="listType == 'entity'"
            >
              <div
                class="byhand"
                style="float:left"
              ></div>
              <div style="float:left;line-height:40px;">手动标注</div>
              <div
                class="byauto"
                style="float:left;margin-left:20px"
              ></div>
              <div style="float:left;line-height:40px;">自动标注</div>
            </a-col>
          </a-row>
          <a-row style="margin-top: 2vh;">
            <div class="search_tableCon">
              <a-table
                :customRow="clickRow"
                :columns="columns"
                :dataSource="selectedData"
                :scroll="{y: 400 }"
                :pagination="{total:total,showTotal:showTotal,size:'small',pageSize:20,showQuickJumper:true}"
              >
                <template
                  slot="name"
                  slot-scope="text,record"
                >
                  <div v-html="record.name"></div>
                </template>
                <template
                  slot="action"
                  slot-scope="text,record"
                >
                  <div :class="record.className"></div>
                </template>
                <template
                  slot="docname"
                  slot-scope="text,record"
                >
                  <div
                    style="color:#0084c5;font-size:20px"
                    v-html="record.docname"
                  ></div>
                  <div
                    class="doccontent"
                    v-html="record.doccontent"
                  ></div>
                </template>
              </a-table>
            </div>
          </a-row>
        </a-col>
        <a-col :span="1">
          <div class="search_divider"></div>
        </a-col>
        <a-col :span="7">
          <a-row style="margin-top: 9vh;">
            <div class="search_title">{{rightName}}</div>
          </a-row>
          <a-row style="margin-top: 2vh;">
            <div class="search_entityT">{{rightTitle}}</div>
            <div
              class="search_entityT"
              style="color:#0084c5"
            >{{selectName}}</div>
            <a-button
              style="float:right"
              @click="analyze"
            >
              拓扑分析
              <a-icon type="dot-chart" />
            </a-button>
          </a-row>
          <a-row style="margin-top: 2vh;">
            <div class="search_panelDiv">
              <a-tabs
                defaultActiveKey="1"
                v-show="listType=='entity'"
              >
                <a-tab-pane
                  tab="知识图谱"
                  key="1"
                >
                  <div
                    id="searchGraph"
                    class="searchGraph"
                  ></div>
                </a-tab-pane>
                <a-tab-pane
                  tab="属性面板"
                  key="2"
                >
                  <a-table
                    :columns="columnsR"
                    :dataSource="rightData"
                    :pagination="{defaultPageSize:6}"
                  />
                </a-tab-pane>
                <a-tab-pane
                  tab="文件面板"
                  key="3"
                >
                  <a-row>
                    <div class="fileSourceCon">
                      <a-button
                        type="primary"
                        @click="showFile(item)"
                        class="fileSourceDiv"
                        :key="index"
                        v-for="(item,index) in fileSource"
                      >{{item}}</a-button>
                    </div>
                  </a-row>
                  <a-drawer
                    :width="500"
                    placement="right"
                    :closable="false"
                    @close="closeDrawer"
                    :visible="drawerVisible"
                  >
                    <div id="drawerTitle" v-html="fileDrawerName">
                    </div>
                    <a-divider />
                    <div id="drawerContent" v-html="fileContent">
                    </div>
                  </a-drawer>
                </a-tab-pane>
              </a-tabs>

              <div
                v-show="listType=='doc'"
                class="search_textDiv"
                ref="search_textDiv"
              ></div>
            </div>
          </a-row>
        </a-col>
        <a-col :span="1"></a-col>
      </a-row>
    </div>
  </a-spin>
</template>

<script>
import $ from "jquery";
import cytoscape from "cytoscape";
import autoTextMarked from "./common.js";
let uuid = require("uuid");
var cy;
let columns = [
  {
    title: "实体名",
    dataIndex: "name",
    width: '40%',
    scopedSlots: { customRender: "name" }
  },
  {
    title: "标注状态",
    dataIndex: "status",
    width: '20%',
    scopedSlots: { customRender: "action" }
  },
  {
    title: "分类",
    dataIndex: "type",
    width: '20%',
    scopedSlots: { customRender: "type" }
  },
  {
    title: "方向",
    dataIndex: "area",
    width: '20%',
    scopedSlots: { customRender: "area" }
  }
];

const columnsR = [
  {
    title: "属性名",
    dataIndex: "name"
  },
  {
    title: "属性值",
    dataIndex: "value"
  }
];

const cutRList = [
  "_id",
  "same_as",
  "name",
  "realName",
  "status",
  "key",
  "className",
  "area",
  "file_list",
  "type",
  "entype",
  "markerType",
  "modify_user_id",
  "create_user_id",
  "update_time",
  "create_time"
];

const cutList = [
  "_id",
  "same_as",
  "name",
  "type",
  "entype",
  "markerType",
  "modify_user_id",
  "create_user_id",
  "update_time",
  "create_time",
  "status",
  "user",
  "time",
  "create_user"
];
export default {
  name: "HelloWorld",
  data() {
    return {
      spinning: false,
      types: [],
      nodes: [],
      edges: [],
      keyWords: [],
      selectedType: "all_element",
      listType: "entity",
      searchValue: "",
      pageSize: 20,
      total: 0,
      data: [],
      selectedData: [],
      entityData: [],
      docData: [],
      columns,
      columnsR,
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
      selectName: "",
      rightData: [],
      rightName: "属性面板",
      rightTitle: "实体名：",
      fileSource: [],
      // /////////////////
      drawerVisible: false,
      fileDrawerName: "",
      fileContent: ""
    };
  },
  mounted() {
    var token = this.getCookie("token");
    if (token == "") {
      this.$message.error("请先登录！");
      this.$router.push({ path: "/graph/graphindex" }); // 没有登录会返回主页
      return;
    }
    // 获取色标柱
    fetch("http://" + window.server + "/init_interface/", {
      method: "GET"
    })
      .then(res => res.json())
      .then(data => {
        this.types = data.entity_label_color;
        // /////////////////////////////////
        this.searchValue = this.$store.state.searchValue;
        this.dataTransform();
        this.data = this.entityData;
        this.typeChange("all_element");
      })
      .catch(err => {
        this.$message.error(`提取失败！`);
      });
  },
  destroyed() {},
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    }
  },
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
    timeTransform(value) {
      let date = new Date(value * 1000);
      let Y = date.getFullYear() + "-";
      let M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      let D = date.getDate() + " ";
      let h = date.getHours() + ":";
      let m = date.getMinutes() + ":";
      let s = date.getSeconds();
      return Y + M + D + h + m + s;
    },
    arrayCut(array, cutList) {
      Array.prototype.remove = function(val) {
        var index = this.indexOf(val);
        if (index > -1) {
          this.splice(index, 1);
        }
      };
      cutList.map(item => {
        array.remove(item);
      });
      return array;
    },
    dataTransform() {
      this.docData = [];
      this.$store.state.docList.map((item, index) => {
        this.docData.push({
          key: index,
          name: item.filename,
          user: item.create_user,
          time: this.timeTransform(item.create_time),
          text: item.origin_content
        });
      });
      this.entityData = [];
      // console.log(this.$store.state.entityList);
      this.$store.state.entityList.map((item, index) => {
        let eachType;
        let eachArea = item.area || "无";
        let className;
        if (item.markerType == "手动标注" || item.markerType == "手动提取") {
          className = "byhand";
        } else {
          className = "byauto";
        }
        this.types.map(type => {
          if (type.value == item.type) eachType = type.label;
        });
        let v_html =
          item.name == "" ? "" : autoTextMarked(item.name, [this.searchValue]);
        let names = Object.keys(item);
        let nameList = this.arrayCut(names, cutList);
        var eachData = {
          key: index,
          name: v_html,
          realName: item.name,
          status: item.markerType,
          className: className,
          type: eachType,
          area: eachArea //this.timeTransform(item.create_time)
        };

        nameList.map(name => {
          eachData[name] = item[name];
        });
        this.entityData.push(eachData);
      });
    },
    typeChange(value) {
      this.selectedType = value;
      this.selectedData = [];
      if (this.selectedType !== "all_element") {
        let typeCh;
        this.types.map(type => {
          if (type.value == this.selectedType) typeCh = type.label;
        });
        this.data.map(item => {
          if (item.type == typeCh) this.selectedData.push(item);
        });
      } else {
        this.data.map(item => {
          this.selectedData.push(item);
        });
      }
      console.log(this.selectedData);
      this.total = this.selectedData.length;
    },
    onSearch(value) {
      if (this.$store.state.userToken == "") {
        this.$message.error(`请先登录！`);
        return;
      }
      if (value == "" || value == " ") {
        this.$message.error(`请输入检索关键词！`);
        return;
      }
      this.spinning = true;
      this.rightData = [];
      this.selectName = "";
      this.searchValue = value;
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
            this.$store.commit("getSearch", data.result);
            this.dataTransform();
            this.changeListType({
              target: {
                value: this.listType
              }
            });
            this.spinning = false;
          }
        })
        .catch(err => {});
    },
    changeListType(e) {
      this.rightData = [];
      this.selectName = "";
      this.listType = e.target.value;
      // 清空右侧面板
      if (this.listType == "doc") {
        this.$refs.search_textDiv.innerHTML = "";
        this.pageSize = 3;
        this.rightName = "文档面板";
        this.rightTitle = "文档名：";
        this.columns = [
          {
            title: "文档名",
            dataIndex: "docname",
            scopedSlots: { customRender: "docname" }
          }
        ];

        this.selectedData = [];
        this.docData.map((eachData, index) => {
          let name_html =
            eachData.name == ""
              ? ""
              : autoTextMarked(eachData.name, [this.searchValue]);
          let content_html =
            eachData.text == ""
              ? ""
              : autoTextMarked(eachData.text, [this.searchValue]);
          this.selectedData.push({
            key: index,
            docname: name_html,
            realName: eachData.name,
            doccontent: content_html
          });
          var addr = "http://" + window.server + "/get_entity/";
          var formData = {
            text: eachData.text
          };
        });
        console.log(this.selectedData);
        this.total = this.docData.length;
      } else {
        this.initCy();
        this.pageSize = 20;
        this.rightName = "属性面板";
        this.rightTitle = "实体名：";
        this.columns = [
          {
            title: "实体名",
            dataIndex: "name",
            width: '40%',
            scopedSlots: { customRender: "name" }
          },
          {
            title: "标注状态",
            dataIndex: "status",
            width: '20%',
            scopedSlots: { customRender: "action" }
          },
          {
            title: "分类",
            width: '20%',
            dataIndex: "type"
          },
          {
            title: "方向",
            width: '20%',
            dataIndex: "area"
          }
        ];
        this.data = this.entityData;
        this.typeChange("all_element");
      }
    },
    showTotal() {
      return `共${this.total}条`;
    },
    itemRender(current, type, originalElement) {
      if (type === "next") {
        return <a>跳转到</a>;
      }
      return originalElement;
    },
    start() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.selectedRowKeys = [];
      }, 1000);
    },
    onSelectChange(selectedRowKeys) {
      // console.log("selectedRowKeys changed: ", selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    },
    initCy() {
      this.nodes = [];
      this.edges = [];
      var tt = this.types;
      cy = window.cy = this.$cytoscape({
        container: document.getElementById("searchGraph"),
        layout: {
          name: "cose-bilkent",
          animate: true
        },
        maxZoom: 1.2, // 最大缩放
        style: [
          // 节点样式
          {
            selector: "node[name]",
            style: {
              content: "data(name)",
              width: 60,
              height: 60,
              "background-color": function(ele) {
                let type = ele.data("type");
                var rgbColor = "#ffffff";
                tt.map((item, index) => {
                  if (item.value == type) {
                    rgbColor = item.color;
                  }
                });
                return rgbColor;
              } // 圆圈颜色
            }
          },
          // 边线样式
          {
            selector: "edge",
            style: {
              label: "data(name)",
              "curve-style": "bezier",
              "target-arrow-shape": "triangle"
            }
          },
          // some style for the extension
          {
            selector: ".eh-handle",
            style: {
              "background-color": "red",
              width: 12,
              height: 12,
              shape: "ellipse",
              "overlay-opacity": 0,
              "border-width": 12, // makes the handle easier to hit
              "border-opacity": 0
            }
          },

          {
            selector: ".eh-source",
            style: {
              "border-width": 2,
              "border-color": "blue"
            }
          },
          {
            selector: ".eh-target",
            style: {
              "border-width": 2,
              "border-color": "blue"
            }
          },
          {
            selector: ".eh-preview, .eh-ghost-edge",
            style: {
              "background-color": "red",
              "line-color": "red",
              "target-arrow-color": "red",
              "source-arrow-color": "red"
            }
          },
          {
            selector: ".eh-ghost-edge.eh-preview-active",
            style: {
              opacity: 0
            }
          }
        ]
      });
    },
    addEntityOnly(id, name, type) {
      cy.add({
        group: "nodes",
        data: {
          id: id,
          name: name,
          type: type
        },
        position: {
          x: Math.random() * 600 + 100,
          y: Math.random() * 600 + 100
        }
      });
      this.nodes.push({
        data: { id: id, name: name, type: type }
      });
    },
    addEdge(edgeList) {
      edgeList.map((item, index) => {
        cy.add({ group: "edges", data: item.data });
        this.edges.push({
          data: {
            id: item.data.id,
            source: item.data.source,
            target: item.data.target,
            name: item.data.name
          },
          name: {
            start_name: item.name.start_name,
            end_name: item.name.end_name
          }
        });
      });
    },
    centerLayout(centerName, centerId) {
      var formData = {
        node_name: centerName,
        relation_name: ""
      };
      fetch(
        "http://" + window.server + "/information/search_relation_by_name/",
        {
          method: "POST",
          body: JSON.stringify(formData)
        }
      )
        .then(res => res.json())
        .then(data => {
          if (data.status == 1) {
            console.log(data.relations);
            let centerEdges = [];
            data.relations.start_nodes.map((start_node, index) => {
              let count = 0;
              let nodeId = "";
              this.nodes.map(node => {
                if (node.data.name == start_node[2][0]) {
                  nodeId = node.data.id;
                  count++;
                }
              });
              if (count == 0) {
                nodeId = uuid.v4();
                this.addEntityOnly(nodeId, start_node[2][0], start_node[2][1]);
              }
              let edgeId = uuid.v4();
              centerEdges.push({
                data: {
                  id: edgeId,
                  source: centerId,
                  target: nodeId,
                  name: start_node[1]
                },
                name: {
                  start_name: centerName,
                  end_name: start_node[2][0]
                }
              });
            });
            data.relations.end_nodes.map((end_node, index) => {
              let count = 0;
              let nodeId = "";
              this.nodes.map(node => {
                if (node.data.name == end_node[0][0]) {
                  nodeId = node.data.id;
                  count++;
                }
              });
              if (count == 0) {
                nodeId = uuid.v4();
                this.addEntityOnly(nodeId, end_node[0][0], end_node[0][1]);
              }

              let edgeId = uuid.v4();
              centerEdges.push({
                data: {
                  id: edgeId,
                  source: nodeId,
                  target: centerId,
                  name: end_node[1]
                },
                name: {
                  start_name: end_node[0][0],
                  end_name: centerName
                }
              });
            });
            this.addEdge(centerEdges);
            var layout = cy.layout({
              name: "concentric",
              animate: true,
              minNodeSpacing: 100 // 同心圆线长度
            });
            layout.run();
            this.layoutType = "concentric";
          }
        })
        .catch(err => {
          console.log(err);
          this.$message.error(`检索失败！`);
        });
    },
    showEntityGraph(name) {
      var formData = {
        name: name
      };
      fetch("http://" + window.server + "/information/get_node_by_name/", {
        method: "POST",
        body: JSON.stringify(formData)
      })
        .then(res => res.json())
        .then(data => {
          if (data.status == 1) {
            let centerNodeInfo = data.info;
            // console.log(centerNodeInfo);
            this.addEntityOnly(
              centerNodeInfo._id,
              centerNodeInfo.name,
              centerNodeInfo.type
            ); // 只添加到前端，不存数据库

            this.centerLayout(centerNodeInfo.name, centerNodeInfo._id);
            if (centerNodeInfo["file_list"] == null) {
              // 获取文件列表
              this.fileSource = [];
            } else {
              this.fileSource = centerNodeInfo["file_list"];
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    clickRow(record, index) {
      return {
        on: {
          click: () => {
            if (this.listType == "entity") {
              this.selectName = record.realName;
              this.rightData = [];
              for (var key in record) {
                if (cutRList.indexOf(key) == -1) {
                  this.rightData.push({
                    key: key,
                    name: key,
                    value: record[key]
                  });
                }
              }
              // 绘制一跳图谱

              this.initCy();
              this.showEntityGraph(this.selectName);
            } else {
              this.selectName = record.realName;
              this.$refs.search_textDiv.innerHTML = record.doccontent;
            }
          }
        }
      };
    },
    analyze() {
      if (this.selectName == "") {
        this.$message.warning("请先选择实体或文档!");
        return;
      }
      var urlPath;
      if (this.listType === "entity") {
        urlPath = "/graph/graphanalyze";
        this.$store.commit("getAnalyzeNode", this.selectName);
      } else {
        urlPath = "/graph/graphdoc";
        this.$store.commit("getDocFile", this.selectName);
      }
      this.$router.push({ path: urlPath });
    },
    getDocEntity(text) {
      return v_html;
    },
    closeDrawer() {
      this.drawerVisible = false;
    },
    showFile(fileName) {
      this.drawerVisible = true;
      // 根据文件名获得文件内容
      var formData = {
        filename: fileName
      };
      fetch("http://" + window.server + "/information/is_file_exists/", {
        method: "POST",
        body: JSON.stringify(formData)
      })
        .then(res => res.json())
        .then(data => {
          if (data.status == 1) {
            console.log(data.file.origin_content);
            this.fileContent = autoTextMarked(data.file.origin_content, [this.searchValue]);
            this.fileDrawerName = autoTextMarked(fileName, [this.searchValue]);
            console.log(markedText);
          }
        })
        .catch(err => {
          // this.$message.error(`保存失败！`);
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.search_logo {
  width: 80px;
  height: 60px;
  background-image: url(/static/pic/iecas.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  margin: auto;
}

.search_divider {
  width: 1px;
  height: 74vh;
  border-right: solid 1px #bfbfbf;
  margin: 0px auto;
  padding: 0px;
  overflow: hidden;
}

.ant-table-row:hover {
  border: solid 2px #0084c5;
}

.ant-table-thead > tr.ant-table-row-hover:not(.ant-table-expanded-row) > td,
.ant-table-tbody > tr.ant-table-row-hover:not(.ant-table-expanded-row) > td,
.ant-table-thead > tr:hover:not(.ant-table-expanded-row) > td,
.ant-table-tbody > tr:hover:not(.ant-table-expanded-row) > td {
  border-bottom: solid 2px #0084c5;
  border-top: solid 2px #0084c5;
}

.ant-table-pagination.ant-pagination {
  float: none;
}

.search_title {
  font-size: 16px;
  float: left;
  color: #9ca8b5;
}

.search_entityT {
  font-size: 24px;
  float: left;
}

.search_panelDiv {
  background: #fff;
  padding: 14px;
  height: 60vh;
  border-radius: 6px;
}

.search_textDiv {
  text-align: left;
  overflow-y: auto;
  height: 56vh;
}

.search_tableCon {
  padding: 14px;
  background: #fff;
  height: 60vh;
  border-radius: 6px;
}

.tableIcon {
  width: 40px;
  height: 40px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.searchGraph {
  width: 100%;
  height: 50vh;
  background: #ffffff;
}

.searchGraph canvas {
  left: 0 !important;
  width: 100% !important;
}

.byhand {
  width: 34px;
  height: 34px;
  background-image: url(/static/pic/byhand.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.byauto {
  width: 34px;
  height: 34px;
  background-image: url(/static/pic/byauto.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.doccontent {
  overflow-y: hidden;
  height: 82px;
  text-overflow: ellipsis;
}

#drawerTitle {
  font-size: 20px;
  line-height: 22px;
  font-weight: 500;
}
</style>
