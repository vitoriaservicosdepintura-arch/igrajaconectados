import { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, Text } from '@react-three/drei';
import * as THREE from 'three';
import { verses } from '../data/verses';

interface PageProps {
  position: [number, number, number];
  rotation: [number, number, number];
  verse: typeof verses[0];
}

function Page({ position, rotation, verse }: PageProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  return (
    <group position={position} rotation={rotation}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[2.8, 3.6, 0.02]} />
        <meshStandardMaterial 
          color="#faf8f0" 
          roughness={0.8}
          metalness={0}
        />
      </mesh>
      <Text
        position={[0, 0.8, 0.02]}
        fontSize={0.12}
        maxWidth={2.4}
        textAlign="center"
        color="#2c1810"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/crimsontext/v19/wlp2gwHKFkZgtmSR3NB0oRJfbwhT.woff"
      >
        {verse.text}
      </Text>
      <Text
        position={[0, -1.2, 0.02]}
        fontSize={0.14}
        color="#8b4513"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/crimsontext/v19/wlp2gwHKFkZgtmSR3NB0oRJfbwhT.woff"
      >
        {verse.reference}
      </Text>
      {/* Page lines */}
      {Array.from({ length: 15 }).map((_, i) => (
        <mesh key={i} position={[0, 1.5 - i * 0.15, 0.015]}>
          <planeGeometry args={[2.2, 0.003]} />
          <meshBasicMaterial color="#d4c4a8" opacity={0.3} transparent />
        </mesh>
      ))}
    </group>
  );
}

function FlippingPage({ isFlipping, progress }: {
  isFlipping: boolean;
  progress: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (groupRef.current && isFlipping) {
      groupRef.current.rotation.y = -Math.PI * progress;
    }
  });

  if (!isFlipping) return null;

  return (
    <group ref={groupRef} position={[0, 0, 0.05]}>
      {/* Front of flipping page */}
      <mesh position={[1.4, 0, 0.01]}>
        <boxGeometry args={[2.8, 3.6, 0.01]} />
        <meshStandardMaterial 
          color="#faf8f0" 
          roughness={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Back of flipping page */}
      <mesh position={[1.4, 0, -0.01]}>
        <boxGeometry args={[2.8, 3.6, 0.01]} />
        <meshStandardMaterial 
          color="#f5f0e0" 
          roughness={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function Book({ currentVerseIndex, isFlipping, flipProgress }: {
  currentVerseIndex: number;
  isFlipping: boolean;
  flipProgress: number;
}) {
  const bookRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (bookRef.current) {
      bookRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
      bookRef.current.rotation.x = -0.3 + Math.sin(state.clock.elapsedTime * 0.2) * 0.02;
    }
  });

  const currentVerse = verses[currentVerseIndex % verses.length];
  const nextVerse = verses[(currentVerseIndex + 1) % verses.length];

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={bookRef}>
        {/* Book cover - left */}
        <mesh position={[-1.5, 0, -0.15]} castShadow>
          <boxGeometry args={[3, 3.8, 0.1]} />
          <meshStandardMaterial color="#4a1f0f" roughness={0.6} metalness={0.1} />
        </mesh>
        {/* Book cover - right */}
        <mesh position={[1.5, 0, -0.15]} castShadow>
          <boxGeometry args={[3, 3.8, 0.1]} />
          <meshStandardMaterial color="#4a1f0f" roughness={0.6} metalness={0.1} />
        </mesh>
        {/* Book spine */}
        <mesh position={[0, 0, -0.25]} castShadow>
          <boxGeometry args={[0.3, 3.8, 0.3]} />
          <meshStandardMaterial color="#3a1508" roughness={0.5} metalness={0.1} />
        </mesh>
        {/* Gold decoration on spine */}
        <mesh position={[0, 0, -0.1]}>
          <boxGeometry args={[0.25, 3.6, 0.02]} />
          <meshStandardMaterial color="#d4af37" roughness={0.3} metalness={0.7} />
        </mesh>
        {/* Cross on spine */}
        <mesh position={[0, 0.5, -0.08]}>
          <boxGeometry args={[0.15, 0.6, 0.02]} />
          <meshStandardMaterial color="#ffd700" roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.5, -0.08]}>
          <boxGeometry args={[0.4, 0.12, 0.02]} />
          <meshStandardMaterial color="#ffd700" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Pages stack - left */}
        <mesh position={[-1.45, 0, -0.05]}>
          <boxGeometry args={[2.7, 3.5, 0.15]} />
          <meshStandardMaterial color="#f5f0e0" roughness={0.9} />
        </mesh>
        {/* Pages stack - right */}
        <mesh position={[1.45, 0, -0.05]}>
          <boxGeometry args={[2.7, 3.5, 0.15]} />
          <meshStandardMaterial color="#f5f0e0" roughness={0.9} />
        </mesh>
        
        {/* Left page with verse */}
        <Page 
          position={[-1.45, 0, 0.03]}
          rotation={[0, 0, 0]}
          verse={currentVerse}
        />
        
        {/* Right page with next verse */}
        <Page 
          position={[1.45, 0, 0.03]}
          rotation={[0, 0, 0]}
          verse={nextVerse}
        />

        {/* Flipping page animation */}
        <FlippingPage 
          isFlipping={isFlipping}
          progress={flipProgress}
        />
        
        {/* Ribbon bookmark */}
        <mesh position={[-0.5, -1.9, 0.1]}>
          <boxGeometry args={[0.1, 0.8, 0.01]} />
          <meshStandardMaterial color="#8b0000" roughness={0.7} />
        </mesh>
      </group>
    </Float>
  );
}

function Particles() {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particlePositions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#ffd700"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function Scene({ currentVerseIndex, isFlipping, flipProgress }: {
  currentVerseIndex: number;
  isFlipping: boolean;
  flipProgress: number;
}) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <spotLight
        position={[5, 10, 5]}
        angle={0.3}
        penumbra={0.5}
        intensity={1.5}
        castShadow
        color="#fff5e6"
      />
      <spotLight
        position={[-5, 5, 5]}
        angle={0.4}
        penumbra={0.8}
        intensity={0.8}
        color="#ffe4c4"
      />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#ffd700" />
      
      <Book 
        currentVerseIndex={currentVerseIndex}
        isFlipping={isFlipping}
        flipProgress={flipProgress}
      />
      <Particles />
      <Environment preset="sunset" />
    </>
  );
}

export function Bible3D() {
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipProgress, setFlipProgress] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIsFlipping(true);
      setFlipProgress(0);
      
      const flipDuration = 1000;
      const startTime = Date.now();
      
      const animateFlip = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / flipDuration, 1);
        setFlipProgress(progress);
        
        if (progress < 1) {
          requestAnimationFrame(animateFlip);
        } else {
          setIsFlipping(false);
          setCurrentVerseIndex(prev => (prev + 1) % verses.length);
        }
      };
      
      requestAnimationFrame(animateFlip);
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="relative w-full h-[600px] md:h-[700px]">
      <Canvas
        shadows
        camera={{ position: [0, 2, 8], fov: 45 }}
        gl={{ antialias: true }}
      >
        <Scene 
          currentVerseIndex={currentVerseIndex}
          isFlipping={isFlipping}
          flipProgress={flipProgress}
        />
      </Canvas>
      
            {/* Verse display removed */}
      
      {/* Light rays effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-radial from-amber-200/20 via-transparent to-transparent rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
