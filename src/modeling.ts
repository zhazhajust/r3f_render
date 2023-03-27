import * as THREE from "three";

export function addVertexColors(geometry: THREE.BufferGeometry) {
  // Create a new buffer attribute for the vertex colors
  const colorAttribute = new THREE.BufferAttribute(
    new Float32Array(geometry.attributes.position.count * 3),
    3
  );

  // For each vertex, get the color from the obj file and assign it to the new color attribute
  for (let i = 0; i < geometry.attributes.position.count; i++) {
    const vertexColor = geometry.attributes.color.array.slice(
      i * 3,
      i * 3 + 3
    );
    colorAttribute.setXYZ(i, vertexColor[0], vertexColor[1], vertexColor[2]);
  }

  // Add the new color attribute to the geometry and return it
  geometry.setAttribute("color", colorAttribute);
  return geometry;
}
