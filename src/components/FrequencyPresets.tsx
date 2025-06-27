
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface FrequencyPresetsProps {
  onFrequencySelect: (frequency: number) => void;
}

const FrequencyPresets: React.FC<FrequencyPresetsProps> = ({ onFrequencySelect }) => {
  const presets = [
    { name: 'Solfeggio', freq: 528, desc: 'Love & Healing', color: 'from-green-500 to-emerald-600' },
    { name: 'Earth Tone', freq: 432, desc: 'Natural Harmony', color: 'from-blue-500 to-cyan-600' },
    { name: 'Crown Chakra', freq: 963, desc: 'Spiritual Connection', color: 'from-purple-500 to-violet-600' },
    { name: 'CE5 Contact', freq: 1111, desc: 'ET Communication', color: 'from-yellow-500 to-orange-600' },
    { name: 'Alpha Waves', freq: 10, desc: 'Relaxation', color: 'from-indigo-500 to-purple-600' },
    { name: 'Theta Waves', freq: 6, desc: 'Deep Meditation', color: 'from-pink-500 to-rose-600' },
  ];

  return (
    <Card className="bg-black/60 backdrop-blur-sm border-gray-800">
      <div className="p-6">
        <h3 className="text-white font-semibold text-lg mb-4">Frequency Presets</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {presets.map((preset) => (
            <Button
              key={preset.freq}
              onClick={() => onFrequencySelect(preset.freq)}
              variant="outline"
              className={`h-auto p-4 bg-gradient-to-br ${preset.color} border-0 hover:scale-105 transition-all duration-200 text-white`}
            >
              <div className="text-center">
                <div className="font-semibold text-sm">{preset.name}</div>
                <div className="text-lg font-bold">{preset.freq}Hz</div>
                <div className="text-xs opacity-90">{preset.desc}</div>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default FrequencyPresets;
