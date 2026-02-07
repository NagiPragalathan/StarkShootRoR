import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useEffect, useState } from "react";

export const SkyBox = () => {
    const [texturePath, setTexturePath] = useState("/textures/anime_art_style_a_water_based_pokemon_like_environ.jpg");

    useEffect(() => {
        const selectedMap = localStorage.getItem("selectedMap")?.toLowerCase() || "";

        // Map textures to game levels
        if (selectedMap.includes("bermuda") || selectedMap.includes("pochinki")) {
            setTexturePath("/textures/anime_art_style_a_water_based_pokemon_like_environ.jpg");
        } else if (selectedMap.includes("city") || selectedMap.includes("arena")) {
            setTexturePath("/textures/anime_art_style_cactus_forest.jpg");
        } else if (selectedMap.includes("grave") || selectedMap.includes("broken") || selectedMap.includes("lava")) {
            setTexturePath("/textures/anime_art_style_lava_world.jpg");
        } else {
            setTexturePath("/textures/anime_art_style_a_water_based_pokemon_like_environ.jpg");
        }
    }, []);

    const texture = useTexture(texturePath);

    return (
        <mesh>
            <sphereGeometry args={[500, 64, 64]} />
            <meshBasicMaterial
                map={texture}
                side={THREE.BackSide}
                fog={false}
            />
        </mesh>
    );
};

// Preload textures for zero-latency transitions
useTexture.preload("/textures/anime_art_style_a_water_based_pokemon_like_environ.jpg");
useTexture.preload("/textures/anime_art_style_cactus_forest.jpg");
useTexture.preload("/textures/anime_art_style_lava_world.jpg");
