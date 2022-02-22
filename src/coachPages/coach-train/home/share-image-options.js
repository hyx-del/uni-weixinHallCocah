export default {
    width: 375,
    height: 500,
    clear: true,
    views: [
        {
            type: 'rect', 
            background: 'white',
            width: 375,
            height: 500,
            top: 0,
            left: 0,
        },
        {
            type: 'image',
            url: 'https://fanyin-oss.fineyoga.com/mini/share-img2.png',
            top: 20,
            left: 20,
            width: 335,
            // height: 167.5
            height: 335
        },
        {
            type: 'text',
            content: '文章标题',
            fontSize: 16,
            color: '#222527',
            textAlign: 'left',
            top: 375,
            left: 20,
            lineHeight: 20,
            MaxLineNumber: 2,
            breakWord: true,
            width: 215
        },
        {
            type: 'text',
            content: '小程序名字',
            fontSize: 14,
            color: '#222527',
            textAlign: 'left',
            top: 460,
            left: 20,
            lineHeight: 20,
            MaxLineNumber: 1,
            breakWord: true,
            width: 215
        },
        {
            type: 'image',
            url: 'https://zhongle-store.oss-cn-hangzhou.aliyuncs.com/mini/mini-program.jpg',
            top: 375,
            left: 255,
            width: 100,
            height: 100
        },
    ]
}
