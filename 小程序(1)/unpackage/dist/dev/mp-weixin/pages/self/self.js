"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      searchVal: "",
      tableData: {
        url: "../../static/head.png",
        name: "sanjin",
        tel: 15922223333,
        cardNum: 12214412124412
      },
      // 每页数据量
      pageSize: 10,
      // 当前页
      pageCurrent: 1,
      // 数据总量
      total: 0,
      loading: false
    };
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.tableData.url,
    b: common_vendor.p({
      type: "right",
      size: "30"
    }),
    c: common_vendor.t($data.tableData.name),
    d: common_vendor.p({
      type: "right",
      size: "30"
    }),
    e: common_vendor.t($data.tableData.tel),
    f: common_vendor.p({
      type: "right",
      size: "30"
    }),
    g: common_vendor.t($data.tableData.cardNum),
    h: common_vendor.p({
      type: "right",
      size: "30"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-f94a969d"]]);
wx.createPage(MiniProgramPage);
