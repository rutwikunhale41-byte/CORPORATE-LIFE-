import React, { useState } from 'react';
import { Music, Play, Pause, SkipForward, SkipBack, Heart, Radio, Disc } from 'lucide-react';

export const MusicApp: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const playlist = [
    { title: 'Monsoon Lofi Chill & Chai', artist: 'Pune Beats Collective', duration: '3:45' },
    { title: 'Koregaon Park Indie Vibes', artist: 'Ananya & Band', duration: '4:12' },
    { title: 'Sinhagad Sunrise Acoustic', artist: 'Rohan Deshmukh', duration: '2:50' },
    { title: 'Deep Focus Coding Ambient', artist: 'SCADA Soundscapes', duration: '5:10' },
  ];

  const currentTrack = playlist[currentTrackIndex];

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white font-sans overflow-hidden">
      {/* Header */}
      <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-sm">
            <Music className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-slate-100">Spotify • Personal Playlist</h2>
            <p className="text-[10px] text-slate-400">Lofi, Bollywood & Acoustic</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-between">
        {/* Album Artwork */}
        <div className="aspect-square rounded-3xl bg-gradient-to-tr from-emerald-800 via-teal-900 to-slate-900 border border-emerald-700/60 shadow-2xl flex items-center justify-center relative overflow-hidden my-auto">
          <Disc className="w-24 h-24 text-emerald-400/40 animate-spin [animation-duration:12s]" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            <Music className="w-12 h-12 text-emerald-400 mb-2" />
            <h3 className="text-base font-extrabold text-white">{currentTrack.title}</h3>
            <p className="text-xs text-emerald-300 mt-1">{currentTrack.artist}</p>
          </div>
        </div>

        {/* Player Controls */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>1:24</span>
            <span>{currentTrack.duration}</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="w-1/3 h-full bg-emerald-500 rounded-full" />
          </div>

          <div className="flex items-center justify-center gap-6 pt-2">
            <button
              onClick={() => setCurrentTrackIndex(prev => (prev > 0 ? prev - 1 : playlist.length - 1))}
              className="p-2 text-slate-400 hover:text-white"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-full shadow-lg"
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-slate-950" /> : <Play className="w-6 h-6 fill-slate-950" />}
            </button>
            <button
              onClick={() => setCurrentTrackIndex(prev => (prev < playlist.length - 1 ? prev + 1 : 0))}
              className="p-2 text-slate-400 hover:text-white"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
