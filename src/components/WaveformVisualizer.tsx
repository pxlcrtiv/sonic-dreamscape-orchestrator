
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

  const generateWaveform = (
    frequency: number,
    waveform: string,
    amplitude: number,
    time: number,
    samples: number
  ) => {
    const points = [];
    for (let i = 0; i < samples; i++) {
      const x = (i / samples) * 4 * Math.PI;
      const t = time * 0.001 + x / frequency * 50;
      let y = 0;

      switch (waveform) {
        case 'sine':
          y = Math.sin(t);
          break;
        case 'square':
          y = Math.sign(Math.sin(t));
          break;
        case 'triangle':
          y = (2 / Math.PI) * Math.asin(Math.sin(t));
          break;
        case 'sawtooth':
          y = 2 * (t / (2 * Math.PI) - Math.floor(t / (2 * Math.PI) + 0.5));
          break;
        default:
          y = Math.sin(t);
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

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    const samples = width;
    const centerY = height / 2;
    const leftWave = generateWaveform(leftChannel.frequency, leftChannel.waveform, leftChannel.amplitude, time, samples);
    const rightWave = generateWaveform(rightChannel.frequency, rightChannel.waveform, rightChannel.amplitude, time, samples);

    // Draw left channel (top half)
    ctx.beginPath();
    ctx.strokeStyle = isPlaying ? '#06b6d4' : '#475569';
    ctx.lineWidth = 2;
    ctx.globalAlpha = isPlaying ? 1 : 0.5;

    for (let i = 0; i < samples; i++) {
      const x = (i / samples) * width;
      const y = centerY - (leftWave[i] * centerY * 0.8) / 2;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw right channel (bottom half)
    ctx.beginPath();
    ctx.strokeStyle = isPlaying ? '#f59e0b' : '#475569';
    ctx.lineWidth = 2;

    for (let i = 0; i < samples; i++) {
      const x = (i / samples) * width;
      const y = centerY + (rightWave[i] * centerY * 0.8) / 2;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw center line
    ctx.beginPath();
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.5;
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // Draw frequency labels
    ctx.globalAlpha = 1;
    ctx.font = '14px Inter, sans-serif';
    ctx.fillStyle = '#06b6d4';
    ctx.fillText(`L: ${leftChannel.frequency}Hz ${leftChannel.waveform}`, 20, 30);
    ctx.fillStyle = '#f59e0b';
    ctx.fillText(`R: ${rightChannel.frequency}Hz ${rightChannel.waveform}`, 20, height - 20);
  };

  const animate = (time: number) => {
    drawWaveform(time);
    if (isPlaying) {
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
      drawWaveform(0);
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
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      }
      drawWaveform(0);
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
