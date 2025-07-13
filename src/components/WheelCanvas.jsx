import React, { useEffect, useRef, forwardRef } from 'react';
import { motion } from 'framer-motion';

const WheelCanvas = forwardRef(({ names, rotation, isSpinning }, ref) => {
  const canvasRef = useRef(null);

  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || names.length === 0) return;

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw wheel sections
    const anglePerSection = (2 * Math.PI) / names.length;
    
    names.forEach((name, index) => {
      const startAngle = index * anglePerSection;
      const endAngle = (index + 1) * anglePerSection;
      
      // Draw section
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = colors[index % colors.length];
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + anglePerSection / 2);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 16px Arial';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 2;
      
      const textRadius = radius * 0.7;
      ctx.fillText(name, textRadius, 0);
      ctx.restore();
    });

    // Draw pointer
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - radius - 10);
    ctx.lineTo(centerX - 15, centerY - radius + 10);
    ctx.lineTo(centerX + 15, centerY - radius + 10);
    ctx.closePath();
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [names]);

  if (names.length === 0) return null;

  return (
    <div className="relative w-full max-w-sm mx-auto">
      <motion.div
        animate={{ rotate: rotation }}
        transition={{
          duration: isSpinning ? 3 : 0,
          ease: isSpinning ? [0.17, 0.67, 0.12, 0.99] : 'linear'
        }}
        className="w-full"
      >
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          className="w-full h-auto rounded-full shadow-2xl"
        />
      </motion.div>
    </div>
  );
});

WheelCanvas.displayName = 'WheelCanvas';

export default WheelCanvas;