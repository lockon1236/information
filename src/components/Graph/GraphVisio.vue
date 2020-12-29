<template>
  <div
    id="graphVisio"
  >
    <!-- 文字面板 -->
    <a-row class="subRow">
      <a-col :span="20">
        <a-upload
          name="file"
          style="float: left"
          :multiple="false"
          :action="uploadUrl"
          accept=".vsdx"
          :headers="headers"
          @change="handleChange"
          :showUploadList="false"
        >
          <div class="commonMenu">上传文件
            </div>
        </a-upload>
        
      </a-col>
      <a-col :span="4">
        <div
          @click="cyFit"
          class="commonMenu"
        >自适应</div>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <div
          class="smallTitle"
          style="margin-left:2vw"
        >visio图谱</div>
        <div
          class="smallTitle"
          style="margin-left:62vw"
        >要素信息</div>
      </a-col>
    </a-row>
    <a-row class="selectRow">
      <a-col :span="24">
        <div class="colDiv"></div>
        <div
          class="textDivTest"
          style="width:63vw"
        >
          <div
            id="graphDiv"
            class="graphDiv"
          ></div>
        </div>
        <div class="colDiv"></div>
        <div
          class="textDivTest"
          style="width:30vw"
        >
          <!-- 添加实体面板 -->
          <div
            class="shitiDiv"
            v-bind:style="entityStyle"
          >
            <div class="shitiRowCon">
              <a-row>
                <a-col :span="10">
                  <div style="margin-top: 4px">实体名:</div>
                </a-col>
                <a-col :span="12">
                  <a-input
                    :value="entityValue"
                    @change="entityChange"
                  />
                </a-col>
              </a-row>
              <a-row style="margin-top: 3%;">
                <a-col :span="10">
                  <div style="margin-top: 4px">实体类型:</div>
                </a-col>
                <a-col :span="12">
                  <a-select
                    style="width: 100%"
                    @change="typeChange"
                    :value="entityType"
                  >
                    <a-select-option
                      :value="item.id"
                      :key="index"
                      v-for="(item,index) in types"
                    >{{item.name}}</a-select-option>
                  </a-select>
                </a-col>
              </a-row>
            </div>
            <a-row style="margin-top: 3%;">
              <a-col :span="12">
                <a-button
                  type="primary"
                  @click="entityOK"
                >确定</a-button>
              </a-col>
              <a-col :span="12">
                <a-button
                  type="primary"
                  @click="entityCancle"
                >取消</a-button>
              </a-col>
            </a-row>
          </div>
        </div>
        <div class="colDiv"></div>
      </a-col>
    </a-row>
    <!-- 色标柱 -->
    <a-row>
      <a-col :span="1"></a-col>
      <a-col :span="22">
        <div
          id="colorBar"
          class="colorBar"
        >
          <div
            :key="index"
            v-for="(item,index) in types"
          >
            <div class="rClickRow">{{item.label}}</div>
            <div
              class="rBox"
              :style="{background:item.color}"
            ></div>
          </div>
        </div>
      </a-col>
      <a-col :span="1"></a-col>
    </a-row>
    <!-- 添加边面板 -->
    <div
      class="edgeDiv"
      v-bind:style="edgeStyle"
    >
      <a-row>
        <a-col :span="6">
          <div>起点：</div>
        </a-col>
        <a-col :span="6">
          <div>{{sourceName}}</div>
        </a-col>
        <a-col :span="6">
          <div>终点：</div>
        </a-col>
        <a-col :span="6">
          <div>{{targetName}}</div>
        </a-col>
      </a-row>
      <a-row style="margin-top: 3%;">
        <a-col :span="6">
          <div>关系名:</div>
        </a-col>
        <a-col :span="6">
          <a-input
            :value="edgeValue"
            @change="edgeChange"
          />
        </a-col>
        <a-col :span="6">
          <a-button
            type="primary"
            @click="edgeOK"
          >确定</a-button>
        </a-col>
        <a-col :span="6">
          <a-button
            type="primary"
            @click="edgeCancle"
          >取消</a-button>
        </a-col>
      </a-row>
    </div>
  </div>

</template>

