<template>
  <div id="homeTest">
    <a-spin
      :spinning="spinning"
      :tip="spinningTip"
      size="large"
      style="height:100%;width: 100%;float:left"
    >
      <!-- 文字面板 -->
      <a-row class="subRow">
        <a-col :span="18">
          <div v-if="showTextStore">
            <a-auto-complete
              id="searchId"
              :allowClear="true"
              :dataSource="searchData"
              style="width: 200px;float: left"
              @change="onSearch"
              @select="searchDone"
              placeholder="请输入内容检索"
            />
          </div>
          <div v-if="showTextStore">
            <a-upload
              name="file"
              style="margin-left: 2vw;float: left"
              :multiple="false"
              :fileList="fileList"
              :action="uploadUrl"
              :headers="headers"
              :showUploadList="false"
              @change="handleChange"
            >
              <div class="commonMenu">上传文件</div>
            </a-upload>
            <div class="commonMenu" @click="analyze">图谱分析</div>
            <a-dropdown id="translateDiv">
              <a-button>
                {{lanName}}
                <a-icon type="down" />
              </a-button>
              <a-menu slot="overlay">
                <a-menu-item
                  :key="item.val"
                  v-for="(item) in lan"
                  @click="translate(item.val,item.label)"
                >{{item.label}}</a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
          <div v-if="showTextStore" class="commonMenu" @click="showTopic">保存</div>
          <div v-if="!showTextStore" class="commonMenu" @click="showStore">恢复</div>
          <div class="commonMenu" @click="output">导出</div>
          <div class="gisTitle">GIS开关</div>
          <a-switch
            style="margin-left: 6px;margin-top: 6px;float: left;"
            @change="gisChange"
            :checked="gisCheck"
          />
        </a-col>
        <a-col :span="6">
          <div id="layoutTitle">选择布局:</div>
          <a-select class="commonSelect" @change="layoutChange" :value="layoutType">
            <a-select-option
              :value="item.val"
              :key="index"
              v-for="(item,index) in layouts"
            >{{item.label}}</a-select-option>
          </a-select>
          <div class="commonMenu" @click="cyFit">自适应</div>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <div class="smallTitle" style="margin-left:2vw">文档信息</div>
          <div class="smallTitle" style="margin-left:24vw">知识图谱</div>
          <div class="smallTitle" style="margin-left:38vw">要素信息</div>
        </a-col>
      </a-row>
      <a-row class="selectRow">
        <a-col :span="24">
          <div class="colDiv"></div>
          <div class="textDivTest" style="width:26vw">
            <a-spin
              :spinning="spinning2"
              :tip="spinningTip2"
              size="large"
              style="height:100%;width: 100%;float:left"
              :indicator="indicator"
            >
              <div
                contenteditable="true"
                id="textDiv"
                class="textDiv"
                ref="selectText"
                @mouseup="contentSelect"
              ></div>
            </a-spin>
          </div>
          <div class="colDiv"></div>
          <div class="textDivTest" style="width:40vw" v-show="!gisCheck">
            <div id="docGraphDiv" class="docGraphDiv"></div>
          </div>
          <div id="earth_containerDoc" v-show="gisCheck"></div>
          <div class="colDiv"></div>
          <div class="textDivTest" style="width:25vw">
            <!-- 添加实体面板 -->
            <div class="shitiDiv" v-show="rightPanelName == 'attribute'" v-bind:style="entityStyle">
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
                    <a-button @click="addAttr" class="ant-btn-del">+</a-button>
                  </a-col>
                </a-row>
                <a-row
                  v-show="eventType == 'edit'"
                  class="selectRow"
                  :key="index"
                  v-for="(item,index) in colName"
                >
                  <a-col :span="10">
                    <div name="attrType" class="attrP" contenteditable="true">{{item}}</div>
                  </a-col>
                  <a-col :span="12">
                    <div name="attrValue" class="attrP" contenteditable="true">{{colValue[index]}}</div>
                  </a-col>
                  <a-col :span="2">
                    <a-button @click="deleteAttr(index)" class="ant-btn-del">-</a-button>
                  </a-col>
                </a-row>
                <a-row style="margin-top: 3%;">
                  <a-col :span="12">
                    <a-button type="primary" @click="entityOK">保存</a-button>
                  </a-col>
                  <a-col :span="12">
                    <a-button type="primary" @click="entityCancle">取消</a-button>
                  </a-col>
                </a-row>
              </div>
            </div>
            <!-- 添加边面板 -->
            <div class="edgeDivTest" v-bind:style="edgeStyle">
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
                  <a-select style="width: 100%" @change="edgeTypeChange" :value="relation">
                    <a-select-opt-group>
                      <hr slot="label" style="width: 100%" />
                      <a-select-option
                        :value="item"
                        :key="index"
                        v-for="(item,index) in relations"
                      >{{item}}</a-select-option>
                    </a-select-opt-group>
                    <a-select-opt-group>
                      <hr slot="label" style="width: 100%" />
                      <a-select-option value="Additem">新增关系</a-select-option>
                      <a-select-option value="Deleteitem">删除关系</a-select-option>
                    </a-select-opt-group>
                  </a-select>
                </a-col>
                <a-col :span="6">
                  <a-button type="primary" @click="edgeOK">确定</a-button>
                </a-col>
                <a-col :span="6">
                  <a-button type="primary" @click="edgeCancle">取消</a-button>
                </a-col>
              </a-row>
            </div>
            <div v-show="eventType == 'edit'" style="padding: 20px;">
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
                <div id="drawerTitle" v-html="fileDrawerName">
                </div>
                <a-divider />
                <div id="drawerContent" v-html="fileContent">
                </div>
              </a-drawer>
            </div>
          </div>
          <div class="colDiv"></div>
        </a-col>
      </a-row>
      <!-- 标注面板 -->
      <a-modal title="标注实体" v-model="markerPanel" :mask="false" :footer="null" :width="300">
        <!-- <a-cascader style="margin-top: 20px;width: 100%" :options="types" @change="markerChange" expandTrigger="hover" placeholder="请选择实体类型" /> -->
        <a-dropdown style="width:220px;margin-left: 6px;">
          <a-menu slot="overlay">
            <a-sub-menu :key="index" v-for="(item,index) in types" :title="item.label">
              <a-menu-item
                :key="index2"
                v-for="(item2,index2) in item.children"
                @click="markerChange(item.value,item2.value,item.label,item2.label)"
              >{{item2.label}}</a-menu-item>
            </a-sub-menu>
          </a-menu>
          <a-button style="margin-left: 8px">
            {{menuBtnText}}
            <a-icon type="down" />
          </a-button>
        </a-dropdown>
        <a-row style="margin-top: 20px">
          <a-col :span="2"></a-col>
          <a-col :span="10">
            <a-button type="primary" @click="addMarker">确定</a-button>
          </a-col>
          <a-col :span="10">
            <a-button style="float:right" type="primary" @click="closeMarker">取消</a-button>
          </a-col>
          <a-col :span="2"></a-col>
        </a-row>
      </a-modal>
      <!-- 删除标注面板 -->
      <a-modal title="是否删除其他同样的标记？" v-model="deletePanel" :mask="false" :footer="null" :width="300">
        <a-row style="margin-top: 20px">
          <a-col :span="2"></a-col>
          <a-col :span="10">
            <a-button type="primary" @click="deleteConfirm">确定</a-button>
          </a-col>
          <a-col :span="10">
            <a-button style="float:right" type="primary" @click="deleteCancel">取消</a-button>
          </a-col>
          <a-col :span="2"></a-col>
        </a-row>
      </a-modal>
      <!-- 色标柱 -->
      <a-row>
        <a-col :span="1"></a-col>
        <a-col :span="22">
          <div id="colorBar" class="colorBar">
            <div :key="index" v-for="(item,index) in types">
              <div class="rClickRow">{{item.label}}</div>
              <div class="rBox" :style="{background:item.color}"></div>
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
          <a-input :value="edgeValue" @change="edgeChange" />
        </a-row>
        <a-row style="margin-top: 20px">
          <a-col :span="2"></a-col>
          <a-col :span="10">
            <a-button type="primary" @click="addEdgeConfirm">确定</a-button>
          </a-col>
          <a-col :span="10">
            <a-button style="float:right" type="primary" @click="addEdgeCancel">取消</a-button>
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
          <a-select style="width: 100%" @change="deleteTypeChange" :value="deleteRelation">
            <a-select-option :value="item" :key="index" v-for="(item,index) in relations">{{item}}</a-select-option>
          </a-select>
        </a-row>
        <a-row style="margin-top: 20px">
          <a-col :span="2"></a-col>
          <a-col :span="10">
            <a-button type="primary" @click="deleteEdgeConfirm">确定</a-button>
          </a-col>
          <a-col :span="10">
            <a-button style="float:right" type="primary" @click="deleteEdgeCancel">取消</a-button>
          </a-col>
          <a-col :span="2"></a-col>
        </a-row>
      </a-modal>
      <!-- 检索关系面板 -->
      <a-modal title="请选择相关关系！" v-model="databasePanel" :mask="false" :footer="null" :width="300">
        <a-row>
          <a-select style="width: 100%" @change="databaseTypeChange" :value="databaseRelation">
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
            <a-button type="primary" @click="databaseConfirm">确定</a-button>
          </a-col>
          <a-col :span="10">
            <a-button style="float:right" type="primary" @click="databaseCancel">取消</a-button>
          </a-col>
          <a-col :span="2"></a-col>
        </a-row>
      </a-modal>
      <!-- 删除关系面板 -->
      <a-modal title="确定删除？" v-model="deleteState" :mask="false" :width="300" :footer="null">
        <a-row style="margin-top: 20px">
          <a-col :span="2"></a-col>
          <a-col :span="10">
            <a-button type="primary" @click="deleteOk">确定</a-button>
          </a-col>
          <a-col :span="10">
            <a-button style="float:right" type="primary" @click="deleteNot">取消</a-button>
          </a-col>
          <a-col :span="2"></a-col>
        </a-row>
      </a-modal>
      <!-- 选择文档主题地区面板 -->
      <a-modal
        title="请选择文档主题！"
        v-model="topicPanel"
        :mask="false"
        :maskClosable="false"
        :footer="null"
        :width="300"
      >
        <a-row style="margin-top: 20px">
          <a-col :span="2"></a-col>
          <a-col :span="20">
            <a-dropdown style="width:100%">
              <a-button>
                {{topicArea}}
                <a-icon type="down" />
              </a-button>
              <a-menu slot="overlay">
                <a-menu-item
                  :key="item.val"
                  v-for="(item) in topicAreas"
                  @click="changeTopic(item)"
                >{{item}}</a-menu-item>
              </a-menu>
            </a-dropdown>
          </a-col>
          <a-col :span="2"></a-col>
        </a-row>
        <a-row style="margin-top: 20px">
          <a-col :span="2"></a-col>
          <a-col :span="10">
            <a-button type="primary" @click="storeAll">确定</a-button>
          </a-col>
          <a-col :span="10">
            <a-button style="float:right" type="primary" @click="storeNot">取消</a-button>
          </a-col>
          <a-col :span="2"></a-col>
        </a-row>
      </a-modal>
      <!-- 数据融合面板 -->
      <a-modal title="数据融合" v-model="mergeState" :mask="false" :width="900" :footer="null">
        <a-row style="margin-top: 20px">
          <a-col :span="8">
            <div>源实体:</div>
            <a-button style="float:left;margin-top:10px" type="primary">{{mergeSourceName}}</a-button>
          </a-col>
          <a-col :span="16" style="border-left:solid 1px #b8b8b8;padding-left:20px">
            <a-row style="margin-top: 2px">
              <div class="mergeTitle">源实体属性</div>
            </a-row>
            <a-row style="border: solid 1px #ebf1f5;">
              <div class="mergeBox" :key="index" v-for="(item,index) in mergeSourceRow">{{item}}</div>
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
              <div class="mergeBox" :key="index" v-for="(item,index) in mergeTargetRow">{{item}}</div>
            </a-row>
          </a-col>
        </a-row>
        <a-row style="margin-top: 20px">
          <a-col :span="2"></a-col>
          <a-col :span="10"></a-col>
          <a-col :span="10">
            <a-button style="float:right" type="primary" @click="showMerge">确定</a-button>
          </a-col>
          <a-col :span="2"></a-col>
        </a-row>
      </a-modal>
      <!-- 融合操作面板 -->
      <a-modal title="数据融合" v-model="mergeDone" :mask="false" :width="800" :footer="null">
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
        <a-row class="selectRow" :key="index" v-for="(item,index) in colNameMerge">
          <a-col :span="8">
            <div name="attrTypeMerge" class="attrP">{{item}}</div>
          </a-col>
          <a-col :span="14">
            <div name="attrValueMerge" class="attrP" contenteditable="true">{{colValueMerge[index]}}</div>
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
            <a-button style="float:right" type="primary" @click="mergePerform">融合</a-button>
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
      lan: [
        { val: "en", label: "英语" },
        { val: "ja", label: "日语" },
        { val: "ru", label: "俄语" },
        { val: "ko", label: "朝鲜语" },
        { val: "my", label: "缅甸语" },
        { val: "th", label: "泰语" }
      ],
      topicAreas: ["美国", "中国", "朝鲜", "日本", "其他"],
      topicArea: "中国",
      topicPanel: false,
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
      fileName: "",
      spinning: false,
      spinning2: false,
      doEntity: false,
      spinningTip: "拼命加载中...",
      spinningTip2: "锁定中...",
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
      rightPanelName: "none",
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
      nodes: [],
      textNodes: [], // 保存文章中的节点
      edges: [],
      textEdges: [], // 保存文章中的关系
      editId: "",
      edgeId: "",
      eventType: "add",
      entityOldValue: "",
      entityValue: "",
      entityId: "",
      entityType: "",
      entityEnType: "",
      entityPosition: {},
      entityStyle: {
        display: "none"
      },
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
      // ///////////////
      colName: [],
      colValue: [],
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
      fileSource: [],
      ////////////////////////
      drawerVisible: false,
      fileDrawerName: "",
      fileContent: "",
      // WebGis开关
      gisCheck: false,
      map: undefined,
      markers: [],
      polylines: [],
      markerNames: [],
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
    this.$store.state.graphColor2 = "#02d4ff";
    this.$store.state.imgUrl2 = "url(/static/pic/iconClick/docBtn.png)";
    // 获取色标柱
    fetch("http://" + window.server + "/init_interface/", {
      method: "GET"
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        this.types = data.entity_label_color;
        // 检索页面跳转
        if (this.$store.state.docFileName !== "") {
          this.searchDone(this.$store.state.docFileName);
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

    // 删除标注按钮
    var _this = this;
    this.$refs.selectText.onclick = function(e) {
      if (e.srcElement.className == "closeBtn") {
        _this.markerContent = e.srcElement.parentElement.innerText;
        e.srcElement.parentElement.outerHTML = _this.markerContent;
        // ///////////cy删除结点/////////////////
        _this.nodes.map((item, index) => {
          if (item.data.name == _this.markerContent) {
            cy.remove(cy.$(`#${item.data.id}`));
            _this.nodes.splice(index, 1);
          }
        });
        _this.deletePanel = true;
      }
    };
  },
  destroyed() {
    this.$store.state.graphColor2 = "#b8b8b8";
    this.$store.state.imgUrl2 = "url(/static/pic/icon/docBtn.png)";
    this.$store.commit("getDocFile", "");
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
    translate(val, label) {
      var formData = {
        src_lan: val,
        tgt_lan: "zh",
        src_text: this.$refs.selectText.innerHTML
      };
      this.lanName = label;
      fetch("http://" + window.server + "/translate/", {
        method: "POST",
        body: JSON.stringify(formData)
      })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          if (data.status == 0) {
            this.$message.error(`翻译失败，请选择正确语言！`);
          } else {
            this.$refs.selectText.innerHTML = data.translated_text;
            this.$message.success(`翻译成功！`);
          }
        })
        .catch(err => {});
    },
    onSearch(value) {
      console.log(value);
      this.searchData = [];
      var formData = {
        keyword: value,
        num: 5
      };
      fetch(
        "http://" +
          window.server +
          "/information/search_file_by_filename_and_content/",
        {
          method: "POST",
          body: JSON.stringify(formData)
        }
      )
        .then(res => res.json())
        .then(data => {
          console.log(data);
          if (data.files.length > 0) {
            data.files.map((item, index) => {
              this.searchData.push(item.filename);
            });
          }
        })
        .catch(err => {
          // this.$message.error(`保存失败！`);
        });
    },
    searchDone(value) {
      console.log(value);
      var formData = {
        filename: value
      };
      fetch("http://" + window.server + "/information/is_file_exists/", {
        method: "POST",
        body: JSON.stringify(formData)
      })
        .then(res => res.json())
        .then(data => {
          if (data.status == 1) {
            this.initDataBaseFile(data.file);
          }
        })
        .catch(err => {
          console.log(err)
        });
    },
    initDataBaseFile(data) {
      console.log(data);
      this.spinning = true;
      this.$refs.selectText.innerHTML = data.content;
      this.fileName = data.filename;
      this.nodes = [];
      this.edges = [];
      this.keyWords = [];
      data.graph.nodes.map((item, index) => {
        this.keyWords.push(item.data.name);
      });
      this.initCy();
      this.addCy(data.graph.nodes, "自动标注");

      this.addEdge(data.graph.edges);
      var layout = cy.layout({
        name: "circle",
        animate: true
      });
      layout.run();
      this.layoutType = "circle";
      this.spinning = false;
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
    addMarker() {
      // 手动标注
      var thisId = uuid.v4();
      if (this.markerType == "" || this.markerEnType == "") {
        this.$message.warning(`请正确选择类型！`);
      } else {
        var dictData = {
          name: this.markerEnType,
          word: this.selectedText
        };
        fetch("http://" + window.server + "/add_new_word/", {
          method: "POST",
          body: JSON.stringify(dictData)
        })
          .then(res => res.json())
          .then(data => {
            if (data.status == 1) {
              this.$message.success(`添加词典数据库成功！`);
            }
          })
          .catch(err => {
            this.$message.error(`添加词典数据库失败！`);
          }); // 添加到词典数据库
        this.autoMarked([
          {
            data: {
              id: thisId,
              name: this.selectedText,
              type: this.markerType,
              entype: this.markerEnType
            }
          }
        ]); // 左侧面板
        this.addCy(
          [
            {
              data: {
                id: thisId,
                name: this.selectedText,
                type: this.markerType,
                entype: this.markerEnType
              }
            }
          ],
          "手动标注"
        ); //右侧面板
        this.markerPanel = false;
      }
      this.markerType = "";
      this.markerEnType = "";
    },
    closeMarker() {
      this.markerPanel = false;
    },
    handleChange(info) {
      if (info.file.status == "uploading") {
        this.fileList = info.fileList;
        this.fileList.splice(0, this.fileList.length - 1);
        this.spinning = true;
      }
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        if (info.file.response.status == 0) {
          this.spinning = false;
          this.$message.error(`${info.file.response.msg}`);
          return;
        }
        // var inputDiv = document.getElementsByClassName('ant-select-search__field__mirror');
        // inputDiv[0].innerText = "hhhhhhh"
        var formData = {
          filename: info.file.name
        };
        fetch("http://" + window.server + "/information/is_file_exists/", {
          method: "POST",
          body: JSON.stringify(formData)
        })
          .then(res => res.json())
          .then(data => {
            console.log(data);
            if (data.status == 1) {
              this.initDataBaseFile(data.file);
              this.spinning = false;
              this.$message.warning("同名文档已加载！");
            } else {
              this.spinning = false;
              this.fileName = info.file.name;
              this.$message.success(
                `${info.file.name} file uploaded successfully`
              );
              this.$refs.selectText.innerHTML = info.file.response.content;
              this.nodes = [];
              this.keyWords = [];
              if (cy) {
                cy.destroy();
              }
            }
          })
          .catch(err => {});
      } else if (info.file.status === "error") {
        this.$message.error(`${info.file.name} file upload failed.`);
      }
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
      console.log(this.fileName);
      // 添加到数据库
      var formData = {
        name: name,
        type: type,
        entype: entype,
        markerType: markerType,
        token: this.$store.state.userToken,
        file_list: this.fileName
      };
      fetch("http://" + window.server + "/information/create_node/", {
        method: "POST",
        body: JSON.stringify(formData)
      })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          if (data.msg == "node exists") {
            console.log(`节点已存在,原节点已添加！`);
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
          relation_name: this.relation,
          file_list: this.fileName
        };
        console.log(this.relation);
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
              if(data.msg=="relation already exist") cy.remove(cy.$(`#${this.edgeId}`));
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
            data.entity_data[0].map((item, index) => {
              item.data.id = uuid.v4();
            });
            var nodesArray = data.entity_data[0];
            this.$message.success(
              `文本实体提取结束！，实体个数为 ${nodesArray.length}`
            );
            this.autoMarked(nodesArray);
            this.addCy(nodesArray, "自动标注");
            var layout = cy.layout({
              name: "circle",
              animate: true,
              fit: false // 防止只有一个节点时,显示太大
            });
            layout.run();
            this.layoutType = "circle";
            if (data.entity_data[1].length > 0) {
              let levelEdges = this.generateEndgeList(
                this.nodes,
                data.entity_data[1]
              );
              this.addEdge(levelEdges);
            }

            data.entity_data[1].map(edge => {
              var edgeData = {
                start_name: edge[0],
                end_name: edge[2],
                relation_name: edge[1],
                file_list: this.fileName
              };
              fetch(
                "http://" +
                  window.server +
                  "/information/create_nodes_relations/",
                {
                  method: "POST",
                  body: JSON.stringify(edgeData)
                }
              )
                .then(res => res.json())
                .then(data => {
                  if (data.status == 1) {
                    console.log(`节点关系保存成功！`);
                  } else {
                    console.log(data.msg);
                  }
                })
                .catch(err => {});
            });
            this.topicArea = "其他"; // 保存文档
            this.storeAll();
          }
        })
        .catch(err => {});
    },
    generateEndgeList(nodes, levelEdgeArray) {
      let levelEdges = [];
      levelEdgeArray.map((item, index) => {
        let sourceId;
        let targetId;
        nodes.map((node, e) => {
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
      return levelEdges;
    }, // 关系数据组织
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
      console.log(edgeList);
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
    autoMarked(keyList) {
      if (keyList.length < 1) return;
      var defaults = {
        divFlag: true,
        divStr: "blue",
        markClass: "smBorderclass",
        markColor: "",
        nullReport: true,
        callback: function() {
          return false;
        }
      };
      var sets = $.extend({}, defaults, {});
      var clStr;
      if (sets.markClass) {
        clStr = "class='" + sets.markClass + "'";
      } else {
        clStr =
          "style='padding:0 3px;margin: 0 5px;border: 2px solid'" +
          sets.markColor +
          ";'";
      }
      // 字符串正则表达式关键字转化
      $.regTrim = function(s) {
        var imp = /[\^\.\\\|\(\)\*\+\-\$\[\]\?]/g;
        var imp_c = {};
        imp_c["^"] = "\\^";
        imp_c["."] = "\\.";
        imp_c["\\"] = "\\\\";
        imp_c["|"] = "\\|";
        imp_c["("] = "\\(";
        imp_c[")"] = "\\)";
        imp_c["*"] = "\\*";
        imp_c["+"] = "\\+";
        imp_c["-"] = "\\-";
        imp_c["$"] = "$";
        imp_c["["] = "\\[";
        imp_c["]"] = "\\]";
        imp_c["?"] = "\\?";
        s = s.replace(imp, function(o) {
          return imp_c[o];
        });
        return s;
      };
      var v_html = this.$refs.selectText.innerHTML;
      // 删除注释
      v_html = v_html.replace(/<!--(?:.*)\-->/g, "");
      //将html
      var tags = /[^<>]+|<(\/?)([A-Za-z]+)([^<>]*)>/g;
      var a = v_html.match(tags);
      var test = 0;
      var _this = this;
      $.each(a, function(i, c) {
        if (!/<(?:.|\s)*?>/.test(c)) {
          // 非标签
          // 开始执行替换
          keyList.map((item, index) => {
            var borderColor;
            _this.types.map((t, e) => {
              if (t.value == item.data.type) borderColor = t.color;
            });

            _this.keyWords.push(item.data.name);
            var reg = new RegExp($.regTrim(item.data.name), "gi");
            // 保留大小写
            var cliststr = c.match(reg) || [];
            $.each(cliststr, function(ljgk, ljgv) {
              c = c.replace(ljgv, "**" + ljgk + "**");
            });

            $.each(cliststr, function(ljgk, ljgv) {
              c = c.replace("**" + ljgk + "**", "♂" + ljgv + "♀");
            });
            // 以shang为修改
            if (reg.test(c)) {
              test = 1;
            }
            c = c
              .replace(
                /♂/g,
                "<span entype='" +
                  item.data.entype +
                  "'style='border-color:" +
                  borderColor +
                  "'rel='mark'" +
                  clStr +
                  ">"
              )
              .replace(/♀/g, "<div class='closeBtn' ></div></span>");
            a[i] = c;
          });
        }
      });
      // 将支离数组重组成字符串
      this.$refs.selectText.innerHTML = a.join("");
    },
    initCy() {
      var tt = this.types;
      cy = window.cy = this.$cytoscape({
        container: document.getElementById("docGraphDiv"),
        layout: {
          name: "cose-bilkent",
          animate: true
        },
        maxZoom: 2, // 最大缩放
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
            content: "<div class='cyMerge'></div>",
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
            content: "<div class='cySearch'></div>",
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
                _this.spinning2 = true;
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
                    console.log(data);
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
              _this.entityPosition = ele._private.pan;
            }
          }
        ]
      });
      cy.on("tap", "node", function(evt) {
        var ele = evt.target;
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
              console.log(data);
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
        addedEles[0]._private.data.id = _this.edgeId; //_this.sourceId + "-" + _this.targetId;
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
    deleteOk() {
      this.deletePerform();
    },
    deleteNot() {
      this.deleteState = false;
    },
    deletePerform() {
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
    showTopic() {
      this.topicPanel = true;
    },
    storeNot() {
      this.topicPanel = false;
    },
    storeAll() {
      if (this.nodes.length == 0) {
        this.$message.error("无法保存空图谱！");
        return;
      }
      var formData = {
        filename: this.fileName,
        file_content: this.$refs.selectText.innerHTML,
        graph: {
          nodes: this.nodes,
          edges: this.edges
        },
        country: this.topicArea,
        token: this.$store.state.userToken
      };
      console.log(this.edges);
      fetch("http://" + window.server + "/information/save_file_and_graph/", {
        method: "POST",
        body: JSON.stringify(formData)
      })
        .then(res => res.json())
        .then(data => {
          if (data.status == 1) {
            this.$message.success(`文档保存成功！`);
            this.topicPanel = false;
          }
        })
        .catch(err => {
          this.$message.error(`文档保存失败！`);
        });
    },
    showStore() {
      this.showTextStore = true;
      this.spinning2 = false;
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
    databaseTypeChange(val) {
      this.databaseRelation = val;
    },
    databaseConfirm() {
      // this.ciseArray = [];
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
                  // console.log(sourceId, targetId);
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
            this.fileDrawerName = 
              fileName == "" ? "" : autoTextMarked(fileName, [this.searchNodeName]);
            this.fileContent = 
              this.fileContent === "" ? "" : autoTextMarked(this.fileContent, [this.searchNodeName]);
          }
        })
        .catch(err => {
          // this.$message.error(`保存失败！`);
        });
    },
    changeTopic(topic) {
      this.topicArea = topic;
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
            saveAs(blob, "文档图谱.xlsx"); //处理二进制数据，让浏览器认识它
          }
        }
      };
      xhr.send(JSON.stringify(formData)); //post请求传的参数
    },
    changeLayer(e) {
      let mapStyle = {
        version: 8,
        id: "google",
        sources: {
          "osm-tiles": {
            type: "raster",
            tiles: [`http://localhost/${e.target.value}/{z}/{x}/{y}.png`],
            tileSize: 256
          }
        },
        layers: [
          {
            id: "google",
            type: "raster",
            source: "osm-tiles",
            minzoom: 0,
            maxzoom: 18
          }
        ]
      };
      this.map.setStyle(mapStyle);
    },
    initGis() {
      mapboxgl.accessToken =
        "pk.eyJ1IjoiemhhbzEyMzYiLCJhIjoiY2pqM3ZocDlyMWlsNDN2bGYzbGN4eGQyZiJ9.B0y8u2o5B0WjHShoFUZlig";
      this.map = new mapboxgl.Map({
        container: "earth_containerDoc", // container id
        style: {
          version: 8,
          id: "google",
          sources: {
            "osm-tiles": {
              type: "raster",
              tiles: ["http://localhost/googlemap/{z}/{x}/{y}.png"],
              tileSize: 256
            }
          },
          layers: [
            {
              id: "google",
              type: "raster",
              source: "osm-tiles",
              minzoom: 0,
              maxzoom: 18
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
                                name: edge.data.name
                              },
                              geometry: {
                                type: "LineString",
                                coordinates: latlngs
                              }
                            }
                          },
                          layout: {
                            "line-join": "round",
                            "line-cap": "round"
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

.commonSelect {
  margin-left: 14px;
  width: 120px;
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
.homeTest_p {
  color: #fff;
  font-size: 26px;
  margin-top: calc(100vw / 750 * 20);
}
.subRow {
  padding: 10px;
  background: #2f4150;
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

#homeTest .textDiv {
  float: left;
  text-align: left;
  font-size: 18px;
  padding: 20px;
  height: 100%;
  width: 99%;
  overflow-y: auto;
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

.docGraphDiv {
  float: right;
  width: 100%;
  height: 100%;
}

.docGraphDiv canvas {
  left: 0 !important;
  width: 100% !important;
}
#buttons {
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 99999;
}

.shitiDiv {
  padding: 26px;
  width: 100%;
  font-size: 16px;
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

.subRow .ant-select-selection {
  background: #2f4150;
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

#earth_containerDoc {
  width: 40vw;
  height: 74vh;
  float: left;
}

.gisTitle {
  float: left;
  margin-left: 20px;
  font-size: 20px;
  color: #b8b8b8;
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
