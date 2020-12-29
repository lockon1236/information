<template>
  <div>
    <div style="background-color:	#508a88; height: 50px"></div>
    <a-row :gutter="16">
      <a-col span="4" style="background-color:	#5e7c85">
        <div style="height: 800px">
          <a-button @click="changing_over" class="analyze_bnt">食物链</a-button>
          <br />
          <a-button @click="addpoint" class="analyze_bnt">图</a-button>
          <br />
          <a-button @click="test" class="analyze_bnt">测试</a-button>
          <br />
          <a-button @click="createcxtmenue" class="analyze_bnt">创建cxtmenue</a-button>
          <br />
          <a-button @click="create_edgehandles" class="analyze_bnt">创建edgehandles</a-button>
        </div>
      </a-col>
      <a-col span="16" style="background-color:	#008792">
        <div id="cy"></div>
        <div id="buttons">
          <button id="start">Start on selected</button>
          <button id="draw-on">Draw mode on</button>
          <button id="draw-off">Draw mode off</button>
        </div>
      </a-col>
      <a-col span="4" style="background-color:#5e7c85; margin-bottom: 10px">
        <div style="height: 800px">
          <img
            id="png-eg"
            style="width: 200px; height: 200px;  margin-top: 200px; margin-bottom: 100px; background-color: #cde6c7"
          />
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script src="https://unpkg.com/font-awesome@4.7.0/css/font-awesome.min.css" type = "text/css " ></script>
<script>
import { delay } from "q";
import $ from "jquery";
export default {
  name: "HelloWorld",
  data() {
    count: 0;
  },

  methods: {
    test() {
      var cy = this.$cytoscape({
        container: document.getElementById("cy"),
        style: [
          {
            selector: 'node[label = "Person"]',
            css: { "background-color": "#6FB1FC", content: "data(name)" }
          },
          {
            selector: "edge",
            css: {
              content: "data(relationship)",
              "curve-style": "bezier",
              "target-arrow-shape": "triangle",
              "target-arrow-color": "#2b4490",
              "line-color": "	#130c0e",
              "arrow-scale": "1",
              "line-cap": "round"
            }
          }
        ],
        elements: {
          nodes: []
        },
        layout: { name: "grid" }
      });

      var eles = cy.add([
        {
          group: "nodes",
          data: { id: "n0", name: "V0", label: "Person" },
          position: { x: 350, y: 300 }
        },
        {
          group: "nodes",
          data: { id: "n1", name: "V1", label: "Person" },
          position: { x: 550, y: 300 }
        },
        {
          group: "nodes",
          data: { id: "n2", name: "V2", label: "Person" },
          position: { x: 650, y: 500 }
        },
        {
          group: "nodes",
          data: { id: "n3", name: "V3", label: "Person" },
          position: { x: 550, y: 700 }
        },
        {
          group: "nodes",
          data: { id: "n4", name: "V4", label: "Person" },
          position: { x: 350, y: 700 }
        },
        {
          group: "nodes",
          data: { id: "n5", name: "V5", label: "Person" },
          position: { x: 250, y: 500 }
        },
        { group: "edges", data: { id: "e0", source: "n0", target: "n1" } },
        { group: "edges", data: { id: "e1", source: "n1", target: "n2" } },
        { group: "edges", data: { id: "e2", source: "n2", target: "n3" } },
        { group: "edges", data: { id: "e3", source: "n3", target: "n4" } },
        { group: "edges", data: { id: "e4", source: "n4", target: "n5" } },
        { group: "edges", data: { id: "e5", source: "n5", target: "n0" } },
        { group: "edges", data: { id: "e6", source: "n0", target: "n3" } },
        { group: "edges", data: { id: "e7", source: "n1", target: "n4" } }
      ]);
      eles.animate(
        {
          position: { x: 350, y: 300 },
          style: { backgroundColor: "black" }
        },
        {
          duration: 4000
        }
      );
      setTimeout(function() {
        eles.stop(false, false);
      }, 1000);
      // cy.center();
      var png64 = cy.png();
      // put the png data in an img tag
      document.querySelector("#png-eg").setAttribute("src", png64);
    },

    addpoint() {
      var cy = this.$cytoscape({
        container: document.getElementById("cy"),
        style: [
          {
            selector: 'node[label = "Person"]',
            css: { "background-color": "#6FB1FC", content: "data(name)" }
          },
          {
            selector: 'node[label = "Movie"]',
            css: { "background-color": "#F5A45D", content: "data(title)" }
          },
          {
            selector: "edge",
            css: {
              content: "data(relationship)",
              "curve-style": "bezier",
              "target-arrow-shape": "triangle",
              "target-arrow-color": "#800080",
              "line-color": "	#800080",
              "arrow-scale": "1",
              "line-cap": "round"
            }
          }
        ],
        elements: {
          nodes: [
            { data: { id: "172", name: "Tom Cruise", label: "Person" } },
            { data: { id: "183", title: "Top Gun", label: "Movie" } }
          ],
          edges: [
            { data: { source: "172", target: "183", relationship: "Acted_In" } }
          ]
        },
        layout: { name: "grid" }
      });

      var eles = cy.add([
        { group: "nodes", data: { id: "n0" }, position: { x: 200, y: 300 } },
        { group: "nodes", data: { id: "n1" }, position: { x: 300, y: 300 } },
        { group: "edges", data: { id: "e0", source: "n0", target: "n1" } }
      ]);
      // cy.center();
      var png64 = cy.png();
      // put the png data in an img tag
      document.querySelector("#png-eg").setAttribute("src", png64);
    },
    changing_over() {
      let _this = this;
      var cy = this.$cytoscape({
        container: document.getElementById("cy"),
        boxSelectionEnabled: false,
        autounselectify: true,
        style: [
          {
            selector: 'node[label = "bird"]',
            css: {
              "background-image":
                "https://live.staticflickr.com/7272/7633179468_3e19e45a0c_b.jpg"
            }
          },
          {
            selector: 'node[label = "cat"]',
            css: {
              "background-image":
                "https://live.staticflickr.com/1261/1413379559_412a540d29_b.jpg"
            }
          },
          {
            selector: 'node[label = "ladybug"]',
            css: {
              "background-image":
                "https://live.staticflickr.com/3063/2751740612_af11fb090b_b.jpg"
            }
          },
          {
            selector: 'node[label = "aphid"]',
            css: {
              "background-image":
                "https://live.staticflickr.com/8316/8003798443_32d01257c8_b.jpg"
            }
          },
          {
            selector: 'node[label = "rose"]',
            css: {
              "background-image":
                "https://live.staticflickr.com/5109/5817854163_eaccd688f5_b.jpg"
            }
          },
          {
            selector: 'node[label = "grasshopper"]',
            css: {
              "background-image":
                "https://live.staticflickr.com/6098/6224655456_f4c3c98589_b.jpg"
            }
          },
          {
            selector: 'node[label = "plant"]',
            css: {
              "background-image":
                "https://live.staticflickr.com/3866/14420309584_78bf471658_b.jpg"
            }
          },

          {
            selector: 'node[label = "wheat"]',
            css: {
              "background-image":
                "https://live.staticflickr.com/2660/3715569167_7e978e8319_b.jpg"
            }
          },
          {
            selector: "edge",
            css: {
              "curve-style": "bezier",
              width: 6,
              "target-arrow-shape": "triangle",
              "line-color": "#f3715c",
              "target-arrow-color": "#f3715c"
            }
          },
          {
            selector: "node",
            css: {
              height: 80,
              width: 80,
              "background-fit": "cover",
              "border-color": "#000",
              "border-width": 3,
              "border-opacity": 0.5
            }
          },
          {
            selector: ".eating",
            css: {
              "border-color": "#aa2116"
            }
          },
          {
            selector: ".eater",
            css: {
              "border-width": 9
            }
          }
        ],
        elements: {
          nodes: [
            { data: { id: "cat", label: "cat" } },
            { data: { id: "bird", label: "bird" } },
            { data: { id: "ladybug", label: "ladybug" } },
            { data: { id: "aphid", label: "aphid" } },
            { data: { id: "rose", label: "rose" } },
            { data: { id: "grasshopper", label: "grasshopper" } },
            { data: { id: "plant", label: "plant" } },
            { data: { id: "wheat", label: "wheat" } }
          ],
          edges: [
            { data: { source: "cat", target: "bird" } },
            { data: { source: "bird", target: "ladybug" } },
            { data: { source: "bird", target: "grasshopper" } },
            { data: { source: "grasshopper", target: "plant" } },
            { data: { source: "grasshopper", target: "wheat" } },
            { data: { source: "ladybug", target: "aphid" } },
            { data: { source: "aphid", target: "rose" } }
          ]
        },
        layout: {
          name: "breadthfirst",
          directed: true,
          padding: 10
        }
      }); // cy init
      cy.on("tap", "node", function() {
        var nodes = this;
        var tapped = nodes;
        var food = [];
        nodes.addClass("eater");
        for (;;) {
          //connectedEdges()获取连接到集合中节点的边。el为事件对象
          var connectedEdges = nodes.connectedEdges(function(el) {
            return !el.target().anySame(nodes);
          });
          var connectedNodes = connectedEdges.targets();
          Array.prototype.push.apply(food, connectedNodes);
          nodes = connectedNodes;
          if (nodes.empty()) {
            break;
          }
        }
        var delay = 0;
        var duration = 500;
        for (var i = food.length - 1; i >= 0; i--) {
          (function() {
            var thisFood = food[i];
            var eater = thisFood
              .connectedEdges(function(el) {
                return el.target().same(thisFood);
              })
              .source();
            thisFood
              .delay(delay, function() {
                eater.addClass("eating");
              })
              .animate(
                {
                  position: eater.position(),
                  css: {
                    width: 10,
                    height: 10,
                    "border-width": 0,
                    opacity: 0
                  }
                },
                {
                  duration: duration,
                  complete: function() {
                    thisFood.remove();
                  }
                }
              );
            delay += duration;
          })();
        }
      });
      var x1 = cy.$("cat").position("x");
      var y1 = cy.$("cat").position("y");
      cy.nodes().animate(
        {
          position: { x: x1, y: y1 },
          style: { backgroundColor: "red" }
        },
        {
          duration: 3000
        }
      );
      setTimeout(function() {
        cy.nodes().stop(false, false);
      }, 1200);
      var png64 = cy.png();
      // put the png data in an img tag
      document.querySelector("#png-eg").setAttribute("src", png64);
    },
    createcxtmenue() {
      var cy = this.$cytoscape({
        container: document.getElementById("cy"),
        ready: function() {},
        style: [
          {
            selector: "node",
            css: {
              content: "data(name)"
            }
          },
          {
            selector: "edge",
            css: {
              "curve-style": "bezier",
              "target-arrow-shape": "triangle"
            }
          }
        ],
        elements: {
          nodes: [
            { data: { id: "j", name: "Jerry" } },
            { data: { id: "e", name: "Elaine" } },
            { data: { id: "k", name: "Kramer" } },
            { data: { id: "g", name: "George" } }
          ],
          edges: [
            { data: { source: "j", target: "e" } },
            { data: { source: "j", target: "k" } },
            { data: { source: "j", target: "g" } },
            { data: { source: "e", target: "j" } },
            { data: { source: "e", target: "k" } },
            { data: { source: "k", target: "j" } },
            { data: { source: "k", target: "e" } },
            { data: { source: "k", target: "g" } },
            { data: { source: "g", target: "j" } }
          ]
        }
      });
      cy.cxtmenu({
        selector: "node, edge",
        commands: [
          {
            content: '<span class="fa fa-flash fa-2x"></span>',
            select: function(ele) {
              console.log(ele.id());
            }
          },
          {
            content: '<span class="fa fa-star fa-2x"></span>',
            select: function(ele) {
              console.log(ele.data("name"));
            },
            enabled: false
          },
          {
            content: "Text",
            select: function(ele) {
              console.log(ele.position());
            }
          }
        ]
      });
      cy.cxtmenu({
        selector: "core",
        commands: [
          {
            content: "bg1",
            select: function() {
              console.log("bg1");
            }
          },
          {
            content: "bg2",
            select: function() {
              console.log("bg2");
            }
          }
        ]
      });
    },

    create_edgehandles() {
      var cy = this.$cytoscape({
        container: document.getElementById("cy"),
        layout: {
          name: "grid",
          rows: 2,
          cols: 2
        },
        style: [
          {
            selector: "node[name]",
            style: {
              content: "data(name)"
            }
          },
          {
            selector: "edge",
            style: {
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
          nodes: [
            { data: { id: "j", name: "Jerry" } },
            { data: { id: "e", name: "Elaine" } },
            { data: { id: "k", name: "Kramer" } },
            { data: { id: "g", name: "George" } }
          ],
          edges: [
            { data: { source: "j", target: "e" } },
            { data: { source: "j", target: "k" } },
            { data: { source: "j", target: "g" } },
            { data: { source: "e", target: "j" } },
            { data: { source: "e", target: "k" } },
            { data: { source: "k", target: "j" } },
            { data: { source: "k", target: "e" } },
            { data: { source: "k", target: "g" } },
            { data: { source: "g", target: "j" } }
          ]
        }
      });
      var eh = cy.edgehandles();
      document.querySelector("#draw-on").addEventListener("click", function() {
        eh.enableDrawMode();
      });
      document.querySelector("#draw-off").addEventListener("click", function() {
        eh.disableDrawMode();
      });
      document.querySelector("#start").addEventListener("click", function() {
        eh.start(cy.$("node:selected"));
      });
    }
  }
};
</script>

<style>
#cy {
  height: 800px;
  width: 900px;
}

#eat {
  position: absolute;
  left: 1em;
  top: 1em;
  font-size: 1em;
  z-index: -1;
  color: #000000;
}

#cy canvas {
  left: 0 !important;
}

.analyze_bnt {
  margin-bottom: 10px;
  margin-top: 10px;
  border-color: #508a88;
  color: #508a88;
  text-align: center;
  width: 130px;
  height: 35px;
}
</style>