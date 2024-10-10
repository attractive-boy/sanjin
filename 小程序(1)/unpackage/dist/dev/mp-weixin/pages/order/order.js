"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      currentIndex: 0,
      tabs: [
        {
          title: "全部",
          description: "这是标签 1 的内容"
        },
        {
          title: "已登记",
          description: "这是标签 2 的内容"
        },
        {
          title: "已核卡",
          description: "这是标签 3 的内容"
        },
        {
          title: "已完成",
          description: "这是标签 3 的内容"
        },
        {
          title: "未通过",
          description: "这是标签 3 的内容"
        },
        {
          title: "已失效",
          description: "这是标签 3 的内容"
        },
        {
          title: "非新客户",
          description: "这是标签 3 的内容"
        }
      ]
    };
  },
  methods: {
    selectTab(index) {
      this.currentIndex = index;
    }
  }
};
if (!Array) {
  const _easycom_uni_search_bar2 = common_vendor.resolveComponent("uni-search-bar");
  _easycom_uni_search_bar2();
}
const _easycom_uni_search_bar = () => "../../uni_modules/uni-search-bar/components/uni-search-bar/uni-search-bar.js";
if (!Math) {
  _easycom_uni_search_bar();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o(_ctx.search),
    b: common_vendor.o(_ctx.blur),
    c: common_vendor.o(_ctx.focus),
    d: common_vendor.o(_ctx.input),
    e: common_vendor.o(_ctx.cancel),
    f: common_vendor.o(_ctx.clear),
    g: common_vendor.o(($event) => _ctx.searchValue = $event),
    h: common_vendor.p({
      focus: true,
      modelValue: _ctx.searchValue
    }),
    i: common_vendor.f($data.tabs, (tab, index, i0) => {
      return {
        a: common_vendor.t(tab.title),
        b: index,
        c: common_vendor.o(($event) => $options.selectTab(index), index),
        d: $data.currentIndex === index ? 1 : ""
      };
    }),
    j: `translateX(${$data.currentIndex * (1200 / $data.tabs.length)}%)`,
    k: common_assets._imports_0$1
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-93207a4f"]]);
wx.createPage(MiniProgramPage);
