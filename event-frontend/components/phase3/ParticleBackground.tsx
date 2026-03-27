"use client";

import { useEffect, useRef } from "react";

// ⭐ We define the types here so strict mode doesn't crash
interface IParticle {
  x: number;
  y: number;
  size: number;
  density: number;
  vx: number;
  vy: number;
  color: string;
  update: (mouse: any, canvas: HTMLCanvasElement) => void;
  draw: (ctx: CanvasRenderingContext2D) => void;
}

// ⭐ THIS IS THE CRITICAL EXPORT LINE!
export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particlesArray: IParticle[] = [];

    const mouse = {
      x: null as number | null,
      y: null as number | null,
      radius: 100,
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    class Particle implements IParticle {
      x: number;
      y: number;
      size: number;
      density: number;
      vx: number;
      vy: number;
      color: string;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 1.5 + 0.5;
        this.density = Math.random() * 15 + 5;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.color = Math.random() > 0.5 ? "rgba(0, 255, 204, 0.5)" : "rgba(167, 139, 250, 0.4)";
      }

      draw(context: CanvasRenderingContext2D) {
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.closePath();
        context.fill();
      }

      update(currentMouse: any, currentCanvas: HTMLCanvasElement) {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < -10) this.x = currentCanvas.width + 10;
        if (this.x > currentCanvas.width + 10) this.x = -10;
        if (this.y < -10) this.y = currentCanvas.height + 10;
        if (this.y > currentCanvas.height + 10) this.y = -10;

        if (currentMouse.x != null && currentMouse.y != null) {
          let dx = currentMouse.x - this.x;
          let dy = currentMouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < currentMouse.radius) {
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let force = (currentMouse.radius - distance) / currentMouse.radius;
            let directionX = forceDirectionX * force * this.density;
            let directionY = forceDirectionY * force * this.density;

            this.x -= directionX * 0.05;
            this.y -= directionY * 0.05;
          }
        }
      }
    }

    const init = () => {
      particlesArray = [];
      const numberOfParticles = (canvas.width * canvas.height) / 14000;
      for (let i = 0; i < numberOfParticles; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        particlesArray.push(new Particle(x, y));
      }
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    window.addEventListener("resize", resize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update(mouse, canvas);
        particlesArray[i].draw(ctx);
        
        for (let j = i; j < particlesArray.length; j++) {
          let dx = particlesArray[i].x - particlesArray[j].x;
          let dy = particlesArray[i].y - particlesArray[j].y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 255, 204, ${0.1 - distance / 1000})`; 
            ctx.lineWidth = 0.4;
            ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
            ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    resize();
    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.6 }} />
      <div className="fixed top-[-150px] left-[-150px] w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none z-0 bg-[radial-gradient(circle,rgba(0,255,204,0.05)_0%,transparent_70%)]" />
      <div className="fixed bottom-[-150px] right-[-150px] w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none z-0 bg-[radial-gradient(circle,rgba(167,139,250,0.04)_0%,transparent_70%)]" />
    </>
  );
}