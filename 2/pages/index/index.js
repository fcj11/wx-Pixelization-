/**
 * 七卡瓦拼豆底稿生成器
 */
Page({
  data: {
    tempImagePath: '', // 原始图片路径
    processedImagePath: '', // 处理后的图片路径
    pixelSize: 4, // 像素大小，默认值改为4
    sliceCount: 200, // 横轴切割数量，默认值改为200
    colorMergeThreshold: 30, // 颜色合并阈值
    colorCount: 64, // 颜色数量，默认值改为64
    currentPalette: 'default', // 当前选择的调色板
    showGrid: true, // 默认显示网格
    // 保存设置相关
    showSaveModal: false, // 是否显示保存设置浮窗
    saveWithGrid: true, // 是否显示网格线
    gridInterval: 10, // 网格线间隔
    gridColor: '#1E90FF', // 网格线颜色
    showCoordinates: true, // 是否显示坐标数字
    includeColorStats: true, // 是否包含色号统计
    gridColors: ['#1E90FF', '#FF0000', '#0000FF', '#008000', '#800080', '#FFA500'], // 网格线颜色选项
    colorStats: [], // 颜色统计数据
    totalBeads: 0, // 总拼豆数量
    filteredColors: [], // 被过滤掉的颜色列表
    // 预设调色板（使用拼豆常用颜色）
    palettes: {
      default: [
        // 基础颜色
        '#FFFFFF', // 白色
        '#000000', // 黑色
        '#808080', // 灰色
        '#C0C0C0', // 银色
        
        // 红色系
        '#FF0000', // 红色
        '#8B0000', // 深红色
        '#FF69B4', // 粉红
        '#FFB6C1', // 浅粉红
        
        // 橙色系
        '#FFA500', // 橙色
        '#FF8C00', // 深橙色
        '#FF7F50', // 珊瑚色
        '#FFDAB9', // 桃色
        
        // 黄色系
        '#FFFF00', // 黄色
        '#FFD700', // 金色
        '#F0E68C', // 卡其色
        '#EEE8AA', // 苍麦色
        
        // 绿色系
        '#008000', // 绿色
        '#32CD32', // 酸橙绿
        '#98FB98', // 淡绿色
        '#90EE90', // 淡绿色
        '#006400', // 深绿色
        '#228B22', // 森林绿
        
        // 蓝色系
        '#0000FF', // 蓝色
        '#000080', // 海军蓝
        '#4169E1', // 皇家蓝
        '#87CEEB', // 天蓝色
        '#00BFFF', // 深天蓝
        '#B0E0E6', // 粉蓝色
        
        // 紫色系
        '#800080', // 紫色
        '#9370DB', // 中紫色
        '#BA55D3', // 兰花紫
        '#DDA0DD', // 梅红色
        
        // 棕色系
        '#A52A2A', // 棕色
        '#8B4513', // 马鞍棕色
        '#D2691E', // 巧克力色
        '#DEB887'  // 实木色
      ],
      warm: [
        // 暖色调
        '#FF0000', // 红色
        '#FF4500', // 橙红色
        '#FF6347', // 番茄色
        '#FF7F50', // 珊瑚色
        '#FF8C00', // 深橙色
        '#FFA500', // 橙色
        '#FFD700', // 金色
        '#FFFF00', // 黄色
        '#FFB6C1', // 浅粉红
        '#FF69B4', // 粉红
        '#FF1493', // 深粉红
        '#C71585', // 中紫红
        '#DC143C', // 猩红
        '#CD5C5C', // 印第安红
        '#B22222', // 火砖色
        '#8B0000', // 深红色
        '#A52A2A', // 棕色
        '#D2691E', // 巧克力色
        '#CD853F', // 秘鲁色
        '#DEB887', // 实木色
        '#F4A460', // 沙褐色
        '#DAA520', // 金菊色
        '#B8860B', // 深金菊色
        '#D2B48C'  // 茶色
      ],
      cool: [
        // 冷色调
        '#0000FF', // 蓝色
        '#000080', // 海军蓝
        '#191970', // 午夜蓝
        '#4169E1', // 皇家蓝
        '#4682B4', // 钢蓝色
        '#5F9EA0', // 军蓝色
        '#00BFFF', // 深天蓝
        '#87CEEB', // 天蓝色
        '#ADD8E6', // 亮蓝色
        '#B0E0E6', // 粉蓝色
        '#008080', // 水鸭色
        '#20B2AA', // 亮海蓝
        '#48D1CC', // 中绿宝石
        '#40E0D0', // 绿宝石
        '#7FFFD4', // 碧绿色
        '#66CDAA', // 中碧蓝色
        '#3CB371', // 中海蓝
        '#2E8B57', // 海蓝色
        '#006400', // 深绿色
        '#008000', // 绿色
        '#228B22', // 森林绿
        '#32CD32', // 酸橙绿
        '#00FF00', // 酸橙色
        '#7CFC00'  // 草地绿
      ]
    },
    // 色号映射表
    colorIndexMap: null,
    // 统计信息
    statistics: null
  },

  /**
   * 选择图片
   */
  chooseImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        // 清除所有缓存数据
        this.setData({
          tempImagePath: res.tempFiles[0].tempFilePath,
          processedImagePath: '', // 清空处理后的图片
          colorStats: [], // 清空颜色统计
          totalBeads: 0, // 重置总拼豆数量
          filteredColors: [], // 清空过滤的颜色
          colorIndexMap: null, // 清空色号映射
          statistics: null, // 清空统计信息
          // 重置处理参数为默认值
          pixelSize: 4,
          sliceCount: 200,
          colorMergeThreshold: 30,
          colorCount: 64,
          currentPalette: 'default',
          showGrid: true,
          // 重置保存设置
          saveWithGrid: true,
          gridInterval: 10,
          gridColor: '#1E90FF',
          showCoordinates: true,
          includeColorStats: true
        });
      }
    });
  },

  /**
   * 预览图片
   */
  previewImage() {
    const current = this.data.processedImagePath || this.data.tempImagePath;
    wx.previewImage({
      urls: [current],
      current: current
    });
  },

  /**
   * 调整图片大小
   */
  async resizeImageData(imageData, targetWidth, targetHeight) {
    return new Promise((resolve, reject) => {
      const query = wx.createSelectorQuery();
      query.select('#processCanvas')
        .fields({ node: true, size: true })
        .exec((res) => {
          const canvas = res[0].node;
          const ctx = canvas.getContext('2d');

          // 确保目标尺寸是像素大小的整数倍
          const adjustedWidth = Math.ceil(targetWidth / this.data.pixelSize) * this.data.pixelSize;
          const adjustedHeight = Math.ceil(targetHeight / this.data.pixelSize) * this.data.pixelSize;

          // 设置 canvas 尺寸
          canvas.width = adjustedWidth;
          canvas.height = adjustedHeight;

          // 创建临时图片
          const tempImage = canvas.createImage();
          
          // 将 ImageData 转换为 base64
          const tempCanvas = wx.createOffscreenCanvas({ type: '2d', width: imageData.width, height: imageData.height });
          const tempCtx = tempCanvas.getContext('2d');
          tempCtx.putImageData(imageData, 0, 0);
          const tempDataURL = tempCanvas.toDataURL();

          tempImage.onload = () => {
            // 清空画布
            ctx.clearRect(0, 0, adjustedWidth, adjustedHeight);
            
            // 计算居中位置
            const scaleX = adjustedWidth / imageData.width;
            const scaleY = adjustedHeight / imageData.height;
            const scale = Math.min(scaleX, scaleY);
            
            const scaledWidth = imageData.width * scale;
            const scaledHeight = imageData.height * scale;
            
            const x = (adjustedWidth - scaledWidth) / 2;
            const y = (adjustedHeight - scaledHeight) / 2;

            // 绘制调整大小后的图片（居中）
            ctx.drawImage(tempImage, x, y, scaledWidth, scaledHeight);
            
            // 获取调整后的图像数据
            resolve(ctx.getImageData(0, 0, adjustedWidth, adjustedHeight));
          };

          tempImage.onerror = (error) => {
            reject(error);
          };

          tempImage.src = tempDataURL;
        });
    });
  },

  /**
   * 处理图片生成底稿
   */
  async processImage() {
    wx.showLoading({
      title: '处理中...'
    });

    try {
      // 获取原始图片数据
      const imageData = await this.getImageData(this.data.tempImagePath);
      
      // 根据横轴切割数量调整图片大小
      const aspectRatio = imageData.height / imageData.width;
      const targetWidth = Math.ceil(this.data.sliceCount / 10) * 10; // 确保是10的整数倍
      const targetHeight = Math.ceil(targetWidth * aspectRatio / 10) * 10; // 确保是10的整数倍

      // 调整图片大小
      let processedImageData;
      try {
        processedImageData = await this.resizeImageData(imageData, targetWidth, targetHeight);
      } catch (error) {
        console.error('调整图片大小失败，使用原始图片数据继续处理:', error);
        processedImageData = imageData;
      }
      
      // 生成底稿
      const result = this.generateTemplate(
        processedImageData,
        this.data.pixelSize,
        this.data.colorCount,
        this.data.palettes[this.data.currentPalette]
      );

      // 保存结果到实例变量
      this.processResult = result;

      // 获取 canvas 实例并绘制结果
      const query = wx.createSelectorQuery();
      query.select('#processCanvas')
        .fields({ node: true, size: true })
        .exec((res) => {
          const canvas = res[0].node;
          const ctx = canvas.getContext('2d');

          // 设置放大倍数和画布尺寸
          const scale = 2;
          const width = processedImageData.width;
          const height = processedImageData.height;
          
          // 确保canvas尺寸是像素大小的整数倍
          canvas.width = Math.ceil(width * scale / this.data.pixelSize) * this.data.pixelSize;
          canvas.height = Math.ceil(height * scale / this.data.pixelSize) * this.data.pixelSize;

          // 绘制底稿
          this.drawTemplate(
            ctx,
            result.processedData,
            width,
            height,
            scale,
            this.data.pixelSize,
            result.colorIndexMap,
            this.data.showGrid
          );

          // 将 canvas 转换为图片
          wx.canvasToTempFilePath({
            canvas: canvas,
            success: res => {
              this.setData({
                processedImagePath: res.tempFilePath
              });
              // 显示统计信息
              this.showStatistics(result.statistics, result.colorIndexMap);
            },
            fail: error => {
              console.error('保存图片失败:', error);
              wx.showToast({
                title: '生成失败',
                icon: 'none'
              });
            }
          });
        });
    } catch (error) {
      console.error('处理图片失败:', error);
      wx.showToast({
        title: '处理失败',
        icon: 'none'
      });
    } finally {
      wx.hideLoading();
    }
  },

  /**
   * 生成底稿数据
   */
  generateTemplate(imageData, pixelSize, colorCount, palette) {
    const { width, height, data } = imageData;
    const result = new Uint8ClampedArray(data);
    const colorIndexMap = new Map();
    const statistics = new Map();
    const mergeThreshold = this.data.colorMergeThreshold * 0.8; // 调整合并阈值的敏感度
    const filteredColors = this.data.filteredColors;
    
    // 将调色板颜色转换为 RGB 和 LAB 数组
    const paletteColors = palette.slice(0, colorCount).map(hex => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      const lab = this.rgbToLab([r, g, b]);
      return {
        rgb: [r, g, b],
        lab: lab,
        hex: hex
      };
    });

    // 过滤掉被禁用的颜色
    const availablePaletteColors = paletteColors.filter(color => 
      !filteredColors.includes(color.hex)
    );

    // 如果所有颜色都被过滤，使用原始调色板
    const finalPaletteColors = availablePaletteColors.length > 0 ? availablePaletteColors : paletteColors;

    // 创建颜色缓存以提高性能
    const colorCache = new Map();

    // 处理每个像素块
    for (let y = 0; y < height; y += pixelSize) {
      for (let x = 0; x < width; x += pixelSize) {
        // 获取区域平均颜色
        const avgColor = this.getAverageColor(data, width, height, x, y, pixelSize);
        const avgLab = this.rgbToLab(avgColor);
        
        // 查找或计算最接近的调色板颜色
        const cacheKey = avgColor.join(',');
        let closestColor;
        
        if (colorCache.has(cacheKey)) {
          closestColor = colorCache.get(cacheKey);
        } else {
          // 寻找最接近的颜色，考虑合并阈值
          let minDistance = Infinity;
          let bestMatch = null;
          let secondBestMatch = null;
          let secondMinDistance = Infinity;
          
          // 找到最接近和第二接近的颜色
          for (const paletteColor of finalPaletteColors) {
            const distance = this.deltaE(avgLab, paletteColor.lab);
            if (distance < minDistance) {
              secondMinDistance = minDistance;
              secondBestMatch = bestMatch;
              minDistance = distance;
              bestMatch = paletteColor;
            } else if (distance < secondMinDistance) {
              secondMinDistance = distance;
              secondBestMatch = paletteColor;
            }
          }
          
          // 如果最接近的两个颜色差异很小，选择更接近原始颜色的一个
          if (secondBestMatch && Math.abs(minDistance - secondMinDistance) < mergeThreshold) {
            const dist1 = this.colorDistance(avgColor, bestMatch.rgb);
            const dist2 = this.colorDistance(avgColor, secondBestMatch.rgb);
            closestColor = dist1 < dist2 ? bestMatch : secondBestMatch;
          } else {
            closestColor = bestMatch;
          }
          
          colorCache.set(cacheKey, closestColor);
        }
        
        // 更新统计信息
        const colorKey = closestColor.rgb.join(',');
        statistics.set(colorKey, (statistics.get(colorKey) || 0) + 1);
        colorIndexMap.set(colorKey, {
          index: paletteColors.indexOf(closestColor) + 1,
          hex: closestColor.hex
        });

        // 填充像素块
        for (let py = 0; py < pixelSize && y + py < height; py++) {
          for (let px = 0; px < pixelSize && x + px < width; px++) {
            const idx = ((y + py) * width + (x + px)) * 4;
            result[idx] = closestColor.rgb[0];     // R
            result[idx + 1] = closestColor.rgb[1]; // G
            result[idx + 2] = closestColor.rgb[2]; // B
            result[idx + 3] = 255;                 // A
          }
        }
      }
    }

    return {
      processedData: result,
      colorIndexMap,
      statistics
    };
  },

  /**
   * RGB 转十六进制颜色
   */
  rgbToHex(rgb) {
    const [r, g, b] = rgb;
    const toHex = (n) => {
      const hex = n.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  },

  /**
   * 绘制底稿
   */
  async drawTemplate(ctx, imageData, width, height, scale, pixelSize, colorIndexMap, showGrid) {
    const scaledPixelSize = pixelSize * scale;
    
    // 设置背景
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width * scale, height * scale);

    // 绘制像素化图片
    const newImageData = ctx.createImageData(width * scale, height * scale);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const srcIdx = (y * width + x) * 4;
        const color = [
          imageData[srcIdx],
          imageData[srcIdx + 1],
          imageData[srcIdx + 2]
        ];
        
        // 填充放大后的像素
        for (let sy = 0; sy < scale; sy++) {
          for (let sx = 0; sx < scale; sx++) {
            const dstIdx = ((y * scale + sy) * width * scale + (x * scale + sx)) * 4;
            newImageData.data[dstIdx] = color[0];
            newImageData.data[dstIdx + 1] = color[1];
            newImageData.data[dstIdx + 2] = color[2];
            newImageData.data[dstIdx + 3] = 255;
          }
        }
      }
    }
    ctx.putImageData(newImageData, 0, 0);

    // 绘制网格和色号
    if (showGrid) {
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.lineWidth = 1;
      ctx.font = `${scale * 3}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let y = 0; y < height; y += pixelSize) {
        for (let x = 0; x < width; x += pixelSize) {
          const scaledX = x * scale;
          const scaledY = y * scale;

          // 绘制网格线
          ctx.strokeRect(scaledX, scaledY, scaledPixelSize, scaledPixelSize);

          // 获取颜色索引
          const idx = (y * width + x) * 4;
          const colorKey = `${imageData[idx]},${imageData[idx + 1]},${imageData[idx + 2]}`;
          const colorInfo = colorIndexMap.get(colorKey);

          if (colorInfo) {
            // 绘制色号
            const textColor = this.getContrastTextColor(this.rgbToHex(colorInfo.hex));
            ctx.fillStyle = textColor;
            ctx.fillText(
              colorInfo.index.toString(),
              scaledX + scaledPixelSize / 2,
              scaledY + scaledPixelSize / 2
            );
          }
        }
      }
    }
  },

  /**
   * 显示统计信息
   */
  showStatistics(statistics, colorIndexMap) {
    let totalBeads = 0;
    const colorStats = [];

    // 按颜色索引排序
    const sortedStats = Array.from(statistics.entries())
      .sort((a, b) => {
        const indexA = colorIndexMap.get(a[0]).index;
        const indexB = colorIndexMap.get(b[0]).index;
        return indexA - indexB;
      });

    // 生成统计数据
    sortedStats.forEach(([colorKey, count]) => {
      const colorInfo = colorIndexMap.get(colorKey);
      colorStats.push({
        index: colorInfo.index,
        color: colorInfo.hex,
        count: count
      });
      totalBeads += count;
    });

    // 更新数据
    this.setData({
      colorStats,
      totalBeads
    });
  },

  /**
   * 获取对比文本颜色
   */
  getContrastTextColor(hexColor) {
    // 将十六进制颜色转换为RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // 计算亮度
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    // 根据背景亮度选择文本颜色
    return brightness > 128 ? '#000000' : '#FFFFFF';
  },

  /**
   * 获取图片数据
   */
  async getImageData(imagePath) {
    return new Promise((resolve, reject) => {
      // 获取 canvas 实例
      const query = wx.createSelectorQuery();
      query.select('#processCanvas')
        .fields({ node: true, size: true })
        .exec((res) => {
          const canvas = res[0].node;
          const ctx = canvas.getContext('2d');

          // 获取图片信息
          wx.getImageInfo({
            src: imagePath,
            success: (imgInfo) => {
              // 设置 canvas 尺寸
              canvas.width = imgInfo.width;
              canvas.height = imgInfo.height;

              // 创建图片对象
              const img = canvas.createImage();
              img.onload = () => {
                // 绘制图片到 canvas
                ctx.drawImage(img, 0, 0);
                // 获取图片数据
                const imageData = ctx.getImageData(0, 0, imgInfo.width, imgInfo.height);
                resolve(imageData);
              };
              img.onerror = reject;
              img.src = imagePath;
            },
            fail: reject
          });
        });
    });
  },

  /**
   * 找到最接近的调色板颜色
   */
  findClosestPaletteColor(color, paletteColors) {
    let minDistance = Infinity;
    let closestColor = null;

    // 找到最接近的颜色
    for (const paletteColor of paletteColors) {
      const distance = this.colorDistance(color, paletteColor);
      if (distance < minDistance) {
        minDistance = distance;
        closestColor = paletteColor;
      }
    }

    return closestColor;
  },

  /**
   * 计算两个颜色之间的距离（RGB空间）
   */
  colorDistance(color1, color2) {
    const rDiff = color1[0] - color2[0];
    const gDiff = color1[1] - color2[1];
    const bDiff = color1[2] - color2[2];
    
    // 考虑人眼对不同颜色的敏感度
    return Math.sqrt(
      (rDiff * rDiff) * 0.299 + 
      (gDiff * gDiff) * 0.587 + 
      (bDiff * bDiff) * 0.114
    );
  },

  /**
   * RGB 转 LAB 色彩空间
   */
  rgbToLab(rgb) {
    // RGB to XYZ
    let r = rgb[0] / 255;
    let g = rgb[1] / 255;
    let b = rgb[2] / 255;

    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

    const x = (r * 0.4124 + g * 0.3576 + b * 0.1805) * 100;
    const y = (r * 0.2126 + g * 0.7152 + b * 0.0722) * 100;
    const z = (r * 0.0193 + g * 0.1192 + b * 0.9505) * 100;

    // XYZ to Lab
    const xn = 95.047;
    const yn = 100.000;
    const zn = 108.883;

    const xx = x / xn;
    const yy = y / yn;
    const zz = z / zn;

    const fx = xx > 0.008856 ? Math.pow(xx, 1/3) : (7.787 * xx) + 16/116;
    const fy = yy > 0.008856 ? Math.pow(yy, 1/3) : (7.787 * yy) + 16/116;
    const fz = zz > 0.008856 ? Math.pow(zz, 1/3) : (7.787 * zz) + 16/116;

    const L = (116 * fy) - 16;
    const a = 500 * (fx - fy);
    const bValue = 200 * (fy - fz);

    return [L, a, bValue];
  },

  /**
   * 计算 Delta E (CIE 2000)
   */
  deltaE(lab1, lab2) {
    const [L1, a1, b1] = lab1;
    const [L2, a2, b2] = lab2;
    
    const kL = 1;
    const kC = 1;
    const kH = 1;

    const C1 = Math.sqrt(a1 * a1 + b1 * b1);
    const C2 = Math.sqrt(a2 * a2 + b2 * b2);
    const Cb = (C1 + C2) / 2;

    const G = 0.5 * (1 - Math.sqrt(Math.pow(Cb, 7) / (Math.pow(Cb, 7) + Math.pow(25, 7))));
    const a1p = (1 + G) * a1;
    const a2p = (1 + G) * a2;

    const C1p = Math.sqrt(a1p * a1p + b1 * b1);
    const C2p = Math.sqrt(a2p * a2p + b2 * b2);
    const Cbp = (C1p + C2p) / 2;

    let h1p = Math.atan2(b1, a1p);
    let h2p = Math.atan2(b2, a2p);

    h1p = h1p < 0 ? h1p + 2 * Math.PI : h1p;
    h2p = h2p < 0 ? h2p + 2 * Math.PI : h2p;

    const dL = L2 - L1;
    const dC = C2p - C1p;
    let dhp = h2p - h1p;

    if (Math.abs(dhp) > Math.PI) {
      dhp = dhp > Math.PI ? dhp - 2 * Math.PI : dhp + 2 * Math.PI;
    }

    const dH = 2 * Math.sqrt(C1p * C2p) * Math.sin(dhp / 2);

    const Lbp = (L1 + L2) / 2;
    const SL = 1 + (0.015 * Math.pow(Lbp - 50, 2)) / Math.sqrt(20 + Math.pow(Lbp - 50, 2));
    const SC = 1 + 0.045 * Cbp;
    const SH = 1 + 0.015 * Cbp;

    const dE = Math.sqrt(
      Math.pow(dL / (kL * SL), 2) +
      Math.pow(dC / (kC * SC), 2) +
      Math.pow(dH / (kH * SH), 2)
    );

    return dE;
  },

  /**
   * 获取区域平均颜色（改进版）
   */
  getAverageColor(data, width, height, startX, startY, size) {
    let r = 0, g = 0, b = 0;
    let count = 0;
    let rValues = [], gValues = [], bValues = [];

    // 收集区域内所有像素的颜色值
    for (let y = 0; y < size && startY + y < height; y++) {
      for (let x = 0; x < size && startX + x < width; x++) {
        const idx = ((startY + y) * width + (startX + x)) * 4;
        rValues.push(data[idx]);
        gValues.push(data[idx + 1]);
        bValues.push(data[idx + 2]);
        count++;
      }
    }

    // 对每个颜色通道进行中值滤波
    rValues.sort((a, b) => a - b);
    gValues.sort((a, b) => a - b);
    bValues.sort((a, b) => a - b);

    const mid = Math.floor(count / 2);
    if (count % 2 === 0) {
      r = (rValues[mid - 1] + rValues[mid]) / 2;
      g = (gValues[mid - 1] + gValues[mid]) / 2;
      b = (bValues[mid - 1] + bValues[mid]) / 2;
    } else {
      r = rValues[mid];
      g = gValues[mid];
      b = bValues[mid];
    }

    return [Math.round(r), Math.round(g), Math.round(b)];
  },

  /**
   * 保存图片到相册
   */
  async saveImage() {
    if (!this.data.processedImagePath) return;
    
    wx.showLoading({
      title: '生成模板中...'
    });

    try {
      // 获取 canvas 实例
      const query = wx.createSelectorQuery();
      query.select('#processCanvas')
        .fields({ node: true, size: true })
        .exec(async (res) => {
          const canvas = res[0].node;
          const ctx = canvas.getContext('2d');

          // 获取原始图片信息
          const imageInfo = await new Promise((resolve, reject) => {
            wx.getImageInfo({
              src: this.data.processedImagePath,
              success: resolve,
              fail: reject
            });
          });

          // 计算模板尺寸
          const padding = 40;
          const statsHeight = 200; // 颜色统计区域高度
          const templateWidth = Math.max(imageInfo.width, 800); // 最小宽度800
          const templateHeight = imageInfo.height + statsHeight + padding * 3;

          // 设置画布尺寸
          canvas.width = templateWidth;
          canvas.height = templateHeight;

          // 绘制白色背景
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, templateWidth, templateHeight);

          // 绘制标题
          ctx.fillStyle = '#333333';
          ctx.font = 'bold 24px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('拼豆底稿', templateWidth / 2, padding);

          // 绘制处理后的图片
          const image = canvas.createImage();
          await new Promise((resolve, reject) => {
            image.onload = resolve;
            image.onerror = reject;
            image.src = this.data.processedImagePath;
          });
          const imageX = (templateWidth - imageInfo.width) / 2;
          const imageY = padding * 2;
          ctx.drawImage(image, imageX, imageY);

          // 绘制网格
          const pixelSize = this.data.pixelSize;
          const gridWidth = imageInfo.width;
          const gridHeight = imageInfo.height;
          const pixelsPerCell = Math.floor(gridWidth / pixelSize); // 总像素格子数

          // 绘制小格子
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(200, 200, 200, 0.5)'; // 浅灰色
          ctx.lineWidth = 0.5;

          // 垂直线（小格子）
          for (let i = 0; i <= pixelsPerCell; i++) {
            const x = imageX + (i * pixelSize);
            ctx.moveTo(x, imageY);
            ctx.lineTo(x, imageY + gridHeight);
          }

          // 水平线（小格子）
          for (let i = 0; i <= Math.floor(gridHeight / pixelSize); i++) {
            const y = imageY + (i * pixelSize);
            ctx.moveTo(imageX, y);
            ctx.lineTo(imageX + gridWidth, y);
          }
          ctx.stroke();

          // 绘制大格子（每10格）
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)'; // 深色
          ctx.lineWidth = 1;

          // 垂直线（大格子，每10格）
          for (let i = 0; i <= pixelsPerCell; i += 10) {
            const x = imageX + (i * pixelSize);
            ctx.moveTo(x, imageY);
            ctx.lineTo(x, imageY + gridHeight);
          }

          // 水平线（大格子，每10格）
          for (let i = 0; i <= Math.floor(gridHeight / pixelSize); i += 10) {
            const y = imageY + (i * pixelSize);
            ctx.moveTo(imageX, y);
            ctx.lineTo(imageX + gridWidth, y);
          }
          ctx.stroke();

          // 添加坐标数字
          ctx.fillStyle = '#333333';
          ctx.font = '12px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          // 横坐标（每10格标注一次）
          for (let i = 10; i <= pixelsPerCell; i += 10) {
            const x = imageX + (i * pixelSize);
            ctx.fillText(i.toString(), x, imageY - 10);
          }

          // 纵坐标（每10格标注一次）
          ctx.textAlign = 'right';
          for (let i = 10; i <= Math.floor(gridHeight / pixelSize); i += 10) {
            const y = imageY + (i * pixelSize);
            ctx.fillText(i.toString(), imageX - 5, y);
          }

          // 绘制分隔线
          ctx.strokeStyle = '#EEEEEE';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(padding, imageY + gridHeight + padding * 0.5);
          ctx.lineTo(templateWidth - padding, imageY + gridHeight + padding * 0.5);
          ctx.stroke();

          // 绘制颜色统计信息
          const stats = this.data.colorStats;
          const boxSize = 40;
          const margin = 10;
          let x = padding;
          let y = imageY + gridHeight + padding;

          // 绘制统计标题
          ctx.fillStyle = '#333333';
          ctx.font = 'bold 18px sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText(`颜色统计（总计：${this.data.totalBeads}颗）`, x, y);
          y += 30;

          // 绘制颜色统计表格
          const maxBoxesPerRow = Math.floor((templateWidth - padding * 2) / (boxSize + margin));
          stats.forEach((stat, index) => {
            // 计算位置
            const row = Math.floor(index / maxBoxesPerRow);
            const col = index % maxBoxesPerRow;
            const currentX = x + col * (boxSize + margin);
            const currentY = y + row * (boxSize + margin);

            // 绘制颜色方块
            ctx.fillStyle = stat.color;
            ctx.fillRect(currentX, currentY, boxSize, boxSize);
            
            // 绘制边框
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 1;
            ctx.strokeRect(currentX, currentY, boxSize, boxSize);

            // 绘制色号和数量
            ctx.fillStyle = this.getContrastTextColor(stat.color);
            ctx.font = '12px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(`${stat.index}`, currentX + boxSize/2, currentY + boxSize/2 - 6);
            ctx.fillText(`${stat.count}颗`, currentX + boxSize/2, currentY + boxSize/2 + 8);
          });

          // 保存模板到相册
          wx.canvasToTempFilePath({
            canvas: canvas,
            success: res => {
              wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success: () => {
                  wx.showToast({
                    title: '保存成功',
                    icon: 'success'
                  });
                },
                fail: () => {
                  wx.showToast({
                    title: '保存失败',
                    icon: 'none'
                  });
                }
              });
            },
            fail: error => {
              console.error('生成图片失败:', error);
              wx.showToast({
                title: '生成失败',
                icon: 'none'
              });
            }
          });
        });
    } catch (error) {
      console.error('保存模板失败:', error);
      wx.showToast({
        title: '保存失败',
        icon: 'none'
      });
    } finally {
      wx.hideLoading();
    }
  },

  /**
   * 像素大小改变事件处理
   */
  onPixelSizeChange(e) {
    this.setData({
      pixelSize: e.detail.value
    });
  },

  /**
   * 设置颜色数量
   */
  setColorCount(e) {
    const count = parseInt(e.currentTarget.dataset.count);
    this.setData({
      colorCount: count
    });
  },

  /**
   * 选择调色板
   */
  selectPalette(e) {
    const palette = e.currentTarget.dataset.palette;
    this.setData({
      currentPalette: palette
    });
  },

  /**
   * 网格显示状态改变事件处理
   */
  onGridChange(e) {
    this.setData({
      showGrid: e.detail.value
    });
  },

  /**
   * 横轴切割数量改变事件处理
   */
  onSliceCountChange(e) {
    this.setData({
      sliceCount: e.detail.value
    });
  },

  /**
   * 颜色合并阈值改变事件处理
   */
  onColorMergeThresholdChange(e) {
    this.setData({
      colorMergeThreshold: e.detail.value
    });
  },

  /**
   * 显示保存设置浮窗
   */
  showSaveSettings() {
    this.setData({
      showSaveModal: true
    });
  },

  /**
   * 关闭保存设置浮窗
   */
  closeSaveModal() {
    this.setData({
      showSaveModal: false
    });
  },

  /**
   * 防止穿透
   */
  preventTouchMove() {
    return;
  },

  /**
   * 网格显示状态改变
   */
  onSaveGridChange(e) {
    this.setData({
      saveWithGrid: e.detail.value
    });
  },

  /**
   * 网格间隔改变
   */
  onGridIntervalChange(e) {
    this.setData({
      gridInterval: e.detail.value
    });
  },

  /**
   * 选择网格线颜色
   */
  onGridColorSelect(e) {
    const color = e.currentTarget.dataset.color;
    this.setData({
      gridColor: color
    });
  },

  /**
   * 坐标显示状态改变
   */
  onShowCoordinatesChange(e) {
    this.setData({
      showCoordinates: e.detail.value
    });
  },

  /**
   * 统计信息显示状态改变
   */
  onIncludeStatsChange(e) {
    this.setData({
      includeColorStats: e.detail.value
    });
  },

  /**
   * 确认保存图纸
   */
  async confirmSave() {
    wx.showLoading({
      title: '生成图纸中...'
    });

    try {
      // 获取 canvas 实例
      const query = wx.createSelectorQuery();
      query.select('#processCanvas')
        .fields({ node: true, size: true })
        .exec(async (res) => {
          const canvas = res[0].node;
          const ctx = canvas.getContext('2d');

          // 重新绘制图片，应用新的设置
          await this.redrawWithSettings(ctx, canvas);

          // 保存到相册
          wx.canvasToTempFilePath({
            canvas: canvas,
            success: res => {
              wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success: () => {
                  wx.showToast({
                    title: '保存成功',
                    icon: 'success'
                  });
                  this.closeSaveModal();
                },
                fail: () => {
                  wx.showToast({
                    title: '保存失败',
                    icon: 'none'
                  });
                }
              });
            },
            fail: error => {
              console.error('生成图片失败:', error);
              wx.showToast({
                title: '生成失败',
                icon: 'none'
              });
            }
          });
        });
    } catch (error) {
      console.error('保存图纸失败:', error);
      wx.showToast({
        title: '保存失败',
        icon: 'none'
      });
    } finally {
      wx.hideLoading();
    }
  },

  /**
   * 重新绘制图片，应用新的设置
   */
  async redrawWithSettings(ctx, canvas) {
    // 获取原始图片
    const image = canvas.createImage();
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
      image.src = this.data.processedImagePath;
    });

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制图片
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    // 绘制网格
    if (this.data.saveWithGrid) {
      this.drawGrid(ctx, canvas.width, canvas.height);
    }

    // 绘制坐标
    if (this.data.showCoordinates) {
      this.drawCoordinates(ctx, canvas.width, canvas.height);
    }

    // 绘制统计信息
    if (this.data.includeColorStats) {
      this.drawColorStats(ctx, canvas.width, canvas.height);
    }
  },

  /**
   * 绘制网格
   */
  drawGrid(ctx, width, height) {
    const interval = this.data.gridInterval * this.data.pixelSize;
    ctx.strokeStyle = this.data.gridColor;
    ctx.lineWidth = 1;
    ctx.beginPath();

    // 绘制垂直线
    for (let x = interval; x < width; x += interval) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }

    // 绘制水平线
    for (let y = interval; y < height; y += interval) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }

    ctx.stroke();
  },

  /**
   * 绘制坐标
   */
  drawCoordinates(ctx, width, height) {
    const interval = this.data.gridInterval * this.data.pixelSize;
    ctx.fillStyle = this.data.gridColor;
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 绘制横坐标
    for (let x = interval; x < width; x += interval) {
      const coord = Math.floor(x / this.data.pixelSize);
      ctx.fillText(coord.toString(), x, 20);
    }

    // 绘制纵坐标
    ctx.textAlign = 'right';
    for (let y = interval; y < height; y += interval) {
      const coord = Math.floor(y / this.data.pixelSize);
      ctx.fillText(coord.toString(), 20, y);
    }
  },

  /**
   * 绘制颜色统计信息
   */
  drawColorStats(ctx, width, height) {
    if (!this.data.colorStats || !this.data.colorStats.length) return;

    const stats = this.data.colorStats;
    const filteredColors = this.data.filteredColors;
    const boxSize = 30;
    const margin = 10;
    let x = margin;
    let y = height + margin;

    ctx.font = '14px sans-serif';
    ctx.textBaseline = 'middle';

    // 绘制标题
    ctx.fillStyle = '#333333';
    ctx.font = '16px sans-serif';
    ctx.fillText('颜色统计：', x, y);
    y += boxSize;

    stats.forEach(stat => {
      const isFiltered = filteredColors.includes(stat.color);
      
      // 绘制颜色方块
      ctx.fillStyle = stat.color;
      ctx.fillRect(x, y, boxSize, boxSize);
      
      // 绘制边框
      ctx.strokeStyle = isFiltered ? '#FF0000' : '#000000';
      ctx.lineWidth = isFiltered ? 2 : 1;
      ctx.strokeRect(x, y, boxSize, boxSize);

      // 绘制数量文本
      ctx.fillStyle = this.getContrastTextColor(stat.color);
      const text = `${stat.count}`;
      const textWidth = ctx.measureText(text).width;
      ctx.fillText(text, x + (boxSize - textWidth) / 2, y + boxSize / 2);

      // 更新位置
      x += boxSize + margin;
      if (x + boxSize > width - margin) {
        x = margin;
        y += boxSize + margin;
      }
    });
  },

  /**
   * 处理颜色统计点击
   */
  onColorStatClick(e) {
    const { color } = e.currentTarget.dataset;
    let filteredColors = [...this.data.filteredColors];
    
    // 切换颜色的过滤状态
    const index = filteredColors.indexOf(color);
    if (index === -1) {
      filteredColors.push(color);
    } else {
      filteredColors.splice(index, 1);
    }
    
    this.setData({ filteredColors }, () => {
      // 重新处理图片
      if (this.data.tempImagePath) {
        this.processImage();
      }
    });
  },
});


