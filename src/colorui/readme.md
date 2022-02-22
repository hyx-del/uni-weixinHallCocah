#button

#####按钮状态
| 状态\象限  | 类 |
| --- | ---------- |
|  不可点击状态(有色)  | cant |
|  不可点击状态  |   disable        |
|  置灰状态  |      gray     |
|  镂空状态(灰色)  |    empty   |
|  镂空状态(有色)  |     same      |
#####按钮象限
| 主题\象限  | 大(88) | 中(78) | 小(64) | 迷你(48) |
| --- | ---------- | ------------ | ---------- | ---------- |
|  默认(主题色)  | btn_main_s88 | btn_main_s78 | btn_main_s64 | btn_main_s64 |
|  默认(副色)  |     btn_vice_s88 | btn_vice_s78 | btn_vice_s64 | btn_vice_s64 |
|  长按钮(主题色)  |  btn_long_main_s88 | btn_long_main_s78 | btn_long_main_s64 | btn_long_main_s64      |
|  长按钮(副色)  |   btn_long_vice_s88 | btn_long_vice_s78 | btn_long_vice_s64 | btn_long_vice_s64|

###使用按钮
引入文件
```
@import '~@/asset/UIComponent.scss
或者
@import '~@/asset/common.scss
```
html里：
直接复制一个类，后面跟状态：
例如 长按钮副色尺寸大，需要一个镂空的样式：btn_long_vice_big empty，也可以btn_long_vice_big_empty
```
<View className="btn_long_vice_big empty">按钮</View>
<View className="btn_long_vice_big_empty">按钮</View>
```
在scss里使用直接继承即可：
```
.btn_test{
  @extend %btn_long_main_big_cant;
}
```