<script>
import cytoscape from "cytoscape";
var cy;
export default {
  name: "HelloWorld",
  data() {
    return {
      spinning: false,
      msg: "Viso图谱分析",
      headers: {
        authorization: "authorization-text"
      },
      uploadUrl: "http://" + window.server + "/file_upload/",
      types: [
        { name: "实体", id: "Entity", color: "#09DB8A" },
        { name: "属性", id: "Attribute", color: "#F3EFBD" },
        { name: "关系", id: "Relationship", color: "#B8E986" }
      ],
      erNodes: [],
      erEdges: [],
      editId: "",
      eventType: "add",
      entityValue: "",
      entityType: "",
      entityPosition: {},
      entityStyle: {
        display: "none"
      },
      addedEdge: undefined,
      edgeValue: "",
      edgeCount: 0,
      edgeStyle: {
        display: "none"
      },
      sourceId: "",
      targetId: "",
      sourceName: "",
      targetName: "",
      edgeIndex: 0,
      nodeIndex: 0,
      element: null,
      addEdgeId: null
    };
  },
  mounted() {
    var token = this.getCookie("token");
    if (token == "") {
      this.$message.error("请先登录！");
      this.$router.push({ path: "/graph/graphindex" }); // 没有登录会返回主页
      return;
    }
    this.$store.state.graphColor4 = "#02d4ff";
    this.$store.state.imgUrl4 = "url(/static/pic/iconClick/visioBtn.png)";
        // 获取色标柱
    fetch("http://" + window.server + "/init_interface/", {
      method: "GET"
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        this.types = data.entity_label_color;
      })
      .catch(err => {
        this.$message.error(`提取失败！`);
      });
  },
  destroyed() {
    this.$store.state.graphColor4 = "#b8b8b8";
    this.$store.state.imgUrl4 = "url(/static/pic/icon/visioBtn.png)";
  },
  computed: {
    resultIndex: function() {
      return 0;
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
    handleChange(info) {
      this.spinning = true;
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        this.spinning = false;
        if (cy !== undefined) {
          cy.remove(cy.$("node"));
        }
        this.erNodes = [];
        this.erEdges = [];
        this.$message.success(`${info.file.name} file uploaded successfully`);
        console.log(info.file.response)
        info.file.response.entitys.forEach(element => {
          this.nodeIndex++;
          let data = {
            data: {
              id: "node" + element[0],
              name: element[2],
              type: element[1],
              realType: element[3]
            }
          };
          this.erNodes.push(data);
          if (element[0] > this.nodeIndex) {
            this.nodeIndex = element[0];
          }
        });

        let relations = info.file.response.relations;
        for (let i = 0; i < relations.length; i++) {
          if (
            !this.inErNodes("node" + relations[i][0]) ||
            !this.inErNodes("node" + relations[i][1])
          ) {
            continue;
          }
          this.edgeIndex++;
          let data = {
            data: {
              id: "edge" + this.edgeIndex,
              source: "node" + relations[i][0],
              target: "node" + relations[i][1],
              name: relations[i][2]
            }
          };
          this.erEdges.push(data);
        }

        this.erNodes.forEach(element => {
          console.log(
            element.data.id + " " + element.data.name + " " + element.data.type
          );
        });
        this.erEdges.forEach(element => {
          console.log(
            element.data.id +
              " " +
              element.data.name +
              " " +
              element.data.source +
              " " +
              element.data.target
          );
        });
        this.analyze();
      } else if (info.file.status === "error") {
        this.spinning = false;
        this.$message.error(`${info.file.name} file upload failed.`);
      }
    },
    typeChange(val) {
      console.log(val);
      this.entityType = val;
    },
    /////////////////////////////////////////////////////////////
    entityChange(e) {
      const { value } = e.target;
      this.entityValue = value;
    },
    entityOK() {
      // 添加/编辑实体
      if (this.eventType == "add") {
        this.nodeIndex++;
        cy.add({
          group: "nodes",
          data: {
            id: "node" + this.nodeIndex,
            name: this.entityValue,
            type: this.entityType
          },
          position: {
            x: Math.random() * 200 + 200,
            y: Math.random() * 200 + 200
          }
        });
        this.addNode(this.entityValue, this.entityType);
        // 在后台创建节点信息
        this.createNodeInDataBase(this.entityValue, this.entityType);
      } else {
        console.log(this.editId);
        cy.$(`#${this.editId}`).data("name", this.entityValue);
        cy.$(`#${this.editId}`).data("type", this.entityType);
        this.changeNode(this.editId, this.entityValue, this.entityType);
      }
      this.entityStyle.display = "none";
    },
    entityCancle() {
      this.entityStyle.display = "none";
    },
    ///////////////////////////////////////////////////
    edgeChange(e) {
      const { value } = e.target;
      this.edgeValue = value;
    },
    edgeOK() {
      // 添加/编辑边
      if (this.eventType == "add") {
        cy.$(`#${this.addEdgeId}`).data("name", this.edgeValue); // 通过id来设置name属性
        this.addEdge(
          this.addEdgeId,
          this.sourceId,
          this.targetId,
          this.edgeValue
        );
      } else {
        cy.$(`#${this.editId}`).data("name", this.edgeValue);
        this.changeEdge(this.editId, this.edgeValue);
      }
      this.edgeStyle.display = "none";
    },
    edgeCancle() {
      this.edgeStyle.display = "none";
    },
    analyze() {
      var tt = this.types;
      cy = window.cy = this.$cytoscape({
        container: document.getElementById("graphDiv"),
        layout: {
          name: "cose-bilkent"
        },
        style: [
          // 节点样式
          {
            selector: "node[name]",
            style: {
              content: "data(name)",
              color: "#000000", // 文字颜色
              "background-color": function(ele) {
                let type = ele.data("realType");
                var bgColor = "#ffffff";
                tt.map((item, index) => {
                  if (item.value == type) {
                    bgColor = item.color;
                  }
                });
                return bgColor;
              },
              width: function(ele) {
                let type = ele.data("type");
                var w;
                if (type == "Relationship") {
                  w = 120;
                } else {
                  w = 100;
                }
                return w;
              },
              height: function(ele) {
                let type = ele.data("type");
                var h;
                if (type == "Relationship") {
                  h = 80;
                } else {
                  h = 60;
                }
                return h;
              },
              shape: function(ele) {
                let type = ele.data("type");
                var typeName = "pentagon";
                if (type == "Entity") {
                  typeName = "rectangle";
                } else if (type == "Relationship") {
                  typeName = "diamond";
                } else if (type == "Attribute") {
                  typeName = "ellipse";
                }
                return typeName;
              },
              "text-valign": "center",
              "text-halign": "center"
            }
          },
          // 边线样式
          {
            selector: "edge",
            style: {
              label: "data(name)",
              color: "#000000", // 文字颜色
              "curve-style": "bezier",
              "target-arrow-shape": "none"
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
            selector: ".eh-hover",
            style: {
              "background-color": "red"
            }
          },
          {
            selector: ".eh-source",
            style: {
              "border-width": 2,
              "border-color": "red"
            }
          },
          {
            selector: ".eh-target",
            style: {
              "border-width": 2,
              "border-color": "red"
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
        ],
        elements: {
          nodes: this.erNodes,
          edges: this.erEdges
        }
      });
      let _this = this;
      cy.cxtmenu({
        selector: "node, edge",
        commands: [
          {
            content: "<div class='cyEdit'></div>",
            select: function(ele) {
              console.log(ele);
              _this.editId = ele.id();
              if (ele.group() == "nodes") {
                _this.entityValue = ele.data("name");
                _this.entityType = ele.data("type");
                _this.eventType = "edit";
                _this.edgeStyle.display = "none";
                _this.entityStyle.display = "block";
              } else if (ele.group() == "edges") {
                _this.sourceName = ele.source().data("name"); // 获得此边的起点名
                _this.targetName = ele.target().data("name");
                _this.edgeValue = ele.data("name"); // // 获得此边的name
                _this.eventType = "edit";
                _this.entityStyle.display = "none";
                _this.edgeStyle.display = "block";
              }
            }
          },
          {
            content: "<div class='cyDelete'></div>",
            select: function(ele) {
              let node_id = ele.id();
              if (ele.group() == "nodes") {
                _this.deleteNode(ele);
              } else if (ele.group() == "edges") {
                _this.deleteEdgeById(ele._private.data.id);
              }
              cy.remove(cy.$(`#${node_id}`));
            }
          }
        ]
      });
      cy.cxtmenu({
        selector: "core",
        commands: [
          {
            content: "<div class='cyCreate'></div>",
            select: function(ele) {
              _this.eventType = "add";
              _this.entityValue = "";
              _this.edgeStyle.display = "none";
              _this.entityStyle.display = "block";
              _this.entityPosition = ele._private.pan;
            }
          }
        ]
      });
      cy.on("click", e => {
        console.log(e);
      });
      var eh = cy.edgehandles();
      // 添加边
      cy.on("ehcomplete", (event, sourceNode, targetNode, addedEles) => {
        let { position } = event;
        _this.sourceId = sourceNode._private.data.id;
        _this.targetId = targetNode._private.data.id;
        _this.sourceName = sourceNode._private.data.name;
        _this.targetName = targetNode._private.data.name;
        _this.eventType = "add";
        _this.edgeValue = "";
        _this.entityStyle.display = "none";
        _this.edgeStyle.display = "block";
        _this.edgeIndex++;
        _this.addEdgeId = "edge" + _this.edgeIndex;
        addedEles[0]._private.data.id = "edge" + _this.edgeIndex;
        // addedEles.data("id", _this.sourceId + "-" + _this.targetId);
        // _this.addedEdge = addedEles;
      });
    },
    deleteNode(ele) {
      let _this = this;
      let deleteNodeId = [];
      deleteNodeId.push(ele._private.data.id);

      // 遍历边的数组，找出需要删除的点
      this.erEdges.forEach(element => {
        if (element.data.source === ele._private.data.id) {
          if (_this.isAttribute(element.data.target)) {
            deleteNodeId.push(element.data.target);
          } else if (
            _this.isRelationship(element.data.target) &&
            _this.isRelationshipOfTwo(element.data.target)
          ) {
            // 节点是关系节点且只连接2个实体
            deleteNodeId.push(element.data.target);
          }
        } else if (element.data.target === ele._private.data.id) {
          if (_this.isAttribute(element.data.source)) {
            deleteNodeId.push(element.data.source);
          } else if (
            _this.isRelationship(element.data.source) &&
            _this.isRelationshipOfTwo(element.data.source)
          ) {
            // 节点是关系节点且只连接2个实体
            deleteNodeId.push(element.data.source);
          }
        }
      });

      deleteNodeId.forEach(nodeId => {
        _this.deleteNodeById(nodeId);
        cy.remove(cy.$(`#${nodeId}`));

        let deleteEdges = _this.deleteEdgeByNodeId(nodeId);
        deleteEdges.forEach(edgeId => {
          cy.remove(cy.$(`#${edgeId}`));
        });
      });
    },
    isAttribute(nodeId) {
      for (var index in this.erNodes) {
        if (
          this.erNodes[index].data.id === nodeId &&
          this.erNodes[index].data.type === "Attribute"
        ) {
          return true;
        }
      }
      return false;
    },
    isRelationship(nodeId) {
      for (var index in this.erNodes) {
        if (
          this.erNodes[index].data.id === nodeId &&
          this.erNodes[index].data.type === "Relationship"
        ) {
          return true;
        }
      }
      return false;
    },
    isRelationshipOfTwo(nodeId) {
      let count = 0;
      this.erEdges.forEach(element => {
        if (element.data.source === nodeId || element.data.target === nodeId) {
          count++;
        }
      });
      if (count >= 3) {
        return false;
      }
      return true;
    },
    deleteNodeById(nodeId) {
      for (var index in this.erNodes) {
        if (this.erNodes[index].data.id === nodeId) {
          this.erNodes.splice(index, 1);
          break;
        }
      }
      console.log(this.erNodes);
    },
    deleteEdgeById(edgeId) {
      for (var index in this.erEdges) {
        if (this.erEdges[index].data.id === edgeId) {
          this.erEdges.splice(index, 1);
          break;
        }
      }
      console.log(this.erEdges);
    },
    addNode(nodeId, name, type) {
      this.erNodes.push({
        data: {
          id: nodeId,
          name: name,
          type: type
        }
      });
      console.log(this.erNodes);
    },
    addEdge(edgeId, source, target, name) {
      this.erEdges.push({
        data: {
          id: edgeId,
          source: source,
          target: target,
          name: name
        }
      });
      console.log(this.erEdges);
    },
    changeNode(nodeId, name, type) {
      this.erNodes.forEach(element => {
        if (element.data.id === nodeId) {
          element.data.name = name;
          element.data.type = type;
        }
      });
      console.log(this.erNodes);
    },
    changeEdge(edgeId, name) {
      this.erEdges.forEach(element => {
        if (element.data.id === edgeId) {
          element.data.name = name;
        }
      });
      console.log(this.erEdges);
    },
    deleteEdgeByNodeId(nodeId) {
      let _this = this;
      let deleteEdges = [];
      this.erEdges.forEach(element => {
        if (element.data.source === nodeId || element.data.target === nodeId) {
          _this.deleteEdgeById(element.data.id);
          deleteEdges.push(element.data.id);
        }
      });
      return deleteEdges;
    },
    inErNodes(nodeId) {
      for (var index in this.erNodes) {
        if (this.erNodes[index].data.id === nodeId) {
          return true;
        }
      }
      return false;
    },
    createNodeInDataBase(name, type) {
      var formData = {
        name: name,
        type: type,
        region: "test"
      };
      fetch("http://" + window.visioServer + "/information/create_node/", {
        method: "POST",
        body: JSON.stringify(formData)
      })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          if (data.status === 1) {
            this.$message.success(`${name}节点创建成功`);
          } else if (data.msg === "node exists") {
            var updateForm = {
              current_name: name,
              name: name,
              type: type,
              region: "test"
            };
            fetch("http://" + window.server + "/information/update_node/", {
              method: "POST",
              body: JSON.stringify(updateForm)
            })
              .then(res => res.json())
              .then(data => {
                if (data.status === 1) {
                  console.log("节点已存在，信息已更新");
                }
              })
              .catch(err => {
                this.$message.error(`节点更新失败！`);
              });
          }
        })
        .catch(err => {
          this.$message.error(`节点创建失败！`);
        });
    },
    cyFit() {
      if (cy) {
        cy.fit();
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
::-webkit-scrollbar {
  width: 2px;
  height: 1px;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #666666;
}

::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #0d2235;
}

.homeTest_p {
  color: #fff;
  font-size: 26px;
  margin-top: calc(100vw / 750 * 20);
}

.subRow {
  padding: 10px;
  background: #2f4150;
}

.graphDiv {
  width: 100%;
  height: 100%;
}

.textDiv {
  text-align: left;
  font-size: 18px;
  height: 100%;
  width: 99%;
  float: left;
}

.colDiv {
  float: left;
  width: 2vw;
  height: calc(74vh);
}

.commonMenu {
  font-size: 20px;
  margin-left: 2vw;
  float: left;
  color: #b8b8b8;
  cursor: pointer;
}

.commonMenu:hover {
  color: #02d4ff;
}

.smallTitle {
  font-size: 16px;
  float: left;
  color: #9ca8b5;
  padding: 10px;
}

.imgVisio {
  width: 100%;
  height: 100%;
}

img[src=""],
img:not([src]) {
  opacity: 0;
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

.shitiRow {
  padding: 14px;
}

.shitiDiv {
  padding: 26px;
  width: 100%;
  font-size: 16px;
}

.textDivTest {
    float: left;
    height: calc(74vh);
    background: #ffffff;
    border-radius: 6px;
}

.edgeDiv {
  position: absolute;
  right: 10%;
  top: 10%;
  padding: 16px;
  width: 532px;
  font-size: 16px;
  background: #fff;
  border-radius: 8px;
  border: solid 1px #b8b8b8;
}

.colorBar {
  margin-top: 1vh;
  border-radius: 10px;
  padding: 12px;
  font-size: 16px;
}

.rClickRow {
  cursor: pointer;
  margin-top: 4px;
  float: left;
}

.rBox {
  float: left;
  width: 30px;
  height: 30px;
  margin-left: 4px;
  margin-right: 20px;
}

.cyEdit {
  margin: auto;
  background-image: url(/static/pic/edit.png);
  width: 32px;
  height: 32px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.cyDelete {
  margin: auto;
  background-image: url(/static/pic/delete.png);
  width: 32px;
  height: 32px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.cySearch {
  margin: auto;
  background-image: url(/static/pic/search.png);
  width: 32px;
  height: 32px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.cyMerge {
  margin: auto;
  background-image: url(/static/pic/merge.png);
  width: 32px;
  height: 32px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.cyCreate {
  margin: auto;
  background-image: url(/static/pic/create.png);
  width: 32px;
  height: 32px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.textDivDiv {
  margin-top: 1%;
  border: solid 1px #b8b8b8;
  height: calc(74vh);
  width: 100%;
  padding: 20px;
}

.ant-spin-container {
  height: 100%;
}

#textDiv .ant-spin-nested-loading > div > .ant-spin {
  max-height: 800px;
}

.ant-spin-nested-loading > div > .ant-spin-lg .ant-spin-text {
  font-size: 20px;
}

.ant-select-combobox .ant-select-search__field__wrap {
  background: rgba(255, 255, 255, 0.3);
}

.ant-select-auto-complete.ant-select .ant-input {
  margin-top: -6px;
  height: 36px;
}

.ant-input-search-icon {
  color: white;
}

.ant-modal-content {
  border: solid 1px #b8b8b8;
}

.ant-modal-title {
  color: white;
}

.ant-modal-header {
  background: linear-gradient(#2f4150, #1c2c35);
  border-bottom: solid 1px #b8b8b8;
}
</style>
