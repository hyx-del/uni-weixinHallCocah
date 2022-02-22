<template>
  <view class="container">
    <cu-custom bgColor="bg-white" :isBack="true"
      ><block slot="content">明细</block></cu-custom
    >
    <view class="logs">
      <view class="logs__item" v-for="item in list" :key="item">
        <view class="title">
          {{ item.type==50?'充值':'余额调整' }}
        </view>
        <view class="info">
          <view class="date">{{ item.createdAt }}</view>
          <view class="plus" v-if="item.isPlus">
            <text>+</text>
            <text>{{ item.amount }}</text>
          </view>
          <view class="minus" v-else>
            <!-- <text>-</text> -->
            <text>{{ item.amount }}</text>
          </view>
        </view>
      </view>
    </view>
    <view class="no-data" v-if="!list.length">暂无数据</view>
  </view>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      list: [],
      isLoaded: false,
      pageIndex: 1,
      pageSize: 20,
      hasMore: false,
    };
  },
  computed: mapState(["memberId"]),
  onLoad() {
    this.getList(true);
  },
  onReachBottom() {
    if (!this.hasMore) return;
    this.getList();
  },
  methods: {
    getList(isReset = false) {
      let params = {
        current: isReset ? 1 : this.pageIndex + 1,
        size: this.pageSize,
      };
      this.api.get("/api/hall/charge/list", params, this.$other).then((ret) => {
        let data = ret || [];
        (data.records || []).forEach((item) => {
          if (parseFloat(item.amount) > 0) {
            item.isPlus = true;
          }
        });

        this.pageIndex = ret.current;
        if (ret.pages > ret.current) {
          this.hasMore = true;
        } else {
          this.hasMore = false;
        }

        this.list = this.list.concat(data.records);
        this.isLoaded = true;
      });
    },
  },
};
</script>

<style lang="scss">
.logs {
  &__item {
    padding: 32upx 48upx;
    .title {
      color: #222527;
      font-size: 30upx;
      margin-bottom: 8upx;
    }
    .info {
      display: flex;
    }
    .date {
      flex: 1;
      font-size: 30upx;
      color: #484f55;
      letter-spacing: 0;
    }
    .plus {
      color: #f08336;
    }
    .minus {
      color: #222527;
    }
  }
}
</style>
