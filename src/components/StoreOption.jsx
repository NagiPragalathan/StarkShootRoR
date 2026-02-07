import React, { useState, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Canvas, useGraph } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, PresentationControls, Stage, useGLTF } from "@react-three/drei";
import { CharacterSoldier } from "./CharacterSoldier";

const itemsData = {
  CHARACTERS: [
    { name: "RECON ELITE", price: "FREE", color: "#4ade80", power: "SPEED + 5%", desc: "Highly agile scout specialized in rapid deployment." },
    { name: "SHADOW OPS", price: "500 STK", color: "#111827", power: "STEALTH + 10%", desc: "Black-ops specialist with advanced camouflage tech." },
    { name: "DESERT FOX", price: "750 STK", color: "#f59e0b", power: "DURABILITY + 8%", desc: "Tough mercenary built to survive harsh environments." },
    { name: "NEON REAPER", price: "1200 STK", color: "#a3ff12", power: "DAMAGE + 12%", desc: "Experimental cyber-soldier with lethal efficiency." },
  ],
  WEAPONS: [
    { name: "AK", price: "FREE", stats: { dmg: 40, rate: 80, range: 60 }, desc: "Reliable Soviet-bloc assault rifle. Balanced for all engagements." },
    { name: "Sniper", price: "900 STK", stats: { dmg: 95, rate: 10, range: 95 }, desc: "High-precision bolt-action rifle for long-range elimination." },
    { name: "RocketLauncher", price: "1500 STK", stats: { dmg: 100, rate: 5, range: 50 }, desc: "Heavy ordinance launcher for maximum area damage." },
    { name: "SMG", price: "600 STK", stats: { dmg: 30, rate: 95, range: 40 }, desc: "Submachine gun with extreme fire rate for close encounters." },
    { name: "Shotgun", price: "800 STK", stats: { dmg: 85, rate: 20, range: 20 }, desc: "Devastating close-quarters power with wide pellet spread." },
    { name: "Pistol", price: "200 STK", stats: { dmg: 25, rate: 60, range: 30 }, desc: "Standard sidearm. Light, reliable, and fast to equip." },
  ],
  MAPS: [
    { name: "bermuda", price: "FREE", model: "/models/map.glb", desc: "Classic combat zone with open terrain and strategic cover." },
    { name: "pochinki", price: "FREE", model: "/models/city_side_map.glb", desc: "Dense urban environment optimized for high-risk city combat." },
    { name: "knife fight", price: "400 STK", model: "/models/knife_fight_map.glb", desc: "Close-quarters arena designed for pure melee mastery." },
    { name: "free arena", price: "400 STK", model: "/models/map.glb", desc: "Symmetrical training ground with varied elevations." },
    { name: "city side", price: "400 STK", model: "/models/city_side_map.glb", desc: "Metropolitan zone featuring vertical gameplay opportunities." },
    { name: "living room", price: "400 STK", model: "/models/living_room.glb", desc: "Intricate indoor environment for tactical CQB." },
    { name: "grave house", price: "400 STK", model: "/models/grave_house_map.glb", desc: "Atmospheric, low-visibility stealth combat theater." },
    { name: "broken house", price: "400 STK", model: "/models/broken_house_map.glb", desc: "Ruined sector with complex line-of-sight challenges." },
  ]
};

