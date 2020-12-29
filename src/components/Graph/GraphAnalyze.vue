<template>
  <div id="homeTest">
    <a-spin
      :spinning="spinning"
      tip="加载中..."
      size="large"
    >
      <!-- 时间轴 -->
      <div
        id="timeBarCon"
        :style="{opacity:timeOpacity}"
      >
        <a-row class="selectRow">
          <a-col :span="22">
            <div id="timeBar"></div>
          </a-col>
          <a-col :span="2">
            <a-button
              style="opacity: 2"
              @click="showRange"
            >数据统计</a-button>
          </a-col>
        </a-row>
      </div>
      <!-- 文字面板 -->
      <a-row class="subRow">
        <a-col :span="18">
          <div
            class="commonMenu"
            @click="customize"
          >自定义</div>
          <div class="gisTitle">GIS开关</div>
          <a-switch
            style="margin-left: 6px;margin-top: 6px;float: left;"
            @change="gisChange"
            :checked="gisCheck"
          />
          <div
            class="commonMenu"
            @click="output"
          >导出</div>
          <div
            v-if="!showTextStore"
            class="commonMenu"
            @click="showStore"
          >恢复</div>
          <!-- <div style="margin-left: 6px;float: left;">时间分析:</div>
        <a-switch
          style="margin-left: 6px;float: left;"
          @change="timeAnalyze"
          :checked="timeCheck"
          />-->
        </a-col>
        <a-col :span="6">
          <div id="layoutTitle">选择布局:</div>
          <a-select
            class="commonSelect"
            @change="layoutChange"
            :value="layoutType"
          >
            <a-select-option
              :value="item.val"
              :key="index"
              v-for="(item,index) in layouts"
            >{{item.label}}</a-select-option>
          </a-select>
          <div
            class="commonMenu"
            @click="cyFit"
          >自适应</div>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <div
            class="smallTitle"
            style="margin-left:2vw"
          >实体图谱</div>
          <div
            class="smallTitle"
            style="margin-left:62vw"
          >要素信息</div>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <div class="colDiv"></div>
          <div
            class="textDivTest"
            style="width:63vw"
            v-show="!gisCheck"
          >
            <div
              id="analyzeGraphDiv"
              class="analyzeGraphDiv"
            ></div>
          </div>
          <div
            id="earth_container"
            v-show="gisCheck"
          >
            <a-radio-group
              style="z-index: 2;position: absolute;"
              @change="changeLayer"
              v-model="layerType"
            >
              <a-radio-button value="googleimg">谷歌影像</a-radio-button>
              <a-radio-button value="googlemap">谷歌地图</a-radio-button>
            </a-radio-group>
            <div class="lonlatDiv">{{mouselonlat}}</div>
          </div>
          <div class="colDiv"></div>
          <div
            class="textDivTest"
            style="width:30vw"
          >
            <!-- 添加实体面板 -->
            <div
              class="shitiDiv"
              v-show="rightPanelName == 'attribute'"
              v-bind:style="entityStyle"
            >
              <div class="shitiRowCon">
                <a-row class="shitiRow">
                  <a-col :span="10">
                    <div>实体名:</div>
                  </a-col>
                  <a-col :span="12">
                    <a-input
                      :value="entityValue"
                      @change="entityChange"
                      style="text-align: center;"
                    />
                  </a-col>
                </a-row>
                <a-row class="shitiRow">
                  <a-col :span="10">
                    <div>实体类型:</div>
                  </a-col>
                  <a-col :span="12">
                    <a-cascader
                      style="width: 100%"
                      :options="types"
                      @change="typeChange"
                      placeholder="请选择实体类型"
                      :value="cascaderVal"
                    />
                  </a-col>
                </a-row>
              </div>

              <div class="attrCon">
                <a-row v-show="eventType == 'edit'">
                  <a-col :span="10">
                    <div class="attrTitle">属性</div>
                  </a-col>
                  <a-col :span="12">
                    <div class="attrTitle">属性值</div>
                  </a-col>
                  <a-col :span="2">
                    <a-button
                      @click="addAttr"
                      class="ant-btn-del"
                    >+</a-button>
                  </a-col>
                </a-row>
                <a-row
                  v-show="eventType == 'edit'"
                  class="selectRow"
                  :key="index"
                  v-for="(item,index) in colName"
                >
                  <a-col :span="10">
                    <div
                      name="attrType"
                      class="attrP"
                      contenteditable="true"
                    >{{item}}</div>
                  </a-col>
                  <a-col :span="12">
                    <div
                      name="attrValue"
                      class="attrP"
                      contenteditable="true"
                    >{{colValue[index]}}</div>
                  </a-col>
                  <a-col :span="2">
                    <a-button
                      @click="deleteAttr(index)"
                      class="ant-btn-del"
                    >-</a-button>
                  </a-col>
                </a-row>
                <a-row style="margin-top: 3%;">
                  <a-col :span="12">
                    <a-button
                      type="primary"
                      @click="entityOK"
                    >保存</a-button>
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
            <!-- 添加边面板 -->
            <div
              class="edgeDivTest"
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
                  <a-select
                    style="width: 100%"
                    @change="edgeTypeChange"
                    :value="relation"
                  >
                    <a-select-opt-group>
                      <hr
                        slot="label"
                        style="width: 100%"
                      />
                      <a-select-option
                        :value="item"
                        :key="index"
                        v-for="(item,index) in relations"
                      >{{item}}</a-select-option>
                    </a-select-opt-group>
                    <a-select-opt-group>
                      <hr
                        slot="label"
                        style="width: 100%"
                      />
                      <a-select-option value="Additem">新增关系</a-select-option>
                      <a-select-option value="Deleteitem">删除关系</a-select-option>
                    </a-select-opt-group>
                  </a-select>
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
            <div
              v-show="eventType == 'edit'"
              style="padding: 20px;"
            >
              <a-divider orientation="left">相关文档</a-divider>
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
                <div
                  id="drawerTitle"
                  v-html="fileName"
                >
                </div>
                <a-divider />
                <div
                  id="drawerContent"
                  v-html="fileContent"
                >
                </div>
              </a-drawer>
            </div>

            <div
              class="levelCon"
              v-show="rightPanelName == 'level'"
            >
              <a-row style="margin-top:2vh;line-height:32px">
                <a-col :span="6">
                  <div class="panelCircle"></div>
                </a-col>
                <a-col :span="6">起点名称:</a-col>
                <a-col :span="6">{{startName}}</a-col>
              </a-row>
              <a-row style="margin-top:2vh;line-height:32px">
                <a-col :span="6">
                  <div
                    class="panelCircle"
                    style="background-image: url(/static/pic/endIcon.png)"
                  ></div>
                </a-col>
                <a-col :span="6">终点名称:</a-col>
                <a-col :span="6">
                  <a-input
                    placeholder="请输入终点名称"
                    :value="endName"
                    @change="endNameChange"
                  />
                </a-col>
              </a-row>
              <a-row style="margin-top:2vh;line-height:32px">
                <a-col :span="6"></a-col>
                <a-col :span="6">层级设置:</a-col>
                <a-col :span="6">
                  <a-input-number
                    :min="1"
                    :max="5"
                    v-model="levelNum"
                    @change="levelNumChange"
                  />
                </a-col>
                <a-col :span="6">
                  <a-button
                    style
                    @click="searchLevel"
                  >查询</a-button>
                </a-col>
              </a-row>
              <a-table
                style="margin-top:2vh"
                :customRow="levelClick"
                :columns="levelColumns"
                :dataSource="levelData"
                :pagination="{defaultPageSize:6}"
              />
            </div>
            <a-collapse v-show="rightPanelName == 'timeRange'">
              <a-collapse-panel
                header="实体统计"
                key="1"
              >
                <p>哈哈哈哈哈哈哈哈哈哈或或或或或或或或或</p>
              </a-collapse-panel>
              <a-collapse-panel
                header="属性统计"
                key="2"
                :disabled="false"
              >
                <p>哈哈哈哈哈哈哈哈哈哈或或或或或或或或或</p>
              </a-collapse-panel>
            </a-collapse>
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

      <!-- 新建关系面板 -->
      <a-modal
        title="请新建关系！"
        v-model="newRePanel"
        :mask="false"
        :maskClosable="false"
        :footer="null"
        :width="300"
      >
        <a-row>
          <a-input
            :value="edgeValue"
            @change="edgeChange"
          />
        </a-row>
        <a-row style="margin-top: 20px">
          <a-col :span="2"></a-col>
          <a-col :span="10">
            <a-button
              type="primary"
              @click="addEdgeConfirm"
            >确定</a-button>
          </a-col>
          <a-col :span="10">
            <a-button
              style="float:right"
              type="primary"
              @click="addEdgeCancel"
            >取消</a-button>
          </a-col>
          <a-col :span="2"></a-col>
        </a-row>
      </a-modal>
      <!-- 删除关系面板 -->
      <a-modal
        title="请删除关系！"
        v-model="deleteRePanel"
        :mask="false"
        :maskClosable="false"
        :footer="null"
        :width="300"
      >
        <a-row>
          <a-select
            style="width: 100%"
            @change="deleteTypeChange"
            :value="deleteRelation"
          >
            <a-select-option
              :value="item"
              :key="index"
              v-for="(item,index) in relations"
            >{{item}}</a-select-option>
          </a-select>
        </a-row>
        <a-row style="margin-top: 20px">
          <a-col :span="2"></a-col>
          <a-col :span="10">
            <a-button
              type="primary"
              @click="deleteEdgeConfirm"
            >确定</a-button>
          </a-col>
          <a-col :span="10">
            <a-button
              style="float:right"
              type="primary"
              @click="deleteEdgeCancel"
            >取消</a-button>
          </a-col>
          <a-col :span="2"></a-col>
        </a-row>
      </a-modal>
      <!-- 检索关系面板 -->
      <a-modal
        title="请选择相关关系！"
        v-model="databasePanel"
        :mask="false"
        :footer="null"
        :width="300"
      >
        <a-row>
          <a-select
            style="width: 100%"
            @change="databaseTypeChange"
            :value="databaseRelation"
          >
            <a-select-option
              :value="item"
              :key="index"
              v-for="(item,index) in nodeRelations"
            >{{item}}</a-select-option>
          </a-select>
        </a-row>
        <a-row style="margin-top: 20px">
          <a-col :span="2"></a-col>
          <a-col :span="10">
            <a-button
              type="primary"
              @click="databaseConfirm"
            >确定</a-button>
          </a-col>
          <a-col :span="10">
            <a-button
              style="float:right"
              type="primary"
              @click="databaseCancel"
            >取消</a-button>
          </a-col>
          <a-col :span="2"></a-col>
        </a-row>
      </a-modal>
      <!-- 检索关系面板 -->
      <a-modal
        title="确定删除？"
        v-model="deleteState"
        :mask="false"
        :width="300"
        :footer="null"
      >
        <a-row style="margin-top: 20px">
          <a-col :span="2"></a-col>
          <a-col :span="10">
            <a-button
              type="primary"
              @click="deleteOk"
            >确定</a-button>
          </a-col>
          <a-col :span="10">
            <a-button
              style="float:right"
              type="primary"
              @click="deleteNot"
            >取消</a-button>
          </a-col>
          <a-col :span="2"></a-col>
        </a-row>
      </a-modal>
      <!-- 数据融合面板 -->
      <a-modal
        title="数据融合"
        v-model="mergeState"
        :mask="false"
        :width="900"
        :footer="null"
      >
        <a-row style="margin-top: 20px">
          <a-col :span="8">
            <div>源实体:</div>
            <a-button
              style="float:left;margin-top:10px"
              type="primary"
            >{{mergeSourceName}}</a-button>
          </a-col>
          <a-col
            :span="16"
            style="border-left:solid 1px #b8b8b8;padding-left:20px"
          >
            <a-row style="margin-top: 2px">
              <div class="mergeTitle">源实体属性</div>
            </a-row>
            <a-row style="border: solid 1px #ebf1f5;">
              <div
                class="mergeBox"
                :key="index"
                v-for="(item,index) in mergeSourceRow"
              >{{item}}</div>
            </a-row>
            <div class="mergeTitle">待融合实体</div>
            <a-row style="border: solid 1px #ebf1f5;padding: 10px">
              <a-col :span="8">实体名:</a-col>
              <a-col :span="16">
                <a-button
                  style="float:left;margin-left:10px;margin-top: 10px;"
                  type="primary"
                  :key="index"
                  @click="showTarget(item)"
                  v-for="(item,index) in mergeTarget"
                >{{item}}</a-button>
              </a-col>
            </a-row>
            <div class="mergeTitle">待融合实体属性</div>
            <a-row style="border: solid 1px #ebf1f5;">
              <div
                class="mergeBox"
                :key="index"
                v-for="(item,index) in mergeTargetRow"
              >{{item}}</div>
            </a-row>
          </a-col>
        </a-row>
        <a-row style="margin-top: 20px">
          <a-col :span="2"></a-col>
          <a-col :span="10"></a-col>
          <a-col :span="10">
            <a-button
              style="float:right"
              type="primary"
              @click="showMerge"
            >确定</a-button>
          </a-col>
          <a-col :span="2"></a-col>
        </a-row>
      </a-modal>
      <!-- 融合操作面板 -->
      <a-modal
        title="数据融合"
        v-model="mergeDone"
        :mask="false"
        :width="800"
        :footer="null"
      >
        <a-row style="margin-top: 3%;">
          <a-col :span="8">
            <div class="attrTitle">属性</div>
          </a-col>
          <a-col :span="14">
            <div class="attrTitle">属性值</div>
          </a-col>
          <a-col :span="2">
            <a-button
              @click="addAttrMerge"
              class="ant-btn-del"
              style="margin-left:8px;margin-top:1px;"
            >+</a-button>
          </a-col>
        </a-row>
        <a-row
          class="selectRow"
          :key="index"
          v-for="(item,index) in colNameMerge"
        >
          <a-col :span="8">
            <div
              name="attrTypeMerge"
              class="attrP"
            >{{item}}</div>
          </a-col>
          <a-col :span="14">
            <div
              name="attrValueMerge"
              class="attrP"
              contenteditable="true"
            >{{colValueMerge[index]}}</div>
          </a-col>
          <a-col :span="2">
            <a-button
              @click="deleteAttrMerge(index)"
              class="ant-btn-del"
              style="margin-left:8px;margin-top:1px;"
            >-</a-button>
          </a-col>
        </a-row>
        <a-row style="margin-top: 20px">
          <a-col :span="2"></a-col>
          <a-col :span="10"></a-col>
          <a-col :span="10">
            <a-button
              style="float:right"
              type="primary"
              @click="mergePerform"
            >融合</a-button>
          </a-col>
          <a-col :span="2"></a-col>
        </a-row>
      </a-modal>
    </a-spin>
  </div>
