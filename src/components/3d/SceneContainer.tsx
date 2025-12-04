import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
} from "@react-three/drei";

interface SceneProps {
  children: React.ReactNode;
}

export function SceneContainer({ children }: SceneProps) {
  return (
    <div className="w-full h-full min-h-[400px] bg-slate-900/50 rounded-xl overflow-hidden border border-slate-700 shadow-inner">
      <Canvas shadows dpr={[1, 2]}>
        {/* 1. Camera Setup */}
        {/* We place it slightly above and looking down at the "neck" */}
        <PerspectiveCamera makeDefault position={[0, 5, 15]} fov={45} />
        {/* 2. Controls */}
        [cite_start]
        {/* Spec says "slight rotation"[cite: 118]. We limit the angles so the user can't get lost under the guitar. */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minPolarAngle={Math.PI / 4} // Don't go too high
          maxPolarAngle={Math.PI / 2} // Don't go below the board
          minAzimuthAngle={-Math.PI / 4} // Limit left rotation
          maxAzimuthAngle={Math.PI / 4} // Limit right rotation
        />
        {/* 3. Lighting */}
        <ambientLight intensity={0.5} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          intensity={1}
          castShadow
        />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        {/* 4. Environment Reflection (Optional, gives metallic look to frets) */}
        <Environment preset="city" />
        {/* 5. The Content (The Guitar) */}
        {children}
      </Canvas>
    </div>
  );
}
