import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, InstancedMesh, Object3D, Vector3 } from "three";

type FireworksProps = {
  isActive: boolean;
  origin?: [number, number, number];
};

const PETAL_COUNT = 40;

type Petal = {
  position: Vector3;
  velocity: Vector3;
  rotation: number;
  rotationSpeed: number;
  scale: number;
  life: number;
  maxLife: number;
};

export function Fireworks({ isActive, origin = [0, 10, 0] }: FireworksProps) {
  const meshRef = useRef<InstancedMesh>(null);
  const petals = useRef<Petal[]>([]);
  const dummy = useMemo(() => new Object3D(), []);

  useMemo(() => {
    petals.current = Array.from({ length: PETAL_COUNT }, () => ({
      position: new Vector3(...origin),
      velocity: new Vector3(
        (Math.random() - 0.5) * 0.02,
        Math.random() * 0.01,
        (Math.random() - 0.5) * 0.02
      ),
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.05,
      scale: Math.random() * 0.03 + 0.02,
      life: 0,
      maxLife: Math.random() * 3 + 4,
    }));
  }, [origin]);

  useFrame((_, delta) => {
    if (!meshRef.current || !isActive) return;

    petals.current.forEach((petal, i) => {
      petal.life += delta;

      if (petal.life > petal.maxLife) {
        petal.position.set(...origin);
        petal.velocity.set(
          (Math.random() - 0.5) * 0.02,
          Math.random() * 0.01,
          (Math.random() - 0.5) * 0.02
        );
        petal.life = 0;
        petal.rotation = Math.random() * Math.PI * 2;
      }

      petal.velocity.y -= 0.001;
      petal.position.add(petal.velocity);
      petal.rotation += petal.rotationSpeed;

      const opacity = Math.max(0, 1 - petal.life / petal.maxLife);

      dummy.position.copy(petal.position);
      dummy.rotation.set(0, petal.rotation, 0);
      dummy.scale.setScalar(petal.scale);
      dummy.updateMatrix();

      meshRef.current.setMatrixAt(i, dummy.matrix);
      meshRef.current.setColorAt(i, new Color(0xd4a5a5).multiplyScalar(opacity));
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PETAL_COUNT]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial transparent opacity={0.7} />
    </instancedMesh>
  );
}
