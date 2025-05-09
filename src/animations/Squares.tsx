import React, { useRef, useEffect } from "react";
import "./Squares.css";

interface SquaresProps {
  direction?: "diagonal" | "up" | "right" | "down" | "left";
  speed?: number;
  borderColor: string;
  squareSize?: number;
  gravityRadius?: number;
  gravityStrength?: number;
  gravitySizeFactor?: number;
  hoverFillColor: string;
  fadeDuration?: number;
  hoverStrength?: number;
  particleCount?: number;
  glowIntensity?: number;
  squareFillOpacity?: number;
  squareBorderOpacity?: number; // New prop for border opacity
}

const Squares: React.FC<SquaresProps> = ({
  hoverFillColor,
  borderColor,
  direction = "diagonal",
  speed = 1,
  squareSize = 40,
  gravityRadius = 150,
  gravityStrength = 10,
  gravitySizeFactor = 0.4,
  fadeDuration = 4000,
  hoverStrength = 1.5,
  particleCount = 1,
  glowIntensity = 15,
  squareFillOpacity = 0.1,
  squareBorderOpacity = 0.53, // Matches original #88 opacity
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const gridOffset = useRef({ x: 0, y: 0 });
  const activeSquaresRef = useRef<
    Map<string, { time: number; x: number; y: number }>
  >(new Map());
  const particlesRef = useRef<
    Array<{ x: number; y: number; vx: number; vy: number; life: number }>
  >([]);
  const timeRef = useRef(0);
  const lastRenderTime = useRef(0);

  const getKey = (x: number, y: number) => `${x},${y}`;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Canvas ref is null");
      return;
    }
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) {
      console.error("Canvas context is null");
      return;
    }

    const resize = () => {
      try {
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
        console.log("Canvas resized:", canvas.width, canvas.height);
      } catch (e) {
        console.error("Resize error:", e);
      }
    };
    window.addEventListener("resize", resize);
    resize();

    const createTrailGradient = (x: number, y: number, size: number) => {
      try {
        const g = ctx.createRadialGradient(
          x + size / 2,
          y + size / 2,
          0,
          x + size / 2,
          y + size / 2,
          size
        );
        g.addColorStop(0, "#ffffff");
        g.addColorStop(0.5, `${hoverFillColor}dd`);
        g.addColorStop(1, "#00000000");
        return g;
      } catch (e) {
        console.error("Trail gradient error:", e);
        return hoverFillColor;
      }
    };

    const createParticle = (x: number, y: number, size: number) => {
      try {
        if (particlesRef.current.length > 150) return;
        for (let i = 0; i < particleCount; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 2 + 0.5;
          particlesRef.current.push({
            x: x + size / 2,
            y: y + size / 2,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 1,
          });
        }
        console.log("Particles created:", particlesRef.current.length);
      } catch (e) {
        console.error("Create particle error:", e);
      }
    };

    const updateParticles = () => {
      try {
        particlesRef.current = particlesRef.current.filter((p) => p.life > 0);
        particlesRef.current.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 0.015;
        });
      } catch (e) {
        console.error("Update particles error:", e);
      }
    };

    const drawParticles = () => {
      try {
        ctx.fillStyle = "#ffffff";
        ctx.globalAlpha = 0.9;
        particlesRef.current.forEach((p, index) => {
          const size = Math.max(p.life * 4, 0.1); // Clamp to prevent negative radius
          if (size <= 0) {
            console.warn(
              `Particle ${index} has invalid size: ${size}, life: ${p.life}`
            );
            return;
          }
          ctx.beginPath();
          ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1;
      } catch (e) {
        console.error("Draw particles error:", e);
      }
    };

    const drawGrid = (time: number) => {
      try {
        timeRef.current = time * 0.001;
        if (!ctx) {
          console.error("Context is null in drawGrid");
          return;
        }

        console.log("Drawing frame at time:", time);

        ctx.save();
        ctx.globalAlpha = 1;

        if (time - lastRenderTime.current > 1000) {
          console.warn("Forcing redraw due to long pause");
        }
        lastRenderTime.current = time;

        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

        const cols = Math.ceil(window.innerWidth / squareSize) + 2;
        const rows = Math.ceil(window.innerHeight / squareSize) + 2;
        const offsetX = gridOffset.current.x % squareSize;
        const offsetY = gridOffset.current.y % squareSize;

        updateParticles();
        drawParticles();

        for (let i = -1; i < cols; i++) {
          for (let j = -1; j < rows; j++) {
            const baseX = i * squareSize - offsetX;
            const baseY = j * squareSize - offsetY;

            const centerX = baseX + squareSize / 2;
            const centerY = baseY + squareSize / 2;
            const dx = mouseRef.current.x - centerX;
            const dy = mouseRef.current.y - centerY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            let scale = 1;
            if (dist < gravityRadius) {
              const t = 1 - dist / gravityRadius;
              const force = t * t;
              scale = 1 - gravitySizeFactor * force;
            }

            const size = squareSize * scale;
            const x = baseX + (squareSize - size) / 2;
            const y = baseY + (squareSize - size) / 2;

            const key = getKey(i, j);
            if (activeSquaresRef.current.has(key)) {
              const { time: start } = activeSquaresRef.current.get(key)!;
              const elapsed = Date.now() - start;
              if (elapsed < fadeDuration) {
                const t = elapsed / fadeDuration;
                const eased = 1 - t * t * (3 - 2 * t);

                ctx.fillStyle = createTrailGradient(x, y, size);
                ctx.globalAlpha = eased * hoverStrength;
                ctx.fillRect(x, y, size, size);
                ctx.globalAlpha = 1;
              } else {
                activeSquaresRef.current.delete(key);
                console.log("Removed square:", key);
              }
            }

            ctx.beginPath();
            ctx.rect(x, y, size, size);
            // Convert squareBorderOpacity (0-1) to hex (00-FF)
            const hexOpacity = Math.round(squareBorderOpacity * 255)
              .toString(16)
              .padStart(2, "0");
            ctx.strokeStyle = `${borderColor}${hexOpacity}`;
            ctx.fillStyle = `rgba(255, 255, 255, ${squareFillOpacity})`;
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.fill();
          }
        }

        console.log(
          `Active Squares: ${activeSquaresRef.current.size}, Particles: ${particlesRef.current.length}, Grid Offset:`,
          gridOffset.current
        );

        ctx.restore();
      } catch (e) {
        console.error("Draw grid error:", e);
      }
    };

    const updateOffset = (deltaTime: number) => {
      try {
        const s = Math.max(speed, 0.1) * deltaTime * 30;
        switch (direction) {
          case "right":
            gridOffset.current.x =
              (gridOffset.current.x - s + squareSize) % squareSize;
            break;
          case "left":
            gridOffset.current.x =
              (gridOffset.current.x + s + squareSize) % squareSize;
            break;
          case "up":
            gridOffset.current.y =
              (gridOffset.current.y + s + squareSize) % squareSize;
            break;
          case "down":
            gridOffset.current.y =
              (gridOffset.current.y - s + squareSize) % squareSize;
            break;
          case "diagonal":
            gridOffset.current.x =
              (gridOffset.current.x - s + squareSize) % squareSize;
            gridOffset.current.y =
              (gridOffset.current.y - s + squareSize) % squareSize;
            break;
        }
        console.log("Grid offset updated:", gridOffset.current);
      } catch (e) {
        console.error("Update offset error:", e);
      }
    };

    let lastTime = 0;
    const loop = (time: number) => {
      try {
        const deltaTime = (time - lastTime) / 1000;
        lastTime = time;
        updateOffset(deltaTime);
        drawGrid(time);
        requestRef.current = requestAnimationFrame(loop);
        console.log("Animation loop running at time:", time);
      } catch (e) {
        console.error("Animation loop error:", e);
        requestRef.current = requestAnimationFrame(loop);
      }
    };

    let lastMouseMove = 0;
    const handleMouseMove = (e: MouseEvent) => {
      try {
        if (Date.now() - lastMouseMove < 30) return;
        lastMouseMove = Date.now();
        mouseRef.current = { x: e.clientX, y: e.clientY };
        const i = Math.floor((e.clientX + gridOffset.current.x) / squareSize);
        const j = Math.floor((e.clientY + gridOffset.current.y) / squareSize);
        const key = getKey(i, j);
        if (!activeSquaresRef.current.has(key)) {
          const baseX = i * squareSize - gridOffset.current.x;
          const baseY = j * squareSize - gridOffset.current.y;
          activeSquaresRef.current.set(key, {
            time: Date.now(),
            x: baseX,
            y: baseY,
          });
          createParticle(baseX, baseY, squareSize);
          console.log("Added square:", key, "at", baseX, baseY);
        }
      } catch (e) {
        console.error("Mouse move error:", e);
      }
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    requestRef.current = requestAnimationFrame(loop);
    console.log("Animation loop started");

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      console.log("Animation loop stopped");
    };
  }, [
    direction,
    speed,
    squareSize,
    gravityRadius,
    gravityStrength,
    gravitySizeFactor,
    borderColor,
    fadeDuration,
    hoverStrength,
    hoverFillColor,
    particleCount,
    glowIntensity,
    squareFillOpacity,
    squareBorderOpacity, // Add to dependency array
  ]);

  return <canvas ref={canvasRef} className="squares-canvas" />;
};

export default Squares;
