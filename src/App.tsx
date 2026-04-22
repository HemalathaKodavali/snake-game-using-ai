import React from 'react';
import { motion } from 'motion/react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { Terminal, Skull, AlertTriangle, Database } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans relative overflow-hidden bg-grid-harsh selection:bg-magenta selection:text-black">
      {/* Visual Effects */}
      <div className="noise-overlay" />
      <div className="absolute inset-0 pointer-events-none z-10 scanline opacity-20" />

      {/* Top Header Rail */}
      <header className="h-16 border-b-4 border-cyan px-6 flex items-center justify-between z-40 bg-black screen-tear">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-magenta border-2 border-cyan flex items-center justify-center">
            <Skull className="w-6 h-6 text-black" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-3xl font-black tracking-widest uppercase leading-none glitch-text" data-text="SYS.ERR::TERMINAL">SYS.ERR::TERMINAL</h1>
            <span className="text-sm text-cyan font-digital uppercase bg-black px-1 mt-1 leading-none">KERNEL_PANIC_v0.9.8</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-digital text-magenta uppercase">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-cyan animate-ping" />
            MEM_LEAK_DETECTED
          </div>
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            <span className="glitch-text" data-text="SECTOR_FAULT">SECTOR_FAULT</span>
          </div>
          <div className="text-black bg-magenta px-2">UPLINK: SEVERED</div>
        </div>

        <div className="flex items-center gap-4">
          <button className="px-4 py-2 border-2 border-magenta text-magenta text-sm font-digital font-bold hover:bg-magenta hover:text-black transition-none uppercase">
            ABORT_SEQ
          </button>
        </div>
      </header>

      {/* Main Panel */}
      <main className="flex-1 flex flex-col lg:flex-row p-6 gap-8 z-40 relative">
        {/* Left Stats Rail */}
        <div className="hidden xl:flex flex-col w-64 border-r-4 border-dashed border-magenta pr-6 gap-8">
           <section className="space-y-4">
             <div className="flex items-center gap-2 text-xl text-cyan font-bold uppercase tracking-widest bg-black p-1 border-l-4 border-cyan">
               <Terminal className="w-5 h-5" />
               ALLOC_UNITS
             </div>
             <div className="space-y-2 font-digital">
               {['VOX_SYNTH', 'VRAM_BUFFER', 'OBJ_COLLIDER'].map((mod) => (
                 <div key={mod} className="p-2 border border-cyan bg-black text-sm text-white flex justify-between uppercase">
                   {mod}
                   <span className="text-magenta animate-pulse">CORRUPT</span>
                 </div>
               ))}
             </div>
           </section>

           <div className="flex-1" />
           
           <div className="p-4 border-glitch bg-black text-sm font-digital text-cyan leading-tight uppercase screen-tear-fast">
             [WARNING] 
             ENTITY_SPAWN ANOMALY DETECTED. 
             CONTAINMENT BREACH IN SECTOR 7G. 
             INPUT REQUIRED TO MAINTAIN STABILITY.
           </div>
        </div>

        {/* Center: Game Panel */}
        <div className="flex-1 flex flex-col items-center justify-center min-h-[500px]">
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="w-full flex justify-center"
          >
            <SnakeGame />
          </motion.div>
        </div>

        {/* Right: Music Panel */}
        <div className="w-full lg:w-auto flex flex-col items-center justify-center lg:items-end lg:justify-start">
          <motion.div
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.1, delay: 0.1 }}
             className="w-full max-w-sm"
          >
            <div className="flex items-center gap-2 text-sm text-magenta bg-black border-b-2 border-magenta p-1 font-bold uppercase tracking-widest mb-6 lg:justify-end">
              <AlertTriangle className="w-4 h-4 text-cyan animate-pulse" />
              AUDIO_SUBSYSTEM
            </div>
            <MusicPlayer />
            
            {/* Additional info below player */}
            <div className="mt-8 grid grid-cols-2 gap-4 font-digital">
               <div className="p-4 bg-black border-2 border-dashed border-cyan">
                  <div className="text-xs text-white uppercase mb-1">BUFFER_FREQ</div>
                  <div className="text-2xl font-bold text-cyan glitch-text" data-text="128 Hz">128 Hz</div>
               </div>
               <div className="p-4 bg-magenta border-2 border-cyan text-black">
                  <div className="text-xs uppercase mb-1 font-bold">STATE_MACHINE</div>
                  <div className="text-2xl font-bold">HALTED</div>
               </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer Info Rail */}
      <footer className="h-12 border-t-4 border-magenta px-6 flex items-center justify-between text-xs font-digital text-white uppercase tracking-widest z-40 bg-black screen-tear">
        <div className="flex gap-8">
          <span className="text-cyan">PID: 0xFFFF</span>
          <span>HEAP: OVERFLOW</span>
          <span className="text-magenta line-through">SAFETIES_ENGAGED</span>
        </div>
        <div className="flex items-center gap-2 border border-cyan px-2 py-1 bg-cyan text-black font-bold">
          <span className="w-2 h-2 bg-black animate-ping" />
          FATAL_ERR_LOGGED
        </div>
      </footer>
    </div>
  );
}
