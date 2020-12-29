<template>
  <a-layout id="components-layout-demo-responsive">
    <a-layout-sider
      breakpoint="lg"
      collapsedWidth="0"
      @collapse="onCollapse"
      @breakpoint="onBreakpoint"
    >
      <a-collapse v-model="activeKey">
        <a-collapse-panel header="MB分析" key="1">
          <a-switch @change="onChange" />
        </a-collapse-panel>
      </a-collapse>
      <div style=" margin: 16px;font-size: 20px ">
        <router-link to="/login" class="homeIndex_Title">注销</router-link>
      </div>
      <div id="test">
        <!-- Dropdown Trigger -->
        <!-- Dropdown Structure -->
        <a-button
          class="bnt"
          @click="createPoint"
          style="color:#0084c5; width:125px; height:30px"
        >创建点</a-button>
        <a-button
          class="bnt"
          @click="createPolyline"
          style="color:#0084c5; width:125px; height:30px"
        >创建线</a-button>
        <a-button
          class="bnt"
          @click="createRectangle"
          style="color:#0084c5; width:125px; height:30px"
        >创建矩形</a-button>
        <a-button
          class="bnt"
          @click="createMarker"
          style="color:#0084c5; width:125px; height:30px"
        >创建Marker</a-button>
        <a-button
          class="bnt"
          @click="createWall"
          style="color:#0084c5; width:125px; height:30px"
        >创建Wall</a-button>

        <a-button
          class="bnt"
          @click="createModel('./static/models/A320.glb')"
          style="color:#0084c5; width:125px; height:30px"
        >创建模型A320</a-button>

        <a-button
          class="bnt"
          @click="createModel('./static/models/A380.glb')"
          style="color:#0084c5; width:125px; height:30px"
        >创建模型A380</a-button>
        <a-button
        class="bnt"
          @click="createParticle"
          style="color:#0084c5; width:125px; height:30px">创建粒子系统</a-button>


        <a-button class="bnt" @click="reM" style="color:#0084c5; width:125px; height:30px">全部移除</a-button>

        <!-- Dropdown Trigger -->
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
import Function from './Function'
export default {
  data() {
    return {
      activeKey: ["1"],
      earth: undefined,
      layer: undefined
    };
  },
  components: {
    Function
  },
  mounted() {
    // 加载完资源后执行
    // this.$nextTick(() => {

    // });
    this.$store.commit("initEarth");
    console.log('执行完毕');
  },
  methods: {
    onChange(checked) {
      console.log(`a-switch to ${checked}`);
      this.$store.commit("addMarkers", checked);
    },
    onChange1(checked) {
      console.log(`a-switch to ${checked}`);
      this.$store.commit("addpoints", checked);
    },
    onChange2(checked) {
      console.log(`a-switch to ${checked}`);
      this.$store.commit("addlines", checked);
    },
    onChange3(checked) {
      console.log(`a-switch to ${checked}`);
      this.$store.commit("addcircle", checked);
    },
    onChange4(checked) {
      console.log(`a-switch to ${checked}`);
      this.$store.commit("addpolygon", checked);
    },
    onChange5(checked) {
      console.log(`a-switch to ${checked}`);
      this.$store.commit("addweibo", checked);
    },
    onChange6(checked) {
      console.log(`a-switch to ${checked}`);
      this.$store.commit("cameracontrol", checked);
    },
    onChange7(checked) {
      console.log(`a-switch to ${checked}`);
      this.$store.commit("addBillboards", checked);
    },
    onChange8(checked) {
      console.log(`a-switch to ${checked}`);
      this.$store.commit("addradar", checked);
    },
    onCollapse(collapsed, type) {
      console.log(collapsed, type);
    },
    onBreakpoint(broken) {
      console.log(broken);
    },
    createPoint() {
      this.$store.commit("createPoint");
    },
    createPolyline() {
      this.$store.commit("createPolyline");
    },
    createRectangle() {
      this.$store.commit("createRectangle");
    },
    createWall() {
      this.$store.commit("createWall");
    },
    createModel(url) {
      this.$store.commit("createModel", url);
    },
    createMarker() {
      this.$store.commit("createMarker");
    },
    reM() {
      this.$store.commit("reM");
    },
    createParticle(){
      this.$store.commit("createParticle");
    }
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

.bnt {
  padding-left: 10px;
  margin-bottom: 10px;
}
</style>
