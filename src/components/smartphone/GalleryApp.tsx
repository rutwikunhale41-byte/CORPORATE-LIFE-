import React from 'react';
import { PersonalLifeState } from '../../types/smartphone';
import { Image as ImageIcon, Heart, Sparkles } from 'lucide-react';

interface GalleryAppProps {
  personalLife: PersonalLifeState;
}

export const GalleryApp: React.FC<GalleryAppProps> = ({ personalLife }) => {
  return (
    <div className="flex flex-col h-full bg-slate-950 text-white font-sans overflow-hidden">
      {/* Header */}
      <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center font-bold text-white text-sm">
            <ImageIcon className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-slate-100">Gallery & Memories</h2>
            <p className="text-[10px] text-slate-400">Personal Photos & Outings</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-2 gap-3">
          {personalLife.galleryPhotos.map(photo => (
            <div key={photo.id} className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow group">
              <div className="aspect-square bg-slate-800 relative overflow-hidden">
                <img src={photo.url} alt={photo.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-bold text-amber-300">
                  {photo.category}
                </div>
              </div>
              <div className="p-2.5">
                <h4 className="text-xs font-bold text-slate-100">{photo.title}</h4>
                <p className="text-[10px] text-slate-400">{photo.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
