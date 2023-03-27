import * as THREE from "three";
import { useState, useEffect } from "react";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { addVertexColors } from "./modeling";

interface SceneProps {
  file: string;
  remove: () => void;
}

export const Scene = ({ file, remove }: SceneProps) => {
  const [obj, setObj] = useState<THREE.Group | null>(null);

  useEffect(() => {
    const loader = new OBJLoader();

    loader.load(file, (obj) => {
      // Create a material with vertex colors
      const material = new THREE.MeshBasicMaterial({ vertexColors: true });

      // For each child of the loaded object, assign the new material and add vertex colors
      obj.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = material;
          child.geometry = addVertexColors(child.geometry);
        }
      });

      setObj(obj);
    });
  }, [file]);

  return (
    <>
      <primitive object={obj} scale={0.05} />
      <mesh
        position={[0, 0, -10]}
        onClick={() => {
          if (window.confirm("Are you sure you want to delete this object?")) {
            remove();
          }
        }}
      >
        <boxBufferGeometry />
        <meshBasicMaterial color="red" />
      </mesh>
    </>
  );
};
