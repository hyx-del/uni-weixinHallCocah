<template>
   <view class="container page-bg">
      <cu-custom bgColor="bg-white"
                 :isBack="true">
         <block slot="content">{{ hasComment ? '我的评价' : '评价' }}</block>
      </cu-custom>

      <view class="page-content-outer">
         <view class="page-content-inner">
            <view class="course">
               <view class="avatar">
                  <image :src="detail.coachPortrait" />
               </view>
               <view class="info">
                  <view class="name">{{ detail.courseName }}</view>
                  <view class="desc mt16">{{ detail.coachName }}</view>
               </view>
            </view>
            <view class="star-wrap"
                  :class="starClass">
               <view v-for="(item, index) in 5"
                     :key="item"
                     class="star-item"
                     :class="star >= index + 1 ? 'cuIcon-favorfill' : 'cuIcon-favor'"
                     @click="checkStar(index)"></view>
            </view>
            <view class="star-text"
                  v-if="star">
               <text class="color1"
                     v-if="star == 1">非常差</text>
               <text class="color1"
                     v-if="star == 2">差</text>
               <text class="color2"
                     v-if="star == 3">一般</text>
               <text class="color2"
                     v-if="star == 4">很棒</text>
               <text class="color3"
                     v-if="star == 5">超赞</text>
            </view>
            <view class="star-text"
                  v-else></view>

            <view class="tags"
                  v-if="!hasComment && star">
               <view class="tags-item-inner"
                     v-for="(item, index) in tags"
                     :key="index">
                  <view class="tags-item"
                        :class="item.checked ? 'checked' : ''"
                        :data-index="index"
                        @click="tagCheck">{{ item.name }}</view>
               </view>
            </view>
            <view class="tags"
                  v-if="hasComment">
               <view class="tags-item-inner"
                     v-for="(item, index) in comment.tags"
                     :key="index">
                  <view class="tags-item checked">{{ item.name }}</view>
               </view>
            </view>

            <view v-if="!hasComment">
               <textarea class="textarea"
                         v-model="message"
                         placeholder="写下您对本堂课的感受吧~"></textarea>
               <button class="cu-btn comment-btn bg-primary"
                       @click="submitCommentVaild">提交评价</button>
            </view>
            <view v-else>
               <view class="comment-content">{{ comment.content || '' }}</view>
               <view class="reply"
                     v-if="comment.replyAt">
                  <view class="reply_content">管理员回复：{{ comment.replyContent }}</view>
                  <view class="reply_date">{{ comment.replyAt }}</view>
               </view>
            </view>
         </view>
      </view>
   </view>
</template>
<script>
   import { mapState } from 'vuex';
   export default {
      data() {
         return {
            tags: [],
            allTags: [],
            star: 0,
            message: '',
            detail: {},
            hasComment: false,
            comment: {},
            ossResize: '?x-oss-process=image/resize,m_fill,w_300,h_300',

         };
      },
      computed: {
         ...mapState(['ossPath', 'memberId']),
         starClass() {
            if (this.star <= 2) {
               return 'color1';
            } else if (this.star <= 4) {
               return 'color2';
            } else {
               return 'color3';
            }
         },
      },
      async onLoad(options) {
         // if (options.id) {
         //    this.hasComment = false;
         //    this.getBookingDetail(options.id);
         // } else if (options.orderId) {
         //    this.hasComment = true;
         //    this.getBookingDetail(options.orderId);
         //    this.getCommentDetail(options.orderId);
         // }

         this.getBookingDetail(options.orderId);
         this.getCommentDetail(options.orderId);
      },
      methods: {
         getBookingDetail(id) {
            this.detail = uni.getStorageSync("makeDetail")
            this.hasComment = this.detail.commentStatus ? true : false
            console.log(this.detail);
            // let params = {
            //    coursePlanOrderId: 3015747859286918,
            // };
            // this.api
            //    .get('/api/hall/course/plan/comment/detail', params, this.$other)
            //    .then(data => {
            //         this.detail = data || {};
            //       if (!data.code) {

            //       } else {
            //          uni.navigateBack({
            //             delta: 1,
            //          });
            //       }
            //    })

         },
         getCommentDetail(orderId = '') {
            let params = {
               coursePlanOrderId: orderId,
            };
            this.api.get('/api/hall/course/plan/comment/detail', params, this.$other).then(data => {
               if (!data.tags) {
                  data.tags = [];
               }
               if (this.hasComment) this.star = data.coachScore;
               if (!this.hasComment) this.getCommentTags();
               this.comment = data;
            });
         },
         //todo
         getCommentTags() {
            this.api.get('/api/hall/course/plan/comment/tags',{},this.$other).then(data => {
               (data || []).forEach(item => {
                  item.checked = false;
               });
               this.allTags = data || [];
            });
         },
         submitCommentVaild() {
            if (!this.star) {
               uni.showToast({
                  icon: 'none',
                  title: '请选择评分',
               });
               return;
            } else if (!this.message || !this.message.trim()) {
               uni.showModal({
                  title: '确认信息',
                  content: '确定不填写评价直接提交？',
                  showCancel: true,
                  success: res => {
                     if (res.confirm) {
                        this.submitComment();
                     }
                  },
               });
               return;
            }
            this.submitComment();
         },
         submitComment() {//后端问题
            let params = {
               coachId: this.detail.coachId,
               hallId: this.detail.hallId,
               coachScore: this.star,
               // comment_tags: [],
               content: this.message,
               "courseId": this.detail.courseId,
               "coursePlanOrderId": this.detail.coursePlanOrderId,
            };
            let tags = this.tags.filter(item => item.checked).map(item => item.id);
            params.comment_tags = tags || [];
            this.api.post('/api/hall/course/plan/comment/create', params, this.$other).then(ret => {
               uni.showToast({
                  icon: 'none',
                  duration: 2000,
                  title: '评论成功',
                  complete: () => {
                     uni.navigateBack({
                        delta: 1,
                     });
                  },
               });
            });
         },
         checkStar(index) {
            if (this.hasComment) {
               return;
            }
            this.star = parseInt(index) + 1;
            this.tags = this.allTags
               .filter(item => item.matchScore == this.star)
               .map(item => {
                  return Object.assign({}, item);
               });
         },
         tagCheck(event) {
            const { index } = event.target.dataset;
            // this.tags.forEach(tag => {
            //     tag.checked = false;
            // })
            this.tags[index].checked = !this.tags[index].checked;
         },
      },
   };
