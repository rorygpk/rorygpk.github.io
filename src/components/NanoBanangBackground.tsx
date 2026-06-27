import React, { useEffect, useRef, useState } from "react";

interface NanoBanangProps {
  backgroundId: string;
  mode: "static" | "video" | "slideshow"; // 'static' is Image mode, 'video' is active moving loop, 'slideshow' is auto-changing crossfades
  customWallpaperUrl?: string; // Base64 or local drive url
  customVideoUrl?: string;
  driveFiles?: any[]; // user's uploaded files for slideshow
}

export const NanoBanangBackground: React.FC<NanoBanangProps> = ({
  backgroundId,
  mode,
  customWallpaperUrl,
  customVideoUrl,
  driveFiles = []
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [fadeOpacity, setFadeOpacity] = useState(1);
  const animationFrameId = useRef<number | null>(null);

  // Background Preloaded High-Quality Images (Unsplash high resolution for Static / Image displays)
  const presetImageUrls: { [key: string]: string[] } = {
    default: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop"
    ],
    "default-light": [
      "https://images.unsplash.com/photo-1618005198143-e5283464303b?q=80&w=1600&auto=format&fit=crop"
    ],
    russian: [
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1600&auto=format&fit=crop"
    ],
    mosaic: [
      "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1615789591457-74a63395c990?q=80&w=1600&auto=format&fit=crop"
    ],
    monet: [
      "https://images.unsplash.com/photo-1578926288207-a90a5366759d?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1600&auto=format&fit=crop"
    ],
    vangogh: [
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?q=80&w=1600&auto=format&fit=crop"
    ],
    forest: [
      "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=1600&auto=format&fit=crop"
    ],
    grassland: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?q=80&w=1600&auto=format&fit=crop"
    ],
    hunan: [
      "https://images.unsplash.com/photo-1552726053-bc2a2ec96fb7?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1600&auto=format&fit=crop"
    ],
    river: [
      "https://images.unsplash.com/photo-1455243575306-03f44ec7c6b9?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1600&auto=format&fit=crop"
    ],
    mingsha: [
      "https://images.unsplash.com/photo-1542401886-65d6c61db217?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1600&auto=format&fit=crop"
    ],
    uk: [
      "https://images.unsplash.com/photo-1513635269975-59693e2d8ce0?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?q=80&w=1600&auto=format&fit=crop"
    ],
    shenzhen: [
      "https://images.unsplash.com/photo-1520668049280-9ce3db8d5b88?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1600&auto=format&fit=crop"
    ],
    local: [
      "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?q=80&w=1600&auto=format&fit=crop" // Beautiful global metropolitan scenic
    ],
    map: [
      "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1600&auto=format&fit=crop" // Elegant vector grid/map vibe
    ]
  };

  // Extract valid image url based on state
  const getActiveImageUrl = () => {
    if (backgroundId === "custom") {
      if (customWallpaperUrl) return customWallpaperUrl;
      // Fallback to first image in cloud files if available
      const imgFiles = driveFiles.filter(f => f.type?.startsWith("image/"));
      if (imgFiles.length > 0) return imgFiles[0].dataUrl;
      return presetImageUrls["default"][0];
    }
    const list = presetImageUrls[backgroundId] || presetImageUrls["default"];
    return list[currentSlideIndex % list.length];
  };

  // Auto changing slideshow timer
  useEffect(() => {
    if (mode !== "slideshow") return;
    
    const interval = setInterval(() => {
      // Begin fade out
      setFadeOpacity(0.1);
      setTimeout(() => {
        // Change slide index
        setCurrentSlideIndex(prev => {
          if (backgroundId === "custom") {
            const imgFiles = driveFiles.filter(f => f.type?.startsWith("image/"));
            const max = Math.max(1, imgFiles.length);
            return (prev + 1) % max;
          }
          const list = presetImageUrls[backgroundId] || presetImageUrls["default"];
          return (prev + 1) % list.length;
        });
        // Fade back in
        setFadeOpacity(1);
      }, 500);
    }, 4500);

    return () => clearInterval(interval);
  }, [mode, backgroundId, driveFiles]);

  // Canvas Drawing & Animation Logic (representing real-time "video/animation" mode)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Resize handling
    const resizeCanvas = () => {
      if (containerRef.current) {
        canvas.width = containerRef.current.clientWidth;
        canvas.height = containerRef.current.clientHeight;
      }
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initializing particle systems and physics states for 60fps dynamic video rendering
    let width = canvas.width;
    let height = canvas.height;
    let frameCount = 0;

    // Tetris block particles
    interface TetrisBlock {
      x: number;
      y: number;
      size: number;
      color: string;
      speed: number;
      shape: number[][];
    }
    const tetrisBlocks: TetrisBlock[] = [];
    const tetrisColors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4"];
    const tetrisShapes = [
      [[1, 1], [1, 1]], // O-block
      [[1, 1, 1, 1]],  // I-block
      [[0, 1, 0], [1, 1, 1]], // T-block
      [[1, 1, 0], [0, 1, 1]], // Z-block
      [[0, 1, 1], [1, 1, 0]]  // S-block
    ];

    // Starry night swirling wind elements (Van Gogh)
    interface VanGoghStroke {
      x: number;
      y: number;
      radius: number;
      angle: number;
      speed: number;
      color: string;
      length: number;
    }
    const starryStrokes: VanGoghStroke[] = [];
    for (let i = 0; i < 40; i++) {
      starryStrokes.push({
        x: Math.random() * 2000,
        y: Math.random() * 800,
        radius: Math.random() * 100 + 40,
        angle: Math.random() * Math.PI * 2,
        speed: (Math.random() * 0.02 + 0.005),
        color: i % 3 === 0 ? "rgba(253, 224, 71, 0.45)" : (i % 3 === 1 ? "rgba(56, 189, 248, 0.35)" : "rgba(30, 58, 138, 0.25)"),
        length: Math.random() * 120 + 60
      });
    }

    // Grass blades and dandelion seeds (Grassland)
    interface DandelionSeed {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }
    const seeds: DandelionSeed[] = [];
    for (let i = 0; i < 25; i++) {
      seeds.push({
        x: Math.random() * 2000,
        y: Math.random() * 1000,
        vx: Math.random() * 1.5 + 0.5,
        vy: (Math.random() * -0.5 - 0.2),
        size: Math.random() * 3 + 1.5,
        opacity: Math.random() * 0.6 + 0.4
      });
    }

    // River flows (River sinus waves)
    interface RiverWave {
      y: number;
      length: number;
      amplitude: number;
      speed: number;
      color: string;
    }
    const riverWaves: RiverWave[] = [
      { y: 0.6, length: 0.005, amplitude: 35, speed: 0.04, color: "rgba(59, 130, 246, 0.15)" },
      { y: 0.7, length: 0.003, amplitude: 50, speed: -0.03, color: "rgba(37, 99, 235, 0.12)" },
      { y: 0.8, length: 0.006, amplitude: 25, speed: 0.05, color: "rgba(147, 197, 253, 0.18)" }
    ];

    // Forest leaves & sunbeam shadows (Forest)
    interface Leaf {
      x: number;
      y: number;
      speedY: number;
      speedX: number;
      size: number;
      rotation: number;
      rotationSpeed: number;
      color: string;
    }
    const forestLeaves: Leaf[] = [];
    for (let i = 0; i < 30; i++) {
      forestLeaves.push({
        x: Math.random() * 2000,
        y: Math.random() * -100,
        speedY: Math.random() * 1.5 + 0.8,
        speedX: Math.random() * 1 - 0.5,
        size: Math.random() * 14 + 6,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: Math.random() * 0.03 - 0.015,
        color: i % 2 === 0 ? "rgba(34, 197, 94, 0.5)" : "rgba(132, 204, 22, 0.4)"
      });
    }

    // Shenzhen / Cyberpunk dynamic laser lines
    interface ShenzhenLaser {
      x: number;
      y: number;
      color: string;
      length: number;
      speed: number;
    }
    const lasers: ShenzhenLaser[] = [];
    for (let i = 0; i < 6; i++) {
      lasers.push({
        x: Math.random() * 1800,
        y: Math.random() * 800,
        color: i % 2 === 0 ? "#ec4899" : "#06b6d4",
        length: Math.random() * 150 + 100,
        speed: Math.random() * 4 + 2
      });
    }

    // Mingsha sand grains (Desert sandstorm)
    interface SandGrain {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
    }
    const sandParticles: SandGrain[] = [];
    for (let i = 0; i < 150; i++) {
      sandParticles.push({
        x: Math.random() * 2000,
        y: Math.random() * 1000,
        vx: Math.random() * 4 + 2,
        vy: Math.random() * 0.5 + 0.1,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.4 + 0.1
      });
    }

    // Preloaded image element to draw image underneath canvas animation
    const imgObj = new Image();
    imgObj.src = getActiveImageUrl();

    // Re-draw if image sources or indexes change
    imgObj.onload = () => {
      // Trigger a direct redraw
    };

    // Main 60fps dynamic rendering animation loop
    const render = () => {
      width = canvas.width;
      height = canvas.height;
      frameCount++;

      // Clear Canvas
      ctx.clearRect(0, 0, width, height);

      // Step 1: Draw Static Background Image under animation
      if (imgObj.complete && imgObj.naturalWidth > 0) {
        // Draw centered and scaled (cover)
        const imgWidth = imgObj.width;
        const imgHeight = imgObj.height;
        const ratio = Math.max(width / imgWidth, height / imgHeight);
        const newWidth = imgWidth * ratio;
        const newHeight = imgHeight * ratio;
        const x = (width - newWidth) / 2;
        const y = (height - newHeight) / 2;
        ctx.globalAlpha = 1.0;
        ctx.drawImage(imgObj, x, y, newWidth, newHeight);
      } else {
        // Safe solid gradient fallback
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        if (backgroundId.includes("light")) {
          gradient.addColorStop(0, "#f8fafc");
          gradient.addColorStop(1, "#e2e8f0");
        } else if (backgroundId === "russian") {
          gradient.addColorStop(0, "#0c0a09");
          gradient.addColorStop(1, "#1c1917");
        } else if (backgroundId === "monet") {
          gradient.addColorStop(0, "#1e1b4b");
          gradient.addColorStop(1, "#311042");
        } else {
          gradient.addColorStop(0, "#090d16");
          gradient.addColorStop(1, "#111827");
        }
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }

      // Step 2: Overlay Dynamic Canvas Video/Animation Elements
      if (mode === "video") {
        ctx.globalAlpha = 1.0;

        // 1. 多彩俄罗斯风格(块) - falling / moving geometric Tetris blocks
        if (backgroundId === "russian") {
          // Spawn block
          if (frameCount % 45 === 0 && tetrisBlocks.length < 20) {
            const size = Math.random() * 25 + 15;
            tetrisBlocks.push({
              x: Math.random() * width,
              y: -50,
              size,
              color: tetrisColors[Math.floor(Math.random() * tetrisColors.length)],
              speed: Math.random() * 1.5 + 0.5,
              shape: tetrisShapes[Math.floor(Math.random() * tetrisShapes.length)]
            });
          }
          // Move and draw
          tetrisBlocks.forEach((block, index) => {
            block.y += block.speed;
            if (block.y > height + 50) {
              tetrisBlocks.splice(index, 1);
              return;
            }
            // Draw Block Shape
            ctx.fillStyle = block.color;
            ctx.shadowColor = block.color;
            ctx.shadowBlur = 15;
            block.shape.forEach((row, rIdx) => {
              row.forEach((cell, cIdx) => {
                if (cell) {
                  ctx.fillRect(
                    block.x + cIdx * block.size,
                    block.y + rIdx * block.size,
                    block.size - 2,
                    block.size - 2
                  );
                }
              });
            });
            ctx.shadowBlur = 0; // reset
          });
        }

        // 2. 黑白马赛克图案 - Opacity-shifting monochrome grids
        else if (backgroundId === "mosaic") {
          const gridSize = 40;
          ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
          ctx.lineWidth = 1;
          
          for (let x = 0; x < width; x += gridSize) {
            for (let y = 0; y < height; y += gridSize) {
              // Shifting grids
              const opacity = (Math.sin((x * 0.01 + y * 0.01 + frameCount * 0.05)) + 1) / 2 * 0.15;
              ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
              ctx.fillRect(x, y, gridSize - 1, gridSize - 1);
            }
          }
        }

        // 3. 莫奈名画 - Gentle water ripples and specular lens shimmer
        else if (backgroundId === "monet") {
          ctx.fillStyle = "rgba(255, 255, 255, 0.01)";
          for (let i = 0; i < 4; i++) {
            const rx = Math.sin(frameCount * 0.01 + i) * (width * 0.3) + (width * 0.5);
            const ry = Math.cos(frameCount * 0.008 + i) * (height * 0.3) + (height * 0.5);
            const rSize = Math.sin(frameCount * 0.012 + i) * 80 + 150;
            const grad = ctx.createRadialGradient(rx, ry, 10, rx, ry, rSize);
            grad.addColorStop(0, "rgba(232, 121, 249, 0.15)");
            grad.addColorStop(1, "rgba(59, 130, 246, 0)");
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, width, height);
          }
        }

        // 4. 梵高名画 - Swirling yellow, light blue, and deep blue starry night spirals!
        else if (backgroundId === "vangogh") {
          starryStrokes.forEach(stroke => {
            stroke.angle += stroke.speed;
            const cx = stroke.x + Math.cos(stroke.angle) * stroke.radius;
            const cy = stroke.y + Math.sin(stroke.angle) * stroke.radius;

            // Draw swirling stroke line
            ctx.strokeStyle = stroke.color;
            ctx.lineWidth = 5;
            ctx.lineCap = "round";
            ctx.shadowColor = stroke.color;
            ctx.shadowBlur = 10;
            
            ctx.beginPath();
            ctx.arc(stroke.x, stroke.y, stroke.radius, stroke.angle, stroke.angle + Math.PI * 0.3);
            ctx.stroke();
            ctx.shadowBlur = 0;
          });
        }

        // 5. 森树 - Swaying foliage and falling green/yellow leaves with sunrays
        else if (backgroundId === "forest") {
          // Falling leaves
          forestLeaves.forEach((leaf) => {
            leaf.y += leaf.speedY;
            leaf.x += Math.sin(frameCount * 0.02 + leaf.y * 0.01) * 0.5 + leaf.speedX;
            leaf.rotation += leaf.rotationSpeed;

            if (leaf.y > height + 20) {
              leaf.y = -20;
              leaf.x = Math.random() * width;
            }

            // Draw leaf
            ctx.save();
            ctx.translate(leaf.x, leaf.y);
            ctx.rotate(leaf.rotation);
            ctx.fillStyle = leaf.color;
            ctx.beginPath();
            ctx.ellipse(0, 0, leaf.size, leaf.size / 2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          });

          // Sunrays moving angles
          const rayAngle = Math.sin(frameCount * 0.002) * 15 + 45;
          ctx.strokeStyle = "rgba(254, 240, 138, 0.04)";
          ctx.lineWidth = 120;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(width * 1.5, height * 1.5);
          ctx.stroke();
        }

        // 6. 草原 - Wind ripples on green landscape and flying dandelions
        else if (backgroundId === "grassland") {
          seeds.forEach(seed => {
            seed.x += seed.vx;
            seed.y += seed.vy + Math.sin(frameCount * 0.03 + seed.x * 0.02) * 0.4;
            
            if (seed.x > width + 50 || seed.y < -50) {
              seed.x = -20;
              seed.y = Math.random() * height;
            }

            // Draw fluffy dandelion seed
            ctx.fillStyle = `rgba(255, 255, 255, ${seed.opacity})`;
            ctx.beginPath();
            ctx.arc(seed.x, seed.y, seed.size, 0, Math.PI * 2);
            ctx.fill();

            // Tiny stem
            ctx.strokeStyle = `rgba(255, 255, 255, ${seed.opacity * 0.3})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(seed.x, seed.y);
            ctx.lineTo(seed.x - seed.size * 2, seed.y + seed.size * 2);
            ctx.stroke();
          });
        }

        // 7. 湖南楼房 - Rising mist and beautiful hanging red lantern sway
        else if (backgroundId === "hunan") {
          // Mist circles
          for (let i = 0; i < 3; i++) {
            const mx = (frameCount * 0.4 + i * 400) % (width + 300) - 150;
            const my = height * 0.7 + Math.sin(frameCount * 0.01 + i) * 30;
            const grad = ctx.createRadialGradient(mx, my, 20, mx, my, 200);
            grad.addColorStop(0, "rgba(255, 255, 255, 0.06)");
            grad.addColorStop(1, "rgba(255, 255, 255, 0)");
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, width, height);
          }

          // Red Lantern glow sways
          ctx.shadowColor = "#f43f5e";
          ctx.shadowBlur = 20;
          ctx.fillStyle = "rgba(244, 63, 94, 0.75)";
          const sway = Math.sin(frameCount * 0.03) * 8;
          ctx.fillRect(width * 0.1 + sway, 100, 20, 25);
          ctx.fillRect(width * 0.85 + sway, 150, 25, 32);
          ctx.shadowBlur = 0;
        }

        // 8. 江河 - Beautiful sinus waves flowing peacefully
        else if (backgroundId === "river") {
          riverWaves.forEach(wave => {
            ctx.fillStyle = wave.color;
            ctx.beginPath();
            ctx.moveTo(0, height);
            for (let x = 0; x <= width; x += 10) {
              const y = height * wave.y + Math.sin(x * wave.length + frameCount * 0.02) * wave.amplitude;
              ctx.lineTo(x, y);
            }
            ctx.lineTo(width, height);
            ctx.closePath();
            ctx.fill();
          });
        }

        // 9. 鸣沙山/莫高 - Sand dust particles drifting under desert heat waves
        else if (backgroundId === "mingsha") {
          sandParticles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x > width + 50) {
              p.x = -20;
              p.y = Math.random() * height;
            }
            ctx.fillStyle = `rgba(245, 158, 11, ${p.alpha})`;
            ctx.fillRect(p.x, p.y, p.size, p.size);
          });
        }

        // 10. 英国 - Rotating hands of Big Ben clock tower and rolling heavy fog
        else if (backgroundId === "uk") {
          // Clock Face at center
          const clockX = width * 0.75;
          const clockY = height * 0.3;
          ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(clockX, clockY, 80, 0, Math.PI * 2);
          ctx.stroke();

          // Hour/Minute hands
          const minuteAngle = (frameCount * 0.005) % (Math.PI * 2);
          const hourAngle = (frameCount * 0.00041) % (Math.PI * 2);
          ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(clockX, clockY);
          ctx.lineTo(clockX + Math.cos(minuteAngle) * 65, clockY + Math.sin(minuteAngle) * 65);
          ctx.stroke();

          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(clockX, clockY);
          ctx.lineTo(clockX + Math.cos(hourAngle) * 45, clockY + Math.sin(hourAngle) * 45);
          ctx.stroke();

          // London Fog rolling
          for (let i = 0; i < 3; i++) {
            const fx = (frameCount * 0.15 + i * 500) % (width + 400) - 200;
            const fy = height * 0.5 + Math.cos(frameCount * 0.005 + i) * 80;
            const fogGrad = ctx.createRadialGradient(fx, fy, 50, fx, fy, 350);
            fogGrad.addColorStop(0, "rgba(241, 245, 249, 0.05)");
            fogGrad.addColorStop(1, "rgba(241, 245, 249, 0)");
            ctx.fillStyle = fogGrad;
            ctx.fillRect(0, 0, width, height);
          }
        }

        // 11. 深圳 - Cyberpunk neon beams scanning and laser lights
        else if (backgroundId === "shenzhen") {
          lasers.forEach(laser => {
            laser.y += laser.speed;
            if (laser.y > height + laser.length) {
              laser.y = -laser.length;
              laser.x = Math.random() * width;
            }

            // Laser stroke
            const laserGrad = ctx.createLinearGradient(laser.x, laser.y, laser.x, laser.y + laser.length);
            laserGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
            laserGrad.addColorStop(0.5, laser.color);
            laserGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
            
            ctx.strokeStyle = laserGrad;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(laser.x, laser.y);
            ctx.lineTo(laser.x, laser.y + laser.length);
            ctx.stroke();
          });

          // Moving sweeping searchlights
          const sweep = Math.sin(frameCount * 0.006) * (width * 0.4) + (width * 0.5);
          const sweepGrad = ctx.createLinearGradient(width, height, sweep, 0);
          sweepGrad.addColorStop(0, "rgba(6, 182, 212, 0.15)");
          sweepGrad.addColorStop(1, "rgba(6, 182, 212, 0)");
          ctx.fillStyle = sweepGrad;
          ctx.beginPath();
          ctx.moveTo(width, height);
          ctx.lineTo(sweep - 100, 0);
          ctx.lineTo(sweep + 100, 0);
          ctx.closePath();
          ctx.fill();
        }

        // 12. 用户所在地区名景 (Foshan Zumiao fallback) - Swaying flower blossoms
        else if (backgroundId === "local") {
          // Dynamic cherry blossoms/plum blossoms falling over the local scenery card
          if (frameCount % 60 === 0 && forestLeaves.length < 50) {
            forestLeaves.push({
              x: Math.random() * width,
              y: -20,
              speedY: Math.random() * 1.2 + 0.5,
              speedX: Math.random() * 0.8 - 0.4,
              size: Math.random() * 8 + 4,
              rotation: Math.random() * Math.PI,
              rotationSpeed: Math.random() * 0.02 - 0.01,
              color: "rgba(251, 207, 232, 0.75)" // Blossom pink!
            });
          }
          forestLeaves.forEach((leaf) => {
            leaf.y += leaf.speedY;
            leaf.x += leaf.speedX + Math.sin(frameCount * 0.01) * 0.2;
            ctx.save();
            ctx.translate(leaf.x, leaf.y);
            ctx.rotate(leaf.rotation);
            ctx.fillStyle = leaf.color;
            ctx.beginPath();
            ctx.arc(0, 0, leaf.size, 0, Math.PI, true);
            ctx.fill();
            ctx.restore();
          });
        }

        // 13. 用户地区地图 - Interactive pulsing radar rings mapping coordinates
        else if (backgroundId === "map") {
          const centerX = width * 0.5;
          const centerY = height * 0.5;
          
          // Draw Radar Scanner sweep line
          const angle = (frameCount * 0.015) % (Math.PI * 2);
          const radarGrad = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, Math.min(width, height) * 0.4);
          radarGrad.addColorStop(0, "rgba(59, 130, 246, 0.08)");
          radarGrad.addColorStop(1, "rgba(59, 130, 246, 0)");
          
          ctx.fillStyle = radarGrad;
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.arc(centerX, centerY, Math.min(width, height) * 0.4, angle, angle + 0.3);
          ctx.closePath();
          ctx.fill();

          // Pulsing target nodes
          for (let i = 0; i < 4; i++) {
            const pulseSize = ((frameCount + i * 90) % 360) * 0.8;
            ctx.strokeStyle = `rgba(59, 130, 246, ${Math.max(0, 1 - pulseSize / 288)})`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(centerX + (i % 2 === 0 ? 150 : -150), centerY + (i > 1 ? 120 : -120), pulseSize % 180, 0, Math.PI * 2);
            ctx.stroke();

            // Core dot
            ctx.fillStyle = "#3b82f6";
            ctx.beginPath();
            ctx.arc(centerX + (i % 2 === 0 ? 150 : -150), centerY + (i > 1 ? 120 : -120), 4, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    // Begin Rendering Loop
    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [backgroundId, mode, customWallpaperUrl, customVideoUrl, driveFiles, currentSlideIndex]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none z-0 transition-opacity duration-500"
      style={{ opacity: fadeOpacity }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
    </div>
  );
};
