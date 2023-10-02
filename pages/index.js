"use client";
import { useState } from "react";

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
      document.body.appendChild(image);
      console.log('imageURL',imageURL)

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

  return (
    <div className="watermark-box">
      <div className="watermark-content">
        <div className="top-info">
          Enter Twitter nicknames to generate watermarked avatars and support
          downloading.
        </div>
        <div className="input-info">
          <input
            type="text"
            value={inputValue}
            placeholder="Please enter a Twitter nickname."
            onChange={(e) => setInputValue(e.target.value)}
          />
          {inputValue && (
            <button onClick={handleConfirm}>Generate watermark</button>
          )}
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
            <img src={imageSrc} alt="图片" />
            <button onClick={handleDownload}>Download watermark</button>
          </div>
        )}
      </div>
    </div>
  );
}
