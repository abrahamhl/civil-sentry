import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Line, Points, PointMaterial } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

const ParticleGlobe = () => {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Generate random points on a sphere
  const particles = useMemo(() => {
    const count = 3000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2; // radius
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
  }, []);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <Points ref={pointsRef as any}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <PointMaterial transparent color="#a855f7" size={0.02} sizeAttenuation={true} depthWrite={false} opacity={0.6} />
    </Points>
  );
};

const OrbitRing = ({ radius, speed, axis, color }: any) => {
  const groupRef = useRef<THREE.Group>(null);
  
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
    }
    return pts;
  }, [radius]);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      (groupRef.current.rotation as any)[axis] = clock.getElapsedTime() * speed;
    }
  });

  return (
    <group ref={groupRef as any}>
      <Line points={points} color={color} lineWidth={1} transparent opacity={0.3} />
      {/* Satellite Node */}
      <mesh position={[radius, 0, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {/* Scanning Cone */}
      <mesh position={[radius - 0.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.3, 0.6, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.15} depthWrite={false} />
      </mesh>
    </group>
  );
};

export const CyberGlobe = () => {
  return (
    <div className="w-full h-[600px] relative rounded-3xl overflow-hidden border border-slate-800 shadow-[0_0_100px_rgba(168,85,247,0.15)]">
      <Canvas camera={{ position: [0, 2, 6], fov: 45 }}>
        <color attach="background" args={['#020617']} />
        
        {/* Core Globe (Dark base) */}
        <Sphere args={[1.95, 64, 64]}>
          <meshBasicMaterial color="#000000" />
        </Sphere>
        
        {/* Particle Shell */}
        <ParticleGlobe />
        
        {/* Orbital Scanners */}
        <OrbitRing radius={2.6} speed={0.5} axis="y" color="#3b82f6" />
        <OrbitRing radius={3.0} speed={0.3} axis="x" color="#a855f7" />
        <OrbitRing radius={2.8} speed={0.4} axis="z" color="#10b981" />
        <OrbitRing radius={3.2} speed={-0.2} axis="y" color="#ef4444" />

        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
        
        <EffectComposer>
          {/* @ts-ignore */}
          <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} intensity={1.5} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};
