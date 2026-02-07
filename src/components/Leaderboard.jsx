import React, { useState, useEffect } from "react";
import { usePlayersList, useMultiplayerState, isHost } from "playroomkit";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setPlayerData } from "../../store/authslice";
import { setgameid } from "../../store/authslice";

import axios from "axios";

import { useRoom } from "@huddle01/react/hooks";
import { AccessToken, Role } from "@huddle01/server-sdk/auth";

import { useLocalAudio, usePeerIds } from "@huddle01/react/hooks";

import RemotePeer from "./RemotePeer";

const getRoomIdFromURL = () => {
  const hash = window.location.hash;
  const roomId = hash.split("=")[1];
  return roomId;
};

export const Leaderboard = () => {
  const players = usePlayersList(true);
  const time = useSelector((state) => state.authslice.selectedTime);
  const [timer, setTimer] = useMultiplayerState("timer");
  const [gameStarted, setGameStarted] = useMultiplayerState("gameStarted", false);
  console.log("Leaderboard Sycned Timer:", timer);
  const dispatch = useDispatch();
  useEffect(() => {
    setRoomId(getRoomIdFromURL());
  }, [window.location.hash]);
  const [roomId, setRoomId] = useState("");
  const playerinfo = useSelector((state) => state.authslice.playerdata);
  const playername = playerinfo?.username;
  const handleButtonClick = () => {
    dispatch(setPlayerData(players));
    dispatch(setgameid(roomId));
  };
  const [muted, setMuted] = useState(false);
  const { peerIds } = usePeerIds();
  const { enableAudio, disableAudio } = useLocalAudio();

  const createRoomId = async () => {
    const response = await axios.post(
      "https://api.huddle01.com/api/v1/create-room",
      {
        title: "Huddle01-Test",
        hostWallets: ["0x324298486F9b811eD5e062275a58363d1B2E93eB"],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "ak_oxmRVWyaH6FDZoPS",
        },
      }
    );
    return response.data.data.roomId;
  };
  const handleJoinRoom = async () => {
    const roomid = await createRoomId();
    const accessToken = new AccessToken({
      apiKey: "ak_oxmRVWyaH6FDZoPS",
      roomId: "xpq-dfgv-cpp",
      role: Role.HOST,
      permissions: {
        admin: true,
        canConsume: true,
        canProduce: true,
        canProduceSources: {
          cam: true,
          mic: true,
          screen: true,
        },
        canRecvData: true,
        canSendData: true,
        canUpdateMetadata: true,
      },
    });

    const tempToken = await accessToken.toJwt();

    const res = await joinRoom({
      roomId: roomid,
      token: tempToken,
    });
    await enableAudio();
    setMuted(true);
  };

  const { joinRoom } = useRoom({
    onJoin: () => {
      console.info("Joined the room");
    },
  });

  const handleExitRoom = async () => {
    await disableAudio();

    setMuted(false);
  };

  const navigate = useNavigate();

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      const message =
        "Are you sure you want to leave? If you leave the game the bedding amount did't fund.";
      event.returnValue = message;
      return message;
    };
    const handleUnload = () => {
      history.push("/another-page");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);



  useEffect(() => {
    const minutes = Math.floor(timer / 60);
    const remainingSeconds = timer % 60;

    if (minutes < 1) {
      var obj = document.getElementById("timer_con");
      if (obj) {
        obj.style.backgroundColor = "rgba(182, 47, 47, 0.99)";
        obj.style.padding = "4px 11px";
        obj.style.borderRadius = "9px";
        obj.style.fontFamily = "cursive";
        obj.style.fontWeight = "bold";
        obj.style.boxShadow = "0px 0px 20px 20px #ff000059";
        obj.style.border = "2px solid rgb(252, 38, 68)";
        obj.style.transition = "background-color 0.5s ease-in-out";
      }
      if (minutes === 0 && remainingSeconds < 1 && gameStarted) {
        localStorage.setItem("myData", "false");
        handleButtonClick();
        navigate("/result");
      }
    }
  }, [timer, gameStarted]);

  const formatTime = (seconds) => {
    if (typeof seconds !== "number" || isNaN(seconds)) {
      return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  useEffect(() => {
    const matchingPlayer = players.find(
      (player) => player.state.profile?.name === playername
    );
    if (matchingPlayer) {
      console.log("Matching player state:", matchingPlayer.state);
    } else {
      console.log("No matching player found.");
    }
  }, [players, playername]);

  return (
    <>
      <div className="fixed w-full top-0 left-0 right-0 p-6 flex justify-between items-start z-10 pointer-events-none">
        {/* Left Side: Player Roster */}
        <div className="flex flex-col space-y-2 pointer-events-auto">
          <div className="text-[10px] text-lime font-bold tracking-[0.3em] mb-2 opacity-60">SQUAD STATUS</div>
          {players.map((player) => (
            <div
              key={player.id}
              className="hud-card flex items-center p-2 pr-6 space-x-4 min-w-[200px]"
            >
              <div className="relative">
                <img
                  src={player.state.profile?.photo || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"}
                  className="w-10 h-10 border-2 rounded-sm transform rotate-45"
                  style={{
                    borderColor: player.state.profile?.color,
                    padding: '2px'
                  }}
                  alt={player.state.profile.name}
                />
              </div>

              <div className="flex flex-col">
                <h2 className="font-bold text-xs tracking-wider uppercase text-white/90">
                  {player.state.profile.name}
                </h2>
                <div className="flex items-center space-x-3 mt-1">
                  <div className="flex items-center space-x-1">
                    <span className="text-[10px] text-lime font-bold">K</span>
                    <span className="text-sm font-black text-white">{player.state.kills}</span>
                  </div>
                  <div className="h-2 w-[1px] bg-white/10"></div>
                  <div className="flex items-center space-x-1">
                    <span className="text-[10px] text-red-500 font-bold">D</span>
                    <span className="text-sm font-black text-white">{player.state.deaths}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Center: Mission Clock */}
        <div className="flex flex-col items-center pointer-events-auto">
          <div className={`mission-clock ${timer < 60 ? 'critical' : ''}`}>
            <span className="text-[10px] absolute -top-5 left-1/2 -translate-x-1/2 tracking-[0.4em] text-white/40 whitespace-nowrap">MISSION TIME</span>
            {formatTime(timer ?? time ?? 60)}
          </div>
        </div>

        {/* Right Side: Comms & Controls */}
        <div className="flex flex-col items-end space-y-4 pointer-events-auto">
          <div className="flex space-x-2">
            {!muted ? (
              <button
                type="button"
                className="bg-blue-600/80 hover:bg-blue-500 border border-blue-400/50 text-[10px] font-bold tracking-widest uppercase px-6 py-2 rounded-sm transition-all"
                onClick={handleJoinRoom}
              >
                ENABLE COMMS
              </button>
            ) : (
              <button
                type="button"
                className="bg-red-600/80 hover:bg-red-500 border border-red-400/50 text-[10px] font-bold tracking-widest uppercase px-6 py-2 rounded-sm transition-all"
                onClick={handleExitRoom}
              >
                DISABLE COMMS
              </button>
            )}

            <button
              className="bg-white/5 hover:bg-white/20 border border-white/10 p-2 rounded-sm transition-all"
              onClick={() => {
                if (document.fullscreenElement) {
                  document.exitFullscreen();
                } else {
                  document.documentElement.requestFullscreen();
                }
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                />
              </svg>
            </button>
          </div>

          {/* Peer List View */}
          <div className="grid gap-2 text-right">
            {peerIds.map((peerId) =>
              peerId ? <RemotePeer key={peerId} peerId={peerId} /> : null
            )}
          </div>
        </div>
      </div>
    </>
  );
};
