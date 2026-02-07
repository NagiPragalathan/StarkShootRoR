import React, { useState, useEffect, startTransition, Suspense } from "react";
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
  "https://blogger.googleusercontent.com/img/a/AVvXsEgHxU-HB-lQ9ifrEy-ymcHR6aeTkwzBaOsIQ6SXinjXyVVmqCbtY44ZraIGYM86B6DT7vk3jDrQSbdJn61D6jZB3HX3aRSc7EIYnSStvJmZefxCOpcKRZVFqha7jg0dd4i-0qZN-87FqviZbUY3oODu3bvJZK9ytVKnLRYcgFpo9hz4JzK25BmQS5c9TMI",
];

const mapNames = ["Bermuda", "Pochinki", "Upcoming..."];

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
    <div className="min-h-screen relative overflow-hidden font-sans">
      {/* Dynamic Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        src="/I_need_looping_202602072235_b73bi.mp4"
      ></video>



      {/* Header: Identity & Economy */}
      <div className="relative z-20 flex justify-between items-start w-full px-12 py-8 pointer-events-none">
        <div className="homeprofilebg flex items-center p-1 pr-8 space-x-6 pointer-events-auto">
          <div className="relative group">
            <img
              src="https://blogger.googleusercontent.com/img/a/AVvXsEilxD0f-Y5qYnr3AA8xT_tvMlR7ru7Yl1zxozlEzg-C5oJqOStwAR8OxsgItoWC112TQTgCt4_xylJDmr4v_Z_A3MDUy22L6CAI_Cvw_FnicYCcoXScnCt41T-xiWNZ8JQJyfbXNdygsgY9TxXvH-Yqdg0vqpeMrakh78RxXj5BAT4XwW1a3KsQVhexzog"
              className="h-20 w-20 profile-avatar object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              alt="Avatar"
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
                  position={[-0.4, -1, 0]}
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

      <div className="relative z-10 flex justify-between items-end h-[calc(100vh-120px)] px-12 pb-12 pointer-events-none">
        <div className="homebox flex flex-col space-y-10 w-80 relative pointer-events-auto">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 mb-8">
              <div className="h-4 w-1 bg-lime shadow-[0_0_10px_#A3FF12]"></div>
              <div className="text-[10px] text-white/50 font-black tracking-[0.5em] uppercase">Tactical Suite</div>
            </div>

            {["BATTLE PASS", "QUARTERMASTER", "NEON ROYALE", "ARMORY"].map((item, i) => (
              <Link
                key={item}
                to={item === "ARMORY" ? "/Guns" : "/optstore"}
                className="menu-tab block group relative"
              >
                <div className="flex items-center justify-between">
                  <div className="text-white font-black text-2xl tracking-widest group-hover:text-lime transition-all duration-300">
                    {item}
                  </div>
                </div>
                <div className="h-[1px] w-0 group-hover:w-64 bg-gradient-to-r from-lime/50 to-transparent transition-all duration-500"></div>
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
        <div className="flex flex-col space-y-6 w-96 pointer-events-auto">
          <div className="mapbox p-8 space-y-8">
            {/* Map Reveal */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-white/30 font-black tracking-widest">MAP SELECTION</span>
                <span className="text-[10px] text-cyan font-bold tabular-nums">0{mapIndex + 1} / 03</span>
              </div>
              <div className="map-preview group relative h-44 overflow-hidden">
                <img
                  src={mapPaths[mapIndex]}
                  className={`h-full w-full object-cover transition-all duration-[2s] group-hover:scale-125 ${mapIndex !== 0 ? "grayscale brightness-50" : ""}`}
                  alt="Map"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-4 left-6">
                  <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">{mapNames[mapIndex]}</h2>
                  {mapIndex !== 0 && <span className="text-[9px] text-red-500 font-bold tracking-widest">DEPLOYMENT UNAVAILABLE</span>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={leftClick} className="nav-chevron py-3 uppercase text-[10px] font-black tracking-widest">PREVIOUS AREA</button>
                <button onClick={rightClick} className="nav-chevron py-3 uppercase text-[10px] font-black tracking-widest">NEXT AREA</button>
              </div>
            </div>

            {/* Mode Logic */}
            <div className="space-y-4">
              <span className="text-[10px] text-white/30 font-black tracking-widest uppercase">Combat Protocol</span>
              <div className="flex flex-wrap gap-2">
                {modes.map(mode => (
                  <button
                    key={mode}
                    onClick={() => handleModeChange(mode)}
                    className={`mode-card px-4 py-2 flex-grow text-center ${gameMode === mode ? 'mode-active' : ''}`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Logic */}
            <div className="space-y-4">
              <span className="text-[10px] text-white/30 font-black tracking-widest uppercase">Deployment window</span>
              <div className="flex justify-between items-center">
                {[60, 300, 600].map((time, i) => (
                  <button
                    key={time}
                    onClick={() => setGameTime(time, i + 1)}
                    className={`time-btn px-4 py-2 text-sm ${activeButton === i + 1 ? "time-btn-active" : ""}`}
                  >
                    {time / 60} MINUTES
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Link
            className="playbtm group relative flex items-center justify-center p-6 space-x-4"
            to="/game"
          >
            <span className="text-2xl font-black">START MISSION</span>
            <svg className="w-6 h-6 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Toast Notification Positioned Bottom-Left for Modern Games */}
      <ToastContainer position="bottom-left" theme="light" />
    </div>
  );
};

export default Lobby;
