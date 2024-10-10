"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      indicatorDots: true,
      autoplay: true,
      interval: 2e3,
      duration: 500,
      sideBar: [
        {
          title: "全部",
          description: "这是全部的内容",
          selected: false
        },
        {
          title: "首刷",
          description: "这是首刷的内容",
          selected: false
        },
        {
          title: "激活",
          description: "这是激活的内容",
          selected: false
        },
        {
          title: "核卡",
          description: "这是核卡的内容",
          selected: false
        },
        {
          title: "分级",
          description: "这是分级的内容",
          selected: false
        }
      ],
      selectedItem: null
    };
  },
  methods: {
    selectSide(index) {
      this.sideBar.forEach((item) => {
        item.selected = false;
      });
      this.sideBar[index].selected = true;
    },
    changeIndicatorDots(e) {
      this.indicatorDots = !this.indicatorDots;
    },
    changeAutoplay(e) {
      this.autoplay = !this.autoplay;
    },
    intervalChange(e) {
      this.interval = e.target.value;
    },
    durationChange(e) {
      this.duration = e.target.value;
    }
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
    a: common_vendor.p({
      color: "white",
      type: "location",
      size: "30"
    }),
    b: common_assets._imports_0,
    c: common_assets._imports_1,
    d: $data.indicatorDots,
    e: $data.autoplay,
    f: $data.interval,
    g: $data.duration,
    h: common_assets._imports_0$1,
    i: common_assets._imports_3,
    j: common_vendor.f($data.sideBar, (item, index, i0) => {
      return {
        a: common_vendor.t(item.title),
        b: index,
        c: common_vendor.o(($event) => $options.selectSide(index), index),
        d: item.selected ? 1 : ""
      };
    }),
    k: common_vendor.f(9, (item, index, i0) => {
      return {};
    }),
    l: common_assets._imports_0$1,
    m: common_assets._imports_3
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
