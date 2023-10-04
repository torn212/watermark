"use client";
import { useState } from "react";
import Viewer from "viewerjs";
export default function HomePage() {
  const [inputValue, setInputValue] = useState("");
  const [imageSrc, setImageSrc] = useState("");
  const [loading, setLoading] = useState(false);
  const [empty, setEmpty] = useState(false);

  const handleConfirm = async () => {
    try {
      setImageSrc("");
      setEmpty(false);
      setLoading(true);
      const response = await fetch("/api/avatar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputValue }),
      });

      if (!response.ok) {
        throw new Error("接口请求失败");
      }
      console.log("response", response.body);
      const streamResponse = new Response(response.body);

      // 创建一个 Image 元素
      const image = new Image();
      // 将 ReadableStream 转换为 Blob 对象
      const blob = await streamResponse.blob();
      // 创建一个 URL 对象
      const imageURL = URL.createObjectURL(blob);
      // 设置 Image 元素的 src 属性为 URL 对象
      image.src = imageURL;
      // 添加 Image 元素到 HTML 页面中的某个容器中
      console.log("imageURL", imageURL);
      window.imageURL = imageURL;
      setEmpty(false);
      setImageSrc(imageURL);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setEmpty(true);
      console.error(error);
    }
  };

  const handleDownload = () => {
    // 创建一个新的 <a> 元素并设置其 href 属性为图片链接
    const downloadLink = document.createElement("a");
    downloadLink.href = imageSrc;
    downloadLink.target = "_blank";
    // 设置下载的文件名
    downloadLink.download = "water_mark.jpg";
    // 模拟点击下载链接
    downloadLink.click();
  };

  const preview = () => {
    new Viewer(document.getElementById("image-container"), {
      toolbar: true, // 显示工具栏
      title: true, // 显示标题
      navbar: false, // 隐藏导航栏
      rotatable: true, // 启用旋转功能
      scalable: false, // 禁用缩放功能
    });
  };

  return (
    <div className="watermark-box">
      <div className="watermark-content">
        <div className="title">FT watermark</div>
        <div className="des mt20">
          Add friend.tech watermark to your X (formerly Twitter) avatar
        </div>
        <div className="des">给你的推特头像加FT水印</div>
        <div className="input-info">
          <div className="input-info-label">Twitter handle</div>
          <input
            type="text"
            value={inputValue}
            placeholder="Enter you Twitter handle"
            onChange={(e) => setInputValue(e.target.value)}
          />
          {inputValue && <button onClick={handleConfirm}>Get avatar </button>}
        </div>
        <div className="border-box">
          <p>by @yequ_eth 夜曲 </p>
          <p>
            FT{" "}
            <a href="https://friend.tech/yequ_eth" target="_blank">
              https://friend.tech/yequ_eth
            </a>
          </p>
          <p>Adding me to your FT Watchlist would be very helpful❤️</p>
        </div>
        {loading && (
          <svg
            width="50"
            height="50"
            viewBox="0 0 50 50"
            className="circular-box"
          >
            <circle
              class="circle"
              cx="25"
              cy="25"
              r="20"
              fill="none"
              stroke-width="2"
              stroke="green"
            ></circle>
          </svg>
        )}
        {empty && (
          <div className="empty-info">
            didn't find the avatar, so I entered the correct Twitter nickname.
          </div>
        )}

        {imageSrc && (
          <div className="img-info">
            <div id="image-container">
              <img src={imageSrc} alt="图片" />
            </div>
            <button onClick={handleDownload}>Save</button>
            {/* <button className="preview" onClick={preview}>
              preview
            </button> */}
            <p className="img-info-tips">
              Save, upload to Twitter and Sync Profile in FT <br />
              保存后上传至推特，并在FT中同步资料
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
