"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      goDetail() {
        common_vendor.index.navigateTo({
          url: "/pages/about/agreement/agreement"
        });
      },
      goPolicy() {
        common_vendor.index.navigateTo({
          url: "/pages/about/policy/policy"
        });
      }
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
    a: common_assets._imports_0$3,
    b: common_vendor.p({
      type: "right",
      size: "30"
    }),
    c: common_vendor.o((...args) => $data.goDetail && $data.goDetail(...args)),
    d: common_vendor.p({
      type: "right",
      size: "30"
    }),
    e: common_vendor.o((...args) => $data.goPolicy && $data.goPolicy(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-13a78ac6"]]);
wx.createPage(MiniProgramPage);
