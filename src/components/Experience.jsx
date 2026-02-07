import { Environment } from "@react-three/drei";
import {
  Joystick,
  insertCoin,
  isHost,
  myPlayer,
  onPlayerJoin,
  useMultiplayerState,
  useIsHost,
  setState,
  getState,
} from "playroomkit";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Bullet } from "./Bullet";
import { BulletHit } from "./BulletHit";
import { CharacterController } from "./CharacterController";
import { TCPCharacterController } from "./TCPCharacterController";
import { Map } from "./Map";
import { SkyBox } from "./SkyBox";

export const Experience = ({ downgradedPerformance = false }) => {
  const [players, setPlayers] = useState([]);
  const [mode, setMode] = useState("Normal"); // State for mode
  const [characterPosition, setCharacterPosition] = useState(null); // State for character position
  const lastPositionRef = useRef(null); // Store the last known position
  const time = useSelector((state) => state.authslice.selectedTime);
  const showMobileControls = useSelector((state) => state.authslice.showMobileControls);
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const [gameStarted, setGameStarted] = useMultiplayerState("gameStarted", false);
  const [timer, setTimer] = useMultiplayerState("timer");

  const start = async () => {
    // Start the game
    await insertCoin();

    const host = isHost();
    if (host) {
      console.log("Setting game started and host initial timer", time);
      setState("gameStarted", true, true);
      // AUTHORITATIVE: Only set initial timer if it hasn't been set by host yet
      if (getState("timer") === undefined) {
        setState("timer", time || 60, true);
      }
    }

    // Create a joystick controller for each joining player
    onPlayerJoin((state) => {
      // Show joystick if mobile OR if desktop mobile option is enabled
      const shouldShowJoystick = isMobile || showMobileControls;

      let joystick = null;
      if (shouldShowJoystick) {
        joystick = new Joystick(state, {
          type: "angular",
          buttons: [
            { id: "fire", label: "Fire" },
            { id: "jump", label: "Jump" },
            { id: "switch", label: "Switch" },
          ],
        });
      }
      const newPlayer = { state, joystick };
      state.setState("health", 100);
      state.setState("deaths", 0);
      state.setState("kills", 0);
      state.setState("killStreak", 0);

      // Initialize player profile from local storage for the local player
      if (state.id === myPlayer()?.id) {
        const storedEquipped = localStorage.getItem("stark_equipped");
        if (storedEquipped) {
          const gear = JSON.parse(storedEquipped);
          state.setState("profile", {
            char: gear.CHARACTERS,
            weapon: gear.WEAPONS
          });
        }
      }

      setPlayers((players) => [...players, newPlayer]);
      state.onQuit(() => {
        setPlayers((players) => players.filter((p) => p.state.id !== state.id));
      });
    });
  };

  useEffect(() => {
    start();
  }, []);

  useEffect(() => {
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

  const amIHost = useIsHost();

  useEffect(() => {
    if (amIHost && gameStarted) {
      console.log("AUTHORITATIVE TIMER STARTING. Initial state:", getState("timer"));
      const interval = setInterval(() => {
        const current = getState("timer") ?? time ?? 60;
        if (current > 0) {
          const next = current - 1;
          setState("timer", next, true);
          console.log("AUTHORITATIVE TICK:", next);
        } else {
          console.log("AUTHORITATIVE TIMER: 0 reached");
        }
      }, 1000);
      return () => {
        console.log("AUTHORITATIVE TIMER CLEANUP");
        clearInterval(interval);
      };
    }
  }, [amIHost, gameStarted, time]);

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
    const currentKills = killerState.getState("kills") || 0;
    const currentStreak = killerState.getState("killStreak") || 0;
    killerState.setState("kills", currentKills + 1);
    killerState.setState("killStreak", currentStreak + 1);
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
      <SkyBox />
      <Environment preset="sunset" />
    </>
  );
};
