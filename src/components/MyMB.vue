<template>
 <a-layout id="components-layout-demo-responsive">
    <a-layout-sider
      breakpoint="lg"
      collapsedWidth="0"
    >
      <a-collapse v-model="activeKey">
        <a-collapse-panel header="MB分析" key="1">
          <div>
            选择点<a-switch v-model="addPointFlag" @change='choosePoints'/>
          </div>
          <div>
            加载模型<a-switch @change='createModel'/>
          </div>
          <div>
            播放<a-switch v-model="playFlag" @change='play'/>
          </div>
        </a-collapse-panel>
      </a-collapse>
      <div style=" margin: 16px;font-size: 20px ">
        <router-link to="/login" class="homeIndex_Title">注销</router-link>
      </div>
    </a-layout-sider>
    <a-layout>
      <a-layout-content :style="{ margin: '16px' }">
        <div id="earth_container" :style="{ background: '#fff', height: '100%', width: '100%' }">
          <router-view></router-view>
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
export default {
  name: "MyMB",
  data() {
    return {
      activeKey: ["1"],
      timer: null,
      earth: null,
      addPointFlag: false,
      playFlag: false,
      positionArr: [],
      model: null,
      lonOffset: 0,
      latOffset: 0,
      RotateX: 0,
      options: {
        vertexColor: true,
        width: 3.0,
        material: new Engine.Material({
          fabric: {
            type: 'PolylineFlying',
            uniforms: {
              color: new Engine.Color(0.0 / 255.0, 135.0 / 255.0, 244.0 / 255.0, 1.0),
              length: 0.2,
              speed: 0.2
            }
          }
        })
      },
      options2: {
        vertexColor: true,
        width: 1.0,
        material: new Engine.Material({
          fabric: {
            type: 'Color',
            uniforms: {
              color: new Engine.Color(0.0 / 255.0, 135.0 / 255.0, 244.0 / 255.0).withAlpha(0.6)
            }
          }
        })
      }
    };
  },
  mounted() {
    // 加载完资源后执行
    // this.$nextTick(() => {
          
    // });
    
    this.$store.commit("initEarth");
    let _this = this;
    this.earth = this.$store.state.earth;
      this.earth.on('click', e => {
        _this.getPointPosition(e);
    });
  },
  methods: {
    getPointPosition(e) {
      if(!this.addPointFlag) {
        return;
      }
      if(this.positionArr.length === 2) {
        this.positionArr = [];
      }

      let position = [];
      position.push(e.lonlat[0]);
      position.push(e.lonlat[1]);
      position.push(0.0);
      this.positionArr.push(position);
      if(this.positionArr.length === 2) {
        this.lonOffset = (this.positionArr[1][0] - this.positionArr[0][0]) /
          this.getGouGu(this.positionArr[1], this.positionArr[0]);
        this.latOffset = (this.positionArr[1][1] - this.positionArr[0][1]) /
          this.getGouGu(this.positionArr[1], this.positionArr[0]);
        let sign = this.latOffset / Math.abs(this.latOffset);
        this.addLine();
        this.RotateX = sign * (Math.acos(this.lonOffset) / Math.PI) * 180;
        this.addPointFlag = false;
      }
    },

    choosePoints(checked) {
      this.addPointFlag = checked;
    },

    play(checked) {
      this.playFlag = checked;
    },

    createModel() {
      // earth.features.remove(model);
      if(this.model){
        this.earth.features.remove(this.model);
        window.clearInterval(this.timer);
      }

      let position = this.positionArr[0];
      var vec = GeoVis.Vector3.fromDegrees(position[0], position[1], position[2]);
      var modelMatrix = GeoVis.Transforms.eastNorthUpToFixedFrame(vec);
      var hpr = new Engine.HeadingPitchRoll(0.0, Engine.Math.PI_OVER_TWO, 0.0);
      var or = Engine.Transforms.headingPitchRollQuaternion(vec, hpr);
      var model = GeoVis.Model.fromGltf({
          url: "/static/purplecar.gltf",
          modelMatrix: modelMatrix,
          scale: 14000.0
          // orientation: or
      });
      model.addTo(this.earth.features);

      let m = model.modelMatrix;
      //RotateX为旋转角度，转为弧度再参与运算
      let m1 = Engine.Matrix3.fromRotationZ(Engine.Math.toRadians(this.RotateX));
      //矩阵计算
      Engine.Matrix4.multiplyByMatrix3(m, m1, m);
      //赋值
      model.modelMatrix = m;
      model.readyPromise.then(function (model) {
        model.activeAnimations.addAll({
          loop: GeoVis.ModelAnimationLoop.REPEAT
          });
      });
      this.model = model;
      this.start();
    },

    start(){
      let positionIndex = 0;
      let model = this.model;
      let _this = this;
      this.timer = setInterval(() => {
        if (_this.playFlag) {
          var thisLon = _this.positionArr[0][0] + positionIndex * _this.lonOffset * 0.03;
          var thisLat = _this.positionArr[0][1] + positionIndex * _this.latOffset * 0.03;
          var thisHeight = _this.positionArr[0][3];
          var thisVec = GeoVis.Vector3.fromDegrees(thisLon, thisLat, thisHeight);
          model.modelMatrix = GeoVis.Transforms.eastNorthUpToFixedFrame(thisVec);

          var mm = model.modelMatrix;
          //RotateX为旋转角度，转为弧度再参与运算
          var mm1 = Engine.Matrix3.fromRotationZ(Engine.Math.toRadians(this.RotateX));
          //矩阵计算
          Engine.Matrix4.multiplyByMatrix3(mm, mm1, mm);
          //赋值
          model.modelMatrix = mm;
          positionIndex++;


          var cameraLon = thisLon - _this.lonOffset * 4;
          var cameraLat = thisLat - _this.latOffset * 4;
          if(0<=this.RotateX<=90){
            var head = GeoVis.Math.toRadians(90-this.RotateX);//1
          }
          else if(90<this.RotateX<=180){
            var head = GeoVis.Math.toRadians(this.RotateX-90);//2
          }
          else if(-90<this.RotateX<0){
            var head = GeoVis.Math.toRadians(90-this.RotateX);//3
          }
          else if(-180<=this.RotateX<=-90){
            var head = GeoVis.Math.toRadians(-this.RotateX+90)//4
          }
          
          this.earth.camera.setView({
          destination: GeoVis.Vector3.fromDegrees(cameraLon, cameraLat, 200000.0),
            orientation: {
              heading:head,
              pitch: GeoVis.Math.toRadians(-20),
              roll:0
            }
          }
          );
        }
        if(this.getGouGu(this.positionArr[0], this.positionArr[1]) <
          this.getGouGu(this.positionArr[0], [thisLon, thisLat, 0])) {
            _this.playFlag = false;
        }
      }, 30)
    },
    getGouGu(x, y) {
      let root = Math.pow((x[1] - y[1]), 2) +
          Math.pow((x[0] - y[0]), 2)
      return Math.pow(root, 1/2);
    },
    addPolylineMaterial() {
      this.earth.features.removeAll();
      this.createLine(this.positionArr[1], this.positionArr[0]);
    },
    createLine(start, end) {
      var polylines = [];
      var positions;
      positions = this.getPointsPosition(start.concat(end));
      polylines.push(new GeoVis.Polyline(positions, this.options).addTo(this.earth.features) );
      polylines.push( new GeoVis.Polyline(positions, this.options2).addTo(this.earth.features) );
    },
    getPointsPosition(pos) {
      var count = 0;
      var times = [0, 50, 100];
      var points = [];
      console.log(pos);
      var spline = new Engine.CatmullRomSpline({
        times: times,
        points: [
          new Engine.Cartesian3.fromDegrees(pos[0], pos[1], 0),
          new Engine.Cartesian3.fromDegrees((pos[0] + pos[3]) / 2 - 1, (pos[1] + pos[4]) / 2, 0),
          new Engine.Cartesian3.fromDegrees(pos[3], pos[4], 0)
        ]
      });
      while (count < 101) {
        points.push(spline.evaluate(count));
        count++;
      };
      return points;
    },
    addLine() {
         this.earth.features.removeAll();
        var positions = this.positionArr;
        var colors1 = [
          new GeoVis.Color.fromCssString("#ff0000").withAlpha(0.7)
        ]
        var polyline1 = new GeoVis.Polyline(positions, {
          colors: colors1,
          vertexColor: true,
          followSurface: true,
          width: 2.0,
        }).addTo(this.earth.features);
      },
  }
};
</script>

<style>
#components-layout-demo-responsive .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}

#components-layout-demo-responsive {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
