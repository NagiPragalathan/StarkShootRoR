import React, { useState, useEffect, useRef, startTransition, Suspense } from "react";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import { Canvas, useLoader } from "@react-three/fiber";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setTimer, setMode } from "../../store/authslice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DotLoader } from "react-spinners";
import { GLTFLoader } from "three-stdlib";
import { CharacterSoldier } from "./CharacterSoldier";

const mapPaths = [
  "./bermuda.svg",
  "https://blogger.googleusercontent.com/img/a/AVvXsEiIDKYobYMAxdl5gAtBoE7B8P9G8iB0AYJUfiA0kR0NubthcLBo_LyYjsajGpA0jr6B1mCVB0lG5ZhMnhFYjNtbY5CiE6PJYmlXaAv5-TZ9GFJjnNZhLCulC76CPvjJfPmfIq3_5bvh0U7N7g784SznhnU5qS_uaRzeL2RsDlx39RboomQP1eg_MmahpNY",
  "/textures/anime_art_style_a_water_based_pokemon_like_environ.jpg",
  "/textures/anime_art_style_cactus_forest.jpg",
  "/textures/anime_art_style_lava_world.jpg",
  "https://blogger.googleusercontent.com/img/a/AVvXsEgHxU-HB-lQ9ifrEy-ymcHR6aeTkwzBaOsIQ6SXinjXyVVmqCbtY44ZraIGYM86B6DT7vk3jDrQSbdJn61D6jZB3HX3aRSc7EIYnSStvJmZefxCOpcKRZVFqha7jg0dd4i-0qZN-87FqviZbUY3oODu3bvJZK9ytVKnLRYcgFpo9hz4JzK25BmQS5c9TMI",
  "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800",
];

const mapNames = [
  "bermuda",
  "pochinki",
  "knife fight map",
  "free arena",
  "city side map",
  "living room",
  "grave house map",
  "broken house map"
];

const mapModels = [
  "",
  "",
  "models/knife_fight_map.glb",
  "models/map.glb",
  "models/city_side_map.glb",
  "models/living_room.glb",
  "models/grave_house_map.glb",
  "models/broken_house_map.glb"
];

