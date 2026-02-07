import React, { useState, useEffect, startTransition, Suspense } from "react";
import { OrbitControls } from "@react-three/drei";
import { Canvas, useLoader } from "@react-three/fiber";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { setTimer } from "../../store/authslice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DotLoader } from "react-spinners";
import { GLTFLoader } from "three-stdlib";

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
  const gltf = useLoader(GLTFLoader, "./models/Character_Soldier.gltf");

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

  return (
    <div className="min-h-screen bg-no-repeat bg-center relative" style={{backgroundImage: "url('/homescreen_stellar_strike.png')", backgroundSize: "cover", backgroundPosition: "center center"}}>
      {/* Screen Vignette */}
      <div className="screen-vignette"></div>

      {/* Top Resource Bar */}
      <div className="resource-bar flex justify-between items-center w-full px-8 py-4 relative z-10">
        {/* Profile Tactical ID - Top Left */}
        <div className="flex homeprofilebg px-6 py-3 items-center space-x-4">
          <img
            src="https://blogger.googleusercontent.com/img/a/AVvXsEilxD0f-Y5qYnr3AA8xT_tvMlR7ru7Yl1zxozlEzg-C5oJqOStwAR8OxsgItoWC112TQTgCt4_xylJDmr4v_Z_A3MDUy22L6CAI_Cvw_FnicYCcoXScwCt41T-xiWNZ8JQJyfbXNdygsgY9TxXvH-Yqdg0vqpeMrakh78RxXj5BAT4XwW1a3KsQVhexzog"
            className="h-14 w-auto profile-avatar"
            alt=""
          />
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <p className="font-bold text-white text-lg tracking-wide">PRASHANTEXE</p>
              <div className="rank-badge">1</div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-1.5 w-24 bg-black/50 rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-gradient-to-r from-#A3FF12 to-#00E5FF"></div>
              </div>
              <p className="text-xs text-[#00E5FF] font-semibold">LVL 1</p>
            </div>
          </div>
        </div>

        {/* Currency Displays */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 currency-display">
            <img
              src="https://blogger.googleusercontent.com/img/a/AVvXsEispplhVXS52zWgstszpWTDQTrJ7FpVpnN4YjBilPRJ0hmtf0FGRI1-JoXko1x1mIG4Gi7ADUF3Yl9lu5JlsLRFnGUcPJnJzStlHom3K63Wu2QcL-nsJoMq2V66FcenoK7MbQVn_9vg1_8E1Q25wDoQJb2AGKiq4JGDYyknSKoXzYQFFR8LEhpX-R13ad4"
              alt=""
              className="h-6 w-auto"
            />
            <p className="font-bold text-[#FFD27F] text-lg">100</p>
          </div>
          <div className="flex items-center space-x-2 currency-display">
            <img
              src="https://blogger.googleusercontent.com/img/a/AVvXsEie2DZwyszxtLdkqYknRhqV0hDa85fb4knhn16GCCa3HO6AB_BHA19-BnWKl5qzuE8oOJ_WVifNg1FdY05UTucSiz36llzpSqUBjYbOriIDtaQV9iLJe0eMs455RVi3wkImTId7l0BqdOamXFulz7jivdeEiXqlhfItGYU-7iDuUgSBWA1PweMDY341yFM"
              alt=""
              className="h-6 w-auto"
            />
            <p className="font-bold text-[#00E5FF] text-lg">20</p>
          </div>
        </div>
      </div>

      <div className="flex text-white text-xl font-semibold justify-between mx-8 relative z-10">
        {/* Left Wing Navigation Stack */}
        <div className="mt-12">
          <div className="homebox px-12 py-8">
            <div className="flex items-center space-x-4 menu-tab group cursor-pointer mb-8">
              <img
                src="https://blogger.googleusercontent.com/img/a/AVvXsEhwze50sr7c42qWHWl1ZtWP-h91tRw96mnDxbST2rhMGENwxAH4LRxTWod417CEaB4xQfPVZ-0-kB1XCD2BDn1hwqxTPxNK6Z_Dz8F7Fo8hDjazJX_zXr458VZUPjdzdih1xheqz4yJg7oXTEQizG8q-8vC2B69RhKN4WOO6XS0AvvMhgGSGkq64aSJ3dQ"
                alt=""
                className="h-7 w-auto menu-icon"
              />
              <Link className="text-white hover:text-[#A3FF12] transition-all font-semibold tracking-wider" href="/optstore">
                STORE
              </Link>
            </div>
            <div className="flex items-center space-x-4 menu-tab group cursor-pointer mb-8">
              <img
                src="https://blogger.googleusercontent.com/img/a/AVvXsEgn6Znvl2a2HObGhEoqPyeJymSTwEqIxV8f7IIQK3sCnu7oyYtZCkSg4XB-SRkV7NaxN7OVjliWj7gsOcc9VFmULUPaex4K3A1oEWf6wNsLfa8y9CcwLEdA52Dh-Hl2OnevhWJVJlI7CAMUpnWT97KEO42TfPhAxgHi7umyV4vGcVoO_XTnyxpNyJasnPg"
                alt=""
                className="h-7 w-auto menu-icon"
              />
              <Link className="text-white hover:text-[#A3FF12] transition-all font-semibold tracking-wider" href="/optstore">
                LUCKROYALE
              </Link>
            </div>
            <div className="flex items-center space-x-4 menu-tab group cursor-pointer">
              <img
                src="https://blogger.googleusercontent.com/img/a/AVvXsEj9mP_S5zrE05iA7nZDHHKPCR4xSdtSRPtzr9tu1TMRYbTkG9wNiCq_Ri20Nna07x-B775iuyjcJBplvhELJglNv426Q-hq-SVkXOhxSDrBLoROEbIAxMzxcUSWOaNF5lpgFBf35PUWkcEoyFN-rhZnwh9o4Q8ply2YLZrxTbmzr_zobAF7jEPIIunNH9s"
                alt=""
                className="h-7 w-auto menu-icon"
              />
              <Link className="text-white hover:text-[#A3FF12] transition-all font-semibold tracking-wider" href="/Guns">
                VAULT
              </Link>
            </div>
          </div>
        </div>

        {/* Center Character Display */}
        <div className="root2">
          <Canvas camera={{ fov: 75, position: [0, 0, 4] }} shadows>
            <Suspense fallback={null}>
              <directionalLight position={[3.3, 1.0, 4.4]} castShadow />
              <primitive object={gltf.scene} position={[0, -3.0, 0]} scale={1.0} castShadow />
              <OrbitControls target={[0, -1.2, 0]} enableZoom={false} />
            </Suspense>
          </Canvas>
        </div>

        {/* Right Side - Map Selector & Action Corner */}
        <div className="mt-12">
          <div className="flex flex-col items-center space-y-6">
            {/* Holographic Map Selector */}
            <div className="mapbox px-8 py-4 w-96">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <img
                  src="https://blogger.googleusercontent.com/img/a/AVvXsEhJ85zCrUSpRV7cSOt5Y1VeibTq8106ipzp_Ow_LZxxFvl2BDdUTpR0N5LVWnfhcA8DjymoCzOOgAl_3P4kpI9QXB2MJBEm6DP1n6kbleCpf_8IY_uaucIZpKyAwZjNJd9XzG2GRbyyqMhX5FKrNeKg1UAj0WLoxEA8b9hKg-eXqJi7IralLJYl8fnj2Uk"
                  alt=""
                  className="h-6 w-auto"
                  style={{filter: 'drop-shadow(0 0 10px rgba(0, 229, 255, 0.8))'}}
                />
                <p className="text-base">SELECT MAP</p>
              </div>

              {/* Map Preview with Scanlines */}
              <div className="map-preview mb-4">
                <img
                  src={mapPaths[mapIndex]}
                  className={`h-44 w-auto ${mapIndex !== 0 ? "blur-sm" : ""}`}
                  alt=""
                />
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <button className="nav-chevron px-6 py-2" onClick={leftClick}>
                  &lt;
                </button>
                <div className="map-name flex-1 text-center px-4 py-2 text-base">
                  {mapNames[mapIndex]}
                </div>
                <button className="nav-chevron px-6 py-2" onClick={rightClick}>
                  &gt;
                </button>
              </div>

              {/* Time Selection Pills */}
              <div className="flex justify-between gap-2">
                <button
                  onClick={() => setGameTime(60, 1)}
                  className={`time-btn px-5 py-2.5 text-sm flex-1 ${
                    activeButton === 1 ? "time-btn-active" : ""
                  }`}
                >
                  1 MIN
                </button>
                <button
                  onClick={() => setGameTime(300, 2)}
                  className={`time-btn px-5 py-2.5 text-sm flex-1 ${
                    activeButton === 2 ? "time-btn-active" : ""
                  }`}
                >
                  5 MIN
                </button>
                <button
                  onClick={() => setGameTime(600, 3)}
                  className={`time-btn px-5 py-2.5 text-sm flex-1 ${
                    activeButton === 3 ? "time-btn-active" : ""
                  }`}
                >
                  10 MIN
                </button>
              </div>
            </div>

            {/* Ultimate Play Button - Action Corner */}
            <Link
              className="playbtm px-16 py-4 text-center block w-full"
              href="/game"
            >
              START BATTLE
            </Link>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Lobby;
