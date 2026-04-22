import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, HardDrive } from 'lucide-react';
import { motion } from 'motion/react';

interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
  color: string;
}

const TRACKS: Track[] = [
  {
    id: 1,
    title: "DATA_LEAK_01",
    artist: "UNAUTHORIZED_ACCESS",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "#00FFFF" // Cyan
  },
  {
    id: 2,
    title: "MEM_CORRUPTION",
    artist: "SYSTEM_EXCEPTION",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    color: "#FF00FF" // Magenta
  },
  {
    id: 3,
    title: "BUFFER=OVERFLOW",
    artist: "ROOT_KIT_PAYLOAD",
    url: "https://cdn.pixabay.com/audio/2022/02/22/audio_d0c6ff1101.mp3",
    color: "#FFFFFF" // White
  }
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleEnded = () => handleNext();

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <div className="flex flex-col gap-6 p-6 bg-black border-glitch w-full max-w-sm rounded-none">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div className="flex items-center gap-4 border-b-2 border-dashed border-gray-600 pb-4">
        <div 
          className="w-16 h-16 flex items-center justify-center animate-pulse border-2"
          style={{ backgroundColor: `${currentTrack.color}22`, borderColor: currentTrack.color }}
        >
          <HardDrive className="w-8 h-8" style={{ color: currentTrack.color }} />
        </div>
        
        <div className="flex-1 min-w-0 font-digital">
          <h3 
            className="text-xl font-bold truncate glitch-text text-white" 
            data-text={currentTrack.title}
          >
            {currentTrack.title}
          </h3>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">{currentTrack.artist}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="h-4 w-full bg-black border-2 border-gray-600 overflow-hidden relative">
          <motion.div 
            className="h-full relative overflow-hidden"
            style={{ backgroundColor: currentTrack.color }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "tween", duration: 0.1 }}
          >
             <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(45deg, black 25%, transparent 25%, transparent 50%, black 50%, black 75%, transparent 75%, transparent)', backgroundSize: '10px 10px'}} />
          </motion.div>
        </div>
        <div className="flex justify-between text-xs font-digital font-bold text-gray-500 uppercase tracking-widest">
          <span>0x00</span>
          <span>EOF</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-2">
        <button 
          onClick={handlePrev}
          className="p-3 bg-black border-2 border-white text-white hover:bg-white hover:text-black transition-none focus:outline-none"
        >
          <SkipBack className="w-5 h-5" />
        </button>

        <button 
          onClick={togglePlay}
          className="w-20 h-14 bg-magenta border-2 border-cyan flex items-center justify-center text-black hover:bg-cyan hover:border-magenta hover:text-black transition-none shadow-[4px_4px_0_white] active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          {isPlaying ? <Pause className="w-6 h-6 fill-black" /> : <Play className="w-6 h-6 fill-black ml-1" />}
        </button>

        <button 
          onClick={handleNext}
          className="p-3 bg-black border-2 border-white text-white hover:bg-white hover:text-black transition-none focus:outline-none"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-3 text-cyan mt-4 pt-4 border-t-2 border-dashed border-gray-600">
        <Volume2 className="w-4 h-4" />
        <div className="h-2 flex-1 bg-black border border-cyan relative">
           <div className="absolute left-0 top-0 h-full w-2/3 bg-cyan" />
        </div>
      </div>
    </div>
  );
};