</template>

<script>
import $ from "jquery";
import axios from "axios";
import cytoscape from "cytoscape";
import coseBilkent from "cytoscape-cose-bilkent"; // 布局
import cise from "cytoscape-cise";
import { setTimeout } from "timers";
import saveAs from "./saveAs.js";
import autoTextMarked from "./common.js";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
var echarts = require("echarts");
let uuid = require("uuid");
cytoscape.use(coseBilkent);
cytoscape.use(cise);
var cy;
const cutList = [
  "_id",
  "file_list",
  "same_as",
  "name",
  "type",
  "entype",
  "markerType",
  "modify_user_id",
  "create_user_id",
  "update_time",
  "create_time"
];

export default {
  name: "HelloWorld",
  components: {
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes
    }
  },
  data() {
    return {
      indicator: <a-icon type="loading" style="opacity: 0" spin />,
      headers: {
        authorization: "authorization-text"
      },
      lanName: "英语",
      layoutType: "circle",
      layouts: [
        { val: "circle", label: "圆形" },
        { val: "grid", label: "网格" },
        { val: "random", label: "随机" },
        { val: "concentric", label: "同心" },
        { val: "breadthfirst", label: "广度优先" },
        { val: "cose-bilkent", label: "复合镶嵌" }
      ],
      showTextStore: true,
      uploadUrl: "http://" + window.server + "/file_upload/",
      fileList: [],
      spinning: false,
      doEntity: false,
      menuBtnText: "请选择实体类型",
      searchData: [],
      selectedText: "",
      keyWords: [],
      markerContent: "",
      markerPanel: false,
      deletePanel: false,
      newRePanel: false,
      deleteRePanel: false,
      deleteState: false,
      confirmType: "",
      confirmId: "",
      relation: "",
      relations: [],
      nodeRelations: [],
      deleteRelation: "",
      markerType: "",
      markerEnType: "",
      types: [],
      nodes: [],
      textNodes: [], // 保存文章中的节点
      edges: [],
      textEdges: [], // 保存文章中的关系
      editId: "",
      eventType: "add",
      entityOldValue: "",
      entityValue: "",
      entityId: "",
      edgeId: "",
      entityType: "",
      entityEnType: "",
      entityPosition: {},
      entityStyle: {
        display: "none"
      },
      colName: [],
      colValue: [],
      cascaderVal: [],
      addedEdge: undefined,
      edgeValue: "",
      oldedgeValue: "",
      edgeCount: 0,
      edgeStyle: {
        display: "none"
      },
      sourceId: "",
      targetId: "",
      sourceName: "",
      targetName: "",
      databasePanel: false,
      databaseRelation: "",
      ciseArray: [],
      originArray: [],
      presentArray: [],
      dataBaseEdge: [],
      presentEdgeIds: [],
      // 拓扑层级检索
      rightPanelName: "none",
      startName: "",
      endName: "",
      levelNum: 1,
      levelColumns: [
        {
          title: "路径编号",
          dataIndex: "num"
        },
        {
          title: "路径长度",
          dataIndex: "length"
        },
        {
          title: "途径条目",
          dataIndex: "object"
        }
      ],
      levelData: [],
      // 时间分析
      timeCheck: false,
      timeOpacity: 0.0,
      timeParam: undefined,
      timeNodes: undefined,
      // 数据融合
      mergeState: false,
      mergeDone: false,
      // ///////////////////
      mergeSourceName: "",
      mergeNameSource: [],
      mergeValueSource: [],
      mergeSourceRow: [],
      // ////////////////////
      mergeTarget: [],
      mergeTargetName: "",
      mergeNameTarget: [],
      mergeValueTarget: [],
      mergeTargetRow: [],
      colNameMerge: [],
      colValueMerge: [],
      // ////////////////
      storeState: false,
      topicAreas: ["美国", "中国", "朝鲜", "日本"],
      topicArea: "中国",
      fileSource: [],
      drawerVisible: false,
      fileName: "",
      fileContent: "",
      // WebGis开关
      gisCheck: false,
      map: undefined,
      markers: [],
      polylines: [],
      markerNames: [],
      layerType: "googlemap",
      osmLayer: undefined,
      mouselonlat: "",
      searchNodeName: ""
    };
  },
  mounted() {
    var token = this.getCookie("token");
    if (token == "") {
      this.$message.error("请先登录！");
      this.$router.push({ path: "/graph/graphindex" }); // 没有登录会返回主页
      return;
    }
    this.$store.state.imgUrl1 = "url(/static/pic/iconClick/analyzeBtn.png)";
    this.$store.state.graphColor1 = "#02d4ff";
    // 获取色标柱
    fetch("http://" + window.server + "/init_interface/", {
      method: "GET"
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        this.types = data.entity_label_color;
        // 检索页面跳转
        if (this.$store.state.analyzeNodeName !== "") {
          var formData = {
            name: this.$store.state.analyzeNodeName
          };
          fetch("http://" + window.server + "/information/get_node_by_name/", {
            method: "POST",
            body: JSON.stringify(formData)
          })
            .then(res => res.json())
            .then(data => {
              if (data.status == 1) {
                this.spinning = true;
                let centerNodeInfo = data.info;
                console.log(centerNodeInfo);
                this.initCy();
                this.addEntityOnly(
                  centerNodeInfo._id,
                  centerNodeInfo.name,
                  centerNodeInfo.type,
                  centerNodeInfo.entype
                ); // 只添加到前端，不存数据库
                this.centerLayout(centerNodeInfo.name, centerNodeInfo._id);
                this.spinning = false;
              }
            })
            .catch(err => {});
        }
      })
      .catch(err => {
        this.$message.error(`提取失败！`);
      });
    //js禁止鼠标右键打开及复制
    document.oncontextmenu = new Function("event.returnValue=false");
    document.onselectstart = new Function("event.returnValue=false");

    function click1() {
      if (event.button == 2) {
        return false;
      }
    }
    document.onselectstart = click1;
  },
  destroyed() {
    this.$store.state.imgUrl1 = "url(/static/pic/icon/analyzeBtn.png)";
    this.$store.state.graphColor1 = "#b8b8b8";
    this.$store.commit("getAnalyzeNode", "");
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
    layoutChange(value) {
      if (cy) {
        var layout = cy.layout({
          name: value,
          animate: true
        });
        layout.run();
        this.layoutType = value;
      }
    },
    cyFit() {
      if (cy) {
        cy.fit();
      }
    },
    clearAll() {
      this.nodes.map(node => {
        cy.remove(cy.$(`#${node.data.id}`));
      });
      this.edges.map(edge => {
        cy.remove(cy.$(`#${edge.data.id}`));
      });
      this.nodes = [];
      this.edges = [];
      this.keyWords = [];
    },
    // 删除其他同样标记
    deleteConfirm() {
      var _this = this;
      this.$refs.selectText.querySelectorAll(".closeBtn").forEach(v => {
        if (v.parentElement.innerText == _this.markerContent) {
          v.parentElement.outerHTML = _this.markerContent;
        }
      });
      this.$message.success(`删除成功！`);
      this.deletePanel = false;
    },
    deleteCancel() {
      this.deletePanel = false;
    },
    contentSelect(e) {
      if (cy == undefined || cy.destroyed() == true) {
        this.$message.warning(`请先点击图谱分析！`);
        return;
      } // 判断cy是否被清除还是没有初始化
      this.selectedText = window
        .getSelection()
        .toString()
        .trim();
      var selection = window.getSelection();
      if (this.selectedText) {
        console.log(this.selectedText, this.keyWords);
        console.log(selection);
        if (selection.anchorNode == selection.focusNode) {
          if (this.keyWords.indexOf(selection.anchorNode.data) > -1) {
            this.$message.warning(`标注不能覆盖!`); // 在关键字内标注的情况
          } else {
            this.markerPanel = true;
          }
        } else {
          this.$message.warning(`标注不能相交!`); // 标注交叉的情况
        }
      } else {
        return false;
      }
    },
    markerChange(markerType, markerEnType, markerName, markerEnName) {
      if (markerType && markerEnType) {
        this.markerType = markerType;
        this.markerEnType = markerEnType;
        this.menuBtnText = markerName + "/" + markerEnName;
      } else {
        this.$message.warning(`请正确选择类型！`);
      }
    },
    edgeTypeChange(val) {
      this.relation = val;
      console.log(val);
      if (val == "Additem") {
        this.newRePanel = true;
      } else if (val == "Deleteitem") {
        this.deleteRePanel = true;
      }
    },
    deleteTypeChange(val) {
      this.deleteRelation = val;
    },
    addEdgeConfirm() {
      this.relations.push(this.edgeValue);
      this.relation = this.edgeValue;
      var formData = {
        relation_name: this.edgeValue
      };
      fetch("http://" + window.server + "/information/add_relationline/", {
        method: "POST",
        body: JSON.stringify(formData)
      })
        .then(res => res.json())
        .then(data => {
          if (data.status == 1) {
            this.$message.success(`保存关系成功！`);
          }
        })
        .catch(err => {
          this.$message.error(`保存关系失败！`);
        });
      this.newRePanel = false;
    },
    addEdgeCancel() {
      this.newRePanel = false;
    },
    deleteEdgeConfirm() {
      this.relations.map((item, index) => {
        if (item == this.deleteRelation) {
          this.relations.splice(index, 1);
        }
      });
      var formData = {
        relation_line_name: this.deleteRelation
      };
      fetch(
        "http://" +
          window.server +
          "/information/delete_relation_line_by_name/",
        {
          method: "POST",
          body: JSON.stringify(formData)
        }
      )
        .then(res => res.json())
        .then(data => {
          if (data.status == 1) {
            this.$message.success(`删除关系成功！`);
          }
        })
        .catch(err => {
          this.$message.error(`删除关系失败！`);
        });
    },
    deleteEdgeCancel() {
      this.deleteRePanel = false;
    },
    closeMarker() {
      this.markerPanel = false;
    },
    typeChange(val) {
      console.log(val);
      this.entityType = val[0];
      this.entityEnType = val[1];
      this.cascaderVal = val;
    },
    /////////////////////////////////////////////////////////////
    entityChange(e) {
      const { value } = e.target;
      this.entityValue = value;
    },
    addEntityOnly(id, name, type, entype) {
      cy.add({
        group: "nodes",
        data: {
          id: id,
          name: name,
          type: type,
          entype: entype
        },
        position: {
          x: Math.random() * 600 + 100,
          y: Math.random() * 600 + 100
        }
      });
      this.nodes.push({
        data: { id: id, name: name, type: type, entype: entype }
      });
    },
    addEntity(id, name, type, entype, markerType) {
      cy.add({
        group: "nodes",
        data: {
          id: id,
          name: name,
          type: type,
          entype: entype
        },
        position: {
          x: Math.random() * 600 + 100,
          y: Math.random() * 600 + 100
        }
      });
      this.nodes.push({
        data: { id: id, name: name, type: type, entype: entype }
      });
      console.log(this.$store.state);
      // 添加到数据库
      var formData = {
        name: name,
        type: type,
        entype: entype,
        markerType: markerType,
        token: this.$store.state.userToken
      };
      fetch("http://" + window.server + "/information/create_node/", {
        method: "POST",
        body: JSON.stringify(formData)
      })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          if (data.msg == "node exists") {
            this.$message.warning(`节点已存在,原节点已添加！`);
            // var updateForm = {
            //   current_name: name,
            //   name: name,
            //   type: type,
            //   entype: entype,
            //   markerType: markerType,
            //   token: this.$store.state.userToken
            // };
            // fetch("http://" + window.server + "/information/update_node/", {
            //   method: "POST",
            //   body: JSON.stringify(updateForm)
            // })
            //   .then(res => res.json())
            //   .then(data => {
            //     if (data.status == 1) {
            //       console.log("节点已存在，信息已更新");
            //     }
            //   })
            //   .catch(err => {
            //     this.$message.error(`节点更新失败！`);
            //   });
          }
        })
        .catch(err => {
          this.$message.error(`节点创建失败！`);
        });
    },
    entityOK() {
      // 添加/编辑实体
      if (this.eventType == "add") {
        let count = 0;
        this.nodes.map(node => {
          if (node.data.name == this.entityValue) {
            count++;
          }
        });
        if (count > 0) {
          this.$message.warning("节点已存在!");
        } else {
          console.log(this.entityEnType);
          this.addEntity(
            uuid.v4(),
            this.entityValue,
            this.entityType,
            this.entityEnType,
            "手动标注"
          );
          this.cyFit();
        }
      } else {
        console.log(this.editId);
        cy.$(`#${this.editId}`).data("name", this.entityValue);
        cy.$(`#${this.editId}`).data("type", this.entityType);
        cy.$(`#${this.editId}`).data("entype", this.entityEnType);
        // var oldNode;
        this.nodes.map((item, index) => {
          if (item.data.id == this.editId) {
            item.data.name = this.entityValue;
            item.data.type = this.entityType;
            item.data.entype = this.entityEnType;
          }
        });
        var updateForm = {
          current_name: this.entityOldValue,
          name: this.entityValue,
          type: this.entityType,
          entype: this.entityEnType,
          token: this.$store.state.userToken
        };
        updateForm = this.getColData(
          updateForm,
          this.colName,
          this.colValue,
          "attrType",
          "attrValue"
        );
        fetch("http://" + window.server + "/information/update_node/", {
          method: "POST",
          body: JSON.stringify(updateForm)
        })
          .then(res => res.json())
          .then(data => {
            if (data.status == 1) {
              this.$message.success(`节点信息已保存！`);
            }
          })
          .catch(err => {
            this.$message.error(`节点更新失败！`);
          });
      }
    },
    getColData(updateForm, colName, colValue, nameName, valueName) {
      var attrTitle = document.getElementsByName(nameName);
      colName = [];
      for (var i = 0; i < attrTitle.length; i++) {
        colName.push(attrTitle[i].innerHTML);
      }

      var attrValue = document.getElementsByName(valueName);
      colValue = [];
      for (var i = 0; i < attrValue.length; i++) {
        colValue.push(attrValue[i].innerHTML);
      }
      colName.map((name, index) => {
        updateForm[name] = colValue[index];
      });
      return updateForm;
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
        this.edges.push({
          data: {
            id: this.edgeId,
            source: this.sourceId,
            target: this.targetId,
            name: this.relation
          },
          name: {
            start_name: this.sourceName,
            end_name: this.targetName
          }
        });
        var edgeData = {
          start_name: this.sourceName,
          end_name: this.targetName,
          relation_name: this.relation
        };
        fetch(
          "http://" + window.server + "/information/create_nodes_relations/",
          {
            method: "POST",
            body: JSON.stringify(edgeData)
          }
        )
          .then(res => res.json())
          .then(data => {
            if (data.status == 1) {
              this.$message.success(`节点关系保存成功！`);
              cy.$(`#${this.edgeId}`).data("name", this.relation); // 通过id来设置name属性
            } else {
              this.$message.error(data.msg);
              if (data.msg == "relation already exist")
                cy.remove(cy.$(`#${this.edgeId}`));
            }
          })
          .catch(err => {
            this.$message.error(`保存失败！`);
          });
      } else {
        cy.$(`#${this.editId}`).data("name", this.relation);
        this.edges.map((edge, index) => {
          if (
            edge.data.source == this.sourceId &&
            edge.data.target == this.targetId
          ) {
            edge.data.name = this.relation;
          }
        });
        // 更新边关系
        var edgeData = {
          start_node_name: this.sourceName,
          end_node_name: this.targetName,
          old_relation: this.oldedgeValue,
          new_relation: this.relation
        };
        fetch(
          "http://" + window.server + "/information/update_nodes_relations/",
          {
            method: "POST",
            body: JSON.stringify(edgeData)
          }
        )
          .then(res => res.json())
          .then(data => {
            if (data.status == 1) this.$message.success(`关系保存成功！`);
          })
          .catch(err => {
            this.$message.error(`保存失败！`);
          });
      }
      this.edgeStyle.display = "none";
    },
    edgeCancle() {
      this.edgeStyle.display = "none";
    },
    getEntity() {
      var addr = "http://" + window.server + "/get_entity/";
      var formData = {
        text: this.$refs.selectText.innerHTML
      };
      fetch(addr, {
        method: "POST",
        body: JSON.stringify(formData)
      })
        .then(res => res.json())
        .then(data => {
          if (data.entity_data) {
            console.log(data.entity_data);
            data.entity_data.map((item, index) => {
              item.data.id = uuid.v4();
            });
            var nodesArray = data.entity_data;
            this.$message.success(
              `文本实体提取结束！，实体个数为 ${nodesArray.length}`
            );
            this.addCy(nodesArray, "自动标注");
            var layout = cy.layout({
              name: "circle",
              animate: true,
              fit: false // 防止只有一个节点时,显示太大
            });
            layout.run();
            this.layoutType = "circle";
          }
        })
        .catch(err => {
          this.$message.error(`提取失败！`);
        });
    },
    // 自动标注
    addCy(keyList, markerType) {
      if (keyList.length < 1) return;
      keyList.map((item, index) => {
        this.addEntity(
          item.data.id,
          item.data.name,
          item.data.type,
          item.data.entype,
          markerType
        ); // 添加cy结点
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
    initCy() {
      var tt = this.types;
      cy = window.cy = this.$cytoscape({
        container: document.getElementById("analyzeGraphDiv"),
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
      let _this = this;
      cy.cxtmenu({
        selector: "node",
        commands: [
          {
            content: "<div class='cyDelete'></div>",
            select: function(ele) {
              _this.deleteState = true;
              _this.confirmId = ele.id();
              _this.confirmType = ele.group();
            }
          },
          // {
          //   content: "拓扑层级检索",
          //   select: function(ele) {
          //     _this.rightPanelName = "level";
          //     _this.startName = ele.data("name");
          //     _this.timeAnalyze(false);
          //     // _this.confirmId = ele.id();
          //     // _this.confirmType = ele.group();
          //   }
          // },
          {
            content: "<div class='cyMerge'></div",
            select: function(ele) {
              _this.mergeState = true;
              _this.mergeSourceName = ele.data("name");
              let mergeType;
              _this.nodes.map(node => {
                if (node.data.name == _this.mergeSourceName)
                  mergeType = node.data.type;
              });
              _this.mergeTargetName = "";
              _this.mergeTargetRow = [];
              var formData = {
                name: ele.data("name")
              };
              fetch(
                "http://" + window.server + "/information/get_node_by_name/",
                {
                  method: "POST",
                  body: JSON.stringify(formData)
                }
              )
                .then(res => res.json())
                .then(data => {
                  if (data.status == 1) {
                    let info = data.info;
                    _this.mergeNameSource = Object.keys(info);
                    _this.mergeNameSource = _this.arrayCut(
                      _this.mergeNameSource,
                      cutList
                    );
                    _this.mergeValueSource = [];
                    _this.mergeSourceRow = [];
                    _this.mergeNameSource.map((name, index) => {
                      _this.mergeValueSource.push(info[name]);
                      _this.mergeSourceRow.push(name + ":" + info[name]);
                    });
                  }
                })
                .catch(err => {});
              // ///////////////////////////////////
              var formSynonyms = {
                name: _this.mergeSourceName,
                type: mergeType
              };
              fetch(
                "http://" +
                  window.server +
                  "/information/get_synonyms_node_by_name/",
                {
                  method: "POST",
                  body: JSON.stringify(formSynonyms)
                }
              )
                .then(res => res.json())
                .then(data => {
                  if (data.status == 1) {
                    _this.mergeTarget = data.result.synonyms_list;
                  }
                })
                .catch(err => {});
            }
          },
          {
            content: "<div class='cySearch'></div",
            select: function(ele) {
              if (ele.group() == "nodes") {
                console.log(ele);
                if (_this.entityId !== "") {
                  cy.$(`#${_this.entityId}`).css({
                    "border-width": 0
                  });
                }
                if (_this.showTextStore == true) {
                  _this.textNodes = [].concat(_this.nodes); // 只有从text页面切换时会执行
                  _this.textEdges = [].concat(_this.edges);
                }
                _this.entityId = ele.data("id");
                _this.entityValue = ele.data("name");
                _this.showTextStore = false;
                var formData = {
                  node_name: _this.entityValue
                };
                // 获取关系
                fetch(
                  "http://" +
                    window.server +
                    "/information/get_node_all_relationline/",
                  {
                    method: "POST",
                    body: JSON.stringify(formData)
                  }
                )
                  .then(res => res.json())
                  .then(data => {
                    if (data.relation_name)
                      _this.nodeRelations = data.relation_name;
                    if (_this.nodeRelations.length > 0)
                      _this.nodeRelations.push("全部");
                  })
                  .catch(err => {});
                _this.databasePanel = true;
                _this.databaseRelation = "";
              }
            }
          }
        ]
      });
      cy.cxtmenu({
        selector: "edge",
        commands: [
          {
            content: "<div class='cyDelete'></div>",
            select: function(ele) {
              _this.deleteState = true;
              _this.confirmId = ele.id();
              _this.confirmType = ele.group();
              _this.sourceName = ele.source().data("name"); // 获得此边的起点名
              _this.targetName = ele.target().data("name");
              _this.relation = ele.data("name"); // // 获得此边的name
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
              console.log(ele, ele._private.pan);
              _this.eventType = "add";
              _this.entityValue = "";
              _this.edgeStyle.display = "none";
              _this.entityStyle.display = "block";
              _this.rightPanelName = "attribute";
              _this.entityPosition = ele._private.pan;
            }
          }
        ]
      });
      cy.on("tap", "node", function(evt) {
        var ele = evt.target;
        console.log(ele.data("entype"));
        _this.searchNodeName = ele.data("name");
        _this.showNodeAttr(
          ele.id(),
          ele.data("name"),
          ele.data("type"),
          ele.data("entype")
        );
      });
      cy.on("tap", "edge", function(evt) {
        var ele = evt.target;
        /////////////////////////////
        _this.editId = ele.id();
        _this.fileSource = [];
        _this.sourceName = ele.source().data("name"); // 获得此边的起点名
        _this.targetName = ele.target().data("name");
        _this.sourceId = ele.source().data("id"); // 获得此边的起点id
        _this.targetId = ele.target().data("id");
        _this.relation = ele.data("name"); // // 获得此边的name
        _this.oldedgeValue = ele.data("name");
        _this.eventType = "edit";
        _this.entityStyle.display = "none";
        _this.edgeStyle.display = "block";
        // ///////////////////////////////////
        // 获取关系文本
        var formData = {
          node_name1: _this.sourceName,
          node_name2: _this.targetName,
          relation_line_name: _this.relation
        };
        fetch(
          "http://" + window.server + "/information/get_relation_origin_file/",
          {
            method: "POST",
            body: JSON.stringify(formData)
          }
        )
          .then(res => res.json())
          .then(data => {
            if (data.status == 1) {
              console.log(data.file_list);
              if (data.file_list == null) {
                _this.fileSource = [];
              } else {
                _this.fileSource = data.file_list;
              }
            }
          })
          .catch(err => {
            console.log(err);
          });
      });
      var eh = cy.edgehandles();
      // 添加边
      cy.on("ehcomplete", (event, sourceNode, targetNode, addedEles) => {
        let { position } = event;
        console.log(sourceNode, targetNode, addedEles);
        _this.sourceId = sourceNode._private.data.id;
        _this.targetId = targetNode._private.data.id;
        _this.sourceName = sourceNode._private.data.name;
        _this.targetName = targetNode._private.data.name;
        _this.eventType = "add";
        _this.relation = "";
        _this.entityStyle.display = "none";
        _this.edgeStyle.display = "block";
        _this.edgeId = uuid.v4();
        addedEles[0]._private.data.id = _this.edgeId;
        // 获取关系
        fetch("http://" + window.server + "/information/get_all_relation/", {
          method: "GET"
        })
          .then(res => res.json())
          .then(data => {
            console.log(data);
            _this.relations = data.relations;
          })
          .catch(err => {});
      });
    },
    showNodeAttr(id, name, type, entype) {
      this.colName = [];
      this.colValue = [];
      this.fileSource = [];
      this.editId = id;
      this.entityValue = name;
      this.entityOldValue = name;
      this.entityType = type;
      this.entityEnType = entype;
      this.cascaderVal = [type, entype];
      this.eventType = "edit";
      this.edgeStyle.display = "none";
      this.entityStyle.display = "block";
      this.rightPanelName = "attribute";
      // 获取实体的详情
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
            let info = data.info;
            console.log(info["file_list"]);
            this.colName = Object.keys(info);
            this.colName = this.arrayCut(this.colName, cutList);
            this.colName.map((name, index) => {
              this.colValue.push(info[name]);
            });
            if (info["file_list"] == null) {
              this.fileSource = [];
            } else {
              this.fileSource = info["file_list"];
            }
          }
        })
        .catch(err => {});
    },
    showTarget(name) {
      var formData = {
        name: name
      };
      this.mergeTargetName = name;
      fetch("http://" + window.server + "/information/get_node_by_name/", {
        method: "POST",
        body: JSON.stringify(formData)
      })
        .then(res => res.json())
        .then(data => {
          if (data.status == 1) {
            let info = data.info;
            this.mergeNameTarget = Object.keys(info);
            this.mergeNameTarget = this.arrayCut(this.mergeNameTarget, cutList);
            this.mergeValueTarget = [];
            this.mergeTargetRow = [];
            this.mergeNameTarget.map((name, index) => {
              this.mergeValueTarget.push(info[name]);
              this.mergeTargetRow.push(name + ":" + info[name]);
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    showMerge() {
      if (this.mergeTargetName == "") {
        this.$message.warning("请选择待融合实体");
        return;
      }
      this.mergeDone = true;
      this.mergeNameTarget.map((targetName, targetIn) => {
        if (this.mergeNameSource.indexOf(targetName) == -1) {
          this.mergeNameSource.push(targetName);
          this.mergeValueSource.push(this.mergeValueTarget[targetIn]);
        }
      });
      this.colNameMerge = [].concat(this.mergeNameSource);
      this.colValueMerge = [].concat(this.mergeValueSource);
    },
    mergePerform() {
      var attribute = {};
      attribute = this.getColData(
        attribute,
        this.colNameMerge,
        this.colValueMerge,
        "attrTypeMerge",
        "attrValueMerge"
      );
      var formData = {
        node_name1: this.mergeSourceName,
        node_name2: this.mergeTargetName,
        attribute: attribute,
        token: this.$store.state.userToken
      };
      fetch("http://" + window.server + "/information/merge_node_info/", {
        method: "POST",
        body: JSON.stringify(formData)
      })
        .then(res => res.json())
        .then(data => {
          if (data.status == 1) {
            this.$message.success("融合成功!");
            this.mergeDone = false;
            this.mergeState = false;
          } else {
            this.$message.error("融合失败!");
          }
        })
        .catch(err => {
          console.log(err);
        });
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
    addAttr() {
      this.colName.push("");
      this.colValue.push("");
    },
    addAttrMerge() {
      this.colNameMerge.push("");
      this.colValueMerge.push("");
    },
    deleteAttr(index) {
      this.colName.splice(index, 1);
      this.colValue.splice(index, 1);
    },
    deleteAttrMerge(index) {
      this.colNameMerge.splice(index, 1);
      this.colValueMerge.splice(index, 1);
    },
    // 10.1
    deleteOk() {
      this.deletePerform();
    },
    deleteNot() {
      this.deleteState = false;
    },
    deletePerform() {
      // 只能删除数据库中关系，不能删除数据库中节点
      this.deleteState = false;
      if (this.confirmType == "nodes") {
        cy.remove(cy.$(`#${this.confirmId}`));
        // 删除节点
        this.nodes.map((item, index) => {
          if (item.data.id == this.confirmId) {
            this.nodes.splice(index, 1);
          }
        });
        // 删除节点的相关关系
        this.edges.map((item, index) => {
          if (
            item.data.source == this.confirmId ||
            item.data.target == this.confirmId
          ) {
            this.edges.splice(index, 1);
          }
        });
      } else {
        cy.remove(cy.$(`#${this.confirmId}`));
        this.edges.map((item, index) => {
          if (item.data.id == this.confirmId) {
            this.edges.splice(index, 1);
          }
        });
        var formData = {
          start_node_name: this.sourceName,
          end_node_name: this.targetName,
          relation_name: this.relation
        };
        fetch(
          "http://" + window.server + "/information/delete_nodes_relations/",
          {
            method: "POST",
            body: JSON.stringify(formData)
          }
        )
          .then(res => res.json())
          .then(data => {
            if (data.status == 1) {
              this.$message.success("删除成功!");
            } else {
              this.$message.error("删除失败!");
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    analyze() {
      if (this.keyWords.length !== 0) {
        this.$message.warning(`不能重复自动提取！`);
        return;
      }
      this.keyWords = [];
      this.initCy();
      this.getEntity();
    },
    customize() {
      this.clearAll();
      this.initCy();
    },
    showStore() {
      this.showTextStore = true;
      this.changeEdgeColor("#999999");
      if (this.entityId !== "") {
        cy.$(`#${this.entityId}`).css({
          "border-width": 0
        });
      }
      this.nodes.map((node, index) => {
        var count = 0;
        this.textNodes.map((textNode, index) => {
          if (textNode.data.id == node.data.id) count++;
        });
        if (count == 0) cy.remove(cy.$(`#${node.data.id}`));
      }); // 清除原文图谱中不存在的cy节点
      this.edges.map((edge, index) => {
        var count = 0;
        this.textEdges.map((textEdge, index) => {
          if (textEdge.data.id == edge.data.id) count++;
        });
        if (count == 0) cy.remove(cy.$(`#${edge.data.id}`));
      }); // 清除原文图谱中不存在的cy关系
      this.nodes = [].concat(this.textNodes);
      this.edges = [].concat(this.textEdges);
      this.ciseArray = [];
      this.originArray = [];
      var layout = cy.layout({
        name: "circle",
        animate: true
      });
      layout.run();
      this.layoutType = "circle";
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
                this.addEntityOnly(
                  nodeId,
                  start_node[2][0],
                  start_node[2][1],
                  start_node[2][2]
                );
              }
              centerEdges.push({
                data: {
                  id: uuid.v4(),
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
                this.addEntityOnly(
                  nodeId,
                  end_node[0][0],
                  end_node[0][1],
                  end_node[0][2]
                );
              }
              centerEdges.push({
                data: {
                  id: uuid.v4(),
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
    databaseTypeChange(val) {
      this.databaseRelation = val;
    },
    databaseConfirm() {
      if (this.databaseRelation == "全部") {
        this.databaseRelation = "";
      }
      var formData = {
        node_name: this.entityValue,
        relation_name: this.databaseRelation
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
            this.spinning = true;
            this.changeEdgeColor("#999999");
            this.dataBaseEdge = []; // 存放检索中的新增关系
            this.presentArray = [];
            this.presentEdgeIds = [];
            var names = [];
            this.$message.success(`检索成功！`);
            cy.$(`#${this.entityId}`).css({
              "border-width": 6,
              "border-color": "#0084c5"
            });
            // 赋值而非引用，注意与 "end_nodes = data.relations.end_nodes"区别开来
            let end_nodes = [].concat(data.relations.end_nodes);
            let start_nodes = [].concat(data.relations.start_nodes);
            cy.$(`#${this.editId}`).data("entype", this.entityEnType);
            console.log(data.relations);
            if (data.relations.start_nodes.length > 0) {
              // 将start_nodes作为end_nodes来分组
              data.relations.start_nodes.map((start_node, e) => {
                data.relations.end_nodes.push([
                  start_node[2],
                  start_node[1],
                  start_node[0]
                ]);
              });
            }
            this.nodes.map((node, index) => {
              var count = 0;
              data.relations.end_nodes.map((end_node, e) => {
                if (node.data.name == end_node[0][0]) {
                  this.presentArray.push(node.data.id);
                  names.push(end_node[0][0]);
                  count++;
                  if (this.ciseArray.length > 0) {
                    //如果是第一次请求数据库关系
                    this.originArray.map((origin, ii) => {
                      if (origin == node.data.id) {
                        this.originArray.splice(ii, 1);
                      }
                    });
                  }
                }
              }); // 找出nodes中已有的节点
              if (count == 0) {
                if (this.ciseArray.length == 0) {
                  //如果是第一次请求数据库关系
                  this.originArray.push(node.data.id);
                }
              }
            });
            data.relations.end_nodes.map((end_node, index) => {
              var count = 0;
              names.map((name, e) => {
                if (end_node[0][0] == name) count++;
              });
              if (count == 0) {
                var thisId = uuid.v4(); // 找出nodes中没有的节点并创建
                cy.add({
                  group: "nodes",
                  data: {
                    id: thisId,
                    name: end_node[0][0],
                    type: end_node[0][1]
                  },
                  position: {
                    x: Math.random() * 600 + 100,
                    y: Math.random() * 600 + 100
                  }
                });
                this.presentArray.push(thisId);
                this.nodes.push({
                  data: {
                    id: thisId,
                    name: end_node[0][0],
                    type: end_node[0][1]
                  }
                });
              }
            });
            // // 节点创建完，再创建关系
            console.log(start_nodes, end_nodes);
            if (end_nodes.length > 0) {
              end_nodes.map((end_node, e) => {
                var count = 0;
                this.edges.map((edge, index) => {
                  if (
                    end_node[0][0] == edge.name.start_name &&
                    end_node[2][0] == edge.name.end_name
                  ) {
                    count++; //如果edges中存在此关系
                    this.presentEdgeIds.push(edge.data.id);
                  }
                });
                if (count == 0) {
                  var sourceId;
                  var targetId;
                  this.nodes.map((node, index) => {
                    if (node.data.name == end_node[0][0]) {
                      sourceId = node.data.id;
                    }
                    if (node.data.name == end_node[2][0]) {
                      targetId = node.data.id;
                    }
                  });
                  let edgeId = uuid.v4();
                  cy.add({
                    group: "edges",
                    data: {
                      id: edgeId,
                      source: sourceId,
                      target: targetId,
                      name: end_node[1]
                    }
                  });
                  this.presentEdgeIds.push(edgeId);
                  this.dataBaseEdge.push({
                    data: {
                      id: edgeId,
                      source: sourceId,
                      target: targetId,
                      name: end_node[1]
                    },
                    name: {
                      start_name: end_node[0][0],
                      end_name: end_node[2][0]
                    }
                  });
                }
              });
            }
            if (start_nodes.length > 0) {
              start_nodes.map((start_node, e) => {
                var count = 0;
                this.edges.map((edge, index) => {
                  if (
                    start_node[0][0] == edge.name.start_name &&
                    start_node[2][0] == edge.name.end_name
                  ) {
                    count++; //如果edges中存在此关系
                    this.presentEdgeIds.push(edge.data.id);
                  }
                });
                if (count == 0) {
                  var sourceId;
                  var targetId;
                  this.nodes.map((node, index) => {
                    if (node.data.name == start_node[0][0]) {
                      sourceId = node.data.id;
                    }
                    if (node.data.name == start_node[2][0]) {
                      targetId = node.data.id;
                    }
                  });
                  let edgeId = uuid.v4();
                  cy.add({
                    group: "edges",
                    data: {
                      id: edgeId,
                      source: sourceId,
                      target: targetId,
                      name: start_node[1]
                    }
                  });
                  this.presentEdgeIds.push(edgeId);
                  this.dataBaseEdge.push({
                    data: {
                      id: edgeId,
                      source: sourceId,
                      target: targetId,
                      name: start_node[1]
                    },
                    name: {
                      start_name: start_node[0][0],
                      end_name: start_node[2][0]
                    }
                  });
                }
              });
            }
            this.changeEdgeColor("#0084c5");
            this.edges = this.edges.concat(this.dataBaseEdge);
            // //////////////////////////////////////////////
            if (this.ciseArray.length == 0) {
              this.ciseArray.push(this.originArray);
            } else {
              this.ciseArray[0] = this.originArray;
            }
            this.ciseArray.push(this.presentArray);
            console.log(this.ciseArray);
            this.runCiseCy(this.ciseArray);
            setTimeout(() => {
              this.cyFit();
              this.spinning = false;
            }, 1500);
          }
        })
        .catch(err => {
          console.log(err);
          this.$message.error(`检索失败！`);
        });
    },
    changeEdgeColor(color) {
      if (this.presentEdgeIds.length == 0) return;
      this.presentEdgeIds.map((edgeId, index) => {
        cy.$(`#${edgeId}`).css({
          "line-color": color
        });
      });
    },
    databaseCancel() {
      this.databasePanel = false;
    },
    runCiseCy(ciseArray) {
      var layout = window.cy.layout({
        name: "cise",
        nodeSeparation: 60.0, //群集中节点之间的间隔距离
        // allowNodesInsideCircle: false,
        // maxRatioOfNodesInsideCircle: 0.1,
        animate: "end",
        fit: true,
        animationDuration: 1500,
        clusters: ciseArray,
        refresh: 1,
        idealInterClusterEdgeLengthCoefficient: 2
      });

      layout.run();
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
            this.fileContent = data.file.origin_content;
            this.fileName =
              fileName === ""
                ? ""
                : autoTextMarked(fileName, [this.searchNodeName]);
            this.fileContent =
              this.fileContent === ""
                ? ""
                : autoTextMarked(this.fileContent, [this.searchNodeName]);
          }
        })
        .catch(err => {
          // this.$message.error(`保存失败！`);
        });
    },
    // 拓扑层级设置
    endNameChange(e) {
      const { value } = e.target;
      this.endName = value;
    },
    levelNumChange(value) {
      this.levelNum = value;
    },
    searchLevel() {
      var centerNode;
      this.nodes.map((node, index) => {
        if (node.data.name !== this.startName) {
          cy.remove(cy.$(`#${node.data.id}`));
        } else {
          centerNode = node;
        }
      });
      this.nodes = [centerNode]; // 移除其他node
      let levelNodes = [
        {
          data: {
            id: uuid.v4(),
            name: "日本",
            type: "person_element",
            entype: "place_name"
          }
        },
        {
          data: {
            id: uuid.v4(),
            name: "美国",
            type: "person_element",
            entype: "place_name"
          }
        },
        {
          data: {
            id: uuid.v4(),
            name: "乔布斯",
            type: "person_element",
            entype: "person_name"
          }
        },
        {
          data: {
            id: uuid.v4(),
            name: "比尔盖茨",
            type: "person_element",
            entype: "person_name"
          }
        }
      ];
      console.log(this.nodes);
      this.addCy(levelNodes, "自动标注");
      let levelEdgeArray = [
        ["宫崎骏", "居住", "日本"],
        ["日本", "合作", "美国"],
        ["乔布斯", "改善", "美国"],
        ["宫崎骏", "合作", "比尔盖茨"],
        ["比尔盖茨", "竞争", "乔布斯"]
      ];
      let levelEdges = [];
      levelEdgeArray.map((item, index) => {
        let sourceId;
        let targetId;
        this.nodes.map((node, e) => {
          if (node.data.name == item[0]) sourceId = node.data.id;
          if (node.data.name == item[2]) targetId = node.data.id;
        });
        levelEdges.push({
          data: {
            id: sourceId + "-" + targetId,
            source: sourceId,
            target: targetId,
            name: item[1]
          },
          name: {
            start_name: item[0],
            end_name: item[2]
          }
        });
      });
      this.addEdge(levelEdges);
      let levelPath = [
        [
          ["宫崎骏", "居住", "日本"],
          ["日本", "合作", "美国"],
          ["乔布斯", "改善", "美国"]
        ],
        [["宫崎骏", "合作", "比尔盖茨"], ["比尔盖茨", "竞争", "乔布斯"]]
      ];
      this.levelData = [];

      levelPath.map((path, index) => {
        let objects = [this.startName, this.endName]; //路径所有节点name
        let pathEdges = []; //路径所有关系id
        path.map((pa, ii) => {
          if (objects.indexOf(pa[0]) == -1) {
            objects.splice(objects.length - 1, 0, pa[0]);
          }
          if (objects.indexOf(pa[2]) == -1) {
            objects.splice(objects.length - 1, 0, pa[2]);
          }
          this.edges.map(edge => {
            if (edge.name.start_name == pa[0] && edge.name.end_name == pa[2])
              pathEdges.push(edge.data.id);
          });
        });

        let obString = "";
        let pathNodes = []; //路径所有节点id

        objects.map(ob => {
          obString = obString + "——" + ob;
          this.nodes.map(node => {
            if (node.data.name == ob) pathNodes.push(node.data.id);
          });
        });
        this.levelData.push({
          key: index,
          num: index + 1,
          length: path.length,
          object: obString,
          pathNodes: pathNodes,
          pathEdges: pathEdges
        });
      });
    },
    noOpacity() {
      this.nodes.map((node, index) => {
        cy.$(`#${node.data.id}`).css({
          opacity: 1.0
        });
      });
      this.edges.map((edge, index) => {
        cy.$(`#${edge.data.id}`).css({
          opacity: 1.0
        });
      });
    },
    levelClick(record, index) {
      return {
        on: {
          click: () => {
            this.noOpacity();
            this.nodes.map((node, index) => {
              if (record.pathNodes.indexOf(node.data.id) == -1) {
                cy.$(`#${node.data.id}`).css({
                  opacity: 0.1
                });
              }
            });
            this.edges.map((edge, index) => {
              if (record.pathEdges.indexOf(edge.data.id) == -1) {
                cy.$(`#${edge.data.id}`).css({
                  opacity: 0.1
                });
              }
            });
          }
        }
      };
    },
    // 时间分析
    getTimeLength(a, b) {
      // a<b
      let aInt = parseInt(a);
      let bInt = parseInt(b);
      let aFloat = parseFloat((a - aInt * 1.0).toFixed(2));
      let bFloat = parseFloat((b - bInt * 1.0).toFixed(2));

      let delt = (bInt - aInt) * 12 + (bFloat - aFloat) * 100;
      return delt; // 返回两个日期间隔的月数
    },
    initTimeBar(timeStart, timeEnd, tableData) {
      let _this = this;
      let myChart = (myChart = echarts.init(
        document.getElementById("timeBar")
      ));
      let legends = [];
      let seriesData = [];
      tableData.map(item => {
        legends.push(item.name);
        seriesData.push({
          name: item.name,
          symbolSize: 20,
          data: item.timeChuo,
          type: "bar",
          barWidth: 20
        });
      });
      let option = {
        xAxis: {
          type: "time",
          splitLine: { show: false },
          boundaryGap: [0.1, 0.1],
          axisLabel: {
            formatter: function(value) {
              let date = new Date(value * 1000);
              let Y = date.getFullYear() + "-";
              let M =
                (date.getMonth() + 1 < 10
                  ? "0" + (date.getMonth() + 1)
                  : date.getMonth() + 1) + "-";
              let D = date.getDate() + " ";
              return Y + M + D;
            }
          },
          min: timeStart,
          max: timeEnd
        },
        yAxis: { minInterval: 1 },
        legend: {
          data: legends
        },
        dataZoom: [
          {
            type: "slider",
            startValue: timeStart,
            endValue: timeEnd,
            handleIcon:
              "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
            handleSize: "80%",
            handleStyle: {
              color: "#fff",
              shadowBlur: 3,
              shadowColor: "rgba(0, 0, 0, 0.6)",
              shadowOffsetX: 2,
              shadowOffsetY: 2
            }
          }
        ],
        series: seriesData
      };
      myChart.setOption(option);
      myChart.on("datazoom", function(params) {
        //获得图表数据数组下标
        var startValue = myChart.getModel().option.dataZoom[0].startValue;
        var endValue = myChart.getModel().option.dataZoom[0].endValue;
        //获得起止位置百分比
        var startPercent = myChart.getModel().option.dataZoom[0].start;
        var endPercent = myChart.getModel().option.dataZoom[0].end;
        // console.log(startValue, endValue);
        _this.timeParam = { start: startValue, end: endValue };
      });
      setTimeout(() => {
        myChart.resize();
      }, 500);
    },
    timeAnalyze(checked) {
      this.timeCheck = checked;
      console.log(checked);
      if (checked) {
        this.noOpacity();
        this.timeOpacity = 1.0;
        this.rightPanelName = "timeRange";
        let timeData = [
          {
            name: "宫崎骏",
            timeAtt: ["出生日期", "毕业日期", "和平日期"],
            timeValue: [-836438400, -2678400, 1533081600],
            att: ["职业", "国籍", "代表作"],
            attValue: ["漫画家", "日本", "龙猫,千与千寻"]
          },
          {
            name: "乔布斯",
            timeAtt: ["出生日期", "毕业日期", "死亡日期"],
            timeValue: [-754704000, -2678400, 1314835200],
            att: ["职务", "国籍", "杰出产品"],
            attValue: ["苹果CEO", "美国", "iphone4,ipad"]
          },
          {
            name: "美国",
            timeAtt: ["战争日期", "毕业日期", "和平日期"],
            timeValue: [-1059868800, -2678400, 1533081600],
            att: ["GDP", "人口", "面积"],
            attValue: ["20.494万亿美元", "3.3亿", "937.3万平方公里"]
          }
        ];
        let timeArray = [];
        let tableData = [];
        timeData.map(data => {
          data.timeValue.map(t => {
            timeArray.push(t);
          });
          data.timeAtt.map((attName, index) => {
            let num = 0;
            tableData.map(item => {
              if (item.name == attName) {
                let num2 = 0;
                item.timeChuo.map((chuo, ee) => {
                  if (chuo[0] == data.timeValue[index]) {
                    chuo[1] = chuo[1] + 1;
                    num2++;
                  }
                });
                if (num2 == 0) {
                  item.timeChuo.push([data.timeValue[index], 1]);
                }
                num++;
              }
            });
            if (num == 0) {
              tableData.push({
                name: attName,
                timeChuo: [[data.timeValue[index], 1]]
              });
            }
          });
        });
        tableData.map(item => {});
        timeArray.sort();
        timeData.map(item => {
          let dataSeries = [];
          item.timeValue.map(tt => {
            dataSeries.push([tt, 2]);
          });
          item.timeIndex = dataSeries;
        });
        this.timeNodes = timeData;
        this.initTimeBar(
          timeArray[0],
          timeArray[timeArray.length - 1],
          tableData
        );
      } else {
        this.timeOpacity = 0.0;
      }
    },
    showRange() {
      this.rightPanelName = "timeRange";
      let rangeNodes = [];
      this.timeNodes.map((node, index) => {
        let rangeArrays = [];
        node.timeValue.map((tim, e) => {
          if (this.timeParam.start <= tim && tim <= this.timeParam.end) {
            rangeArrays.push(e);
          }
        });
        if (rangeArrays.length > 0) {
          rangeNodes.push({ name: node.name });
        }
      });
      console.log(rangeNodes);
    },
    output() {
      let nodeList = [];
      let edgeList = [];
      this.nodes.map(node => {
        nodeList.push(node.data.name);
      });
      this.edges.map(edge => {
        edgeList.push([
          edge.name.start_name,
          edge.data.name,
          edge.name.end_name
        ]);
      });
      if (nodeList.length == 0) {
        this.$message.warning("无法导出空图谱!");
        return;
      }
      var formData = {
        node_list: nodeList,
        relations_list: edgeList
      };
      var xhr = new XMLHttpRequest(); //创建新的XHR对象
      xhr.open(
        "post",
        "http://" + window.server + "/information/export_graph/"
      ); //指定获取数据的方式和url地址
      xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
      xhr.responseType = "blob"; //以blob的形式接收数据，一般文件内容比较大
      xhr.onload = function(e) {
        var blob = this.response; //Blob数据
        if (this.status == 200) {
          if (blob && blob.size > 0) {
            saveAs(blob, "图谱分析.xlsx"); //处理二进制数据，让浏览器认识它
          }
        }
      };
      xhr.send(JSON.stringify(formData)); //post请求传的参数
    },
    changeLayer(e) {
      this.map.setLayoutProperty(
        "googlemap",
        "visibility",
        e.target.value === "googlemap" ? "visible" : "none"
      );
      this.map.setLayoutProperty(
        "googleimg",
        "visibility",
        e.target.value === "googlemap" ? "none" : "visible"
      );
    },
    initGis() {
      mapboxgl.accessToken =
        "pk.eyJ1IjoiemhhbzEyMzYiLCJhIjoiY2pqM3ZocDlyMWlsNDN2bGYzbGN4eGQyZiJ9.B0y8u2o5B0WjHShoFUZlig";
      this.map = new mapboxgl.Map({
        container: "earth_container", // container id
        style: {
          version: 8,
          id: "google",
          sources: {
            map: {
              type: "raster",
              tiles: ["http://localhost/googlemap/{z}/{x}/{y}.png"],
              tileSize: 256
            },
            img: {
              type: "raster",
              tiles: ["http://localhost/googleimg/{z}/{x}/{y}.png"],
              tileSize: 256
            }
          },
          layers: [
            {
              id: "googlemap",
              type: "raster",
              source: "map",
              minzoom: 0,
              maxzoom: 18
            },
            {
              id: "googleimg",
              type: "raster",
              source: "img",
              minzoom: 0,
              maxzoom: 18,
              layout: {
                visibility: "none"
              }
            }
          ]
        },
        center: [0, 0],
        zoom: 1
      });

      this.addFeatures();
    },
    gisChange(checked) {
      this.gisCheck = checked;
      if (this.gisCheck) {
        setTimeout(() => {
          if (!this.map) {
            this.initGis();
          } else {
            // this.map.setView([0, 0], 1);
            this.addFeatures();
          }
        }, 400);
      } else {
        this.removeGis();
      }
    },
    addFeatures() {
      this.nodes.map(node => {
        var formData = {
          name: node.data.name
        };
        fetch("http://" + window.server + "/information/get_node_by_name/", {
          method: "POST",
          body: JSON.stringify(formData)
        })
          .then(res => res.json())
          .then(data => {
            if (data.status == 1) {
              let info = data.info;
              if (info["坐标"]) {
                let name = info["坐标"];
                let lon = parseFloat(name.substring(0, name.indexOf(" ")));
                let lat = parseFloat(
                  name.substring(name.indexOf(" "), name.length)
                );

                var el = document.createElement("div");
                el.className = "gisMarker";
                var popup = new mapboxgl.Popup({
                  autoClose: false,
                  closeOnClick: false
                }).setText(node.data.name);
                var mm = new mapboxgl.Marker(el)
                  .setLngLat([lon, lat])
                  .addTo(this.map)
                  .setPopup(popup)
                  .togglePopup(); // sets a popup auto open

                this.markers.push(mm);
                this.markerNames.push(node.data.name);

                el.id = node.data.id;
                el.name = node.data.name;
                el.type = node.data.type;
                el.entype = node.data.entype;
                var _this = this;
                el.addEventListener("click", function() {
                  _this.showNodeAttr(el.id, el.name, el.type, el.entype);
                });
              }
            }
          })
          .catch(err => {
            console.log(err);
          });
      });

      this.edges.map(edge => {
        var formData = {
          name: edge.name.start_name
        };
        fetch("http://" + window.server + "/information/get_node_by_name/", {
          method: "POST",
          body: JSON.stringify(formData)
        })
          .then(res => res.json())
          .then(data => {
            if (data.status == 1) {
              let info = data.info;
              if (info["坐标"]) {
                let name = info["坐标"];
                let lonStart = parseFloat(name.substring(0, name.indexOf(" ")));
                let latStart = parseFloat(
                  name.substring(name.indexOf(" "), name.length)
                );
                var formDataEnd = {
                  name: edge.name.end_name
                };
                fetch(
                  "http://" + window.server + "/information/get_node_by_name/",
                  {
                    method: "POST",
                    body: JSON.stringify(formDataEnd)
                  }
                )
                  .then(res => res.json())
                  .then(data => {
                    if (data.status == 1) {
                      let infoEnd = data.info;
                      if (infoEnd["坐标"]) {
                        let nameEnd = infoEnd["坐标"];
                        let lonEnd = parseFloat(
                          nameEnd.substring(0, nameEnd.indexOf(" "))
                        );
                        let latEnd = parseFloat(
                          nameEnd.substring(
                            nameEnd.indexOf(" "),
                            nameEnd.length
                          )
                        );
                        var latlngs = [[lonStart, latStart], [lonEnd, latEnd]];
                        var lineId = uuid.v4();
                        var popup = new mapboxgl.Popup({
                          closeButton: false
                        });

                        this.map.addLayer({
                          id: lineId,
                          type: "line",
                          source: {
                            type: "geojson",
                            data: {
                              type: "Feature",
                              properties: {
                                name: edge.data.name,
                                title: edge.data.name
                              },
                              geometry: {
                                type: "LineString",
                                coordinates: latlngs
                              }
                            }
                          },
                          layout: {
                            "line-join": "round",
                            "line-cap": "round",
                          },
                          paint: {
                            "line-color": "#888",
                            "line-width": 4
                          }
                        });

                        var hoveredStateId = null;
                        var _this = this;
                        this.map.on("mousemove", lineId, function(e) {
                          if (e.features.length > 0) {
                            _this.map.getCanvas().style.cursor = "pointer";
                            var feature = e.features[0];
                            popup
                              .setLngLat(e.lngLat)
                              .setText(feature.properties.name)
                              .addTo(_this.map);
                          }
                        });

                        this.map.on("mouseleave", lineId, function() {
                          _this.map.getCanvas().style.cursor = "";
                          popup.remove();
                        });
                        this.polylines.push(lineId); // 保存线的id
                      }
                    }
                  })
                  .catch(err => {});
              }
            }
          })
          .catch(err => {});
      });
    },
    removeGis() {
      this.markers.map(item => {
        item.remove();
      });
      this.polylines.map(item => {
        if (this.map.getLayer(item)) this.map.removeLayer(item);
      });
      this.markers = [];
      this.polylines = [];
      this.markerNames = [];
    }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#translateDiv {
  margin-left: 2vw;
  float: left;
  font-size: 16px;
  color: #9ca8b5;
  background: #2f4150;
}
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

#layoutTitle {
  float: left;
  margin-left: 20px;
  font-size: 20px;
  color: #b8b8b8;
}

.gisTitle {
  float: left;
  margin-left: 20px;
  font-size: 20px;
  color: #b8b8b8;
}

.subRow {
  padding: 10px;
  background: #2f4150;
}

.subRow .ant-select-selection {
  background: #2f4150;
}
.homeTest_p {
  color: #fff;
  font-size: 26px;
  margin-top: calc(100vw / 750 * 20);
}

.colDiv {
  float: left;
  width: 2vw;
  height: calc(74vh);
}

.textDivTest {
  float: left;
  height: calc(74vh);
  background: #ffffff;
  border-radius: 6px;
}

.levelCon {
  border: solid 1px #b8b8b8;
  margin: auto;
}

.panelCircle {
  width: 32px;
  height: 32px;
  float: right;
  background-image: url(/static/pic/startIcon.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

#homeTest .textDiv {
  float: left;
  text-align: left;
  font-size: 18px;
  padding: 20px;
  height: 100%;
  width: 99%;
  overflow-y: auto;
}

.commonSelect {
  margin-left: 14px;
  width: 120px;
  float: left;
  font-size: 16px;
  color: #9ca8b5;
  background: #2f4150;
}

.smBorderclass {
  padding: 0 3px;
  margin: 0 3px;
  border: 2px solid red;
}

.closeBtn {
  cursor: pointer;
  width: 16px;
  height: 16px;
  background-image: url(/static/pic/icon/delete.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  display: inline-block;
}

.analyzeGraphDiv {
  float: right;
  width: 100%;
  height: 100%;
  background: #ffffff;
}

.analyzeGraphDiv canvas {
  left: 0 !important;
  width: 100% !important;
}
#buttons {
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 99999;
}

.ant-btn-del {
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

.shitiRowCon {
  border: solid 1px #bfbfbf;
  margin-bottom: 2vh;
  border-radius: 6px;
  padding: 10px;
}

.shitiRow {
  padding: 10px;
}

.shitiDiv {
  padding: 26px;
  width: 100%;
  font-size: 16px;
}

.attrCon {
  width: 100%;
  height: 34vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.attrTitle {
  text-align: center;
  font-size: 18px;
  padding: 6px;
  background: #ebf1f5;
  border-bottom: solid 1px #bfbfbf;
}

.attrP {
  text-align: center;
  height: 37px;
  padding: 6px;
  font-size: 16px;
  border-left: solid 1px #e8e8e8;
  border-bottom: solid 1px #e8e8e8;
  border-right: solid 1px #e8e8e8;
  overflow-y: auto;
}

.fileSourceDiv {
  float: left;
  margin-left: 20px;
  margin-top: 10px;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  font-size: 16px;
  color: #ffffff;
  background: #219cd1;
}

.fileSourceCon {
  width: 100%;
  height: 44px;
  overflow-y: auto;
  overflow-x: hidden;
}

.edgeDivTest {
  padding: 16px;
  width: 90%;
  background: white;
  font-size: 16px;
  border-radius: 8px;
  border: solid 1px #b8b8b8;
  margin: auto;
  margin-top: 20px;
}

.colorBar {
  margin-top: 1vh;
  border-radius: 10px;
  padding: 20px;
  font-size: 16px;
}

#timeBarCon {
  z-index: 0;
  position: absolute;
  bottom: 0px;
  width: 100%;
  height: 166px;
  background: #636b6a;
  transition: opacity 2s;
  -webkit-transition: opacity 2s;
}

#timeBar {
  width: 100%;
  height: 166px;
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

.ant-upload-list {
  color: #fff;
  float: right;
}

.ant-spin-container {
  height: 100%;
}

.ant-spin-nested-loading > div > .ant-spin-lg .ant-spin-text {
  font-size: 20px;
}

.ant-cascader-picker-label {
  font-size: 16px;
}

.ant-select-combobox .ant-select-search__field__wrap {
  background: rgba(255, 255, 255, 0.3);
}

.ant-select-auto-complete.ant-select .ant-input {
  margin-top: -6px;
  height: 36px;
}

.ant-select-selection__placeholder,
.ant-select-search__field__placeholder {
  color: #48564f;
}

.ant-select-selection-selected-value {
  float: initial;
}

.ant-select-auto-complete.ant-select .ant-select-selection__rendered {
  line-height: 36px;
}

.ant-select-auto-complete.ant-select .ant-input:focus,
.ant-select-auto-complete.ant-select .ant-input:hover {
  border: solid 0px #b8b8b8;
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

.ant-modal-footer {
  background: #636b6a;
}

.mergeTitle {
  margin-top: 1vh;
  padding-left: 20px;
  color: #0084c5;
  background: #ebf1f5;
}

.mergeBox {
  width: 50%;
  float: left;
  padding: 10px;
}

#earth_container {
  width: 63vw;
  height: 74vh;
  float: left;
  /* position: absolute !important; */
}

.lonlatDiv {
  color: white;
  width: 140px;
  position: absolute;
  z-index: 2;
  right: 10px;
  bottom: 10px;
}

.gisMarker {
  margin: auto;
  background-image: url(/static/pic/icon/marker.png);
  width: 48px;
  height: 48px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
#drawerTitle {
  font-size: 20px;
  line-height: 22px;
  font-weight: 500;
}
</style>