const MapPreview = ({ modelPath }) => {
  if (!modelPath) return (
    <group rotation-y={Math.PI / 4} position={[-0.5, 0.5, 0]}>
      <mesh receiveShadow>
        <boxGeometry args={[3, 0.1, 3]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <gridHelper args={[3, 10, '#a3ff12', '#333']} />
    </group>
  );

  const { scene } = useGLTF(modelPath);
  return <primitive object={scene} scale={0.01} position={[-0.5, 0.5, 0]} />;
};

const WeaponPreview = ({ weaponName }) => {
  const { scene } = useGLTF("/models/Character_Soldier.gltf");
  const { nodes } = useGraph(scene);
  const weaponNode = nodes[weaponName];

  if (!weaponNode) return null;

  return (
    <primitive
      object={weaponNode.clone()}
      scale={0.4}
      rotation={[0, Math.PI / 1.5, 0]}
      position={[-0.5, 0.5, 0]}
    />
  );
};

const StoreOptions = () => {
  const [activeTab, setActiveTab] = useState('CHARACTERS');
  const [selectedItem, setSelectedItem] = useState(itemsData['CHARACTERS'][0]);

  return (
    <div className="h-screen w-screen bg-[#05070a] overflow-hidden flex flex-col relative font-['Rajdhani']">
      {/* ... (Previous Header/Layout remains same) ... */}
      <div className="absolute inset-0 opacity-20 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(163,255,18,0.1)_0%,transparent_70%)] animate-pulse"></div>
      </div>

      {/* Header HUD (Lines 60-83 exactly) */}
      <header className="px-12 py-8 flex justify-between items-center z-20 border-b border-white/5 bg-black/40 backdrop-blur-md">
        <div className="flex items-center space-x-8">
          <Link to="/" className="group flex items-center space-x-3 text-white/40 hover:text-lime transition-all">
            <svg className="w-5 h-5 transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-xs font-black tracking-[0.3em] uppercase">Return to Base</span>
          </Link>
          <div className="h-8 w-px bg-white/10"></div>
          <h1 className="text-4xl font-black text-white italic tracking-tighter">QUARTERMASTER <span className="text-lime">STORE</span></h1>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Available Credits</span>
            <div className="text-2xl font-black text-lime tracking-tighter tabular-nums flex items-center">
              <span className="text-xs mr-2">STK</span> 14,250
            </div>
          </div>
          <div className="w-12 h-12 bg-lime/10 border border-lime/20 flex items-center justify-center">
            <span className="text-lime">⚡</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-grow flex p-8 gap-8 overflow-hidden z-10">

        {/* Sidebar Tabs */}
        <aside className="w-24 flex flex-col space-y-4">
          {Object.keys(itemsData).map(tab => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSelectedItem(itemsData[tab][0]);
              }}
              className={`h-24 w-full flex flex-col items-center justify-center space-y-2 transition-all duration-500 border-l-4 ${activeTab === tab
                ? 'bg-lime/10 border-lime text-lime'
                : 'bg-white/5 border-transparent text-white/30 hover:bg-white/10'
                }`}
            >
              <span className="text-[10px] font-black tracking-[0.2em] -rotate-90 origin-center whitespace-nowrap">{tab}</span>
            </button>
          ))}
        </aside>

        {/* Item List */}
        <div className="w-96 flex flex-col space-y-3 overflow-y-auto pr-4 custom-scrollbar">
          <div className="text-[10px] text-white/30 font-black tracking-widest uppercase mb-2">Available Equipment</div>
          {itemsData[activeTab].map((item, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedItem(item)}
              className={`group p-5 flex items-center justify-between border transition-all duration-300 ${selectedItem?.name === item.name
                ? 'bg-lime/20 border-lime/50 translate-x-3'
                : 'bg-white/5 border-white/5 hover:bg-white/10'
                }`}
              style={{ clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0 100%)' }}
            >
              <div className="flex flex-col items-start">
                <span className={`text-[8px] font-bold tracking-[0.2em] ${selectedItem?.name === item.name ? 'text-lime' : 'text-white/30'}`}>
                  0{idx + 1} // MODEL
                </span>
                <span className="text-xl font-black text-white italic tracking-tighter uppercase">{item.name}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-bold text-white/40 uppercase mb-1">{item.price === 'FREE' ? 'UNLOCKED' : 'PREMIUM'}</span>
                <span className={`text-sm font-black ${item.price === 'FREE' ? 'text-cyan' : 'text-lime'}`}>{item.price}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Main Display View */}
        <div className="flex-grow relative flex flex-col space-y-8">
          <div className="flex-grow bg-white/5 border border-white/5 relative overflow-hidden group">
            <div className="absolute inset-0 z-0">
              <Canvas shadows camera={{ position: [0, 1, 5], fov: 40 }}>
                <ambientLight intensity={0.4} /> {/* Reduced from 0.5 to match lobby */}
                <pointLight position={[5, 5, 5]} intensity={0.8} /> {/* Reduced intensity and distance */}
                <spotLight position={[-5, 5, 5]} angle={0.15} penumbra={1} intensity={0.5} />
                <PresentationControls speed={1.5} global zoom={0.5} polar={[-0.1, Math.PI / 4]}>
                  <Stage environment="city" intensity={0.5} castShadow={false}>
                    <Suspense fallback={null}>
                      {activeTab === 'CHARACTERS' && <CharacterSoldier color={selectedItem.color} />}
                      {activeTab === 'WEAPONS' && (
                        <WeaponPreview weaponName={selectedItem.name} />
                      )}
                      {activeTab === 'MAPS' && (
                        <MapPreview modelPath={selectedItem?.model} />
                      )}
                    </Suspense>
                  </Stage>
                </PresentationControls>
                <Environment preset="night" />
              </Canvas>
            </div>

            {/* Item Details Overlay */}
            <div className="absolute top-8 left-8 p-8 border border-white/10 bg-black/60 backdrop-blur-xl w-80 pointer-events-none" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 90%, 10% 100%, 0 100%)' }}>
              <div className="space-y-6">
                <div>
                  <div className="text-[10px] text-lime font-black tracking-[0.4em] uppercase mb-2">Item Specifications</div>
                  <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">{selectedItem?.name || "Initializing..."}</h2>
                </div>

                <div className="h-px bg-white/10"></div>

                <p className="text-sm text-white/50 leading-relaxed font-bold tracking-tight">
                  {selectedItem?.desc || "Strategic deployment asset verified for high-risk operations within the Stark ecosystem."}
                </p>

                {activeTab === 'CHARACTERS' && (
                  <div className="bg-lime/10 p-4 border-l-2 border-lime">
                    <div className="text-[8px] text-lime font-black uppercase tracking-widest mb-1">Unique Ability</div>
                    <div className="text-white font-black text-sm">{selectedItem.power}</div>
                  </div>
                )}

                {activeTab === 'WEAPONS' && selectedItem.stats && (
                  <div className="space-y-3">
                    {Object.entries(selectedItem.stats).map(([key, val]) => (
                      <div key={key} className="space-y-1">
                        <div className="flex justify-between text-[8px] font-black uppercase tracking-[0.2em] text-white/40">
                          <span>{key}</span>
                          <span>{val}%</span>
                        </div>
                        <div className="h-1 bg-white/5 w-full">
                          <div className="h-full bg-lime shadow-[0_0_5px_#A3FF12]" style={{ width: `${val}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <button className="playbtm w-full p-4 pointer-events-auto" onClick={() => toast.success(`${selectedItem.name} PURCHASED!`)}>
                  <span className="text-lg">{selectedItem.price === 'FREE' ? 'EQUIP ASSET' : 'PURCHASE ASSET'}</span>
                </button>
              </div>
            </div>

            {/* Nav Indicators */}
            <div className="absolute bottom-8 right-8 flex space-x-4">
              <div className="flex flex-col items-end opacity-40">
                <div className="text-[8px] font-black text-white tracking-[0.5em] mb-1">DATA FLOW</div>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="w-1 h-3 bg-lime animate-pulse" style={{ animationDelay: `${i * 100}ms` }}></div>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreOptions;
