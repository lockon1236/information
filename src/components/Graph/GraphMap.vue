<template>
  <div id="graphMap">
    <a-layout style="height: 100%;">
      <a-layout-sider style="padding: 10px;background: #ebf1f5">
        <a-radio-group
          @change="changeLayer"
          v-model="layerType"
        >
          <a-radio-button
            value="googleimg"
            class="layerBtn"
          >影像</a-radio-button>
          <a-radio-button
            value="googlemap"
            class="layerBtn"
          >地图</a-radio-button>
          <a-radio-button
            value="googledark"
            class="layerBtn"
          >cyber</a-radio-button>
        </a-radio-group>
        <a-tree
          checkable
          @expand="onExpand"
          :expandedKeys="expandedKeys"
          :autoExpandParent="autoExpandParent"
          v-model="checkedKeys"
          :checkStrictly="false"
          @select="onSelect"
          @check="onCheck"
          :selectedKeys="selectedKeys"
          :treeData="treeData"
        />
      </a-layout-sider>
      <a-layout-content>
        <div id='map'>
          <div
            id='commonPanel'
            v-if="showPanel"
          >
            <a-row>
              <a-col :span="22">
                <a-radio-group
                  @change="changePanel"
                  v-model="panelType"
                >
                  <a-radio-button
                    value="condition"
                    class="layerBtn"
                  >详细情况</a-radio-button>
                  <a-radio-button
                    value="distance"
                    class="layerBtn"
                  >周边信息</a-radio-button>
                </a-radio-group>
              </a-col>
              <a-col :span="2">
                <a-button
                  shape="circle"
                  icon="close"
                  size="small"
                  @click="closePanel"
                />
              </a-col>
            </a-row>
            <div v-if="panelType=='condition'">
              <a-carousel
                arrows
                :autoplay="true"
                style="margin-top:10px"
              >
                <div
                  slot="prevArrow"
                  slot-scope="props"
                  class="custom-slick-arrow"
                  style="left: 10px;zIndex: 1"
                >
                  <a-icon type="left-circle" />
                </div>
                <div
                  slot="nextArrow"
                  slot-scope="props"
                  class="custom-slick-arrow"
                  style="right: 10px"
                >
                  <a-icon type="right-circle" />
                </div>
                <div
                  :key="index"
                  v-for="(item,index) in imgList"
                >
                  <div
                    class="carouselImg"
                    :style="{'background-image': 'url(/static/pic/bg/'+item+')'}"
                  ></div>
                </div>
              </a-carousel>
              <div class="centerName">{{centerName}}</div>
              <a-row
                :key="index"
                v-for="(item,index) in attrName"
                style="margin-top:10px"
              >
                <a-col
                  :span="12"
                  class="attrP"
                >{{item+":"}}</a-col>
                <a-col
                  :span="12"
                  class="attrP"
                >{{attrValue[index]}}</a-col>
              </a-row>
            </div>
            <div v-if="panelType=='distance'">

            </div>
          </div>
        </div>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script>
// var MapboxDraw = require("@mapbox/mapbox-gl-draw");
// import {
//   DragCircleMode
// } from "mapbox-gl-draw-circle";
/* eslint-disable no-eval */
import { Line2 } from "../../../static/lib/lines/Line2.js";
import { LineMaterial } from "../../../static/lib/lines/LineMaterial.js";
import { LineGeometry } from "../../../static/lib/lines/LineGeometry.js";
import outdoorStyle from "../../../static/map/styles/Outdoors/style.json";
import cytoscape from "cytoscape";
import $ from "jquery";
import { Scene, LineLayer, PointLayer, Mapbox } from "@antv/l7";
// import { Mapbox } from '@antv/l7-maps';
var cy;
// var draw = new MapboxDraw({
//   displayControlsDefault: false,
//   controls: {
//     polygon: true,
//     line_string: true,
//     point: true,
//     trash: true,
//   },
// });

let echartslayer = undefined; //不能定义在data()中使用this.echartslayer，会造成图层冲突

// randomly generate some line arcs (not essential for understanding this demo)

var lines = new Array();
var arcSegments = 25;
var lineQuantity = 50;

for (var i = 0; i < lineQuantity; i++) {
  var line = new Array();
  var destination = [300 * (Math.random() - 0.5), 140 * (Math.random() - 0.5)];
  var maxElevation =
    Math.pow(Math.abs(destination[0] * destination[1]), 0.5) * 80000;

  var increment = destination.map(function (direction) {
    return direction / arcSegments;
  });

  for (var l = 0; l <= arcSegments; l++) {
    var waypoint = increment.map(function (direction) {
      return direction * l;
    });

    var waypointElevation =
      Math.sin((Math.PI * l) / arcSegments) * maxElevation;

    waypoint.push(waypointElevation);
    line.push(waypoint);
  }

  lines.push(line);
}

