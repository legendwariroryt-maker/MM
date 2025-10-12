import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface DragonSegment {
  position: THREE.Vector3;
  rotation: number;
}

function Dragon3D() {
  const { camera, size } = useThree();
  const dragonRef = useRef<THREE.Group>(null);
  const segmentsRef = useRef<THREE.Mesh[]>([]);
  const targetPosition = useRef(new THREE.Vector3(0, 0, 0));
  const currentPosition = useRef(new THREE.Vector3(0, 0, 0));
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const [segments] = useState<DragonSegment[]>(() => 
    Array.from({ length: 8 }, () => ({
      position: new THREE.Vector3(0, 0, 0),
      rotation: 0
    }))
  );
  const wingRotation = useRef(0);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Convert mouse position to 3D coordinates
      const x = (event.clientX / size.width) * 2 - 1;
      const y = -(event.clientY / size.height) * 2 + 1;
      
      const vector = new THREE.Vector3(x, y, 0);
      vector.unproject(camera);
      
      const dir = vector.sub(camera.position).normalize();
      const distance = -camera.position.z / dir.z;
      const pos = camera.position.clone().add(dir.multiplyScalar(distance));
      
      targetPosition.current.copy(pos);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [camera, size]);

  useFrame((state, delta) => {
    if (!dragonRef.current) return;

    // Smooth dragon head movement with physics
    const acceleration = targetPosition.current.clone()
      .sub(currentPosition.current)
      .multiplyScalar(8);
    
    velocity.current.add(acceleration.multiplyScalar(delta));
    velocity.current.multiplyScalar(0.85); // Damping
    
    currentPosition.current.add(velocity.current.clone().multiplyScalar(delta));

    // Update head position and rotation
    const head = segmentsRef.current[0];
    if (head) {
      head.position.copy(currentPosition.current);
      
      // Point head in direction of movement
      if (velocity.current.length() > 0.01) {
        const angle = Math.atan2(velocity.current.y, velocity.current.x);
        head.rotation.z = angle;
      }
    }

    // Update body segments to follow head with serpentine motion
    for (let i = 1; i < segmentsRef.current.length; i++) {
      const current = segmentsRef.current[i];
      const previous = segmentsRef.current[i - 1];
      
      if (current && previous) {
        const target = previous.position.clone();
        const direction = target.sub(current.position);
        const distance = direction.length();
        const targetDistance = 0.4;
        
        if (distance > targetDistance) {
          direction.normalize().multiplyScalar((distance - targetDistance) * 0.3);
          current.position.add(direction);
        }
        
        // Rotate segments to face direction
        const angle = Math.atan2(direction.y, direction.x);
        current.rotation.z = angle;
      }
    }

    // Animate wings
    wingRotation.current += delta * 8;
  });

  return (
    <group ref={dragonRef}>
      {/* Dragon Head */}
      <mesh
        ref={(el) => { if (el) segmentsRef.current[0] = el; }}
        position={[0, 0, 0]}
      >
        <coneGeometry args={[0.15, 0.3, 8]} />
        <meshStandardMaterial 
          color="#10b981" 
          emissive="#10b981"
          emissiveIntensity={0.5}
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>

      {/* Eyes */}
      <mesh position={[0.08, 0.08, 0.1]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial 
          color="#fef08a"
          emissive="#fef08a"
          emissiveIntensity={1}
        />
      </mesh>
      <mesh position={[0.08, -0.08, 0.1]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial 
          color="#fef08a"
          emissive="#fef08a"
          emissiveIntensity={1}
        />
      </mesh>

      {/* Horns */}
      <mesh position={[0.15, 0.12, 0.05]} rotation={[0, 0, Math.PI / 6]}>
        <coneGeometry args={[0.02, 0.15, 4]} />
        <meshStandardMaterial 
          color="#059669"
          emissive="#059669"
          emissiveIntensity={0.3}
        />
      </mesh>
      <mesh position={[0.15, -0.12, 0.05]} rotation={[0, 0, -Math.PI / 6]}>
        <coneGeometry args={[0.02, 0.15, 4]} />
        <meshStandardMaterial 
          color="#059669"
          emissive="#059669"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Body Segments */}
      {segments.slice(1, 4).map((_, index) => {
        const i = index + 1;
        const size = 0.12 - i * 0.015;
        return (
          <mesh
            key={i}
            ref={(el) => { if (el) segmentsRef.current[i] = el; }}
            position={[-i * 0.4, 0, 0]}
          >
            <sphereGeometry args={[size, 12, 12]} />
            <meshStandardMaterial 
              color="#10b981"
              emissive="#06b6d4"
              emissiveIntensity={0.4}
              roughness={0.3}
              metalness={0.7}
            />
          </mesh>
        );
      })}

      {/* Wings at segment 2 */}
      <group position={[-0.8, 0, 0]}>
        <mesh 
          rotation={[0, 0, Math.sin(wingRotation.current) * 0.3 + Math.PI / 4]}
          position={[0, 0.15, 0]}
        >
          <boxGeometry args={[0.05, 0.4, 0.01]} />
          <meshStandardMaterial 
            color="#06b6d4"
            emissive="#06b6d4"
            emissiveIntensity={0.5}
            transparent
            opacity={0.7}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh 
          rotation={[0, 0, -Math.sin(wingRotation.current) * 0.3 - Math.PI / 4]}
          position={[0, -0.15, 0]}
        >
          <boxGeometry args={[0.05, 0.4, 0.01]} />
          <meshStandardMaterial 
            color="#06b6d4"
            emissive="#06b6d4"
            emissiveIntensity={0.5}
            transparent
            opacity={0.7}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Tail Segments */}
      {segments.slice(4).map((_, index) => {
        const i = index + 4;
        const size = 0.08 - index * 0.012;
        return (
          <mesh
            key={i}
            ref={(el) => { if (el) segmentsRef.current[i] = el; }}
            position={[-i * 0.4, 0, 0]}
          >
            <sphereGeometry args={[size, 10, 10]} />
            <meshStandardMaterial 
              color="#3b82f6"
              emissive="#3b82f6"
              emissiveIntensity={0.3}
              roughness={0.4}
              metalness={0.6}
            />
          </mesh>
        );
      })}

      {/* Tail Fin */}
      <mesh position={[-3.2, 0, 0]} rotation={[0, 0, 0]}>
        <coneGeometry args={[0.15, 0.3, 3]} />
        <meshStandardMaterial 
          color="#3b82f6"
          emissive="#3b82f6"
          emissiveIntensity={0.4}
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Glowing aura around dragon */}
      <pointLight 
        position={[0, 0, 0.3]} 
        intensity={1.5} 
        distance={2} 
        color="#10b981"
      />
    </group>
  );
}

export function DragonCursorTrail() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#ffffff" />
        <pointLight position={[-10, -10, 10]} intensity={0.3} color="#06b6d4" />
        <Dragon3D />
      </Canvas>
    </div>
  );
}
