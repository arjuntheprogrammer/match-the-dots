
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { LEVELS, PENS, GAME_WIDTH, GAME_HEIGHT } from '../constants';
import { Pen } from '../types';

interface GameViewProps {
  levelId: number;
  unlockedPens: string[];
  onBack: () => void;
  onComplete: () => void;
}

export const GameView: React.FC<GameViewProps> = ({ levelId, unlockedPens, onBack, onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<any>(null);
  const renderRef = useRef<any>(null);
  const runnerRef = useRef<any>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  
  const [currentPen, setCurrentPen] = useState<Pen>(PENS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [won, setWon] = useState(false);
  const [drawPoints, setDrawPoints] = useState<{ x: number, y: number }[]>([]);
  const [drawnShapesCount, setDrawnShapesCount] = useState(0);
  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem('match_the_dots_muted') === 'true';
  });

  const level = LEVELS.find(l => l.id === levelId)!;

  // Persistence for mute state
  useEffect(() => {
    localStorage.setItem('match_the_dots_muted', isMuted.toString());
  }, [isMuted]);

  // Sound Synthesis Helpers
  const playSound = (type: 'draw' | 'pop' | 'win' | 'click') => {
    if (isMuted) return;

    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    switch (type) {
      case 'draw':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200 + Math.random() * 100, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start();
        osc.stop(now + 0.1);
        break;
      case 'pop':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.1);
        osc.start();
        osc.stop(now + 0.1);
        break;
      case 'win':
        osc.type = 'square';
        [440, 554.37, 659.25, 880].forEach((freq, i) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = 'sine';
          o.frequency.setValueAtTime(freq, now + i * 0.1);
          g.gain.setValueAtTime(0.1, now + i * 0.1);
          g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.4);
          o.connect(g);
          g.connect(ctx.destination);
          o.start(now + i * 0.1);
          o.stop(now + i * 0.1 + 0.5);
        });
        break;
      case 'click':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start();
        osc.stop(now + 0.05);
        break;
    }
  };

  const initPhysics = useCallback(() => {
    const M = (window as any).Matter;
    if (!M || !canvasRef.current) return;

    if (engineRef.current) {
      M.World.clear(engineRef.current.world, false);
      M.Engine.clear(engineRef.current);
    }
    
    const engine = M.Engine.create({
      gravity: { x: 0, y: 0.5 }
    });
    engineRef.current = engine;

    const render = M.Render.create({
      canvas: canvasRef.current,
      engine: engine,
      options: {
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        wireframes: false,
        background: 'transparent',
        pixelRatio: window.devicePixelRatio || 1
      }
    });
    renderRef.current = render;

    const staticBodies = level.obstacles.map(obs => {
      return M.Bodies.rectangle(obs.x, obs.y, obs.w, obs.h, {
        isStatic: true,
        angle: obs.angle || 0,
        render: { fillStyle: '#bdc3c7' }
      });
    });

    const balls = level.balls.map(ball => {
      return M.Bodies.circle(ball.x, ball.y, 20, {
        isStatic: true,
        restitution: 0.8,
        friction: 0.05,
        label: 'ball',
        render: { fillStyle: ball.color }
      });
    });

    M.Composite.add(engine.world, [...staticBodies, ...balls]);

    if (M.Events) {
      M.Events.on(engine, 'collisionStart', (event: any) => {
        const pairs = event.pairs;
        for (let i = 0; i < pairs.length; i++) {
          const pair = pairs[i];
          if (pair.bodyA.label === 'ball' && pair.bodyB.label === 'ball' && !won) {
            setWon(true);
            playSound('win');
          } else if (pair.bodyA.label === 'ball' || pair.bodyB.label === 'ball') {
            playSound('pop');
          }
        }
      });
    }

    const runner = M.Runner.create();
    runnerRef.current = runner;
    M.Runner.run(runner, engine);
    M.Render.run(render);

  }, [level, won, isMuted]); // Added isMuted to dependency to ensure correct context

  useEffect(() => {
    const timer = setTimeout(initPhysics, 150);
    return () => {
      clearTimeout(timer);
      const M = (window as any).Matter;
      if (!M) return;
      if (runnerRef.current) M.Runner.stop(runnerRef.current);
      if (renderRef.current) M.Render.stop(renderRef.current);
      if (engineRef.current) M.Engine.clear(engineRef.current);
    };
  }, [initPhysics]);

  const togglePlay = () => {
    playSound('click');
    const M = (window as any).Matter;
    if (!engineRef.current || !M) return;
    const nextState = !isPlaying;
    setIsPlaying(nextState);

    const world = engineRef.current.world;
    const bodies = M.Composite.allBodies(world);
    bodies.forEach((b: any) => {
      if (b.label === 'ball' || b.label === 'drawnShape') {
        M.Body.setStatic(b, !nextState);
      }
    });
  };

  const reset = () => {
    playSound('click');
    setIsPlaying(false);
    setWon(false);
    setDrawnShapesCount(0);
    initPhysics();
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (isMuted) {
      // Play a quick click if we just unmuted
      const tempMute = false;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    }
  };

  const getPos = (e: any) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    
    let clientX = 0;
    let clientY = 0;

    const actualEvent = (e.nativeEvent || e);
    
    if (actualEvent.touches && actualEvent.touches.length > 0) {
      clientX = actualEvent.touches[0].clientX;
      clientY = actualEvent.touches[0].clientY;
    } else if (actualEvent.clientX !== undefined) {
      clientX = actualEvent.clientX;
      clientY = actualEvent.clientY;
    }
    
    const scaleX = GAME_WIDTH / rect.width;
    const scaleY = GAME_HEIGHT / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (isPlaying || won) return;
    const pos = getPos(e);
    if (isNaN(pos.x) || isNaN(pos.y)) return;
    setDrawPoints([pos]);
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (isPlaying || won || drawPoints.length === 0) return;
    const pos = getPos(e);
    if (isNaN(pos.x) || isNaN(pos.y)) return;
    setDrawPoints(prev => [...prev, pos]);
    playSound('draw');
  };

  const handleMouseUp = () => {
    if (drawPoints.length < 2) {
      setDrawPoints([]);
      return;
    }
    createPhysicalLine(drawPoints);
    setDrawPoints([]);
  };

  const createPhysicalLine = (points: { x: number, y: number }[]) => {
    const M = (window as any).Matter;
    if (!engineRef.current || !M) return;

    const bodies = [];
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i+1];
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const length = Math.max(Math.sqrt(dx*dx + dy*dy), 1);
      const angle = Math.atan2(dy, dx);
      
      const segment = M.Bodies.rectangle(
        p1.x + dx / 2,
        p1.y + dy / 2,
        length,
        currentPen.width,
        {
          angle: angle,
          friction: 0.5,
          render: { fillStyle: currentPen.color }
        }
      );
      bodies.push(segment);
    }

    if (bodies.length === 0) return;

    const compound = M.Body.create({
      parts: bodies,
      isStatic: !isPlaying,
      friction: 0.5,
      label: 'drawnShape'
    });

    M.Composite.add(engineRef.current.world, compound);
    setDrawnShapesCount(prev => prev + 1);
  };

  useEffect(() => {
    const M = (window as any).Matter;
    if (!M || !M.Events || !renderRef.current) return;

    const currentRender = renderRef.current;

    const onAfterRender = () => {
      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;
      
      if (drawPoints.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = currentPen.color;
        ctx.lineWidth = currentPen.width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.moveTo(drawPoints[0].x, drawPoints[0].y);
        for (let i = 1; i < drawPoints.length; i++) {
          ctx.lineTo(drawPoints[i].x, drawPoints[i].y);
        }
        ctx.stroke();
      }

      if (won) {
         ctx.font = 'bold 40px Quicksand, sans-serif';
         ctx.fillStyle = 'rgba(0,0,0,0.6)';
         ctx.textAlign = 'center';
         ctx.fillText("SUCCESS!", GAME_WIDTH/2, GAME_HEIGHT/2);
      }
    };

    M.Events.on(currentRender, 'afterRender', onAfterRender);
    
    return () => {
      if (M.Events && currentRender) {
        M.Events.off(currentRender, 'afterRender', onAfterRender);
      }
    };
  }, [drawPoints, currentPen, won]);

  return (
    <div className="flex flex-col h-screen bg-[#f5f5f5]" ref={containerRef}>
      <div className="bg-white shadow-sm px-6 py-3 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => { playSound('click'); onBack(); }} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <span className="font-bold text-xl text-gray-700">Level {levelId}</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto max-w-md p-1 bg-gray-50 rounded-xl">
          {PENS.map(pen => {
            const isUnlocked = unlockedPens.includes(pen.id) || pen.unlockedAt <= levelId;
            return (
              <button 
                key={pen.id}
                disabled={!isUnlocked}
                onClick={() => { playSound('click'); setCurrentPen(pen); }}
                className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                  currentPen.id === pen.id ? 'bg-white shadow-md scale-110 border-2 border-blue-400' : 'hover:bg-gray-200'
                } ${!isUnlocked && 'opacity-20 grayscale'}`}
              >
                <span className="text-lg">{isUnlocked ? pen.icon : '🔒'}</span>
              </button>
            );
          })}
        </div>

        <div className="flex gap-3">
          <button 
            onClick={toggleMute}
            className={`p-3 rounded-full transition-all active:scale-90 ${isMuted ? 'bg-red-100 text-red-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            {isMuted ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
            )}
          </button>
          <button 
            onClick={reset}
            className="p-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-all active:scale-90"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </button>
          <button 
            onClick={togglePlay}
            disabled={won}
            className={`px-6 py-2 rounded-full font-bold text-white transition-all shadow-lg active:scale-95 flex items-center gap-2 ${
              isPlaying ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-500 hover:bg-green-600'
            } ${won && 'opacity-50 cursor-not-allowed'}`}
          >
            {isPlaying ? "Stop" : "Play"}
          </button>
        </div>
      </div>

      <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
          className="bg-white/50 shadow-2xl rounded-sm border-8 border-gray-100 max-w-full max-h-full object-contain"
        />

        {level.hint && !isPlaying && !won && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-1 rounded-full text-sm text-gray-500 border border-gray-100 shadow-sm pointer-events-none">
            💡 {level.hint}
          </div>
        )}

        {won && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-sm flex flex-col items-center justify-center animate-fade-in z-20">
            <div className="bg-white p-10 rounded-3xl shadow-2xl text-center scale-up">
              <h2 className="text-5xl font-black text-gray-800 mb-4">MATCHED!</h2>
              <p className="text-gray-500 mb-8">Excellent drawing skills!</p>
              <div className="flex gap-4 justify-center">
                <button onClick={reset} className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200">Retry</button>
                <button onClick={() => { playSound('click'); onComplete(); onBack(); }} className="px-8 py-3 bg-blue-500 text-white font-bold rounded-xl shadow-lg hover:bg-blue-600">Next Level</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white border-t p-3 flex justify-center text-xs text-gray-400 font-medium">
        Shapes: {drawnShapesCount} • Matter.js Engine • Match the Dots
      </div>

      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scale-up { from { transform: scale(0.8); } to { transform: scale(1); } }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .scale-up { animation: scale-up 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
      `}</style>
    </div>
  );
};
