<template>
  <div>
    <a-dropdown>
        功能列表 <a-icon type="down" />
      <a-menu slot="overlay">
        <a-sub-menu title="添加" key="add">
          <a-menu-item v-on:click="addPoint">添加一个点</a-menu-item>
          <a-menu-item v-on:click="addLine">添加一条线</a-menu-item>
          <a-menu-item v-on:click="addCircle">添加一个圆</a-menu-item>
          <a-menu-item v-on:click="addMarkerEvent">添加标记事件</a-menu-item>
          <a-menu-item v-on:click="addPolygon">添加一个标记区域</a-menu-item>
          <a-menu-item v-on:click="addLabel">添加一个标签</a-menu-item>
          <a-menu-item v-on:click="addPolylineMaterial">添加一组放射线</a-menu-item>
          <a-menu-item v-on:click="addKarPaski">添加两条飞线</a-menu-item>
          <a-menu-item v-on:click="addWall">添加照片墙</a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-dropdown>
  </div>
</template>
<script>
  export default {
    name: 'Function',
    data () {
      return {
        earth: this.$store.state.earth,
        features: this.$store.state.earth.features,
        marker: this.$store.state.marker,
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
      }
    },
    methods: {
      addPoint() {
        this.removeAll()
        var features = this.features;
        features.removeAll();
        new GeoVis.Point([120, 31, 100], {
          color: new GeoVis.Color(255 / 255, 0 / 255, 0 / 255, 0.5),
          pixelSize: 15,
        }).addTo(features);
      },
      addLine() {
        this.removeAll()
        var positions1 = [
          [101.0, 39.0, 0],
          [123.0, 39.0, 0]
        ];
        var colors1 = [
          new GeoVis.Color.fromCssString("#0288d1").withAlpha(0.4),
          new GeoVis.Color.fromCssString("#7b1fa2").withAlpha(1)
        ]
        var polyline1 = new GeoVis.Polyline(positions1, {
          colors: colors1,
          vertexColor: true,
          followSurface: true,
          width: 2.0,
        }).addTo(this.features);
      },
      addCircle() {
        this.removeAll()
        var position = [121, 30, 5000]; // 圆心坐标 
        var circle = new GeoVis.Circle(position, {
            radius: 500000, // 半径
            height: 5000, // 高度
            fill: true,
            fillColor: GeoVis.Color.fromCssString("#4AFD2A").withAlpha(0.5), // 填充颜色
        }).addTo(this.features);  
      },
      addMarkerEvent() {
        this.removeAll()
        this.marker = new GeoVis.Marker([120.75, 31.3, 0]).addTo(this.features);
        this.marker.bindPopup("<b>Hello</b><br>Hello~~", {
          maxWidth: 120
        })
        this.marker.showPopup();
      },
      addPolygon() {
        this.removeAll();
        var positions_orange = [
          [112, 28, 0],
          [114, 28, 0],
          [114, 30, 0],
          [112, 30, 0]
        ]
        var color_orange = GeoVis.Color.fromCssString("#d84315").withAlpha(0.5);
        var outlinecolor_orange = GeoVis.Color.fromCssString("#00acc1");
        var polygon_orange = new GeoVis.Polygon(positions_orange, {
          outline: true,
          outlineColor: outlinecolor_orange,
          fill: true,
          fillColor: color_orange,
          extrudedHeight: 100000,
          outlineWidth: 2.0,
          async: true
        }).addTo(this.features);
      },
      addLabel() {
        this.removeAll();
        var lon = 120;
				var lat = 33;
				var label = new GeoVis.Label([lon, lat, 0], {
					text: 'DDDD',
					font: `${20}px 微软雅黑`,
					outlineWidth: 8,
					scale: 1,
					style: GeoVis.LabelStyle.FILL_AND_OUTLINE,
					outlineColor: GeoVis.Color.fromCssString('#000000'),
					fillColor: GeoVis.Color.fromCssString('#ffffff')
				})
				label.addTo(this.features)
      },
      addPolylineMaterial() {
        this.removeAll();
        this.createLine([102.92, 30.71, 0.0], [116.31, 39.91, 0]);
        this.createLine([121.40, 31.26, 0.0], [116.31, 39.91, 0]);
        this.createLine([113.42, 23.68, 0.0], [116.31, 39.91, 0]);
        this.createLine([90.36, 30.92, 0.0], [116.31, 39.91, 0]);
      },
      createLine(start, end) {
        var polylines = [];
        var positions;
        positions = this.getPointsPosition(start.concat(end));
        polylines.push(new GeoVis.Polyline(positions, this.options).addTo(this.features) );
        polylines.push( new GeoVis.Polyline(positions, this.options2).addTo(this.features) );
      },
      getPointsPosition(pos) {
        var count = 0;
        var times = [0, 50, 100];
        var points = [];

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
      addKarPaski() {
        this.removeAll();
        var polyline = new GeoVis.BezierCurve({
            start: [101.0, 30.0, 0],
            end: [123.0, 10.0, 0],
            color: GeoVis.Color.fromCssString("#D81B60"),
            width: 6.0,
            curve: 0.6,
            fit: 6
        });

        var billboards = [];

        var billLength = Math.floor(polyline.positions.length * 0.6);
        for (var i = 0; i < polyline.positions.length; i++) {
            var scale = 0.0;
            if (i <= billLength) {
                scale = i < billLength / 2 ? i / billLength * 0.8 : (billLength - i) / billLength * 0.8;
            }
            var billboard = new GeoVis.Billboard([polyline.lonlats[i][0], polyline.lonlats[i][1], polyline.lonlats[i][2]], {
                image: './data/cluster.png',
                scale: scale / 2,
                light: true
            });
            billboard.addTo(this.features);
            billboards.push(billboard)
        }

        var positions = [];
        for (var i = 0; i < polyline.positions.length; i++) {
            positions[i] = { x: polyline.lonlats[i][0], y: polyline.lonlats[i][1], z: polyline.lonlats[i][2] };
        }


        // 飞线系列
        var curver = new GeoVis.BezierCurve({
            start: [101.0, 30.0, 0],
            end: [132.0, 42.0, 0],
            color: GeoVis.Color.fromCssString("#29b2cf"),
            width: 6.0,
            curve: 0.6,
            fit: 4
        });

        var colorLength = Math.floor(curver.positions.length * 0.4)
        var colors = new Array(colorLength);
        for (var i = 0; i < colorLength; i++) {
            var alpha = i < colorLength / 2 ? i / colorLength : (colorLength - i) / colorLength;
            colors[i] = GeoVis.Color.fromCssString("#29b2cf").withAlpha(alpha * 2)
        }
        colors.push(GeoVis.Color.fromCssString("#29b2cf").withAlpha(0.0));
        var line = new GeoVis.Polyline(curver.positions.slice(0, colors.length), {
            colors: colors,
            vertexColor: true,
            followSurface: true,
            width: 6.0
        }).addTo(this.features);
        try {
          var inv = window.setInterval(() => {
            const temppos = {
                x: positions[0].x,
                y: positions[0].y,
                z: positions[0].z
            };
            for (var i = 0; i < billboards.length; i++) {
                var next = i === positions.length - 1 ? 0 : i + 1;
                var billborad = billboards[i];
                billborad.position = GeoVis.Vector3.fromDegrees(positions[next].x, positions[next].y, positions[next].z);
                positions[i] = i === positions.length - 1 ? temppos : {
                    x: positions[next].x,
                    y: positions[next].y,
                    z: positions[next].z
                };
            }
          }, 60);
        } catch (error) {
          alert("99999")
        }
        // interval
        
        var count = 0;
        try {
          var lineinv = window.setInterval(() => {
            count++;
            line.positions = curver.positions.slice(count, colors.length + count);
            if (count >= curver.positions.length - colors.length) count = 0;
          }, 60);
        } catch (error) {
          alert("66666666666")
        }
      },
      addWall() {
        this.removeAll();
        var positions = [[120, 20.0,1000],[121.0, 20.0,1000]]; // 左下经度，左下纬度，右上经度，右上纬度
        var minimumHeights=[0,0];
        var maximumHeights=[100000,100000]
        var color = GeoVis.Color.fromCssString("#009688").withAlpha(0.8);  // 填充颜色
        var rec = new GeoVis.WallGeom(positions, {
            minimumHeights:minimumHeights,
            maximumHeights:maximumHeights,
            async: false,
            fill: true,
            fillColor: color,
            material: new GeoVis.Material({
              fabric : {
                type : 'Image',
                uniforms : {
                  image : '../assets/306.jpg'
                }
            }
            })
        });
        rec.addTo(this.features);       

        this.earth.camera.flyTo({
          destination: GeoVis.Cartesian3.fromDegrees(120.5, 17, 4e5),
          orientation:  new GeoVis.HeadingPitchRoll(0, -0.94, 0)
        })

        // 高度修改示例
        function Data(){ 
          this.height = 50000;
          this.fillColor = "#4AF000";
          this.async = false;
        };

        var data = new Data();
        var gui = new dat.GUI();

        var heightController = gui.add(data, 'height', 0, 1e6);
        heightController.onChange(function(value) {
          rec.minimumHeights = [0,0];
          rec.maximumHeights = [value,value];
        });

        //填充颜色修改示例
        var fillColorController = gui.addColor(data, 'fillColor');
        fillColorController.onChange(function(value) {
          rec.fillColor = GeoVis.Color.fromCssString(value).withAlpha(0.8);
        });

        //异步同步
        var asyncController = gui.add(data, 'async');
        asyncController.onChange(function(value) {
          rec.async = value;
        });
      },
      removeAll() {
        this.removeAllFeatures();
        this.removeMarkers(this.marker, this.features);
      },
      removeAllFeatures() {
        this.features.removeAll();
      },
      removeMarkers(marker, features) {
        if (marker !== undefined){
          marker.removeFrom(features);
        }
      }
    }
  }
</script>