const Lobby = () => {
  const dispatch = useDispatch();
  const playerinfo = useSelector((state) => state.authslice.playerdata);
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapIndex, setMapIndex] = useState(0);
  const [playerData, setPlayerData] = useState(playerinfo || null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
  const videoRef = useRef(null);

  // Auto-play audio handling for browser policies
  useEffect(() => {
    const handleInteraction = () => {
      if (videoRef.current) {
        videoRef.current.play().catch(e => console.log("Audio play blocked", e));
        videoRef.current.muted = false;
      }
      window.removeEventListener('click', handleInteraction);
    };

    window.addEventListener('click', handleInteraction);
    return () => window.removeEventListener('click', handleInteraction);
  }, []);

  // Load initial map selection from localStorage
  useEffect(() => {
    const storedMap = localStorage.getItem("selectedMap");
    if (storedMap) {
      const index = mapNames.indexOf(storedMap);
      if (index !== -1) {
        setMapIndex(index);
      }
    }
  }, []);

  const leftClick = () => {
    startTransition(() => {
      setMapIndex((prevIndex) => {
        const newIndex = prevIndex === 0 ? mapPaths.length - 1 : prevIndex - 1;
        localStorage.setItem("selectedMap", mapNames[newIndex]);
        return newIndex;
      });
    });
  };

  const rightClick = () => {
    startTransition(() => {
      setMapIndex((prevIndex) => {
        const newIndex = prevIndex === mapPaths.length - 1 ? 0 : prevIndex + 1;
        localStorage.setItem("selectedMap", mapNames[newIndex]);
        return newIndex;
      });
    });
  };

  const setGameTime = (time, buttonId) => {
    startTransition(() => {
      dispatch(setTimer(time));
      setActiveButton(buttonId);
      localStorage.setItem("selectedTime", time);
    });
  };

  const activeMode = useSelector((state) => state.authslice.selectedMode);
  const [gameMode, setGameMode] = useState(activeMode || "Free Style");
  const modes = ["Free Style", "Knife Fight", "TPP"];

  const handleModeChange = (mode) => {
    startTransition(() => {
      setGameMode(mode);
      dispatch(setMode(mode));
    });
  };

  return (
    <div className="h-screen w-screen relative overflow-hidden font-sans select-none">
      {/* Dynamic Video Background */}
      <video
        ref={videoRef}
        autoPlay
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        src="/I_need_looping_202602072235_b73bi.mp4"
      ></video>

      {/* Overlays */}
      <div className="cyber-overlay"></div>



      {/* Background: Character Stage (Full Height) */}
      <div className="absolute inset-0 z-[5]">
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-[50vw] h-full cursor-grab active:cursor-grabbing">
            <Canvas camera={{ fov: 40, position: [0, 0, 5] }} shadows gl={{ antialias: true }}>
              <ambientLight intensity={0.8} />
              <spotLight position={[5, 10, 5]} angle={0.2} penumbra={1} intensity={3} castShadow />
              <Suspense fallback={null}>
                <CharacterSoldier
                  animation="Idle"
                  weapon="AK"
                  position={[-0.1, -1, 0]}
                  scale={0.85}
                />
                <OrbitControls
                  enableZoom={false}
                  enablePan={false}
                  minPolarAngle={Math.PI / 2.2}
                  maxPolarAngle={Math.PI / 2.2}
                  makeDefault
                />
              </Suspense>
            </Canvas>
          </div>
        </div>
      </div>

      {/* UI Overlay Layer */}
      <div className="absolute inset-0 z-10 flex flex-col pointer-events-none overflow-hidden">
        {/* Header: Identity & Economy */}
        <div className="flex justify-between items-start w-full px-12 py-8">
          <div className="homeprofilebg flex items-center p-1 pr-8 space-x-6 pointer-events-auto">
            <div className="relative group">
              <img
                src="https://raw.githubusercontent.com/Prashant-v-s/StarkShootRoR/main/public/soldier_head.png"
                className="h-20 w-20 profile-avatar object-cover group-hover:scale-110 transition-all duration-500 rounded-none border border-lime/20"
                alt="Avatar"
                onError={(e) => {
                  e.target.src = "https://blogger.googleusercontent.com/img/a/AVvXsEilxD0f-Y5qYnr3AA8xT_tvMlR7ru7Yl1zxozlEzg-C5oJqOStwAR8OxsgItoWC112TQTgCt4_xylJDmr4v_Z_A3MDUy22L6CAI_Cvw_FnicYCcoXScnCt41T-xiWNZ8JQJyfbXNdygsgY9TxXvH-Yqdg0vqpeMrakh78RxXj5BAT4XwW1a3KsQVhexzog";
                }}
              />
              <div className="absolute -bottom-2 -right-4 rank-badge">LV 01</div>
            </div>

            <div className="flex flex-col">
              <h1 className="text-2xl font-black text-white tracking-widest uppercase">
                {playerData?.name || "PRASHANTEXE"}
              </h1>
              <div className="flex items-center space-x-4 mt-2">
                <div className="w-40 h-1 bg-white/10 relative">
                  <div className="absolute inset-0 bg-lime shadow-[0_0_10px_#A3FF12] w-2/5"></div>
                </div>
                <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">XP 1240/5000</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-6 pointer-events-auto">
            <div className="currency-display flex items-center space-x-4">
              <div className="text-[10px] font-black text-white/20 uppercase tracking-tighter">Gold Stock</div>
              <p className="font-black text-[#FFD27F] text-xl tabular-nums">1,240</p>
            </div>
            <div className="currency-display flex items-center space-x-4 border-r-lime">
              <div className="text-[10px] font-black text-white/20 uppercase tracking-tighter">Stellar Credits</div>
              <p className="font-black text-cyan text-xl tabular-nums">250</p>
            </div>
          </div>
        </div>

        <div className="flex-grow flex justify-between items-center px-12 pb-12">
          {/* Left Panel: Tactical Suite */}
          <div className="homebox flex flex-col space-y-6 w-80 relative pointer-events-auto">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-8">
                <div className="h-4 w-1 bg-lime shadow-[0_0_10px_#A3FF12]"></div>
                <div className="text-[10px] text-white/50 font-black tracking-[0.5em] uppercase">Tactical Suite</div>
              </div>

              {[
                { name: "BATTLE PASS", id: "01", sub: "ELITE PROGRESSION" },
                { name: "QUARTERMASTER", id: "02", sub: "EQUIPMENT LOGISTICS" },
                { name: "NEON ROYALE", id: "03", sub: "EVENT REWARDS" },
                { name: "ARMORY", id: "04", sub: "WEAPON SYSTEMS" }
              ].map((item, i) => (
                <Link
                  key={item.name}
                  to={item.name === "ARMORY" ? "/Guns" : "/optstore"}
                  className="menu-tab block group relative"
                >
                  <div className="flex items-center justify-between pointer-events-none">
                    <div className="flex flex-col">
                      <div className="text-[10px] text-lime/40 font-black tracking-[0.3em] mb-1 group-hover:text-lime transition-colors">
                        PROTOCOL {item.id}
                      </div>
                      <div className="text-white font-black text-2xl tracking-[0.15em] transition-all duration-300 group-hover:translate-x-2">
                        {item.name}
                      </div>
                      <div className="text-[9px] text-white/20 font-bold tracking-widest mt-1 group-hover:text-white/40 transition-colors">
                        {item.sub}
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-8 h-8 rounded-full border border-lime/30 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-lime rounded-full animate-ping"></div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="pt-8 border-t border-white/5 space-y-2">
              <div className="text-[9px] text-white/20 font-mono flex items-center space-x-2">
                <span className="inline-block w-1 h-1 bg-lime animate-pulse"></span>
                <span>SIGNAL: STABLE - 24MS</span>
              </div>
              <div className="text-[9px] text-white/20 font-mono">CONNECTION: ENCRYPTED // REGION: STARK-01</div>
            </div>
          </div>



          {/* Right: Combat Control Panel */}
          <div className="flex flex-col space-y-4 w-96 pointer-events-auto">
            {/* Data Suite: Quick Access */}
            <div className="mapbox p-4 grid grid-cols-2 gap-3">
              {[
                { name: "STORE", icon: "🛒", path: "/optstore", sub: "MARKET" },
                { name: "CHAT AI", icon: "🤖", path: "/chat", sub: "COMMAND" },
                { name: "LEADERBOARD", icon: "🏆", path: "/leaderboard", sub: "RANKING" },
                { name: "EVENT", icon: "🔥", path: "/optstore", sub: "LIVE" }
              ].map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="relative group overflow-hidden bg-white/5 border border-white/5 p-3 hover:bg-lime/10 transition-all duration-300"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 90% 100%, 0 100%)' }}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-0.5">
                      <div className="text-[7px] text-lime font-black tracking-widest opacity-50 group-hover:opacity-100">DATA_HUB</div>
                      <div className="text-xs font-black text-white group-hover:text-lime">{item.name}</div>
                      <div className="text-[6px] text-white/20 font-bold uppercase">{item.sub}</div>
                    </div>
                    <span className="text-xs opacity-30 group-hover:opacity-100 group-hover:scale-110 transition-all">{item.icon}</span>
                  </div>
                  <div className="absolute bottom-0 right-0 w-8 h-0.5 bg-lime/0 group-hover:bg-lime transition-all"></div>
                </Link>
              ))}
            </div>

            <div className="mapbox p-5 space-y-4">
              {/* Map Reveal */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-white/30 font-black tracking-widest">MAP SELECTION</span>
                  <span className="text-[10px] text-cyan font-bold tabular-nums">0{mapIndex + 1} / 0{mapNames.length}</span>
                </div>
                <div className="map-preview group relative h-36 overflow-hidden">
                  <img
                    src={mapPaths[mapIndex]}
                    className="h-full w-full object-cover transition-all duration-[2s] group-hover:scale-125"
                    alt="Map"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <div className="absolute bottom-3 left-6">
                    <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">{mapNames[mapIndex]}</h2>
                    <span className="text-[9px] text-lime font-bold tracking-widest">READY FOR DEPLOYMENT</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={leftClick} className="nav-chevron py-3 uppercase text-[10px] font-black tracking-widest">PREVIOUS AREA</button>
                  <button onClick={rightClick} className="nav-chevron py-3 uppercase text-[10px] font-black tracking-widest">NEXT AREA</button>
                </div>
              </div>

              {/* Mode Logic */}
              <div className="space-y-3">
                <span className="text-[10px] text-white/30 font-black tracking-widest uppercase">Combat Protocol</span>
                <div className="flex flex-wrap gap-2">
                  {modes.map(mode => (
                    <button
                      key={mode}
                      onClick={() => handleModeChange(mode)}
                      className={`mode-card px-3 py-2 flex-grow text-center ${gameMode === mode ? 'mode-active' : ''}`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Logic */}
              <div className="space-y-3">
                <span className="text-[10px] text-white/30 font-black tracking-widest uppercase">Deployment window</span>
                <div className="flex justify-between items-center px-1">
                  {[60, 300, 600].map((time, i) => (
                    <button
                      key={time}
                      onClick={() => setGameTime(time, i + 1)}
                      className={`time-btn px-4 py-2 text-xs ${activeButton === i + 1 ? "time-btn-active" : ""}`}
                    >
                      {time / 60} MIN
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Link
              className="playbtm group relative flex flex-col items-center justify-center p-6"
              to="/game"
            >
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-black italic tracking-tighter">START MISSION</span>
                <svg className="w-8 h-8 transform group-hover:translate-x-3 transition-all duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </div>
              <div className="absolute top-2 left-6 flex items-center space-x-1 uppercase text-[8px] font-bold opacity-40 group-hover:opacity-100 transition-opacity">
                <span className="w-1.5 h-1.5 bg-black rounded-full animate-pulse"></span>
                <span>System: Stable</span>
                <span className="mx-2">|</span>
                <span>Auth: Verified</span>
              </div>
              <div className="absolute bottom-1 right-8 text-[7px] font-black opacity-30 group-hover:opacity-60">
                STARK-OS // V2.0.4
              </div>
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Lobby;
