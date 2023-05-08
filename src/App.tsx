import * as THREE from "three";
import { useState, useEffect } from "react";
import { Canvas, applyProps, useFrame, useLoader, useGraph } from '@react-three/fiber'
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { Loader, OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import { BufferAttribute } from "three";

import "./App.css";

// Function to add vertex colors to the geometry
const Scene = ({ file }: { file: string }) => {
    //load the obj file
    const obj: THREE.Group = useLoader(OBJLoader, file);
    //create a material with vertex colors
    const material: THREE.MeshPhysicalMaterial = new THREE.MeshPhysicalMaterial({ 
        vertexColors: true,
        side: THREE.FrontSide, 
        metalness: 1.0, 
        roughness: 0.3 
    });
    //for each child of the loaded object, assign the new material and add vertex colors
    obj.traverse((child: THREE.Object3D<THREE.Event>) => {
    if (child instanceof THREE.Mesh) {
        child.material = material;
    }
    });
  //return the object
  return <primitive object={obj} scale={0.05}/>

};

const App = () => {
  const [files, setFiles] = useState<string[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const newFiles = Array.from(event.target.files).map((file) =>
        URL.createObjectURL(file)
      );
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  return (
    <div className="App">
      <div className="input-container">
        <input
          type="file"
          id="file-input"
          accept=".obj"
          multiple
          onChange={handleFileChange}
        />
        <label htmlFor="file-input">Choose OBJ files</label>
      </div>
      {files.length > 0 && (
        <div className="canvas-container">
          <Canvas>
            <directionalLight position={[1, 1, 1]}/>
            <directionalLight position={[-1, -1, -1]}/>
            <ambientLight intensity={0.3}/>
            <OrbitControls />
            {files.map((file, index) => (
              <Suspense key = {index} fallback={null}>
                <Scene file={file} />
              </Suspense>
            ))}
          </Canvas>
        </div>
      )}
    </div>
  );
};

export default App;
