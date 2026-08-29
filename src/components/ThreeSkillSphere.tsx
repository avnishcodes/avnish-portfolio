import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, RefreshCw, Cpu, Layers } from 'lucide-react';

interface SkillItem {
  name: string;
  category: 'ml' | 'languages' | 'frameworks' | 'tools';
  color: string;
  icon: string;
}

const SKILLS_LIST: SkillItem[] = [
  { name: 'Python', category: 'languages', color: '#38bdf8', icon: '🐍' },
  { name: 'Machine Learning', category: 'ml', color: '#818cf8', icon: '🧠' },
  { name: 'Scikit-Learn', category: 'ml', color: '#f59e0b', icon: '⚡' },
  { name: 'NumPy', category: 'ml', color: '#06b6d4', icon: '🔢' },
  { name: 'Pandas', category: 'ml', color: '#ec4899', icon: '🐼' },
  { name: 'C / C++', category: 'languages', color: '#6366f1', icon: '⚙️' },
  { name: 'SQL / PostgreSQL', category: 'tools', color: '#10b981', icon: '🗄️' },
  { name: 'React.js', category: 'frameworks', color: '#38bdf8', icon: '⚛️' },
  { name: 'TypeScript', category: 'languages', color: '#60a5fa', icon: '🔷' },
  { name: 'Tailwind CSS', category: 'frameworks', color: '#06b6d4', icon: '🎨' },
  { name: 'Git & GitHub', category: 'tools', color: '#f97316', icon: '🐙' },
  { name: 'Linux / Bash', category: 'tools', color: '#eab308', icon: '🐧' },
  { name: 'Jupyter Labs', category: 'tools', color: '#f97316', icon: '📓' },
  { name: 'Matplotlib', category: 'ml', color: '#a855f7', icon: '📊' },
  { name: 'Seaborn', category: 'ml', color: '#06b6d4', icon: '📈' },
  { name: 'Data Structures', category: 'languages', color: '#10b981', icon: '🌲' },
  { name: 'Algorithms', category: 'languages', color: '#818cf8', icon: '🧩' },
  { name: 'REST APIs', category: 'frameworks', color: '#34d399', icon: '🔌' },
];

