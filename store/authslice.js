import { createSlice } from "@reduxjs/toolkit";

const authslice = createSlice({
  name: "authslice",
  initialState: {
    playerdata: null,
    players: [],
    selectedTime: 60,
    playername: null,
    id: null,
    vediostate: false,
    address:""
  },
  reducers: {
    setPlayerData: (state, action) => {
      console.log("action", action);
      state.playerdata = action.payload;
      console.log("dispatched", state.playerdata);
    },
    setgameid: (state, action) => {
      state.id = action.payload;
    },
    setTimer: (state, action) => {
      console.log("action", action);
      state.selectedTime = action.payload;
    },
    setPlayers: (state, action) => {
      console.log("action", action);

      state.players = action.payload;
    },
    setPlayername: (state, action) => {
      state.playername = action.payload;
    },
    setVediostate: (state, action) => {
      state.vediostate = action.payload;
    },
    setAddress: (state, action) => {
      state.address = action.payload;
    },
  },
});

export const {
  setTimer,
  setgameid,
  setPlayername,
  setPlayers,
  setPlayerData,
  setVediostate,
  setAddress
} = authslice.actions;
export default authslice.reducer;
