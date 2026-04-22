import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  
  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);
  const speedRef = useRef(150);

  const generateFood = useCallback((currentSnake: {x: number, y: number}[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const onSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!onSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setIsGameOver(false);
    setFood(generateFood(INITIAL_SNAKE));
    setGameStarted(true);
    speedRef.current = 150;
  };

  const update = useCallback(() => {
    if (isGameOver || !gameStarted) return;

    setSnake(prevSnake => {
      const newHead = {
        x: prevSnake[0].x + direction.x,
        y: prevSnake[0].y + direction.y,
      };

      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        setIsGameOver(true);
        return prevSnake;
      }

      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
        speedRef.current = Math.max(70, speedRef.current - 2);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, gameStarted, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted && !isGameOver) {
        setGameStarted(true);
      }
      switch (e.key) {
        case 'ArrowUp': if (direction.y === 0) setDirection({ x: 0, y: -1 }); break;
        case 'ArrowDown': if (direction.y === 0) setDirection({ x: 0, y: 1 }); break;
        case 'ArrowLeft': if (direction.x === 0) setDirection({ x: -1, y: 0 }); break;
        case 'ArrowRight': if (direction.x === 0) setDirection({ x: 1, y: 0 }); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameStarted, isGameOver]);

  useEffect(() => {
    const animate = (time: number) => {
      if (time - lastUpdateTimeRef.current > speedRef.current) {
        update();
        lastUpdateTimeRef.current = time;
      }
      gameLoopRef.current = requestAnimationFrame(animate);
    };

    gameLoopRef.current = requestAnimationFrame(animate);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [update]);

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  // Draw Game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width / GRID_SIZE;

    // Clear
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Glitchy Grid
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for(let i=0; i<=GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i*size, 0); ctx.lineTo(i*size, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i*size); ctx.lineTo(canvas.width, i*size);
        ctx.stroke();
    }

    // Draw Food (Magenta block)
    ctx.fillStyle = '#FF00FF';
    ctx.shadowBlur = 0;
    ctx.fillRect(food.x * size, food.y * size, size, size);
    
    // Food inner detail
    ctx.fillStyle = '#000000';
    ctx.fillRect(food.x * size + size/3, food.y * size + size/3, size/3, size/3);

    // Draw Snake (Cyan blocks)
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#FFFFFF' : '#00FFFF';
      
      const padding = 1;
      ctx.fillRect(
        segment.x * size + padding, 
        segment.y * size + padding, 
        size - padding * 2, 
        size - padding * 2
      );

      // Snake Eye
      if (index === 0) {
          ctx.fillStyle = '#FF00FF';
          const eyeSize = 3;
          ctx.fillRect(segment.x * size + size/4, segment.y * size + size/4, eyeSize, eyeSize);
          ctx.fillRect(segment.x * size + 3*size/4 - eyeSize, segment.y * size + size/4, eyeSize, eyeSize);
      }
    });

  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex justify-between w-full max-w-[400px] mb-4 border-b-2 border-cyan pb-2">
        <div className="flex flex-col">
          <span className="text-xs text-magenta uppercase tracking-widest font-digital">Score_Alloc</span>
          <span 
            className="text-5xl font-bold font-digital text-cyan glitch-text" 
            data-text={`0x${score.toString(16).padStart(4, '0').toUpperCase()}`}
          >
            0x{score.toString(16).padStart(4, '0').toUpperCase()}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-magenta uppercase tracking-widest font-digital">Peak_Mem</span>
          <span 
            className="text-5xl font-bold font-digital text-white glitch-text" 
            data-text={`0x${highScore.toString(16).padStart(4, '0').toUpperCase()}`}
          >
            0x{highScore.toString(16).padStart(4, '0').toUpperCase()}
          </span>
        </div>
      </div>

      <div className="relative group">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="relative bg-black border-glitch z-20 cursor-crosshair"
        />
        
        <AnimatePresence>
          {(!gameStarted || isGameOver) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm border-glitch-alt"
            >
              <h2 className="text-4xl font-pixel mb-4 text-magenta tracking-widest uppercase glitch-text text-center px-4 leading-none" data-text={isGameOver ? "SYSTEM_FAILURE" : "AWAITING_INPUT"}>
                {isGameOver ? "SYSTEM_FAILURE" : "AWAITING_INPUT"}
              </h2>
              <p className="text-cyan mb-8 font-digital text-sm uppercase tracking-widest text-center px-4">
                {isGameOver ? `FATAL EXCEPTION AT: 0x${score.toString(16).toUpperCase()}` : "EXECUTE START_SEQ.EXE DIRECTLY"}
              </p>
              
              <button 
                onClick={resetGame}
                className="group relative px-6 py-2 bg-black text-cyan border-2 border-cyan font-digital font-bold uppercase overflow-hidden hover:bg-cyan hover:text-black transition-none focus:outline-none focus:bg-magenta focus:border-magenta focus:text-black"
              >
                <div className="flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 group-hover:animate-spin" />
                    {isGameOver ? "REBOOT_SYSTEM" : "INIT_SEQUENCE"}
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Controls */}
      <div className="grid grid-cols-3 gap-2 md:hidden w-full max-w-[200px]">
        <div />
        <button onClick={() => direction.y === 0 && setDirection({x: 0, y: -1})} className="p-4 bg-black border-2 border-cyan text-cyan active:bg-cyan active:text-black transition-none flex justify-center"><ChevronUp /></button>
        <div />
        <button onClick={() => direction.x === 0 && setDirection({x: -1, y: 0})} className="p-4 bg-black border-2 border-cyan text-cyan active:bg-cyan active:text-black transition-none flex justify-center"><ChevronLeft /></button>
        <button onClick={() => direction.y === 0 && setDirection({x: 0, y: 1})} className="p-4 bg-black border-2 border-cyan text-cyan active:bg-cyan active:text-black transition-none flex justify-center"><ChevronDown /></button>
        <button onClick={() => direction.x === 0 && setDirection({x: 1, y: 0})} className="p-4 bg-black border-2 border-cyan text-cyan active:bg-cyan active:text-black transition-none flex justify-center"><ChevronRight /></button>
      </div>
      
      <div className="text-xs text-white font-digital uppercase tracking-widest mt-4 bg-magenta text-black px-2 py-1">
        MANUAL_OVERRIDE_ENABLED
      </div>
    </div>
  );
};
