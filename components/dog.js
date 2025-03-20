import React, { useRef, useState, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

export default function Model(props) {
  const { nodes, materials } = useGLTF("/dog.glb");
  const dogRef = useRef(null);
  const clockRef = useRef(0);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [lastMoveTime, setLastMoveTime] = useState(Date.now());
  const [isMoving, setIsMoving] = useState(false);

  // ✅ Initial Animation on Load (dog moves up and down)
  useEffect(() => {
    const interval = setInterval(() => {
      if (dogRef.current) {
        dogRef.current.position.y += Math.sin(clockRef.current) * 0.005; // Smooth bobbing
      }
      clockRef.current += 0.05;
    }, 16);
    return () => clearInterval(interval);
  }, []);

  // ✅ Track Mouse Movement
  useEffect(() => {
    const handleMouseMove = (event) => {
      const x = (event.clientX / window.innerWidth) * 4 - 2; // Normalize X
      const y = -(event.clientY / window.innerHeight) * 2 + 1; // Normalize Y
      setMousePos({ x, y });
      setLastMoveTime(Date.now()); // Update last move time
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // ✅ Move Dog Toward Mouse & Stop If No Movement
  useFrame(() => {
    if (dogRef.current) {
      const elapsed = Date.now() - lastMoveTime;
      setIsMoving(elapsed < 1000); // Stop after 1s of inactivity

      // Smooth movement towards cursor, adding boundaries to prevent overlap with images
      dogRef.current.position.x += (mousePos.x - dogRef.current.position.x) * 0.05;
      dogRef.current.position.z += (mousePos.y - dogRef.current.position.z) * 0.05;

      // Constrain the dog's position to not overlap the images (example boundaries)
      if (dogRef.current.position.x < -2) dogRef.current.position.x = -2; // Left boundary
      if (dogRef.current.position.x > 2) dogRef.current.position.x = 2; // Right boundary

      if (dogRef.current.position.z < -1.5) dogRef.current.position.z = -1.5; // Lower boundary

      // Rotate to face the cursor
      dogRef.current.rotation.y = Math.atan2(mousePos.x - dogRef.current.position.x, mousePos.y - dogRef.current.position.z);

      // ✅ Simulate Walking Animation
      if (isMoving) {
        dogRef.current.position.y += Math.sin(clockRef.current * 5) * 0.002; // Slight up-down motion
      }
    }
  });

  return (
    <group ref={dogRef} {...props} position={[0, -1, 0]} scale={0.12} dispose={null}> {/* Smaller dog */}
      {/* ✅ Dog Body with Color */}
      <mesh castShadow receiveShadow geometry={nodes.Doguinho_low_poly_Doguinho.geometry}>
        <meshStandardMaterial color="#c29a6b" /> {/* ✅ Light Brown Dog */}
      </mesh>

      {/* ✅ Dog Collar */}
      <mesh castShadow receiveShadow geometry={nodes.collar_Doguinho001_1.geometry}>
        <meshStandardMaterial color="#ff0000" /> {/* ✅ Red Collar */}
      </mesh>
      <mesh castShadow receiveShadow geometry={nodes.collar_Doguinho001_2.geometry}>
        <meshStandardMaterial color="#ffd700" /> {/* ✅ Gold Tag */}
      </mesh>
      <mesh castShadow receiveShadow geometry={nodes.collar_Doguinho001_3.geometry}>
        <meshStandardMaterial color="#000000" /> {/* ✅ Black Accents */}
      </mesh>
    </group>
  );
}

// Preload the model
useGLTF.preload("/dog.glb");
