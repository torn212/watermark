const axios = require("axios");
const Jimp = require("jimp");
import { join } from 'path';

async function setWater(img) {
  try {
    // 加载原始图片和水印图片
    const imagePath = img;
    const watermarkPath = "https://www.chnphoto.cn/NewIndex/images/products-4.jpg";

    const image = await Jimp.read(imagePath);
    const watermark = await Jimp.read(watermarkPath);

    // 调整水印尺寸
    watermark.scaleToFit(image.getWidth() / 2, image.getHeight() / 2);

    // 设置水印位置
    const x = (image.getWidth() - watermark.getWidth()) / 2;
    const y = (image.getHeight() - watermark.getHeight());

    // 添加水印到原始图片
    image.composite(watermark, x, y, {
      mode: Jimp.BLEND_SCREEN,
      opacitySource: 1,
      opacityDest: 1,
    });

    // 保存带水印的图片
    const outputImagePath = `watermarked_${new Date().getTime()}.jpg`;
    const outputPath = join(process.cwd(), 'public', 'images', outputImagePath);

    await image.writeAsync(outputPath);
    console.log('__________outputImagePath_________',outputPath)
    // 返回带水印的图片路径或其他响应给客户端
    return '/images/'+outputImagePath;
  } catch (error) {
    // 处理异常情况
    console.error(error);
    throw error;
  }
}

export default async function handler(req, res) {
  try {
    console.log("req.body", req.body);
    // 调用接口A并增加header参数abc
    const url =
      "http://api.twitter.com/1.1/users/show.json?screen_name=" +
      req.body.inputValue;
    const headers = {
      authorization:
        "Bearer AAAAAAAAAAAAAAAAAAAAAG7xqAEAAAAAhX%2FIUoT9ShGkFjPZWohUodOv6F4%3DiTI6bjcnwCsnQnHnPEwGFS2xQWkGeu6Q9oqsBrMOvZnGhE9jrt",
    };
    console.log("url", url);

    const response = await axios.get(url, { headers });
    console.log("response", response.data);
    const handleImgWater=await setWater(response.data.profile_image_url_https)
    console.log('handleImgWater',handleImgWater)
    // 获取接口A的返回值，并返回给客户端
    res.status(200).send({
        img:handleImgWater
    });
    // res.status(200).send({
    //     img:'https://imgcps.jd.com/img-cubic/creative_server_cia_jdcloud/v2/2000366/100049058416/FocusFullshop/CkNqZnMvdDEvMTI5MTg4LzkvMzc4NjQvNzA5NDU5LzY1MGNhMTJlRmUxMjAwMDMyL2Q4NWZiODgyZjA0Y2YwOWQucG5nEgkzLXR5XzBfNTQwAjjui3pCFgoS57Si5bC85bmz5p2_55S16KeGEAFCEwoP5a6e5oOg5LmQ5LiN5YGcEAJCEAoM56uL5Y2z5oqi6LStEAZCCgoG5Yqb6I2QEAdY8PSN2_QC/cr/s/q.jpg'
    // });
  } catch (error) {
    // 处理异常情况
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}
