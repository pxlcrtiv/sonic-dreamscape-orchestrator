
import React, { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';

interface WaveformVisualizerProps {
  leftChannel: {
    frequency: number;
    waveform: string;
    amplitude: number;
  };
  rightChannel: {
    frequency: number;
    waveform: string;
    amplitude: number;
  };
  isPlaying: boolean;
  masterVolume: number;
}

const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  leftChannel,
  rightChannel,
  isPlaying,
  masterVolume
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const timeRef = useRef(0);

  const generateWaveform = (
    frequency: number,
    waveform: string,
    amplitude: number,
    time: number,
    samples: number
  ) => {
    const points = [];
    for (let i = 0; i < samples; i++) {
      const x = (i / samples) * 8 * Math.PI; // More cycles for better visualization
      const t = time * 0.005 + x / Math.max(frequency / 100, 1); // Better time scaling
      let y = 0;

      switch (waveform) {
        case 'sine':
          y = Math.sin(t * frequency / 50);
          break;
        case 'square':
          y = Math.sign(Math.sin(t * frequency / 50));
          break;
        case 'triangle':
          y = (2 / Math.PI) * Math.asin(Math.sin(t * frequency / 50));
          break;
        case 'sawtooth':
          const period = (2 * Math.PI) / (frequency / 50);
          y = 2 * ((t % period) / period - 0.5);
          break;
        default:
          y = Math.sin(t * frequency / 50);
      }

      points.push(y * amplitude * masterVolume);
    }
    return points;
  };

  const drawWaveform = (time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const { width, height } = canvas;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    const samples = Math.floor(width / 2); // Reduce samples for better performance
    const centerY = height / 2;
    
    try {
      const leftWave = generateWaveform(leftChannel.frequency, leftChannel.waveform, leftChannel.amplitude, time, samples);
      const rightWave = generateWaveform(rightChannel.frequency, rightChannel.waveform, rightChannel.amplitude, time, samples);

      // Draw left channel (top half)
      ctx.beginPath();
      ctx.strokeStyle = isPlaying ? '#06b6d4' : '#64748b';
      ctx.lineWidth = 2;
      ctx.globalAlpha = isPlaying ? 1 : 0.5;

      for (let i = 0; i < samples; i++) {
        const x = (i / samples) * width;
        const y = centerY - (leftWave[i] * (centerY * 0.7));
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Draw right channel (bottom half)
      ctx.beginPath();
      ctx.strokeStyle = isPlaying ? '#f59e0b' : '#64748b';
      ctx.lineWidth = 2;

      for (let i = 0; i < samples; i++) {
        const x = (i / samples) * width;
        const y = centerY + (rightWave[i] * (centerY * 0.7));
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Draw center line
      ctx.beginPath();
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.3;
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();

      // Draw frequency labels with better positioning
      ctx.globalAlpha = 1;
      ctx.font = '12px Inter, sans-serif';
      ctx.fillStyle = '#06b6d4';
      ctx.fillText(`L: ${leftChannel.frequency}Hz ${leftChannel.waveform}`, 16, 24);
      ctx.fillStyle = '#f59e0b';
      ctx.fillText(`R: ${rightChannel.frequency}Hz ${rightChannel.waveform}`, 16, height - 12);
    } catch (error) {
      console.error('Error drawing waveform:', error);
    }
  };

  const animate = (currentTime: number) => {
    if (isPlaying) {
      timeRef.current = currentTime;
      drawWaveform(currentTime);
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      drawWaveform(timeRef.current);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, leftChannel, rightChannel, masterVolume]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      canvas.width = rect.width * dpr;
      canvas.height = 256 * dpr;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
      
      canvas.style.width = rect.width + 'px';
      canvas.style.height = '256px';
      
      drawWaveform(timeRef.current);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-600">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Waveform Visualization</h3>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
              <span className="text-gray-300">Left Channel</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
              <span className="text-gray-300">Right Channel</span>
            </div>
          </div>
        </div>
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="w-full h-64 bg-slate-900/50 rounded-lg border border-slate-700"
            style={{ width: '100%', height: '256px' }}
          />
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/30 rounded-lg">
              <div className="text-gray-400 text-lg">Press play to see live waveforms</div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default WaveformVisualizer;