export const ThreeSkillSphere: React.FC<{
  onSelectSkill?: (name: string) => void;
}> = ({ onSelectSkill }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  const [isRotating, setIsRotating] = useState<boolean>(true);

  const radius = 170; // Sphere radius in px
  const count = SKILLS_LIST.length;

  const [rotX, setRotX] = useState<number>(0.2);
  const [rotY, setRotY] = useState<number>(0.2);

  const isDraggingRef = useRef<boolean>(false);
  const prevMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const speedRef = useRef<{ x: number; y: number }>({ x: 0.003, y: 0.004 });
  const animFrameIdRef = useRef<number | null>(null);

  // Compute 3D Fibonacci sphere distribution
  const points = React.useMemo(() => {
    return SKILLS_LIST.map((skill, i) => {
      const phi = Math.acos(-1 + (2 * i + 1) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      return {
        ...skill,
        baseX: radius * Math.cos(theta) * Math.sin(phi),
        baseY: radius * Math.sin(theta) * Math.sin(phi),
        baseZ: radius * Math.cos(phi),
      };
    });
  }, [count]);

  const [tagPositions, setTagPositions] = useState(points);

  useEffect(() => {
    let currentRotX = rotX;
    let currentRotY = rotY;

    const animate = () => {
      if (isRotating && !isDraggingRef.current) {
        currentRotX += speedRef.current.x;
        currentRotY += speedRef.current.y;
        setRotX(currentRotX);
        setRotY(currentRotY);
      }

      // Rotate points in 3D around X and Y axes
      const sinX = Math.sin(currentRotX);
      const cosX = Math.cos(currentRotX);
      const sinY = Math.sin(currentRotY);
      const cosY = Math.cos(currentRotY);

      const newPositions = points.map((p) => {
        // Rotate around Y
        const x1 = p.baseX * cosY - p.baseZ * sinY;
        const z1 = p.baseZ * cosY + p.baseX * sinY;

        // Rotate around X
        const y2 = p.baseY * cosX - z1 * sinX;
        const z2 = z1 * cosX + p.baseY * sinX;

        // Perspective depth scale
        const cameraDist = 380;
        const scale = cameraDist / (cameraDist - z2);
        const alpha = Math.max(0.2, (z2 + radius) / (2 * radius));

        return {
          ...p,
          x: x1 * scale,
          y: y2 * scale,
          z: z2,
          scale: Math.max(0.65, Math.min(scale, 1.35)),
          alpha: Math.min(1, alpha + 0.2),
          zIndex: Math.round(z2 + radius),
        };
      });

      setTagPositions(newPositions);
      animFrameIdRef.current = requestAnimationFrame(animate);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isRotating, points]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    prevMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - prevMousePosRef.current.x;
    const deltaY = e.clientY - prevMousePosRef.current.y;

    setRotY((prev) => prev + deltaX * 0.008);
    setRotX((prev) => prev - deltaY * 0.008);

    prevMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className="relative w-full rounded-2xl bg-slate-900/60 border border-slate-800 p-5 overflow-hidden flex flex-col items-center justify-between group">
      
      {/* Background Decorative Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <div className="w-72 h-72 rounded-full border border-dashed border-indigo-500/40 animate-spin-slow" />
        <div className="w-56 h-56 rounded-full border border-indigo-500/20 absolute" />
      </div>

      {/* Header Info Bar */}
      <div className="w-full flex items-center justify-between mb-4 z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Cpu className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-white">Interactive 3D Skill Constellation</h4>
            <span className="text-[10px] font-mono text-slate-400">Drag to spin · Click tag to inspect</span>
          </div>
        </div>

        <button
          onClick={() => setIsRotating(!isRotating)}
          className={`p-1.5 rounded-lg border text-xs font-mono transition-all ${
            isRotating
              ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
              : 'bg-slate-800 border-slate-700 text-slate-400'
          }`}
          title={isRotating ? 'Pause rotation' : 'Resume rotation'}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
        </button>
      </div>

      {/* 3D Interactive Tag Cloud Stage */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="relative w-full h-[360px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
      >
        {tagPositions.map((tag, idx) => (
          <button
            key={idx}
            onClick={() => {
              setActiveSkill(tag.name);
              onSelectSkill?.(tag.name);
            }}
            onMouseEnter={() => setActiveSkill(tag.name)}
            onMouseLeave={() => setActiveSkill(null)}
            style={{
              transform: `translate3d(${tag.x}px, ${tag.y}px, 0px) scale(${tag.scale})`,
              opacity: tag.alpha,
              zIndex: tag.zIndex,
            }}
            className={`absolute px-2.5 py-1 rounded-xl font-mono text-xs whitespace-nowrap transition-all duration-75 flex items-center gap-1.5 shadow-md ${
              activeSkill === tag.name
                ? 'bg-indigo-600 text-white scale-125 z-50 ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-950 shadow-indigo-500/50'
                : 'bg-slate-950/85 text-slate-200 border border-slate-800 hover:border-indigo-400/60'
            }`}
          >
            <span className="text-sm">{tag.icon}</span>
            <span className="font-medium text-[11px]">{tag.name}</span>
          </button>
        ))}
      </div>

      {/* Footer Active Tag Status Indicator */}
      <div className="w-full pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono z-10">
        <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>{activeSkill ? `Selected: ${activeSkill}` : 'Hover or tap nodes to lock focus'}</span>
        </div>
        <span className="text-[10px] text-slate-500">{SKILLS_LIST.length} Core Competencies</span>
      </div>
    </div>
  );
};
