<template>
    <view class="container page-bg">
        <cu-custom bgColor="bg-white" :isBack="true">
            <block slot="backText">返回</block>
            <block slot="content">修改信息</block>
        </cu-custom>
        <view class="page-content">
            <template v-if="isGender">
                <view class="cu-form-group" v-for="(item, index) in genders" :key="index" :data-index="index" @tap="checkedGender">
                    <view class="title">{{ item.label }}</view>
                    <view class="checked">
                        <text v-if="item.checked" class="cuIcon-check lg"></text>
                    </view>
                </view>

            </template>
            <template v-else-if="isAddress">
                <view class="input-wrapper">
                    <!-- <input v-model="address" placeholder="请输入地址" /> -->
                    <textarea class="text" :value="address" placeholder="请输入地址" @input="addressChange" @confirm="confirmAddress" />
                </view>
            </template>
            <template v-else-if="isBirthday">
                <view class="input-wrapper">
                    <picker mode="date" :value="date" @change="dateChange">
                        <view class="picker">
                            <view class="picker-value" :class="date ? '' : 'no-data'">
                                {{ date ? date : '请选择生日' }}
                            </view>
                            <view class="cuIcon-right right-icon"></view>
                        </view>
                    </picker>
                </view>
            </template>

            <view class="btns-wrap">
                <button class="cu-btn bg-primary" @tap="confirm">完成</button>
            </view>
        </view>
    </view>
</template>
<script>
import { mapState } from 'vuex';
export default {
    data() {
        return {
            isGender: false,
            isAddress: false,
            isBirthday: false,
            address: '',
            birthday : '',
            date: '',
            genders: [{ label: "男", value: 1, checked: false}, { label: "女", value: 2, checked: false}],
        }
    },
    computed: mapState(['memberId']),
    onLoad(options) {
        if (options.gender) {
            this.isGender = true;
        } else if (options.address) {
            this.isAddress = true;
        } else if (options.birthday) {
            this.isBirthday = options.birthday;
        }

        let data = uni.getStorageSync("memberInfo");
        let memberInfo = JSON.parse(data);
        if (memberInfo.gender) {
            this.genders.forEach(item => {
                if (item.value == memberInfo.gender) {
                    item.checked = true;
                }
            })
        }
        this.address = memberInfo.address;
        if (memberInfo.birthday) {
            this.date = memberInfo.birthday;
        }

    },
    methods: {
        checkedGender(event) {
            const { index } = event.currentTarget.dataset;
            this.genders.forEach(item => {
                item.checked = false;
            })
            this.genders[index].checked = true;
        },
        dateChange(event) {
            this.date = event.detail.value;
        },
        addressChange(event) {
            this.address = event.detail.value;
        },
        confirmAddress(event) {
            this.address = event.detail.value;
            this.confirm();
        },
        confirm() {
            let params = {};
            if (this.isGender) {
                let selectedGender = this.genders.find(item => item.checked);
                if (!selectedGender) {
                    uni.showToast({
                        title: "请选择性别",
                    })
                    return ;
                }
                params.gender =  selectedGender.value;
            } else if (this.isAddress) {
                if (!this.address) {
                    uni.showToast({
                        title: "请输入地址",
                    })
                    return ;
                }
                params.address = this.address;
            } else if (this.isBirthday) {
                params.birthday = this.date;
            }
           this.api.put("/api/hall/member/member/info", params, this.$other).then(ret => {
                if(ret.code!=200){
                    uni.showToast({
                        icon:"none",
                        title: "修改失败",
                    })
                }else{
                  uni.navigateBack({
                    delta: 1,
                  })
                }
                
            })
        }
    }
}
</script>
<style lang="scss">
    .page-content {
        padding-top: 32upx;   
    }
    .btns-wrap {
        margin-top: 160upx;
        padding: 0 175upx;
        button {
            width: 100%;
            border-radius: 20upx;
            height: 100upx;
            line-height: 1;
            font-size: 32upx;
        }
        .bg-primary {
            background: #F08336;
            color: white;
        }
    }
    .cu-form-group {
        .checked {
            font-size: 36upx;
            color: #F08336;
        }
    }
    .input-wrapper {
        padding: 16upx 32upx;
        background: white;
        .text {
            width: 100%;
            height: 160upx;
            padding: 16upx 0;
        }
    }
    .picker {
        width: 100%;
        height: 74upx;
        border-radius: 10upx;
        display: flex;
        align-items: center;
        color: #484F55;
        .no-data {
            color: #999999;
        }
        .right-icon {
            color:#C2C4CA;
        }
    }
    .picker-value {
        flex: 1;
    }
</style>