const setting = require('../../setting.js')

const scaleSize = (width, height) => {
      let wscale = setting['windowWidth'] / width;
      let hscale = setting['windowHeight'] / height
      return Math.min(hscale, wscale)
}

const scaleSizeW = (currentWidth, width, height) => {
      return height * (currentWidth || setting['windowWidth']) / width;
}

const scaleSizeH = (currentHeight, width, height) => {
      return (currentHeight || setting['windowHeight']) * width / height;
}

module.exports = {
      scaleSizeW,
      scaleSizeH
}

