import { useLoader } from "@react-three/fiber";
import type { ThreeElements } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import {
  Box3,
  MeshStandardMaterial,
  SRGBColorSpace,
  Vector3,
  DoubleSide,
  Color,
  Mesh,
} from "three";

type PictureFrameProps = ThreeElements["group"] & {
  image: string;
  imageScale?: number | [number, number];
  imageOffset?: [number, number, number];
};

const DEFAULT_IMAGE_SCALE: [number, number] = [0.82, 0.82];

export function PictureFrame({
  image,
  imageScale = DEFAULT_IMAGE_SCALE,
  imageOffset,
  children,
  ...groupProps
}: PictureFrameProps) {
  const { gl } = useThree();
  const gltf = useLoader(GLTFLoader, "/picture_frame.glb");
  const pictureTexture = useTexture(image);

  pictureTexture.colorSpace = SRGBColorSpace;
  const maxAnisotropy =
    typeof gl.capabilities.getMaxAnisotropy === "function"
      ? gl.capabilities.getMaxAnisotropy()
      : 1;
  pictureTexture.anisotropy = maxAnisotropy;

  const frameScene = useMemo(() => {
    const cloned = gltf.scene.clone(true);

    // Apply soft, mature colors to frame materials
    cloned.traverse((child) => {
      if (child instanceof Mesh && child.material) {
        const material = child.material as MeshStandardMaterial;
        if (material.isMeshStandardMaterial) {
          // Dusty rose/soft mauve tones for frame
          material.color = new Color(0xc9b1b1); // soft mauve
          material.roughness = 0.6;
          material.metalness = 0.1;
        }
      }
    });

    return cloned;
  }, [gltf.scene]);

  const { frameSize, frameCenter } = useMemo(() => {
    const box = new Box3().setFromObject(frameScene);
    const size = new Vector3();
    const center = new Vector3();
    box.getSize(size);
    box.getCenter(center);
    return { frameSize: size, frameCenter: center };
  }, [frameScene]);

  const scaledImage = useMemo<[number, number]>(() => {
    if (Array.isArray(imageScale)) {
      return imageScale;
    }
    return [imageScale, imageScale];
  }, [imageScale]);

  const [imageScaleX, imageScaleY] = scaledImage;

  const imageWidth = frameSize.x * imageScaleX;
  const imageHeight = frameSize.y * imageScaleY;

  const [offsetX, offsetY, offsetZ] = imageOffset ?? [
    0,
    0.05,
    -0.27,
  ];

  const imagePosition: [number, number, number] = [
    frameCenter.x + offsetX,
    frameCenter.y + offsetY,
    frameCenter.z + offsetZ,
  ];

  const pictureMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        map: pictureTexture,
        roughness: 0.15,
        metalness: 0,
        side: DoubleSide,
      }),
    [pictureTexture]
  );

  useEffect(() => {
    return () => {
      pictureMaterial.dispose();
    };
  }, [pictureMaterial]);

  return (
    <group {...groupProps}>
      <group rotation={[0.04, 0, 0]}>
        <primitive object={frameScene} />
        <mesh
          position={imagePosition}
          rotation={[0.435, Math.PI, 0]}
          material={pictureMaterial}
        >
          <planeGeometry args={[imageWidth, imageHeight]} />
        </mesh>
        {children}
      </group>
    </group>
  );
}
