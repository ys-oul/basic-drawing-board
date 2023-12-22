import React, { useEffect, useRef, useState } from "react";

const DEFAULT_CANVAS_WIDTH = 600;
const DEFAULT_CANVAS_HEIGHT = 300;
const DEFAULT_PEN_SIZE = 5;
const colorList = [
  "#000",
  "#f00",
  "#ff8c00",
  "#ff0",
  "#008000",
  "#00f",
  "#4b0082",
  "#800080",
];

function App() {
  const [penSize, setPenSize] = useState<number>(DEFAULT_PEN_SIZE);
  const [eraserActived, setEraserActived] = useState<boolean>(false);
  const [colorIndex, setColorIndex] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio;

    canvas.style.width = DEFAULT_CANVAS_WIDTH + "px";
    canvas.style.height = DEFAULT_CANVAS_HEIGHT + "px";
    canvas.width = DEFAULT_CANVAS_WIDTH * dpr;
    canvas.height = DEFAULT_CANVAS_HEIGHT * dpr;

    ctx.scale(dpr, dpr);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, DEFAULT_CANVAS_WIDTH, DEFAULT_CANVAS_HEIGHT);
    ctx.fillStyle = "#000";

    const canvasRect = canvas.getBoundingClientRect();
    let dragging = false;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = penSize;
    ctx.translate(-canvasRect.x, -canvasRect.y);

    const draw = (e: MouseEvent) => {
      ctx.beginPath();
      ctx.arc(e.clientX, e.clientY, penSize / 2, 0, Math.PI * 2);
      ctx.fill();
    };

    const handleMousedown = (e: MouseEvent) => {
      draw(e);
      ctx.beginPath();
      ctx.moveTo(e.clientX, e.clientY);
      dragging = true;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging) return;
      ctx.lineTo(e.clientX, e.clientY);
      ctx.stroke();
      ctx.closePath();
      ctx.beginPath();
      ctx.moveTo(e.clientX, e.clientY);
    };

    const handleMouseup = () => {
      if (!dragging) return;
      ctx.closePath();
      dragging = false;
    };

    canvas.addEventListener("mousedown", handleMousedown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseup);

    return () => {
      canvas.removeEventListener("mousedown", handleMousedown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseup);
    };
    // console.log(canvas);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.lineWidth = penSize;
  }, [penSize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (eraserActived) {
      ctx.fillStyle = "#fff";
      ctx.strokeStyle = "#fff";
      return;
    }

    const currentColor = colorList[colorIndex];
    ctx.fillStyle = currentColor;
    ctx.strokeStyle = currentColor;
  }, [eraserActived, colorIndex]);

  const handleChangePenSize = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPenSize(parseInt(e.target.value));
  };

  const handleChangeEraser = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEraserActived(e.target.checked);
  };

  const handleChangecolor = (index: number) => {
    setEraserActived(false);
    setColorIndex(index);
  };

  return (
    <div>
      <div className="menu">
        <div className="menu-item">
          <strong className="menu-title">펜 굵기 {penSize}</strong>
          <div className="menu-content">
            <input
              type="range"
              min={1}
              max={30}
              value={penSize}
              className="range-input"
              onChange={handleChangePenSize}
            />
          </div>
        </div>
        <div className="menu-item">
          <strong className="menu-title">지우개</strong>
          <div className="menu-content">
            <input
              type="checkbox"
              checked={eraserActived}
              id="eraser-input"
              className="eraser-input"
              onChange={handleChangeEraser}
            />
            <label htmlFor="eraser-input" className="eraser-label" />{" "}
          </div>
        </div>
        <div className="menu-item">
          <strong className="menu-title">색상 선택</strong>
          <div className="menu-content">
            <ul className="color-list">
              {colorList.map((item, index) => (
                <li key={item} className="color-item">
                  <div
                    className="color-background"
                    style={{ background: colorList[index] }}
                  >
                    <button
                      type="button"
                      className="color-button"
                      onClick={handleChangecolor.bind(null, index)}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} />
      <div className="canvase-area"></div>
    </div>
  );
}

export default App;
