import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';
import { Sparkles, RefreshCw, Zap, Eye, Box, CircleDot, Cpu } from 'lucide-react';

export type ShapeMode = 'neural' | 'torus' | 'hypercube' | 'sphere';

export const ThreeHeroScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { theme } = useTheme();
  const [currentMode, setCurrentMode] = useState<ShapeMode>('neural');
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [wireframeOnly, setWireframeOnly] = useState<boolean>(false);
  const [isInteracting, setIsInteracting] = useState<boolean>(false);

  // References to keep Three.js instances across state changes
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const mainGroupRef = useRef<THREE.Group | null>(null);
  const particlesMeshRef = useRef<THREE.Points | null>(null);
  const innerCoreMeshRef = useRef<THREE.Mesh | null>(null);
  const outerMeshRef = useRef<THREE.Mesh | null>(null);
  const orbitalRingsRef = useRef<THREE.Group | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  const isDraggingRef = useRef(false);
  const prevMousePosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 460;
    const height = container.clientHeight || 460;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 7.2;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // Clear previous children
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x6366f1, 3.5, 50); // Indigo
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x06b6d4, 3.0, 50); // Cyan
    pointLight2.position.set(-5, -5, 3);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xa855f7, 2.5, 50); // Purple
    pointLight3.position.set(0, 6, -3);
    scene.add(pointLight3);

    // Root Group
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);
    mainGroupRef.current = mainGroup;

    // Background Particle Cloud
    const particleCount = 280;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0x6366f1);
    const color2 = new THREE.Color(0x06b6d4);
    const color3 = new THREE.Color(0x38bdf8);

    for (let i = 0; i < particleCount; i++) {
      const radius = 2.8 + Math.random() * 3.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);

      const mixedColor = i % 3 === 0 ? color1 : i % 3 === 1 ? color2 : color3;
      particleColors[i * 3] = mixedColor.r;
      particleColors[i * 3 + 1] = mixedColor.g;
      particleColors[i * 3 + 2] = mixedColor.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });

    const particlesMesh = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particlesMesh);
    particlesMeshRef.current = particlesMesh;

    // Orbital Rings Group
    const orbitalGroup = new THREE.Group();
    mainGroup.add(orbitalGroup);
    orbitalRingsRef.current = orbitalGroup;

    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const ringGeo1 = new THREE.TorusGeometry(2.3, 0.015, 16, 100);
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    orbitalGroup.add(ring1);

    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    const ringGeo2 = new THREE.TorusGeometry(2.55, 0.015, 16, 100);
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 6;
    orbitalGroup.add(ring2);

    // Initial shape build
    buildShapeGeometry(currentMode, wireframeOnly);

    // Mouse Listeners
    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = x * 0.8;
      mouseRef.current.targetY = y * 0.8;

      if (isDraggingRef.current && mainGroupRef.current) {
        const deltaX = e.clientX - prevMousePosRef.current.x;
        const deltaY = e.clientY - prevMousePosRef.current.y;
        mainGroupRef.current.rotation.y += deltaX * 0.01;
        mainGroupRef.current.rotation.x += deltaY * 0.01;
        prevMousePosRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handlePointerDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      setIsInteracting(true);
      prevMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
      setIsInteracting(false);
    };

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('resize', handleResize);

    // Animation Loop
    const startTime = performance.now();

    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) * 0.001;

      // Smooth mouse follow
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      if (mainGroupRef.current && !isDraggingRef.current) {
        if (isAutoRotating) {
          mainGroupRef.current.rotation.y += 0.008;
          mainGroupRef.current.rotation.x = Math.sin(elapsedTime * 0.4) * 0.2 + mouseRef.current.y * 0.4;
          mainGroupRef.current.rotation.z = Math.cos(elapsedTime * 0.3) * 0.1 + mouseRef.current.x * 0.4;
        } else {
          mainGroupRef.current.rotation.x += (mouseRef.current.y * 0.5 - mainGroupRef.current.rotation.x) * 0.05;
          mainGroupRef.current.rotation.y += (mouseRef.current.x * 0.5 - mainGroupRef.current.rotation.y) * 0.05;
        }
      }

      if (orbitalGroup) {
        orbitalGroup.rotation.z = elapsedTime * 0.15;
        orbitalGroup.rotation.y = elapsedTime * 0.1;
      }

      if (particlesMeshRef.current) {
        particlesMeshRef.current.rotation.y = -elapsedTime * 0.03;
        particlesMeshRef.current.rotation.x = elapsedTime * 0.02;
      }

      if (innerCoreMeshRef.current) {
        const pulse = 1 + Math.sin(elapsedTime * 2.5) * 0.08;
        innerCoreMeshRef.current.scale.set(pulse, pulse, pulse);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, []);

  // Function to re-construct geometry based on mode
  const buildShapeGeometry = (mode: ShapeMode, wireframe: boolean) => {
    if (!mainGroupRef.current || !sceneRef.current) return;

    // Clean old meshes inside mainGroup except orbital rings
    const toRemove: THREE.Object3D[] = [];
    mainGroupRef.current.children.forEach((child) => {
      if (child !== orbitalRingsRef.current) {
        toRemove.push(child);
      }
    });
    toRemove.forEach((c) => mainGroupRef.current?.remove(c));

    const isLight = theme === 'light';

    if (mode === 'neural') {
      // Nested Wireframe Icosahedron + Pulsing Core + Synapse nodes
      const outerGeo = new THREE.IcosahedronGeometry(1.6, 1);
      const outerMat = new THREE.MeshStandardMaterial({
        color: isLight ? 0x4f46e5 : 0x6366f1,
        wireframe: true,
        roughness: 0.2,
        metalness: 0.8,
        emissive: 0x4338ca,
        emissiveIntensity: 0.4,
      });
      const outerMesh = new THREE.Mesh(outerGeo, outerMat);
      mainGroupRef.current.add(outerMesh);
      outerMeshRef.current = outerMesh;

      const midGeo = new THREE.IcosahedronGeometry(1.1, 0);
      const midMat = new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        wireframe: true,
        roughness: 0.1,
        metalness: 0.9,
        emissive: 0x0891b2,
        emissiveIntensity: 0.5,
      });
      const midMesh = new THREE.Mesh(midGeo, midMat);
      mainGroupRef.current.add(midMesh);

      // Inner Glowing Core
      const innerGeo = new THREE.SphereGeometry(0.55, 32, 32);
      const innerMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        roughness: 0.1,
        metalness: 0.2,
        emissive: 0x0284c7,
        emissiveIntensity: 0.8,
        wireframe: wireframe,
      });
      const innerMesh = new THREE.Mesh(innerGeo, innerMat);
      mainGroupRef.current.add(innerMesh);
      innerCoreMeshRef.current = innerMesh;

      // Vertex Synapse spheres
      const pos = outerGeo.attributes.position;
      const nodeGeo = new THREE.SphereGeometry(0.04, 8, 8);
      const nodeMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      for (let i = 0; i < pos.count; i += 2) {
        const node = new THREE.Mesh(nodeGeo, nodeMat);
        node.position.set(pos.getX(i), pos.getY(i), pos.getZ(i));
        mainGroupRef.current.add(node);
      }
    } else if (mode === 'torus') {
      // Quantum Torus Knot
      const knotGeo = new THREE.TorusKnotGeometry(1.2, 0.38, 128, 32, 2, 3);
      const knotMat = new THREE.MeshStandardMaterial({
        color: isLight ? 0x4338ca : 0x6366f1,
        roughness: 0.15,
        metalness: 0.85,
        wireframe: wireframe,
        emissive: 0x1e1b4b,
        emissiveIntensity: 0.3,
      });
      const knotMesh = new THREE.Mesh(knotGeo, knotMat);
      mainGroupRef.current.add(knotMesh);
      outerMeshRef.current = knotMesh;

      // Inner mini sphere
      const coreGeo = new THREE.SphereGeometry(0.4, 16, 16);
      const coreMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, wireframe: true });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      mainGroupRef.current.add(coreMesh);
      innerCoreMeshRef.current = coreMesh;
    } else if (mode === 'hypercube') {
      // Cyber Hypercube (Nested Octahedron & Cubes)
      const cubeGeo1 = new THREE.BoxGeometry(1.8, 1.8, 1.8);
      const cubeMat1 = new THREE.MeshStandardMaterial({
        color: 0x6366f1,
        wireframe: true,
        roughness: 0.2,
      });
      const cube1 = new THREE.Mesh(cubeGeo1, cubeMat1);
      mainGroupRef.current.add(cube1);
      outerMeshRef.current = cube1;

      const octGeo = new THREE.OctahedronGeometry(1.2, 0);
      const octMat = new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        wireframe: true,
        roughness: 0.1,
        emissive: 0x0891b2,
        emissiveIntensity: 0.4,
      });
      const octMesh = new THREE.Mesh(octGeo, octMat);
      mainGroupRef.current.add(octMesh);

      const centerGeo = new THREE.BoxGeometry(0.6, 0.6, 0.6);
      const centerMat = new THREE.MeshStandardMaterial({
        color: 0xa855f7,
        roughness: 0.1,
        metalness: 0.9,
        wireframe: wireframe,
      });
      const centerMesh = new THREE.Mesh(centerGeo, centerMat);
      mainGroupRef.current.add(centerMesh);
      innerCoreMeshRef.current = centerMesh;
    } else if (mode === 'sphere') {
      // Data Waveform Sphere
      const sphereGeo = new THREE.SphereGeometry(1.4, 36, 36);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        wireframe: true,
        roughness: 0.1,
        metalness: 0.8,
        emissive: 0x0e7490,
        emissiveIntensity: 0.4,
      });
      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
      mainGroupRef.current.add(sphereMesh);
      outerMeshRef.current = sphereMesh;

      const innerSphereGeo = new THREE.DodecahedronGeometry(0.8, 1);
      const innerSphereMat = new THREE.MeshStandardMaterial({
        color: 0x6366f1,
        roughness: 0.2,
        metalness: 0.8,
        wireframe: wireframe,
      });
      const innerSphere = new THREE.Mesh(innerSphereGeo, innerSphereMat);
      mainGroupRef.current.add(innerSphere);
      innerCoreMeshRef.current = innerSphere;
    }
  };

  // Switch mode handler
  const handleModeChange = (mode: ShapeMode) => {
    setCurrentMode(mode);
    buildShapeGeometry(mode, wireframeOnly);
  };

  const handleToggleWireframe = () => {
    const next = !wireframeOnly;
    setWireframeOnly(next);
    buildShapeGeometry(currentMode, next);
  };

  // Pulse effect
  const handlePulse = () => {
    if (mainGroupRef.current) {
      mainGroupRef.current.scale.set(1.25, 1.25, 1.25);
      setTimeout(() => {
        if (mainGroupRef.current) {
          mainGroupRef.current.scale.set(1, 1, 1);
        }
      }, 350);
    }
  };

  return (
    <div className="relative w-full max-w-[440px] aspect-square flex flex-col items-center justify-center select-none group">
      
      {/* 3D Glow Ambient Backing */}
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/20 via-sky-500/10 to-teal-400/20 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-slow" />
      
      {/* WebGL Canvas Container */}
      <div
        ref={containerRef}
        id="hero-threejs-canvas"
        className={`w-full h-full cursor-grab active:cursor-grabbing transition-transform duration-300 ${
          isInteracting ? 'scale-[1.02]' : ''
        }`}
        title="Click and drag to rotate the 3D model in real time!"
      />

      {/* Floating 3D Control Bar */}
      <div 
        id="three-controls-bar"
        className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-slate-800/90 shadow-xl z-20 transition-all hover:border-indigo-500/50"
      >
        {/* Shape mode buttons */}
        <button
          onClick={() => handleModeChange('neural')}
          className={`p-1.5 rounded-xl transition-all ${
            currentMode === 'neural'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="3D Neural Core"
        >
          <Cpu className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => handleModeChange('torus')}
          className={`p-1.5 rounded-xl transition-all ${
            currentMode === 'torus'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Quantum Torus Knot"
        >
          <CircleDot className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => handleModeChange('hypercube')}
          className={`p-1.5 rounded-xl transition-all ${
            currentMode === 'hypercube'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Cyber Hypercube"
        >
          <Box className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => handleModeChange('sphere')}
          className={`p-1.5 rounded-xl transition-all ${
            currentMode === 'sphere'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Data Waveform Sphere"
        >
          <Sparkles className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-4 bg-slate-800 mx-0.5" />

        {/* Rotate Toggle */}
        <button
          onClick={() => setIsAutoRotating(!isAutoRotating)}
          className={`p-1.5 rounded-xl text-xs font-mono transition-all ${
            isAutoRotating
              ? 'bg-slate-800 text-indigo-400'
              : 'text-slate-500 hover:text-slate-300'
          }`}
          title={isAutoRotating ? 'Pause auto-rotation' : 'Resume auto-rotation'}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isAutoRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
        </button>

        {/* Pulse / Energy burst */}
        <button
          onClick={handlePulse}
          className="p-1.5 rounded-xl text-amber-400 hover:bg-slate-800 transition-all active:scale-90"
          title="Trigger Energy Pulse"
        >
          <Zap className="w-3.5 h-3.5" />
        </button>

        {/* Wireframe toggle */}
        <button
          onClick={handleToggleWireframe}
          className={`p-1.5 rounded-xl transition-all ${
            wireframeOnly
              ? 'bg-indigo-600/30 text-indigo-300'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Toggle Wireframe Core"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Interactive Helper Hint */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-slate-950/70 border border-slate-800/80 text-[10px] font-mono text-slate-400 pointer-events-none flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
        <span>Interactive 3D WebGL · Drag to Orbit</span>
      </div>
    </div>
  );
};
