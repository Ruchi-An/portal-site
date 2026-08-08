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

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      // 1. Canvasの準備
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      // 元画像を描画
      ctx.drawImage(img, 0, 0);

      // 2. 元画像の「平均の明るさ（輝度）」を計算
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      let totalBrightness = 0;

      let count = 0;
      for (let i = 0; i < data.length; i += 4 * 10) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
        totalBrightness += brightness;
        count++;
      }

      const avgBrightness = totalBrightness / count;

      // 3. 4段階の明るさに応じて素材を自動切り替え
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

      // 4. ウォーターマークの読み込み＆タイリング（繰り返し）合成
      const wm = new Image();
      wm.crossOrigin = "anonymous";
      
      wm.onload = () => {
        // ★ 濃さ（透明度）を控えめ（0.35）に設定！
        // 目立ちすぎる場合は 0.25〜0.3 に、薄すぎる場合は 0.45 くらいに調整してね
        ctx.globalAlpha = 0.35; 

        // ★ 比率を保ったまま敷き詰める計算
        // サムネイルの横幅に合わせて、ウォーターマーク1個あたりの幅を決める（例: 横幅の約1/3〜1/2）
        const targetTileWidth = Math.max(canvas.width / 3, 250); 
        const scale = targetTileWidth / wm.width; 
        const tileW = wm.width * scale;  // 比率を保った幅
        const tileH = wm.height * scale; // 比率を保った高さ

        // 縦横に敷き詰めて描画（タイル配置）
        for (let x = 0; x < canvas.width; x += tileW) {
          for (let y = 0; y < canvas.height; y += tileH) {
            ctx.drawImage(wm, x, y, tileW, tileH);
          }
        }

        // 合成完了後、DataURL化
        setWatermarkedDataUrl(canvas.toDataURL("image/png"));
      };

      wm.onerror = () => {
        console.error(`ウォーターマーク画像が見つかりません: ${watermarkPath}`);
        setWatermarkedDataUrl(canvas.toDataURL("image/png"));
      };

      wm.src = watermarkPath;
    };

    img.src = src;
  }, [src]);

  // 読み込み中表示
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