"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      goSelf() {
        common_vendor.index.navigateTo({
          url: "/pages/self/self"
        });
      },
      goAbout() {
        common_vendor.index.navigateTo({
          url: "/pages/about/about"
        });
      },
      goProduct() {
        common_vendor.index.navigateTo({
          url: "/pages/product/product"
        });
      },
      goMyTeam() {
        console.log(11);
        common_vendor.index.navigateTo({
          url: "/pages/myTeam/myTeam"
        });
      },
      goInvite() {
        common_vendor.index.navigateTo({
          url: "/pages/invite/invite"
        });
      },
      goLogin() {
        common_vendor.index.navigateTo({
          url: "/pages/login/login"
        });
      }
    };
  }
};
if (!Array) {
  const _easycom_uni_section2 = common_vendor.resolveComponent("uni-section");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  (_easycom_uni_section2 + _easycom_uni_icons2)();
}
const _easycom_uni_section = () => "../../uni_modules/uni-section/components/uni-section/uni-section.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (_easycom_uni_section + _easycom_uni_icons)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $data.goLogin && $data.goLogin(...args)),
    b: common_vendor.o((...args) => $data.goSelf && $data.goSelf(...args)),
    c: common_assets._imports_0$2,
    d: common_vendor.p({
      title: "我的收入",
      type: "line"
    }),
    e: common_vendor.p({
      type: "right",
      size: "20"
    }),
    f: common_vendor.p({
      title: "业绩数据",
      type: "line"
    }),
    g: common_vendor.p({
      title: "我的服务",
      type: "line"
    }),
    h: common_assets._imports_1$1,
    i: common_vendor.o((...args) => $data.goMyTeam && $data.goMyTeam(...args)),
    j: common_vendor.p({
      type: "plusempty",
      size: "30"
    }),
    k: common_vendor.o((...args) => $data.goInvite && $data.goInvite(...args)),
    l: common_vendor.p({
      title: "团队服务",
      type: "line"
    }),
    m: common_vendor.o((...args) => $data.goProduct && $data.goProduct(...args)),
    n: common_vendor.o((...args) => $data.goAbout && $data.goAbout(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-2f1ef635"]]);
wx.createPage(MiniProgramPage);
