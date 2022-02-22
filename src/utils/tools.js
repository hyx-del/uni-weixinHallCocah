const tabBar = [
	'/pages/index/index',
	'/pages/news/index',
	'/pages/reservation/index',
	'/pages/user/home/index',
];
// type 0 switchTab(导航栏跳转) 1 navigateTo(普通跳转)  2 redirectTo
// isLogin是否需要登录
export const jumps = (url, obj = {}, { type = 1, isLogin = false, routing = true } = {}) => {
	if (!url) return;
	if (typeof url == 'object') {
		url = url.url;
	}
	let toUrl = url;
	// 检查斜杠
	toUrl = toUrl.slice(0, 1) != '/' ? '/' + toUrl : toUrl;
	// 判断跳转是否是taber
	if (tabBar.includes(url) && type == 1) {
		type = 0;
	}
	// 如果是tab没有参数,组装参数
	if (!tabBar.includes(url)) {
		let arrObj = {};
		if (routing) {
			let pages = getCurrentPages();
			let curPage = pages[pages.length - 1];
			let params = curPage.options || curPage.$route.query;
			arrObj = { ...params, ...obj };
		}
		if (arrObj) {
			let arr = [];
			for (let key in arrObj) {
				arr.push(`${key}=${arrObj[key]}`);
			}
			if (arr.length > 0) {
				toUrl += '?' + arr.join('&');
			}
		}
	}
	if (type == 1) {
		uni.navigateTo({
			url: toUrl,
		});
	} else if (type == 0) {
		uni.switchTab({
			url: toUrl,
		});
	} else if (type == 2) {
		uni.redirectTo({
			url: toUrl,
		});
	}
};

/**
 * @description 获取当前页url
 */
export const getCurrentPageUrl = () => {
	let pages = getCurrentPages();
	let currentPage = pages[pages.length - 1];
	let url = currentPage.route;
	return url;
};

// 返回上一页,路由上一级不存在会跳到首页
export const backPage = (n = 1) => {
	let pages = getCurrentPages();
	if (pages.length == 1) {
		console.log(12);
		jumps('/pages/index/index');
	} else {
		uni.navigateBack({ delta: n > pages.length - 1 ? pages.length : n });
	}
};

/*
 * jp 在没有登录时是否需要跳转到登录页面
 * callBack在已经登录时执行的回调
 * 返回值true代表需要登录
 * */
export const isToLogin = (callBack, jp = true) => {
	let token = uni.getStorageSync('token') || '';
	if (token.length < 20) {
		if (jp) {
			let path = getCurrentPageUrl();
			if (!path.includes('login')) {
				uni.navigateTo({
					url: '/pages/login/index',
				});
			}
		}
		return true;
	} else {
		callBack && callBack();
		return false;
	}
};
1;
2;
3;
4;
5;
6;
7;
8;
9;
10;
11;
12;
13;
14;
15;
16;
17;
18;
19;
20;
21;
22;
23;
24;
25;
26;
27;
28;
29;
30;
31;
32;
33;
34;
35;
36;
37;
38;
39;
40;
41;
42;
43;
44;
45;
46;
47;
48;
49;
50;
51;
52;
53;
54;
55;
56;
57;
58;
59;
60;
61;
62;
63;
64;
65;
66;
67;
68;
69;
70;
71;
72;
73;
74;
75;
76;
77;
78;
79;
80;
81;
82;
83;
84;
85;
86;
87;
88;
89;
90;
91;
92;
93;
94;
export const yearDiff = (startTime, endTime) => {
	let flag = [1, 3, 5, 7, 8, 10, 12, 4, 6, 9, 11, 2];
	let start = new Date(startTime);
	let end = new Date(endTime);
	let year = end.getFullYear() - start.getFullYear();
	let month = end.getMonth() - start.getMonth();
	let day = end.getDate() - start.getDate();
	if (month < 0) {
		year--;
		month = end.getMonth() + (12 - start.getMonth());
	}
	if (day < 0) {
		if (month == 0) {
			year--;
			month = 11;
		} else {
			month--;
		}
		let index = flag.findIndex(temp => {
			return temp === start.getMonth() + 1;
		});
		let monthLength;
		if (index <= 6) {
			monthLength = 31;
		} else if (index > 6 && index <= 10) {
			monthLength = 30;
		} else {
			monthLength = 28;
		}
		day = end.getDate() + (monthLength - start.getDate());
	}
	// console.log(`相差${year}年${month}月${day}天`)
	return {
		year,
		month,
		day,
	};
};
// 身份证号验证
export const isCardID = sId => {
	sId = sId + '';
	sId = sId.replace('x', 'X');
	if (!/(^\d{15}$)|(^\d{17}(\d|X|x)$)/.test(sId)) {
		return {
			valid: false,
			error: '长度不是15位或者18位',
		};
	}

	//身份证省市
	var aCity = {
		11: '北京市',
		12: '天津市',
		13: '河北',
		14: '山西',
		15: '内蒙古',
		21: '辽宁',
		22: '吉林',
		23: '黑龙江',
		31: '上海',
		32: '江苏',
		33: '浙江',
		34: '安徽',
		35: '福建',
		36: '江西',
		37: '山东',
		41: '河南',
		42: '湖北',
		43: '湖南',
		44: '广东',
		45: '广西',
		46: '海南',
		50: '重庆',
		51: '四川',
		52: '贵州',
		53: '云南',
		54: '西藏',
		61: '陕西',
		62: '甘肃',
		63: '青海',
		64: '宁夏',
		65: '新疆',
		71: '台湾',
		81: '香港',
		82: '澳门',
		91: '国外',
	};
	if (!aCity[parseInt(sId.substr(0, 2))]) {
		return {
			valid: false,
			error: '省市区不对',
		};
	}
	let province = aCity[parseInt(sId.substr(0, 2))];
	let idCode = sId.substr(0, 6);
	// 出生日期验证
	var sBirthday = (
			sId.substr(6, 4) +
			'-' +
			Number(sId.substr(10, 2)) +
			'-' +
			Number(sId.substr(12, 2))
		).replace(/-/g, '/'),
		d = new Date(sBirthday);
	if (sBirthday != d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate()) {
		return {
			valid: false,
			error: '出生日期不对',
		};
	}
	let birthday = sId.substr(6, 4) + '-' + sId.substr(10, 2) + '-' + sId.substr(12, 2);
	let { year, month, day } = yearDiff(birthday, new Date());
	// 身份证号码校验
	var sum = 0,
		weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
		codes = '10X98765432';
	for (var i = 0; i < sId.length - 1; i++) {
		sum += sId[i] * weights[i];
	}
	var last = codes[sum % 11]; //计算出来的最后一位身份证号码
	if (sId[sId.length - 1] != last) {
		return {
			valid: false,
			error: '格式不对',
		};
	}
	let sex = sId.substr(sId.length - 2, 1) % 2 == 1 ? '男' : '女';
	return {
		valid: true,
		age: year,
		ageStr: `${year}年${month}月${day}天`,
		sex,
		birthday,
		idCode,
		province,
	};
};