let lineZZZ = [
  [31.31003, 40.7365],
  [21.32696, 130.58606],
];

// console.log("lineGeometries of the lines: ", lines);
export default {
  name: "HelloWorld",
  components: {},
  data() {
    return {
      layerType: "googleimg",
      panelType: "condition",
      showPanel: false,
      centerName: "",
      properties: {},
      attrName: [],
      attrValue: [],
      interval: undefined,
      circleList: [
        { id: "Dergaon", lonlats: [93.8671875, 26.684275490019488] },
        { id: "Devgaon", lonlats: [80.99945068359375, 18.999802829053266] },
        { id: "Kendrapara", lonlats: [86.7041015625, 20.463042775094095] },
        { id: "Mahadevpur", lonlats: [95.7843017578125, 27.666501544712574] },
        { id: "Huaxi", lonlats: [106.63330078125, 26.465655637838367] },
      ],
      imgList: ["timg1.jpg", "timg2.jpg", "timg3.jpg", "timg4.jpg"],
      // /////////////////////////////////
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
      treeData: [
        {
          title: "自然现象",
          key: "nature",
          disableCheckbox: true,
          children: [
            {
              title: "地震",
              key: "earthquakes",
            },
            {
              title: "陨石",
              key: "meteorites",
            },
          ],
        },
        {
          title: "网络攻击",
          key: "cyber",
          disableCheckbox: true,
          children: [
            {
              title: "原生",
              key: "anipoints",
            },
            {
              title: "echarts",
              key: "anilines",
            },
          ],
        },
      ],
      // echartslayer: undefined
    };
  },
  beforeCreate() {
    this.map = undefined;
  },
  mounted() {
    var token = this.getCookie("token");
    // if (token == "") {
    //   this.$message.error("请先登录！");
    //   this.$router.push({ path: "/graph/graphindex" }); // 没有登录会返回主页
    //   return;
    // }
    this.$store.state.graphColor5 = "#02d4ff";
    this.$store.state.imgUrl5 = "url(/static/pic/iconClick/mapBtn.png)";
    // 初始化map
    setTimeout(() => {
      this.initMap();
    }, 500);
    // //////////////////////
    window.toTarget = (data) => {
      console.log(data);
      if (data == "Dergaon") {
        this.centerName = data;
        this.showPanel = true;
        this.attrName = [];
        this.attrValue = [];
        for (let key in this.properties) {
          if (key !== "id") {
            this.attrName.push(key);
            this.attrValue.push(this.properties[key]);
          }
        }
      }
    };
  },
  destroyed() {
    this.$store.state.graphColor5 = "#b8b8b8";
    this.$store.state.imgUrl5 = "url(/static/pic/icon/mapBtn.png)";
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
    initMap() {
      mapboxgl.accessToken =
        "pk.eyJ1IjoiemhhbzEyMzYiLCJhIjoiY2pqM3ZocDlyMWlsNDN2bGYzbGN4eGQyZiJ9.B0y8u2o5B0WjHShoFUZlig";
      this.map = new mapboxgl.Map({
        container: "map", // container id
        //outdoorStyle,
        style: {
          version: 8,
          id: "google",
          name: "Mapbox Streets",
          sprite: "http://localhost:8088/map/sprite/sharegis/sprite", //本地图标的json及图片
          glyphs: "/static/map/font/{fontstack}/{range}.pbf", //字体文件,fontstack是pbf文件所在的文件夹名
          sources: {
            map: {
              type: "raster",
              tiles: ["http://localhost:8088/googlemap/{z}/{x}/{y}.png"],
              tileSize: 256,
            },
            img: {
              type: "raster",
              tiles: ["http://localhost:8088/googleimg/{z}/{x}/{y}.png"],
              tileSize: 256,
            },
            dark: {
              type: "raster",
              tiles: ["http://localhost:8088/googledark/{z}/{x}/{y}.png"],
              tileSize: 256,
            },
          },
          layers: [
            {
              id: "googlemap",
              type: "raster",
              source: "map",
              minzoom: 0,
              maxzoom: 18,
              layout: {
                visibility: "none",
              },
            },
            {
              id: "googledark",
              type: "raster",
              source: "dark",
              minzoom: 0,
              maxzoom: 18,
              layout: {
                visibility: "none",
              },
            },
            {
              id: "googleimg",
              type: "raster",
              source: "img",
              minzoom: 0,
              maxzoom: 18,
            },
          ],
        },
        center: [0, 0],
        zoom: 1,
      });

      this.map.addControl(new mapboxgl.NavigationControl());
      // this.map.addControl(draw);

      const scene = new Scene({
        id: "map",
        map: new Mapbox({
          mapInstance: this.map,
        }),
      });

      scene.on("loaded", () => {
        Promise.all([
          fetch(
            "https://gw.alipayobjects.com/os/basement_prod/dbd008f1-9189-461c-88aa-569357ffc07d.json"
          ).then((d) => d.json()),
          fetch(
            "https://gw.alipayobjects.com/os/basement_prod/4472780b-fea1-4fc2-9e4b-3ca716933dc7.json"
          ).then((d) => d.text()),
          fetch(
            "https://gw.alipayobjects.com/os/basement_prod/a5ac7bce-181b-40d1-8a16-271356264ad8.json"
          ).then((d) => d.text()),
        ]).then(function onLoad([world, dot, flyline]) {
          const dotData = eval(dot);
          const flydata = eval(flyline).map((item) => {
            const latlng1 = item.from.split(",").map((e) => {
              return e * 1;
            });
            const latlng2 = item.to.split(",").map((e) => {
              return e * 1;
            });
            return { coord: [latlng1, latlng2] };
          });

          const worldLine = new LineLayer()
            .source(world)
            .color("#41fc9d")
            .size(0.5)
            .style({
              opacity: 0.4,
            });
          const dotPoint = new PointLayer()
            .source(dotData, {
              parser: {
                type: "json",
                x: "lng",
                y: "lat",
              },
            })
            .shape("circle")
            .color("#ffed11")
            .animate(true)
            .size(40)
            .style({
              opacity: 1.0,
            });
          const flyLine = new LineLayer()
            .source(flydata, {
              parser: {
                type: "json",
                coordinates: "coord",
              },
            })
            .color("#ff6b34")
            .shape("arc3d")
            .size(3)
            .active(true)
            .animate({
              enable: true,
              interval: 0.4,
              trailLength: 0.5,
              duration: 2,
            })
            .style({
              opacity: 1,
            });
          // scene.addLayer(worldFill);
          scene.addLayer(worldLine);
          scene.addLayer(dotPoint);
          scene.addLayer(flyLine);
        });
      });

      let _this = this;
      var hoveredStateId = null;
      this.map.on("load", function () {
        function draw(tb, dataTxt, stationId = "002113ad-cb67") {
          let curveH = 80000; //曲线高度
          let lineGroup = new THREE.Group();
          lineGroup.name = "lineGroup";
          dataTxt.map(function (s, i) {
            let splitArray = s.split(",");
            if (splitArray[0] !== stationId) {
              return;
            }
            let ll_o = [
              parseFloat(splitArray[1]),
              parseFloat(splitArray[2]),
            ].reverse();
            let xy_o = tb.utils.lnglatsToWorld([[...ll_o, 0]]);
            let ll_d = [
              parseFloat(splitArray[4]),
              parseFloat(splitArray[5]),
            ].reverse();
            let xy_d = tb.utils.lnglatsToWorld([[...ll_d, 0]]);
            let count = parseFloat(splitArray[6]);
            let color;
            let opacity;
            if (count > 0 && count <= 10) {
              color = 60;
              opacity = 0.3;
            } else if (count > 10 && count <= 30) {
              color = 50;
              opacity = 0.6;
            } else if (count > 30 && count <= 50) {
              color = 40;
              opacity = 0.8;
            } else if (count > 50 && count <= 100) {
              color = 30;
              opacity = 0.8;
            } else if (count > 100 && count <= 150) {
              color = 20;
              opacity = 0.8;
            } else if (count > 150) {
              color = 10;
              opacity = 0.8;
            }
            opacity = 1.0;
            let curve = new THREE.CatmullRomCurve3([
              new THREE.Vector3(xy_o[0].x, xy_o[0].y, 0),
              new THREE.Vector3(
                (xy_o[0].x + xy_d[0].x) / 2,
                (xy_o[0].y + xy_d[0].y) / 2,
                curveH
              ),
              new THREE.Vector3(xy_d[0].x, xy_d[0].y, 0),
            ]);
            let geometry = new THREE.Geometry();
            let curveModelData = curve.getPoints(50);
            geometry.vertices = curveModelData; //.slice(0, 1);
            let material = new THREE.LineDashedMaterial({
              color: new THREE.Color("#ff9607"),
              // opacity: opacity,
              // transparent: false,
              linewidth: 100,
              dashSize: 0.6,
              gapSize: 0.2,
              scale: 1.0,
              // blending: THREE.AdditiveBlending,
            });
            let curveObject = new THREE.LineSegments(geometry, material); //LineLoop,Line,LineSegments
            curveObject.geometry.verticesNeedUpdate = true;
            let meshUserData = new Object();
            meshUserData.curveModelData = curveModelData;
            curveObject.userData = meshUserData;
            lineGroup.add(curveObject);
            function tweenHandler() {
              var endPointIndex = Math.ceil(this.endPointIndex);

              var curvePartialData = new THREE.CatmullRomCurve3(
                curveModelData.slice(0, endPointIndex)
              );
              curveObject.geometry.vertices = curvePartialData.getPoints(50);
              curveObject.geometry.verticesNeedUpdate = true;
            }
            let tween = new TWEEN.Tween({ endPointIndex: 1 })
              .to({ endPointIndex: 50 }, 1000)
              .onUpdate(tweenHandler)
              .repeat(Infinity);
            tween.start();
          });
          return lineGroup;
        }
        let tb;
        _this.map.addLayer({
          id: "custom_layer",
          type: "custom",
          onAdd: function (map, mbxContext) {
            tb = new Threebox(map, mbxContext, { defaultLights: true });
            this.linemap = map;
            let lineData = [
              "002113ad-cb67,31.31003,40.7365,013563fc-a796,21.32696,130.58606,3",
            ];
            let lineGroup = draw(tb, lineData);
            tb.add(lineGroup);
            // for (line of lines) {
            //   var lineOptions = {
            //     geometry: line,
            //     color: (line[1][1] / 180) * 0xffffff, // color based on latitude of endpoint
            //     width: 2, //Math.random() + 1, // random width between 1 and 2
            //   };

            //   let lineMesh = tb.line(lineOptions);
            //   tb.add(lineMesh);
            // }
          },

          render: function (gl, matrix) {
            if (_this.map) _this.map.triggerRepaint();
            tb.update();
            TWEEN.update();
          },
          //           function (gl, matrix) {
          //   tb.update();
          // },
        });
        //////////////////////////////////////////////////////////
        _this.map.addSource("states", {
          type: "geojson",
          data: "/static/map/json/area/countries.geojson", //us_states.geojson",//
        });

        // The feature-state dependent fill-opacity expression will render the hover effect
        // when a feature's hover state is set to true.
        _this.map.addLayer({
          id: "state-fills",
          type: "fill",
          source: "states",
          layout: {},
          paint: {
            "fill-color": "#627BC1",
            "fill-opacity": [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              1,
              0.5,
            ],
          },
        });

        _this.map.addLayer({
          id: "state-borders",
          type: "line",
          source: "states",
          layout: {},
          paint: {
            "line-color": "#627BC1",
            "line-width": 2,
          },
        });

        _this.map.addLayer({
          id: "state-fills-hover",
          type: "fill",
          source: "states",
          layout: {},
          paint: {
            "fill-color": "#02d4ff",
            "fill-opacity": 0.5,
          },
          filter: [
            "==",
            "name",
            "",
          ] /* 过滤器，名字为空的数据才显示，也就是默认不使用该layer  */,
        });

        _this.map.on("mousemove", function (e) {
          var features = _this.map.queryRenderedFeatures(e.point, {
            layers: ["state-fills"],
          }); /*queryRenderedFeatures  ([geometry], [parameters]):返回满足查询条件并且能够可视化的Geojson特性对象数组，查询条件可以是layers或者filter，如果是layers，则在这些layer之内的特性能够返回  */
          if (features.length) {
            _this.map.setFilter("state-fills-hover", [
              "==",
              "name",
              features[0].properties.name,
            ]); /* 通过设置filter更新要显示的数据，即出现鼠标悬停之后的变色效果 */
          } else {
            _this.map.setFilter("state-fills-hover", ["==", "name", ""]);
          }
        });

        // Reset the state-fills-hover layer's filter when the mouse leaves the map
        _this.map.on("mouseout", function () {
          _this.map.setFilter("state-fills-hover", [
            "==",
            "name",
            "",
          ]); /* 鼠标移开时还原layer的过滤器 */
        });
      });
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
        e.target.value === "googleimg" ? "visible" : "none"
      );
      this.map.setLayoutProperty(
        "googledark",
        "visibility",
        e.target.value === "googledark" ? "visible" : "none"
      );
    },
    changePanel(e) {
      console.log(this.panelType);
      if (this.panelType == "distance") {
        this.addLine();
        this.map.setFilter("meteoritespoints", [
          "match",
          ["get", "id"],
          this.circleList.map(function (feature) {
            return feature.id;
          }),
          true,
          false,
        ]);
      } else {
        this.removeLine();
      }
    },
    closePanel() {
      this.panelType = "condition";
      this.showPanel = false;
      this.removeLine();
    },
    onExpand(expandedKeys) {
      console.log("onExpand", expandedKeys);
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    onCheck(checkedKeys, info) {
      console.log(info.checked, info.node.eventKey);
      this.checkedKeys = checkedKeys;
      if (info.checked) {
        this.addData(info.node.eventKey);
      } else {
        this.removeData(info.node.eventKey);
      }
    },
    onSelect(selectedKeys, info) {
      console.log("onSelect", info);
      this.selectedKeys = selectedKeys;
    },
    removeData(name) {
      if (name == "anipoints") {
        this.map.removeLayer(name + "points");
        this.map.removeSource(name);
        this.map.removeImage("pulsing-dot");
      } else if (name == "anilines") {
        echartslayer.remove();
        echartslayer = undefined;
      } else {
        this.map.removeLayer(name + "clusters");
        this.map.removeLayer(name + "points");
        this.map.removeLayer(name + "cluster-count");
        this.map.removeSource(name);
      }
    },
    addData(name) {
      if (name == "anipoints") {
      } else if (name == "anilines") {
        this.addEcharts(name);
      } else {
        this.addNature(name);
      }
    },
    addEcharts(name) {
      var geoCoordMap = {
        上海: [121.4648, 31.2891],
        东莞: [113.8953, 22.901],
        东营: [118.7073, 37.5513],
        中山: [113.4229, 22.478],
        临汾: [111.4783, 36.1615],
        临沂: [118.3118, 35.2936],
        丹东: [124.541, 40.4242],
        丽水: [119.5642, 28.1854],
        乌鲁木齐: [87.9236, 43.5883],
        佛山: [112.8955, 23.1097],
        保定: [115.0488, 39.0948],
        兰州: [103.5901, 36.3043],
        包头: [110.3467, 41.4899],
        北京: [116.4551, 40.2539],
        北海: [109.314, 21.6211],
        南京: [118.8062, 31.9208],
        南宁: [108.479, 23.1152],
        南昌: [116.0046, 28.6633],
        南通: [121.1023, 32.1625],
        厦门: [118.1689, 24.6478],
        台州: [121.1353, 28.6688],
        合肥: [117.29, 32.0581],
        呼和浩特: [111.4124, 40.4901],
        咸阳: [108.4131, 34.8706],
        哈尔滨: [127.9688, 45.368],
        唐山: [118.4766, 39.6826],
        嘉兴: [120.9155, 30.6354],
        大同: [113.7854, 39.8035],
        大连: [122.2229, 39.4409],
        天津: [117.4219, 39.4189],
        太原: [112.3352, 37.9413],
        威海: [121.9482, 37.1393],
        宁波: [121.5967, 29.6466],
        宝鸡: [107.1826, 34.3433],
        宿迁: [118.5535, 33.7775],
        常州: [119.4543, 31.5582],
        广州: [113.5107, 23.2196],
        廊坊: [116.521, 39.0509],
        延安: [109.1052, 36.4252],
        张家口: [115.1477, 40.8527],
        徐州: [117.5208, 34.3268],
        德州: [116.6858, 37.2107],
        惠州: [114.6204, 23.1647],
        成都: [103.9526, 30.7617],
        扬州: [119.4653, 32.8162],
        承德: [117.5757, 41.4075],
        拉萨: [91.1865, 30.1465],
        无锡: [120.3442, 31.5527],
        日照: [119.2786, 35.5023],
        昆明: [102.9199, 25.4663],
        杭州: [119.5313, 29.8773],
        枣庄: [117.323, 34.8926],
        柳州: [109.3799, 24.9774],
        株洲: [113.5327, 27.0319],
        武汉: [114.3896, 30.6628],
        汕头: [117.1692, 23.3405],
        江门: [112.6318, 22.1484],
        沈阳: [123.1238, 42.1216],
        沧州: [116.8286, 38.2104],
        河源: [114.917, 23.9722],
        泉州: [118.3228, 25.1147],
        泰安: [117.0264, 36.0516],
        泰州: [120.0586, 32.5525],
        济南: [117.1582, 36.8701],
        济宁: [116.8286, 35.3375],
        海口: [110.3893, 19.8516],
        淄博: [118.0371, 36.6064],
        淮安: [118.927, 33.4039],
        深圳: [114.5435, 22.5439],
        清远: [112.9175, 24.3292],
        温州: [120.498, 27.8119],
        渭南: [109.7864, 35.0299],
        湖州: [119.8608, 30.7782],
        湘潭: [112.5439, 27.7075],
        滨州: [117.8174, 37.4963],
        潍坊: [119.0918, 36.524],
        烟台: [120.7397, 37.5128],
        玉溪: [101.9312, 23.8898],
        珠海: [113.7305, 22.1155],
        盐城: [120.2234, 33.5577],
        盘锦: [121.9482, 41.0449],
        石家庄: [114.4995, 38.1006],
        福州: [119.4543, 25.9222],
        秦皇岛: [119.2126, 40.0232],
        绍兴: [120.564, 29.7565],
        聊城: [115.9167, 36.4032],
        肇庆: [112.1265, 23.5822],
        舟山: [122.2559, 30.2234],
        苏州: [120.6519, 31.3989],
        莱芜: [117.6526, 36.2714],
        菏泽: [115.6201, 35.2057],
        营口: [122.4316, 40.4297],
        葫芦岛: [120.1575, 40.578],
        衡水: [115.8838, 37.7161],
        衢州: [118.6853, 28.8666],
        西宁: [101.4038, 36.8207],
        西安: [109.1162, 34.2004],
        贵阳: [106.6992, 26.7682],
        连云港: [119.1248, 34.552],
        邢台: [114.8071, 37.2821],
        邯郸: [114.4775, 36.535],
        郑州: [113.4668, 34.6234],
        鄂尔多斯: [108.9734, 39.2487],
        重庆: [107.7539, 30.1904],
        金华: [120.0037, 29.1028],
        铜川: [109.0393, 35.1947],
        银川: [106.3586, 38.1775],
        镇江: [119.4763, 31.9702],
        长春: [125.8154, 44.2584],
        长沙: [113.0823, 28.2568],
        长治: [112.8625, 36.4746],
        阳泉: [113.4778, 38.0951],
        青岛: [120.4651, 36.3373],
        韶关: [113.7964, 24.7028],
      };
      //设置北京航线数据
      var BJData = [
        [
          {
            name: "北京",
          },
          {
            name: "上海",
            value: 95,
          },
        ],
        [
          {
            name: "北京",
          },
          {
            name: "广州",
            value: 90,
          },
        ],
        [
          {
            name: "北京",
          },
          {
            name: "大连",
            value: 80,
          },
        ],
        [
          {
            name: "北京",
          },
          {
            name: "南宁",
            value: 70,
          },
        ],
        [
          {
            name: "北京",
          },
          {
            name: "南昌",
            value: 60,
          },
        ],
        [
          {
            name: "北京",
          },
          {
            name: "拉萨",
            value: 50,
          },
        ],
        [
          {
            name: "北京",
          },
          {
            name: "长春",
            value: 40,
          },
        ],
        [
          {
            name: "北京",
          },
          {
            name: "包头",
            value: 30,
          },
        ],
        [
          {
            name: "北京",
          },
          {
            name: "重庆",
            value: 20,
          },
        ],
        [
          {
            name: "北京",
          },
          {
            name: "常州",
            value: 10,
          },
        ],
      ];
      //设置上海航线数据
      var SHData = [
        [
          {
            name: "上海",
          },
          {
            name: "包头",
            value: 95,
          },
        ],
        [
          {
            name: "上海",
          },
          {
            name: "昆明",
            value: 90,
          },
        ],
        [
          {
            name: "上海",
          },
          {
            name: "广州",
            value: 80,
          },
        ],
        [
          {
            name: "上海",
          },
          {
            name: "郑州",
            value: 70,
          },
        ],
        [
          {
            name: "上海",
          },
          {
            name: "长春",
            value: 60,
          },
        ],
        [
          {
            name: "上海",
          },
          {
            name: "重庆",
            value: 50,
          },
        ],
        [
          {
            name: "上海",
          },
          {
            name: "长沙",
            value: 40,
          },
        ],
        [
          {
            name: "上海",
          },
          {
            name: "北京",
            value: 30,
          },
        ],
        [
          {
            name: "上海",
          },
          {
            name: "丹东",
            value: 20,
          },
        ],
        [
          {
            name: "上海",
          },
          {
            name: "大连",
            value: 10,
          },
        ],
      ];
      //设置广州航线数据
      var GZData = [
        [
          {
            name: "广州",
          },
          {
            name: "福州",
            value: 95,
          },
        ],
        [
          {
            name: "广州",
          },
          {
            name: "太原",
            value: 90,
          },
        ],
        [
          {
            name: "广州",
          },
          {
            name: "长春",
            value: 80,
          },
        ],
        [
          {
            name: "广州",
          },
          {
            name: "重庆",
            value: 70,
          },
        ],
        [
          {
            name: "广州",
          },
          {
            name: "西安",
            value: 60,
          },
        ],
        [
          {
            name: "广州",
          },
          {
            name: "成都",
            value: 50,
          },
        ],
        [
          {
            name: "广州",
          },
          {
            name: "常州",
            value: 40,
          },
        ],
        [
          {
            name: "广州",
          },
          {
            name: "北京",
            value: 30,
          },
        ],
        [
          {
            name: "广州",
          },
          {
            name: "北海",
            value: 20,
          },
        ],
        [
          {
            name: "广州",
          },
          {
            name: "海口",
            value: 10,
          },
        ],
      ];
      //飞机动画路径
      var planePath =
        "path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z";

      var convertData = function (data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
          var dataItem = data[i];
          var fromCoord = geoCoordMap[dataItem[0].name];
          var toCoord = geoCoordMap[dataItem[1].name];
          if (fromCoord && toCoord) {
            res.push({
              fromName: dataItem[0].name,
              toName: dataItem[1].name,
              coords: [fromCoord, toCoord],
            });
          }
        }
        return res;
      };

      var color = ["#a6c84c", "#ffa022", "#46bee9"];
      var series = [];
      [
        ["北京", BJData],
        ["上海", SHData],
        ["广州", GZData],
      ].forEach(function (item, i) {
        series.push(
          // {
          //   name: item[0] + " Top10",
          //   coordinateSystem: "GLMap",
          //   type: "lines",
          //   zlevel: 1,
          //   effect: {
          //     show: true,
          //     period: 6,
          //     trailLength: 0.7,
          //     color: "#fff",
          //     symbolSize: 3,
          //   },
          //   lineStyle: {
          //     normal: {
          //       color: color[i],
          //       width: 0,
          //       curveness: 0.2,
          //     },
          //   },
          //   data: convertData(item[1]),
          // },
          {
            name: item[0] + " Top10",
            coordinateSystem: "GLMap",
            type: "lines",
            zlevel: 2,
            effect: {
              show: true,
              period: 4, //箭头指向速度，值越小速度越快
              trailLength: 0.02, //特效尾迹长度[0,1]值越大，尾迹越长重
              symbol: "arrow", //箭头图标
              symbolSize: 5, //图标大小
            },
            lineStyle: {
              normal: {
                color: color[i],
                width: 1, //尾迹线条宽度
                opacity: 1, //尾迹线条透明度
                curveness: 0.3, //尾迹线条曲直度
              },
            },
            // effect: {
            //   show: true,
            //   period: 6,
            //   trailLength: 0,
            //   symbol: planePath,
            //   symbolSize: 15,
            // },
            // lineStyle: {
            //   normal: {
            //     color: color[i],
            //     width: 1,
            //     opacity: 0.4,
            //     curveness: 0.2,
            //   },
            // },
            data: convertData(item[1]),
          },
          {
            name: item[0] + " Top10",
            type: "effectScatter",
            coordinateSystem: "GLMap",
            zlevel: 2,
            rippleEffect: {
              brushType: "stroke",
            },
            label: {
              normal: {
                show: true,
                position: "right",
                formatter: "{b}",
              },
            },
            symbolSize: function (val) {
              return val[2] / 8;
            },
            itemStyle: {
              normal: {
                color: color[i],
              },
            },
            data: item[1].map(function (dataItem) {
              return {
                name: dataItem[1].name,
                value: geoCoordMap[dataItem[1].name].concat([
                  dataItem[1].value,
                ]),
              };
            }),
          }
        );
      });

      var option = {
        GLMap: {
          roam: true,
        },
        coordinateSystem: "GLMap",
        title: {
          text: "航线动画",
          left: "center",
          textStyle: {
            color: "#fff",
          },
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          top: "bottom",
          left: "right",
          data: ["北京 Top10", "上海 Top10", "广州 Top10"],
          textStyle: {
            color: "#fff",
          },
          selectedMode: "single",
        },
        geo: {
          map: "GLMap",
          label: {
            emphasis: {
              show: false,
            },
          },
          roam: true,
          itemStyle: {
            normal: {
              areaColor: "#323c48",
              borderColor: "#404a59",
            },
            emphasis: {
              areaColor: "#2a333d",
            },
          },
        },
        series: series,
      };
      //添加echarts图层
      echartslayer = new EchartsLayer(this.map);
      //设置图层参数
      echartslayer.chart.setOption(option);
    },
    addNature(name) {
      let clusterColor = name == "earthquakes" ? "#51bbd6" : "#f1f075";
      let pintIcon = name == "earthquakes" ? "fire-station-15" : "star-15";
      this.map.addSource(name, {
        type: "geojson",
        data: `/static/map/json/${name}.json`,
        cluster: true,
        clusterMaxZoom: 12, // Max zoom to cluster points on
        clusterRadius: 30, // Radius of each cluster when clustering points (defaults to 50)
      });

      // 如果'cluster'属性是true. GL-JS 会给source data自动添加point_count属性 .
      this.map.addLayer({
        id: name + "clusters",
        type: "circle",
        source: name,
        filter: ["has", "point_count"],
        paint: {
          "circle-color": clusterColor,
          "circle-radius": [
            "step",
            ["get", "point_count"],
            20,
            100,
            30,
            750,
            40,
          ],
        },
      });

      this.map.addLayer({
        id: name + "cluster-count",
        type: "symbol",
        source: name,
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["ArialRegular"],
          "text-size": 16,
        },
      });

      this.map.addLayer({
        id: name + "points",
        type: "symbol",
        source: name,
        filter: ["!", ["has", "point_count"]], //["!=", "cluster", true], 过滤掉没被聚合的
        layout: {
          // concatenate the name to get an icon from the style's sprite sheet
          "icon-image": ["concat", pintIcon], //["concat", ["get", "icon"], "-15"],
          "icon-size": 1.2, // 原始图标的缩放
          "text-field": ["get", "id"], // get the title name from the source's "id" property
          "text-font": ["ArialRegular"],
          "text-offset": [0, 0.6],
          "text-anchor": "top",
        },
        paint: {
          "text-color": "white", // icon的名字颜色
        },
      });

      let _this = this;

      this.map.on("mouseenter", name + "points", function () {
        _this.map.getCanvas().style.cursor = "pointer";
      });

      // Change it back to a pointer when it leaves.
      this.map.on("mouseleave", name + "points", function () {
        _this.map.getCanvas().style.cursor = "";
      });

      this.map.on("click", name + "points", function (e) {
        var coordinates = e.features[0].geometry.coordinates.slice();
        var description = e.features[0].properties.time;
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        var name = e.features[0].properties.id;
        name = JSON.stringify(name);
        _this.properties = e.features[0].properties;

        var html = `
        <div>
            <div class="popImg" onclick='toTarget(${name})'></div>
            <div class="popContent">${description}</div>
        </div>`;

        console.log(coordinates);
        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(html)
          .addTo(_this.map);
      });
    },
    addLine() {
      let features = [];
      this.circleList.map((item, index) => {
        if (index !== 0) {
          features.push({
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: [this.circleList[0].lonlats, item.lonlats],
            },
          });
        }
      });
      this.map.addLayer({
        id: "route",
        type: "line",
        source: {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: features,
          },
        },
        layout: {
          // "line-cap": "butt",
          // "line-join": "miter"
        },
        paint: {
          "line-color": "#e48f3c",
          "line-width": 4,
          // "line-pattern": "oneway-white-small",
          "line-dasharray": [0, 4, 3],
        },
      });

      var animationStep = 50;
      var _this = this;
      function enableLineAnimation(layerId) {
        var step = 0;
        let dashArraySeq = [
          [0, 4, 3],
          [1, 4, 2],
          [2, 4, 1],
          [3, 4, 0],
          [0, 1, 3, 3],
          [0, 2, 3, 2],
          [0, 3, 3, 1],
        ];
        _this.interval = setInterval(() => {
          step = (step + 1) % dashArraySeq.length;
          _this.map.setPaintProperty(
            layerId,
            "line-dasharray",
            dashArraySeq[step]
          );
        }, animationStep);
      }

      enableLineAnimation("route");
    },
    removeLine() {
      if (this.interval) {
        clearInterval(this.interval);
        this.map.removeLayer("route");
        this.map.removeSource("route");
        this.map.setFilter("meteoritespoints", ["has", "id"]);
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
#graphMap {
  width: 100%;
  height: 100%;
}
#map {
  width: 100%;
  height: 100%;
  background: #999999;
}
#commonPanel {
  position: absolute;
  text-align: center;
  margin-top: 10px;
  margin-left: 10px;
  width: 24%;
  height: 50%;
  padding: 10px;
  z-index: 1;
  background: #fff;
}
.layerBtn {
  background: #fff;
}

.mapboxgl-popup-content {
  width: 140px;
  height: 60px;
  padding: 10px;
}

.popImg {
  float: left;
  cursor: pointer;
  background-image: url(/static/pic/icon/App.png);
  width: 40px;
  height: 40px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.popContent {
  float: left;
  text-align: center;
  line-height: 20px;
  width: 78px;
  height: 40px;
  word-wrap: break-word;
}

/* For demo */
.ant-carousel .slick-slide {
  text-align: center;
  height: 160px;
  line-height: 160px;
  background: #364d79;
  overflow: hidden;
}

.ant-carousel .custom-slick-arrow {
  width: 25px;
  height: 25px;
  font-size: 25px;
  color: #fff;
  background-color: rgba(31, 45, 61, 0.11);
  opacity: 0.3;
}
.ant-carousel .custom-slick-arrow:before {
  display: none;
}
.ant-carousel .custom-slick-arrow:hover {
  opacity: 0.5;
}

.ant-carousel .slick-slide h3 {
  color: #fff;
}

.carouselImg {
  width: 100%;
  height: 160px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.centerName {
  margin-top: 10px;
  font-size: 26px;
  color: #02d4ff;
}

.attrP {
  font-size: 18px;
}
</style>
