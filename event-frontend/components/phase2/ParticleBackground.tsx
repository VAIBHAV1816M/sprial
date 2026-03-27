"use client";

import { useEffect, useRef } from "react";

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particlesArray: Particle[] = [];
    let animationFrameId: number;

    // Mouse interaction parameters
    let mouse = {
      x: null as number | null,
      y: null as number | null,
      radius: 100, // Distance at which dots react to the cursor
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.x;
      mouse.y = event.y;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    window.addEventListener("resize", resize);

    // Particle Class
    class Particle {
      x: number;
      y: number;
      size: number;
      baseX: number;
      baseY: number;
      density: number;
      vx: number;
      vy: number;
      color: string;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.size = Math.random() * 1.5 + 0.5; // Tiny dots
        this.density = Math.random() * 15 + 5;
        this.vx = (Math.random() - 0.5) * 0.4; // Very slow drift
        this.vy = (Math.random() - 0.5) * 0.4;
        
        // Randomly assign either the Cyan or Purple theme color
        this.color = Math.random() > 0.5 ? "rgba(0, 255, 204, 0.5)" : "rgba(167, 139, 250, 0.4)";
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }

      update() {
        // Continuous slow drift
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around screen edges smoothly
        if (this.x < -10) this.x = canvas!.width + 10;
        if (this.x > canvas!.width + 10) this.x = -10;
        if (this.y < -10) this.y = canvas!.height + 10;
        if (this.y > canvas!.height + 10) this.y = -10;

        // Mouse interaction (gentle repel)
        if (mouse.x != null && mouse.y != null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < mouse.radius) {
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let force = (mouse.radius - distance) / mouse.radius;
            let directionX = forceDirectionX * force * this.density;
            let directionY = forceDirectionY * force * this.density;

            this.x -= directionX * 0.05; // Muted the force so it's not too aggressive
            this.y -= directionY * 0.05;
          }
        }
      }
    }

    const init = () => {
      particlesArray = [];
      const numberOfParticles = (canvas.width * canvas.height) / 14000; // Optimal density
      for (let i = 0; i < numberOfParticles; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        particlesArray.push(new Particle(x, y));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
        
        // Connect dots with lines if they are close to each other
        for (let j = i; j < particlesArray.length; j++) {
          let dx = particlesArray[i].x - particlesArray[j].x;
          let dy = particlesArray[i].y - particlesArray[j].y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            // Line color matches the primary cyan, fading out over distance
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
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ opacity: 0.6 }} // Adjust this to make it more or less visible
      />
      {/* Very subtle static ambient glows in the corners to match Phase 2 vibe */}
      <div className="fixed top-[-150px] left-[-150px] w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none z-0 bg-[radial-gradient(circle,rgba(0,255,204,0.05)_0%,transparent_70%)]" />
      <div className="fixed bottom-[-150px] right-[-150px] w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none z-0 bg-[radial-gradient(circle,rgba(167,139,250,0.04)_0%,transparent_70%)]" />
    </>
  );
}