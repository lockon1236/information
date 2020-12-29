import $ from "jquery";
export default function autoTextMarked(v_html, keyList) {
  if (keyList.length < 1) return;
  var defaults = {
    divFlag: true,
    divStr: "blue",
    markColor: "",
    nullReport: true,
    callback: function () {
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
  $.regTrim = function (s) {
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
    s = s.replace(imp, function (o) {
      return imp_c[o];
    });
    return s;
  };
  // var v_html = this.$refs.selectText.innerHTML;
  // 删除注释
  v_html = v_html.replace(/<!--(?:.*)\-->/g, "");
  //将html
  var tags = /[^<>]+|<(\/?)([A-Za-z]+)([^<>]*)>/g;
  var a = v_html.match(tags);
  var test = 0;
  var _this = this;
  $.each(a, function (i, c) {
    if (!/<(?:.|\s)*?>/.test(c)) {
      // 非标签
      // 开始执行替换
      keyList.map((item, index) => {
        var borderColor = "#f5222d";
        var reg = new RegExp($.regTrim(item), "gi");
        // 保留大小写
        var cliststr = c.match(reg) || [];
        $.each(cliststr, function (ljgk, ljgv) {
          c = c.replace(ljgv, "**" + ljgk + "**");
        });

        $.each(cliststr, function (ljgk, ljgv) {
          c = c.replace("**" + ljgk + "**", "♂" + ljgv + "♀");
        });
        // 以shang为修改
        if (reg.test(c)) {
          test = 1;
        }
        c = c
          .replace(
            /♂/g,
            "<span style='font-weight:600;color:" +
            borderColor +
            "'rel='mark'" +
            clStr +
            ">"
          )
          .replace(/♀/g, "</span>");
        a[i] = c;
      });
    }
  });
  // 将支离数组重组成字符串,当v_html=""会报错
  var content = a.join("");
  return content;
}