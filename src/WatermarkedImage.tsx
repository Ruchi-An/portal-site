import { useEffect, useState } from "react";

type Props = {
  src: string;
  alt?: string;
  className?: string;
  onClick?: () => void;
};

export default function WatermarkedImage({
  src,
  alt = "",
  className = "",
  onClick,
}: Props) {
  const [watermarkedDataUrl, setWatermarkedDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!src) return;

    let isSubscribed = true;
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      // 元画像を描画
      ctx.drawImage(img, 0, 0);

      // 平均輝度の計算
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      let totalBrightness = 0;
      let count = 0;

      for (let i = 0; i < data.length; i += 4 * 10) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        totalBrightness += 0.299 * r + 0.587 * g + 0.114 * b;
        count++;
      }

      const avgBrightness = totalBrightness / count;

      // 明るさに応じたウォーターマーク素材の切り替え
      let watermarkPath = "/watermark-lightgray.png";
      if (avgBrightness < 65) {
        watermarkPath = "/watermark-white.png";
      } else if (avgBrightness < 125) {
        watermarkPath = "/watermark-lightgray.png";
      } else if (avgBrightness < 185) {
        watermarkPath = "/watermark-darkgray.png";
      } else {
        watermarkPath = "/watermark-black.png";
      }

      // ウォーターマーク画像の合成
      const wm = new Image();
      wm.crossOrigin = "anonymous";

      wm.onload = () => {
        if (!isSubscribed) return;

        ctx.globalAlpha = 0.35;

        const targetTileWidth = Math.max(canvas.width / 3, 250);
        const scale = targetTileWidth / wm.width;
        const tileW = wm.width * scale;
        const tileH = wm.height * scale;

        for (let x = 0; x < canvas.width; x += tileW) {
          for (let y = 0; y < canvas.height; y += tileH) {
            ctx.drawImage(wm, x, y, tileW, tileH);
          }
        }

        setWatermarkedDataUrl(canvas.toDataURL("image/png"));
      };

      wm.onerror = () => {
        if (!isSubscribed) return;
        console.error(`ウォーターマーク画像が見つかりません: ${watermarkPath}`);
        setWatermarkedDataUrl(canvas.toDataURL("image/png"));
      };

      wm.src = watermarkPath;
    };

    img.src = src;

    return () => {
      isSubscribed = false;
    };
  }, [src]);

  // ローディング中表示
  if (!watermarkedDataUrl) {
    return <div className={`animate-pulse bg-white/10 ${className}`} />;
  }

  return (
    <img
      src={watermarkedDataUrl}
      alt={alt}
      className={className}
      onClick={onClick}
    />
  );
}