</script>
<style lang="scss">
   .page-content-outer {
      width: 100%;
      flex: 1;
      padding: 32upx;
      display: flex;
      flex-direction: column;
   }
   .page-content-inner {
      background-color: white;
      border-radius: 16upx;
      padding: 0 32upx;
      flex: 1;
   }
   .course {
      display: flex;
      padding: 32upx 0;
      .avatar {
         width: 132upx;
         height: 132upx;
         background-color: #f1f1f1;
         image {
            width: 100%;
            height: 100%;
         }
      }
      .info {
         margin-left: 24upx;
         flex: 1;
         display: flex;
         flex-direction: column;
         // align-items: center;
         justify-content: center;
         .name {
            font-size: 30upx;
            color: #222527;
         }
         .desc {
            font-size: 24upx;
            color: #636f7c;
         }
      }
   }
   .star-wrap {
      display: flex;
      font-size: 40upx;
      justify-content: center;
      margin-top: 28upx;
      &.color1 {
         color: #9da7b1;
      }
      &.color2 {
         color: #ffd000;
      }
      &.color3 {
         color: #ff755d;
      }
      .star-item {
         margin: 0 4upx;
      }
   }
   .star-text {
      margin-top: 24upx;
      display: flex;
      justify-content: center;
      height: 40upx;
      line-height: 40upx;
      .color1 {
         color: #9da7b1;
      }
      .color2 {
         color: #ffbc00;
      }
      .color3 {
         color: #ff755d;
      }
   }
   .mt16 {
      margin-top: 16upx;
   }
   .tags {
      margin-bottom: 16upx;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      margin-top: 60upx;
      &-item {
         display: inline-block;
         background: #ffffff;
         border: 1px solid #999999;
         border-radius: 8upx;
         padding: 12upx 16upx;
         color: rgba(0, 0, 0, 0.45);
         // line-height: 38upx;
         &-inner {
            padding: 0 12upx;
            margin-bottom: 24upx;
         }
         &.checked {
            border-color: #f08336;
            color: #f08336;
            background-color: rgba(240, 131, 54, 0.1);
         }
      }
   }
   .comment-content {
      color: #222527;
      margin-bottom: 24upx;
   }
   .reply {
      background: #fafafa;
      border-radius: 8px;
      margin-top: 12upx;
      padding: 24upx;
      position: relative;
      &::before {
         content: " ";
         position: absolute;
         top: -8upx;
         left: 32upx;
         width: 16upx;
         height: 16upx;
         background: #fafafa;
         transform: rotate(45deg);
      }
      .reply_content {
         color: #222527;
         margin-bottom: 24upx;
      }
      .reply_date {
         color: rgba(0, 0, 0, 0.35);
         text-align: right;
      }
   }

   .textarea {
      width: 100%;
      height: 228upx;
      background: #ffffff;
      border: 1px solid #cccccc;
      border-radius: 8upx;
      padding: 24upx;
      &:focus {
         border-color: #f08336;
      }
      &::-webkit-input-placeholder {
         color: rgba(0, 0, 0, 0.25);
      }
   }

   .bg-primary {
      background: #f08336;
   }
   .comment-btn {
      background: #f08336;
      width: 100%;
      height: 94upx;
      border-radius: 8upx;
      font-size: 32upx;
      color: #ffffff;
      margin-top: 40upx;
   }
</style>
