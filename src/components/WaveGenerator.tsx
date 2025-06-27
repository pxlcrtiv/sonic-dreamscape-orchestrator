
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Play, Square, Download, Waves, Volume2 } from 'lucide-react';
import WaveformVisualizer from './WaveformVisualizer';
import ChannelControl from './ChannelControl';

const WaveGenerator = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [leftChannel, setLeftChannel] = useState({
    frequency: 528,
    waveform: 'sine',
    amplitude: 0.5
  });
  const [rightChannel, setRightChannel] = useState({
    frequency: 528,
    waveform: 'sine',
    amplitude: 0.5
  });
  const [linkedChannels, setLinkedChannels] = useState(true);
  const [masterVolume, setMasterVolume] = useState(0.7);

  const healingFrequencies = [
    { name: 'Solfeggio 528Hz', freq: 528, color: 'from-green-400 to-emerald-600' },
    { name: 'Earth 432Hz', freq: 432, color: 'from-blue-400 to-cyan-600' },
    { name: 'Crown 963Hz', freq: 963, color: 'from-purple-400 to-violet-600' },
    { name: 'CE5 1111Hz', freq: 1111, color: 'from-yellow-400 to-orange-600' },
  ];

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleFrequencyChange = (channel: 'left' | 'right', frequency: number) => {
    if (channel === 'left') {
      setLeftChannel(prev => ({ ...prev, frequency }));
      if (linkedChannels) {
        setRightChannel(prev => ({ ...prev, frequency }));
      }
    } else {
      setRightChannel(prev => ({ ...prev, frequency }));
      if (linkedChannels) {
        setLeftChannel(prev => ({ ...prev, frequency }));
      }
    }
  };

  const handleWaveformChange = (channel: 'left' | 'right', waveform: string) => {
    if (channel === 'left') {
      setLeftChannel(prev => ({ ...prev, waveform }));
      if (linkedChannels) {
        setRightChannel(prev => ({ ...prev, waveform }));
      }
    } else {
      setRightChannel(prev => ({ ...prev, waveform }));
      if (linkedChannels) {
        setLeftChannel(prev => ({ ...prev, waveform }));
      }
    }
  };

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Waves className="w-8 h-8 text-cyan-400" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Quantum Wave Generator
          </h1>
        </div>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Generate healing frequencies, binaural beats, and custom waveforms for sound therapy, CE5 protocols, and acoustic experimentation
        </p>
      </div>

      {/* Healing Frequency Presets */}
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-600">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Healing Frequencies</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {healingFrequencies.map((freq) => (
              <Button
                key={freq.freq}
                variant="outline"
                className={`bg-gradient-to-r ${freq.color} hover:scale-105 transition-all duration-200 border-0 text-white font-medium`}
                onClick={() => handleFrequencyChange('left', freq.freq)}
              >
                <div className="text-center">
                  <div className="text-sm">{freq.name}</div>
                  <div className="text-xs opacity-90">{freq.freq}Hz</div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Waveform Visualizer */}
      <WaveformVisualizer 
        leftChannel={leftChannel}
        rightChannel={rightChannel}
        isPlaying={isPlaying}
        masterVolume={masterVolume}
      />

      {/* Channel Controls */}
      <div className="grid md:grid-cols-2 gap-6">
        <ChannelControl
          channel="left"
          config={leftChannel}
          onFrequencyChange={(freq) => handleFrequencyChange('left', freq)}
          onWaveformChange={(wave) => handleWaveformChange('left', wave)}
          onAmplitudeChange={(amp) => setLeftChannel(prev => ({ ...prev, amplitude: amp }))}
          linkedChannels={linkedChannels}
        />
        <ChannelControl
          channel="right"
          config={rightChannel}
          onFrequencyChange={(freq) => handleFrequencyChange('right', freq)}
          onWaveformChange={(wave) => handleWaveformChange('right', wave)}
          onAmplitudeChange={(amp) => setRightChannel(prev => ({ ...prev, amplitude: amp }))}
          linkedChannels={linkedChannels}
        />
      </div>

      {/* Master Controls */}
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-600">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Master Controls</h3>
            <div className="flex items-center gap-2">
              <Badge variant={linkedChannels ? "default" : "secondary"}>
                {linkedChannels ? "Linked" : "Independent"}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLinkedChannels(!linkedChannels)}
                className="border-slate-600 text-white hover:bg-slate-700"
              >
                {linkedChannels ? "Unlink" : "Link"} Channels
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-center">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white">
                <Volume2 className="w-4 h-4" />
                <span>Master Volume</span>
              </div>
              <Slider
                value={[masterVolume]}
                onValueChange={(value) => setMasterVolume(value[0])}
                max={1}
                min={0}
                step={0.01}
                className="w-full"
              />
              <div className="text-sm text-gray-400">{Math.round(masterVolume * 100)}%</div>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={handlePlay}
                size="lg"
                className={`w-24 h-24 rounded-full ${
                  isPlaying 
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                } transition-all duration-300 shadow-lg hover:shadow-xl`}
              >
                {isPlaying ? <Square className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
              </Button>
            </div>

            <div className="flex justify-center">
              <Button
                variant="outline"
                className="border-slate-600 text-white hover:bg-slate-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Export WAV
              </Button>
            </div>
          </div>

          {/* Binaural Beat Indicator */}
          {Math.abs(leftChannel.frequency - rightChannel.frequency) > 0 && (
            <div className="text-center p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30">
              <div className="text-white font-medium">
                Binaural Beat: {Math.abs(leftChannel.frequency - rightChannel.frequency).toFixed(1)} Hz
              </div>
              <div className="text-sm text-gray-300 mt-1">
                L: {leftChannel.frequency}Hz | R: {rightChannel.frequency}Hz
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default WaveGenerator;
