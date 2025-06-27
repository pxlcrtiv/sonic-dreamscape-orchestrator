
import React, { useState, useEffect } from 'react';
import { useAudioEngine } from '../hooks/useAudioEngine';
import PlayerControls from './PlayerControls';
import FrequencyPresets from './FrequencyPresets';
import ChannelMixer from './ChannelMixer';
import WaveformVisualizer from './WaveformVisualizer';
import { Waves } from 'lucide-react';

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

  const { startAudio, stopAudio, updateFrequency, updateAmplitude, updateMasterVolume, exportWAV } = useAudioEngine();

  const handlePlay = async () => {
    if (isPlaying) {
      stopAudio();
      setIsPlaying(false);
    } else {
      try {
        await startAudio({
          leftChannel,
          rightChannel,
          masterVolume
        });
        setIsPlaying(true);
      } catch (error) {
        console.error('Failed to start audio:', error);
      }
    }
  };

  const handleStop = () => {
    stopAudio();
    setIsPlaying(false);
  };

  const handleFrequencySelect = (frequency: number) => {
    setLeftChannel(prev => ({ ...prev, frequency }));
    if (linkedChannels) {
      setRightChannel(prev => ({ ...prev, frequency }));
    }
  };

  const handleLeftChannelChange = (changes: Partial<typeof leftChannel>) => {
    const newConfig = { ...leftChannel, ...changes };
    setLeftChannel(newConfig);
    
    if (linkedChannels && changes.frequency !== undefined) {
      setRightChannel(prev => ({ ...prev, frequency: changes.frequency! }));
    }
    if (linkedChannels && changes.waveform !== undefined) {
      setRightChannel(prev => ({ ...prev, waveform: changes.waveform! }));
    }

    // Update live audio if playing
    if (isPlaying && changes.frequency !== undefined) {
      updateFrequency('left', changes.frequency);
      if (linkedChannels) {
        updateFrequency('right', changes.frequency);
      }
    }
    if (isPlaying && changes.amplitude !== undefined) {
      updateAmplitude('left', changes.amplitude);
    }
  };

  const handleRightChannelChange = (changes: Partial<typeof rightChannel>) => {
    if (linkedChannels) return;
    
    const newConfig = { ...rightChannel, ...changes };
    setRightChannel(newConfig);

    // Update live audio if playing
    if (isPlaying && changes.frequency !== undefined) {
      updateFrequency('right', changes.frequency);
    }
    if (isPlaying && changes.amplitude !== undefined) {
      updateAmplitude('right', changes.amplitude);
    }
  };

  const handleVolumeChange = (volume: number) => {
    setMasterVolume(volume);
    if (isPlaying) {
      updateMasterVolume(volume);
    }
  };

  const handleExport = () => {
    exportWAV({
      leftChannel,
      rightChannel,
      masterVolume
    }, 10);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 p-4 space-y-6">
      {/* Header */}
      <div className="text-center py-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Waves className="w-10 h-10 text-green-400" />
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Wave Studio
          </h1>
        </div>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Professional wave generator for healing frequencies, binaural beats, and audio experiments
        </p>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Player Controls - Spotify Style */}
        <PlayerControls
          isPlaying={isPlaying}
          masterVolume={masterVolume}
          onPlay={handlePlay}
          onStop={handleStop}
          onVolumeChange={handleVolumeChange}
          onExport={handleExport}
          leftFreq={leftChannel.frequency}
          rightFreq={rightChannel.frequency}
        />

        {/* Frequency Presets */}
        <FrequencyPresets onFrequencySelect={handleFrequencySelect} />

        {/* Waveform Visualizer */}
        <WaveformVisualizer 
          leftChannel={leftChannel}
          rightChannel={rightChannel}
          isPlaying={isPlaying}
          masterVolume={masterVolume}
        />

        {/* Channel Mixer */}
        <ChannelMixer
          leftChannel={leftChannel}
          rightChannel={rightChannel}
          linkedChannels={linkedChannels}
          onLeftChannelChange={handleLeftChannelChange}
          onRightChannelChange={handleRightChannelChange}
          onLinkToggle={() => setLinkedChannels(!linkedChannels)}
        />
      </div>
    </div>
  );
};

export default WaveGenerator;
