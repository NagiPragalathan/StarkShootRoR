import { Environment } from "@react-three/drei";
import {
  Joystick,
  insertCoin,
  isHost,
  myPlayer,
  onPlayerJoin,
  useMultiplayerState,
} from "playroomkit";
import { useEffect, useState, useRef } from "react";
import { Bullet } from "./Bullet";
import { BulletHit } from "./BulletHit";
import { CharacterController } from "./CharacterController";
import { TCPCharacterController } from "./TCPCharacterController";
import { Map } from "./Map";

export const Experience = ({ downgradedPerformance = false }) => {
  const [players, setPlayers] = useState([]);
  const [mode, setMode] = useState("Normal"); // State for mode
  const [characterPosition, setCharacterPosition] = useState(null); // State for character position
  const lastPositionRef = useRef(null); // Store the last known position

  const start = async () => {
    // Start the game
    await insertCoin();

    // Create a joystick controller for each joining player
    onPlayerJoin((state) => {
      const joystick = new Joystick(state, {
        type: "angular",
        buttons: [
          { id: "fire", label: "Fire" },
          { id: "jump", label: "Jump" },
          { id: "switch", label: "Switch" },
        ],
      });
      const newPlayer = { state, joystick };
      state.setState("health", 100);
      state.setState("deaths", 0);
      state.setState("kills", 0);
      setPlayers((players) => [...players, newPlayer]);
      state.onQuit(() => {
        setPlayers((players) => players.filter((p) => p.state.id !== state.id));
      });
    });
  };

  useEffect(() => {
    start();

    // Add keydown event listener for "m" key
    const handleKeyDown = (event) => {
      if (event.key === "m") {
        // Capture the current player's position before mode change
        players.forEach(({ state }) => {
          if (state.id === myPlayer()?.id) {
            const position = state.getState("pos");
            if (position) {
              lastPositionRef.current = position; // Store the current position before switching modes
            }
          }
        });

        // Toggle between "TCP" and "Normal" modes
        setMode((prevMode) => (prevMode === "Normal" ? "TCP" : "Normal"));
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Cleanup event listener when component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [players]);

  const [bullets, setBullets] = useState([]);
  const [hits, setHits] = useState([]);

  const [networkBullets, setNetworkBullets] = useMultiplayerState("bullets", []);
  const [networkHits, setNetworkHits] = useMultiplayerState("hits", []);

  const onFire = (bullet) => {
    if (isHost()) {
      setBullets((bullets) => [...bullets, bullet]);
    } else {
      setNetworkBullets((bullets) => [...bullets, bullet]);
    }
  };

  const onHit = (bulletId, position) => {
    if (isHost()) {
      setBullets((bullets) => bullets.filter((bullet) => bullet.id !== bulletId));
      setHits((hits) => [...hits, { id: bulletId, position }]);
    } else {
      setNetworkHits((hits) => [...hits, { id: bulletId, position }]);
    }
  };

  const onHitEnded = (hitId) => {
    if (isHost()) {
      setHits((hits) => hits.filter((h) => h.id !== hitId));
    } else {
      setNetworkHits((hits) => hits.filter((h) => h.id !== hitId));
    }
  };

  useEffect(() => {
    if (isHost()) {
      setNetworkBullets(bullets);
    }
  }, [bullets]);

  useEffect(() => {
    if (isHost()) {
      setNetworkHits(hits);
    }
  }, [hits]);

  const onKilled = (_victim, killer) => {
    const killerState = players.find((p) => p.state.id === killer).state;
    killerState.setState("kills", killerState.state.kills + 1);
  };

  return (
    <>
      <Map />
      {players.map(({ state, joystick }) =>
        mode === "TCP" ? (
          <TCPCharacterController
            key={state.id}
            state={state}
            userPlayer={state.id === myPlayer()?.id}
            joystick={joystick}
            onKilled={onKilled}
            onFire={onFire}
            downgradedPerformance={downgradedPerformance}
            // Apply stored position when mode changes
            initialPosition={lastPositionRef.current || { x: 0, y: 0, z: 0 }} // Reuse the last position, or default to origin
          />
        ) : (
          <CharacterController
            key={state.id}
            state={state}
            userPlayer={state.id === myPlayer()?.id}
            joystick={joystick}
            onKilled={onKilled}
            onFire={onFire}
            downgradedPerformance={downgradedPerformance}
            // Apply stored position when mode changes
            initialPosition={lastPositionRef.current || { x: 0, y: 0, z: 0 }} // Reuse the last position, or default to origin
          />
        )
      )}
      {(isHost() ? bullets : networkBullets).map((bullet) => (
        <Bullet
          key={bullet.id}
          {...bullet}
          onHit={(position) => onHit(bullet.id, position)}
        />
      ))}
      {(isHost() ? hits : networkHits).map((hit) => (
        <BulletHit key={hit.id} {...hit} onEnded={() => onHitEnded(hit.id)} />
      ))}
      <Environment preset="sunset" />
    </>
  );
};
