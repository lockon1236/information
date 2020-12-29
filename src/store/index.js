import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0,
    count1: 0,
    count2: 0,
    count3: 0,
    count4: 0,
    earth: undefined,
    marker: undefined,
    point: undefined,
    Polyline: undefined,
    rectangle: undefined,
    WallGeom: undefined,
    Model: undefined,
    particleGroup: undefined,
    pretreatHColor1: "#fff",
    pretreatHColor2: "#fff",
    pretreatHColor3: "#fff",
    pretreatHColor4: "#fff",
    pretreatHColor5: "#fff",
    graphColor1: "#b8b8b8",
    graphColor2: "#b8b8b8",
    graphColor3: "#b8b8b8",
    graphColor4: "#b8b8b8",
    graphColor5: "#b8b8b8",
    graphColor6: "#b8b8b8",
    imgUrl1: "url(/static/pic/icon/analyzeBtn.png)",
    imgUrl2: "url(/static/pic/icon/docBtn.png)",
    imgUrl3: "url(/static/pic/icon/excelBtn.png)",
    imgUrl4: "url(/static/pic/icon/visioBtn.png)",
    imgUrl5: "url(/static/pic/icon/mapBtn.png)",
    imgUrl6: "url(/static/pic/icon/manageBtn.png)",
    // ///////////////////////////////
    loginvisible: false,
    registervisible: false,
    userName: "登录",
    userToken: "",
    searchValue: "",
    entityList: [],
    docList: [],
    analyzeNodeName: "", // 检索页拓扑分析实体名
    docFileName: "" // 检索页拓扑分析实体名
  },
  getters: {

  },
  mutations: {
    showLogin(state) {
      state.loginvisible = true;
    },
    hideLogin(state) {
      state.loginvisible = false;
      console.log("9999999")
    },
    showRegister(state) {
      state.loginvisible = false;
      state.registervisible = true;
    },
    hideRegister(state) {
      state.loginvisible = false;
      state.registervisible = false;
    },
    initToken(state,userData) {
      state.userName = userData.name;
      state.userToken = userData.token;
      console.log(state.userToken);
    },
    getSearchValue(state,value) {
      state.searchValue = value;
    },
    getSearch(state,searchData) {
      if(searchData.nodes) state.entityList = searchData.nodes;
      if(searchData.files) state.docList = searchData.files;
    },
    initSearch(state) {
      state.entityList = [];
      state.docList = [];
    },
    getAnalyzeNode(state,name) {
      state.analyzeNodeName = name
    },
    getDocFile(state,name) {
      state.docFileName = name
    },
    // ////////////////////////////////////////////////////
    increment(state) {
      state.count++
    },
    pretreatHeader1(state) {
      state.pretreatHColor1 = "#fff000",
        state.pretreatHColor2 = "#fff",
        state.pretreatHColor3 = "#fff",
        state.pretreatHColor4 = "#fff",
        state.pretreatHColor5 = "#fff"
    },
    pretreatHeader2(state) {
      state.pretreatHColor1 = "#fff",
        state.pretreatHColor2 = "#fff000",
        state.pretreatHColor3 = "#fff",
        state.pretreatHColor4 = "#fff",
        state.pretreatHColor5 = "#fff"
    },
    pretreatHeader3(state) {
      state.pretreatHColor1 = "#fff",
        state.pretreatHColor2 = "#fff",
        state.pretreatHColor3 = "#fff000",
        state.pretreatHColor4 = "#fff",
        state.pretreatHColor5 = "#fff"
    },
    pretreatHeader4(state) {
      state.pretreatHColor1 = "#fff",
        state.pretreatHColor2 = "#fff",
        state.pretreatHColor3 = "#fff",
        state.pretreatHColor4 = "#fff000",
        state.pretreatHColor5 = "#fff"
    },
    pretreatHeader5(state) {
      state.pretreatHColor1 = "#fff",
        state.pretreatHColor2 = "#fff",
        state.pretreatHColor3 = "#fff",
        state.pretreatHColor4 = "#fff",
        state.pretreatHColor5 = "#fff000"
    },
    initEarth(state) {
      /* state.earth = new GeoVis.Earth('earth_container',{
          skyBox: true
       });*/
      state.earth = new GeoVis.Earth('earth_container', {
        skyBox: true
      });
      state.layer = new GeoVis.SingleLayer('/static/pic/earth.jpg').addTo(state.earth.layers);
      // setTimeout(() => {
      //   state.earth.handleResize();
      // }, 200);
      // state.earth.scene.backgroundColor = GeoVis.Color.TRANSPARENT
    },
    addMarkers(state, checked) {
      if (checked && state.marker === undefined) {
        state.marker = new GeoVis.Marker([120.75, 31.3, 0]).addTo(state.earth.features);
        state.marker.bindPopup("<b>Hello</b><br>我在~~", {
          maxWidth: 120
        })
        state.marker.showPopup();
      } else if (checked && state.marker !== undefined) {
        state.marker.addTo(state.earth.features)
      } else if (!checked && state.marker !== undefined) {
        state.marker.removeFrom(state.earth.features)
      }
    },
    createMarker(state, ) {

      if (state.count1 == 0) {
        state.marker = new GeoVis.Marker([120.75, 31.3, 0]).addTo(state.earth.features);
        state.marker.bindPopup("<b>Hello</b><br>我在这里~~", {
          maxWidth: 120
        })
        state.marker.showPopup();
        state.count1++;
      } else {
        return;
      }
    },
    createPoint(state) {
      // var features = earth.features;
      //features.removeAll()
      if (state.count2 == 0) {
        state.point = new GeoVis.Point([50, 39.0, 0], {
          color: new GeoVis.Color(128 / 255, 42 / 255, 42 / 255, 0.5),
          pixelSize: 15,
        }).addTo(state.earth.features);
        state.count2++;
      }
      else {
        return;
      }

    },
    createPolyline(state) {
      var positions1 = [
        [101.0, 39.0, 0],
        [123.0, 39.0, 0]
      ];
      var colors1 = [
        GeoVis.Color.fromCssString("#0288d1").withAlpha(0.4),
        GeoVis.Color.fromCssString("#7b1fa2").withAlpha(1)
      ];
      if (state.count3 == 0) {
        state.Polyline = new GeoVis.Polyline(positions1, {
          colors: colors1,
          vertexColor: true,
          followSurface: true,
          width: 2.0,
        }).addTo(state.earth.features);
        state.count3++;
      } else {
        return;
      }

    },
    createRectangle(state) {
      var positionRc = [101, 20, 121, 30];// 左下经度，左下纬度，右上经度，右上纬度
      var colorRc = GeoVis.Color.fromCssString("#8B3A62").withAlpha(0.8); // 填充颜色
      if (state.count4 == 0) {

        state.rectangle = new GeoVis.RectangleGeom(positionRc, {
          async: false,
          fill: true,
          fillColor: colorRc
        });
        state.rectangle.addTo(state.earth.features);
        state.count4++;

      }
      else {
        return;
      }

    },
    createWall(state) {
      var img = './static/pic/earth.jpg';
      var positions = [[120, 20.0, 1000], [121.0, 20.0, 1000]]; // 左下经度，左下纬度，右上经度，右上纬度
      var minimumHeights = [0, 0];
      var maximumHeights = [100000, 100000]
      var color = GeoVis.Color.fromCssString("#009688").withAlpha(0.8);  // 填充颜色
      state.WallGeom = new GeoVis.WallGeom(positions, {
        minimumHeights: minimumHeights,
        maximumHeights: maximumHeights,
        async: false,
        fill: true,
        fillColor: color,
        material: new GeoVis.Material({
          fabric: {
            type: 'Image',
            uniforms: {
              image: img
            }
          }
        })
      });
      state.WallGeom.addTo(state.earth.features);

      state.earth.camera.flyTo({
        destination: GeoVis.Cartesian3.fromDegrees(120.5, 17, 4e5),
        orientation: new GeoVis.HeadingPitchRoll(0, -0.94, 0)
      })

    },

    createModel(state, url) {
      var heading2 = 135;
      var position = [120.76899, 31.2914, 0];
      // state.earth.features.remove(state.Model);
      var vec = GeoVis.Vector3.fromDegrees(position[0], position[1], 100);
      var heading = GeoVis.Math.toRadians(heading2);
      var pitch = 0;
      var roll = 0;
      var hpr = new GeoVis.HeadingPitchRoll(heading, pitch, roll);
      var modelMatrix = GeoVis.Transforms.headingPitchRollToFixedFrame(vec, hpr,
        GeoVis.Ellipsoid.WGS84,
        GeoVis.Transforms.eastNorthUpToFixedFrame, modelMatrix);

      state.Model = GeoVis.Model.fromGltf({
        url: url,
        show: true,
        modelMatrix: modelMatrix,
        scale: 2.0,
        minimumPixelSize: 128,
        maximumScale: 20000,
        allowPicking: false,
        debugShowBoundingVolume: false,
        debugWireframe: false
      });
      state.Model.addTo(state.earth.features);

      state.earth.camera.setView({
        destination: GeoVis.Vector3.fromDegrees(position[0], position[1], 300),
        orientation: {
          heading: GeoVis.Math.toRadians(45.0), // east, default value is 0.0 (north)
          // pitch: GeoVis.Math.toRadians(-45),    // default value (looking down)
          roll: 4.0                             // default value
        }
      })
    },
    createParticle(state) {
      state.particleGroup = new GeoVis.ParticleGroup({
        color: GeoVis.Color.fromCssString("#5ca1c0")
      }).addTo(state.earth);
      state.earth.scene.rethrowRenderErrors = true
      for (var i = 0; i < 30; i++) {
        var lon = Math.round(Math.random() * 360 - 180);
        var lat = Math.round(Math.random() * 180 - 90);
        var curve = new GeoVis.BezierCurve({
          // id: '',
          start: [-95.0, 32.0, 0.0],
          end: [lon, lat, 0.0],
          vertexColor: true,
          width: 1.0,
          color: GeoVis.Color.fromCssString("#ab3f2d")
        })// .addTo(earth);
        var emitter = new GeoVis.Emitter(curve.lonlats, {
          duration: 5,
          particleCount: i,
          image: './static/pic/particleA.png',
          scale: 0.3 + 0.01
        }).addTo(state.particleGroup);
        emitter.start();
      }
    },
    reM(state) {
      state.earth.features.removeAll();
      state.marker.removeFrom(state.earth.features);
      state.count1 = 0;
      state.count2 = 0;
      state.count3 = 0;
      state.count4 = 0;
    },

  }
})

export default store;
