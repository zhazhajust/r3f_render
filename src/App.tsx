import * as THREE from "three";
import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import { BufferAttribute } from "three";

import "./App.css";

const Scene = ({ file }: { file: string }) => {
  const [obj, setObj] = useState<THREE.Object3D | null>(null);

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

  // Function to add vertex colors to the geometry
  const addVertexColors = (geometry: any) => {
    // Create a new buffer attribute for the vertex colors
    const colorAttribute = new BufferAttribute(new Float32Array(geometry.attributes.position.count * 3), 3);

    // For each vertex, get the color from the obj file and assign it to the new color attribute
    for (let i = 0; i < geometry.attributes.position.count; i++) {
      const vertexColor = geometry.attributes.color.array.slice(i * 3, i * 3 + 3);
      colorAttribute.setXYZ(i, vertexColor[0], vertexColor[1], vertexColor[2]);
    }

    // Add the new color attribute to the geometry and return it
    geometry.setAttribute('color', colorAttribute);
    return geometry;
  };

  return obj ? <primitive object={obj} scale={0.05} /> : null;
};

const App = () => {
  const [file, setFile] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(URL.createObjectURL(event.target.files[0]));
    }
  };

  return (
    <div className="App">
      <div className="input-container">
        <input
          type="file"
          id="file-input"
          accept=".obj"
          onChange={handleFileChange}
        />
        <label htmlFor="file-input">Choose an OBJ file</label>
      </div>
      {file && (
        <div className="canvas-container">
          <Canvas>
            <Suspense fallback={null}>
              <Scene file={file} />
              <OrbitControls />
            </Suspense>
          </Canvas>
        </div>
      )}
    </div>
  );
};

export default App;