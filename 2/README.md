# 拼豆底稿生成器

<div align="center">
  <img src="./Img//WechatIMG4418.jpg" alt="拼豆底稿生成器 Logo" width="200">
</div>

一个基于微信小程序的拼豆底稿生成工具，可以将图片转换为拼豆图纸，并提供颜色统计和网格参考。

## 主要功能

- 图片上传和预览
- 图片像素化处理
- 调色板选择和颜色匹配
- 网格线显示和自定义
- 颜色统计和计数
- 图纸保存和分享

## 技术栈

### 前端框架
- 微信小程序原生框架
- WXML (WeiXin Markup Language)
- WXSS (WeiXin Style Sheets)
- JavaScript

### 核心技术

#### 图片处理
- Canvas 2D API
  - `createImage()`: 创建图片对象
  - `drawImage()`: 绘制图片
  - `getImageData()`: 获取像素数据
  - `putImageData()`: 写入像素数据
- 离屏画布 (OffscreenCanvas)
  - 用于图片处理和合成
  - 提高性能和内存使用效率

#### 颜色处理
- LAB 色彩空间转换
  - RGB 到 LAB 的色彩空间转换
  - CIE2000 色差公式实现
- 颜色匹配算法
  - 最近邻颜色匹配
  - 颜色合并阈值处理

#### 用户界面
- Flex 布局
- Grid 布局
- 响应式设计
- 自定义组件

### API 使用
- 文件系统 API
  - `wx.chooseMedia`: 选择图片
  - `wx.saveImageToPhotosAlbum`: 保存图片
- 画布 API
  - `wx.createCanvasContext`: 创建画布上下文
  - `wx.canvasToTempFilePath`: 画布转图片
- 系统 API
  - `wx.getSystemInfo`: 获取系统信息
  - `wx.showToast`: 显示提示框
  - `wx.showLoading`: 显示加载提示

### 数据处理
- 图片像素化处理
- 颜色映射和统计
- 网格线生成算法

## 项目结构

```
├── pages/
│   └── index/
│       ├── index.js    # 主页面逻辑
│       ├── index.wxml  # 主页面结构
│       ├── index.wxss  # 主页面样式
│       └── index.json  # 页面配置
├── utils/
│   └── util.js        # 工具函数
├── app.js             # 应用入口
├── app.json           # 应用配置
├── app.wxss           # 应用样式
└── project.config.json # 项目配置
```

## 核心算法

### 图片像素化处理
```javascript
// 将图片按指定大小进行像素化
function pixelateImage(imageData, pixelSize) {
  // 获取区域平均颜色
  // 将相近颜色合并
  // 映射到调色板颜色
}
```

### 颜色匹配
```javascript
// 使用 LAB 色彩空间进行颜色匹配
function findClosestColor(color, palette) {
  // RGB 转 LAB
  // 计算色差
  // 返回最接近的颜色
}
```

### 网格生成
```javascript
// 生成网格线
function drawGrid(ctx, width, height, interval) {
  // 绘制垂直线
  // 绘制水平线
  // 添加坐标标记
}
```

## 性能优化

- 使用离屏画布进行图片处理
- 颜色匹配结果缓存
- 分批处理大型图片
- 按需加载和渲染

## 注意事项

1. 图片尺寸限制
   - 建议图片不超过 2048x2048 像素
   - 处理大图片时会自动缩放

2. 内存使用
   - 使用离屏画布处理大图片
   - 及时释放不需要的资源

3. 权限要求
   - 需要相册读写权限
   - 需要相机权限（可选）

## 后续优化方向

1. 性能优化
   - 使用 WebAssembly 加速图片处理
   - 优化颜色匹配算法

2. 功能扩展
   - 添加更多调色板选项
   - 支持自定义调色板
   - 添加图片预处理功能

3. 用户体验
   - 添加操作教程
   - 优化交互动画
   - 支持更多导出格式 