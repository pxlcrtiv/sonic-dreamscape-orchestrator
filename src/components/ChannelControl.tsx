
import React from 'react';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface ChannelControlProps {
  channel: 'left' | 'right';
  config: {
    frequency: number;
    waveform: string;
    amplitude: number;
  };
  onFrequencyChange: (frequency: number) => void;
  onWaveformChange: (waveform: string) => void;
  onAmplitudeChange: (amplitude: number) => void;
  linkedChannels: boolean;
}

const ChannelControl: React.FC<ChannelControlProps> = ({
  channel,
  config,
  onFrequencyChange,
  onWaveformChange,
  onAmplitudeChange,
  linkedChannels
}) => {
  const channelColor = channel === 'left' ? 'from-cyan-500 to-blue-600' : 'from-amber-500 to-orange-600';

  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-600">
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className={`text-lg font-semibold bg-gradient-to-r ${channelColor} bg-clip-text text-transparent capitalize`}>
            {channel} Channel
          </h3>
          {linkedChannels && channel === 'right' && (
            <Badge variant="secondary" className="text-xs">
              Linked to Left
            </Badge>
          )}
        </div>

        {/* Frequency Control */}
        <div className="space-y-2">
          <Label className="text-white">Frequency (Hz)</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              value={config.frequency}
              onChange={(e) => onFrequencyChange(Number(e.target.value))}
              min={1}
              max={20000}
              className="bg-slate-700 border-slate-600 text-white"
              disabled={linkedChannels && channel === 'right'}
            />
            <div className="flex items-center text-sm text-gray-400 min-w-fit">
              Hz
            </div>
          </div>
          <Slider
            value={[config.frequency]}
            onValueChange={(value) => onFrequencyChange(value[0])}
            min={20}
            max={2000}
            step={1}
            className="w-full"
            disabled={linkedChannels && channel === 'right'}
          />
          <div className="text-xs text-gray-400">
            Range: 20Hz - 2000Hz (Use input for higher frequencies)
          </div>
        </div>

        {/* Waveform Selection */}
        <div className="space-y-2">
          <Label className="text-white">Waveform</Label>
          <Select 
            value={config.waveform} 
            onValueChange={onWaveformChange}
            disabled={linkedChannels && channel === 'right'}
          >
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              <SelectItem value="sine">Sine Wave</SelectItem>
              <SelectItem value="square">Square Wave</SelectItem>
              <SelectItem value="triangle">Triangle Wave</SelectItem>
              <SelectItem value="sawtooth">Sawtooth Wave</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Amplitude Control */}
        <div className="space-y-2">
          <Label className="text-white">Amplitude</Label>
          <Slider
            value={[config.amplitude]}
            onValueChange={(value) => onAmplitudeChange(value[0])}
            min={0}
            max={1}
            step={0.01}
            className="w-full"
          />
          <div className="text-sm text-gray-400">{Math.round(config.amplitude * 100)}%</div>
        </div>

        {/* Frequency Info */}
        <div className="p-3 bg-slate-700/50 rounded-lg">
          <div className="text-xs text-gray-300 space-y-1">
            <div>Current: <span className="text-white font-mono">{config.frequency} Hz</span></div>
            <div>Period: <span className="text-white font-mono">{(1000/config.frequency).toFixed(2)} ms</span></div>
            <div>Wavelength: <span className="text-white font-mono">{(343/config.frequency).toFixed(2)} m</span></div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ChannelControl;
