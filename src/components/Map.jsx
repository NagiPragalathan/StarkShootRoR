import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useEffect, useState } from "react";

export const Map = () => {
  const [mapFile, setMapFile] = useState(null); // Initialize as null

  useEffect(() => {
    // Retrieve the map name from local storage
    const selectedMap = localStorage.getItem("selectedMap");
    console.log("selectedMap", selectedMap)

    // Set the map file based on the selected map
    if (selectedMap === "Bermuda") {
      setMapFile("models/map1.glb"); // Bermuda map
      console.log("models/map1.glb is loaded !")
    } else if (selectedMap === "Pochinki") {
      setMapFile("models/map.glb"); // Pochinki map
      console.log("models/map.glb is loaded !")
    } else {
      setMapFile("models/map.glb"); // Default to Pochinki if no map is selected
      console.log("models/map1.glb is loaded ! in else statements :)")
    }
  }, []); // Run only once on component mount

  // Load the map based on the file set by useEffect
  const map = useGLTF(mapFile || "models/map.glb"); // Fallback to default if mapFile is null

  useEffect(() => {
    if (map && map.scene) {
      // Traverse the map and enable shadows for meshes
      map.scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
  }, [map]); // Re-run when map changes

  return mapFile ? (
    <>
      <RigidBody colliders="trimesh" type="fixed">
        <primitive object={map.scene} />
      </RigidBody>
    </>
  ) : null; // Render nothing while the mapFile is being determined
};

// Preload both map files
useGLTF.preload("models/map1.glb");
useGLTF.preload("models/map.glb");
