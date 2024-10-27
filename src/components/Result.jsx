import React, { useEffect, useState } from "react";
import "../styles/result.css";
import { useSelector } from "react-redux";
import Link from "next/link";
import confetti from "canvas-confetti";

const Result = () => {
  const [team, setTeam] = useState([]);

  const playername = "macha";
  const playerValue = useSelector((state) => state.authslice.playerdata);
  const players = useSelector((state) => state.authslice.players);
  const gameid = useSelector((state) => state.authslice.id);

  const [claimable, setClaimable] = useState(false);
  const [tokensAwarded, setTokensAwarded] = useState(0);
  const [mvp, setMVP] = useState(null);

  useEffect(() => {
    const sortedTeam = playerValue
      .map((value, index) => ({
        rank: index + 1,
        name: value.state.profile.name,
        handle: value.state.profile.name,
        img: value.state.profile.photo,
        kudos: value.state.kills,
        deaths: value.state.deaths,
        wallet: value.state.profile.wallet,
      }))
      .sort((a, b) => b.kudos - a.kudos);

    setTeam(sortedTeam);

    if (sortedTeam.length > 0) {
      const topPlayer = sortedTeam[0];
      setMVP(topPlayer);
      setTokensAwarded(topPlayer.kudos * 5);
    }
  }, [playerValue]);

  const handleClaim = async () => {
    try {
      setClaimable(false);
      window.location.href = "/lobby";
    } catch (error) {
      console.error("Failed to claim tokens", error);
    }
  };

  useEffect(() => {
    const kills = playerValue.reduce(
      (total, player) => total + player.state.kills,
      0
    );
    if (kills > 0) {
      setTokensAwarded(kills * 5);
      setClaimable(true);
    }

    const randomEmoji = () => {
      const emojis = ["👏", "👍", "🙌", "🤩", "🔥", "⭐️", "🏆", "💯"];
      return emojis[Math.floor(Math.random() * emojis.length)];
    };

    const class_obj = document.getElementById("list");
    while (class_obj.firstChild) {
      class_obj.removeChild(class_obj.firstChild);
    }

    let newRow = document.createElement("li");
    newRow.classList = "c-list__item";
    newRow.innerHTML = `
      <div className="c-list__grid" style="display: contents;">
          <div className="u-text--left u-text--small u-text--medium">
          Rank
          </div>
          <div className="u-text--left u-text--small u-text--medium">
          Name
          </div>
          <div className="u-text--right u-text--small u-text--medium">
          # Kills/Deaths
          </div>
      </div>`;
    class_obj.appendChild(newRow);

    team.forEach((member) => {
      let newRow = document.createElement("li");
      newRow.classList = "c-list__item";
      newRow.innerHTML = `
        <div class="c-list__grid" style="display: contents;">
            <div class="c-flag c-place u-bg--transparent">${member.rank}</div>
            <div class="c-media">
                <img class="c-avatar c-media__img" src="${member.img}" />
                <div class="c-media__content">
                    <div class="c-media__title">${member.name}</div>
                </div>
            </div>
            <div class="u-text--right c-kudos">
                <div class="u-mt--8">
                    <strong>${member.kudos}</strong>/<strong>${
        member.deaths
      }</strong> ${randomEmoji()}
                </div>
            </div>
        </div>
      `;
      if (member.rank === 1) {
        newRow.querySelector(".c-place").classList.add("u-text--dark");
        newRow.querySelector(".c-place").classList.add("u-bg--yellow");
        newRow.querySelector(".c-kudos").classList.add("u-text--yellow");
      } else if (member.rank === 2) {
        newRow.querySelector(".c-place").classList.add("u-text--dark");
        newRow.querySelector(".c-place").classList.add("u-bg--teal");
        newRow.querySelector(".c-kudos").classList.add("u-text--teal");
      } else if (member.rank === 3) {
        newRow.querySelector(".c-place").classList.add("u-text--dark");
        newRow.querySelector(".c-place").classList.add("u-bg--orange");
        newRow.querySelector(".c-kudos").classList.add("u-text--orange");
      }
      class_obj.appendChild(newRow);
    });

    const winnerCard = document.getElementById("winner");
    if (team.length > 0) {
      const winner = team[0];
      winnerCard.innerHTML = `
        <div class="u-text-small u-text--medium u-mb--16">MVP of the Match🔥</div>
        <img class="c-avatar c-avatar--lg" src="${winner.img}"/>
        <h3 class="u-mt--16">${winner.name}</h3>
        <span class="u-text--teal u-text--small">${winner.name}</span>
      `;
    }

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, [team]);

  return (
    <>
      <div className="text-white min-h-screen l-wrapper">
        <h1 className="text-center text-3xl font-bold my-4 ">Leaderboard</h1>
        <div className="c-header">
          {!claimable ? (
            <button className="mapbox px-5 py-3 rounded-lg r-wrapper lobby-button">
              <Link href="/lobby" style={{ color: "#ffffff" }}>
                Lobby
              </Link>
            </button>
          ) : (
            <button
              className="mapbox px-5 py-3 rounded-lg r-wrapper claim-button"
              onClick={handleClaim}
            >
              Claim {tokensAwarded} Tokens
            </button>
          )}
        </div>

        <div className="l-grid">
          <div className="l-grid__item l-grid__item--sticky">
            <div className="c-card  glowing-card">
              <div className="c-card__body mapbox">
                <div className="u-text--center" id="winner" />
              </div>
            </div>
          </div>
          <div className="l-grid__item">
            <div className="c-card glowing-card ">
              <div className="c-card__body mapbox">
                <ul className="c-list" id="list">
                  <li className="c-list__item">
                    <div className="c-list__grid">
                      <div className="u-text--left u-text--small u-text--medium">
                        Rank
                      </div>
                      <div className="u-text--left u-text--small u-text--medium">
                        Name
                      </div>
                      <div className="u-text--right u-text--small u-text--medium">
                        # Kills/Deaths
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .lobby-button {
          position: fixed;
          top: 25px;
          right: 25px;
        }
        .claim-button {
          position: fixed;
          top: 25px;
          right: 25px;
          background-color: #9fc610;
          color: #000;
        }
        .glowing-card {
          position: relative;
          border: 2px solid transparent;
        }
        .glowing-card::before {
          content: "";
          position: absolute;
          top: -10px;
          left: -10px;
          right: -10px;
          bottom: -10px;
          background: radial-gradient(circle, #9fc610, transparent 60%);
          border-radius: 10px;
          animation: move-glow 3s infinite linear;
          z-index: -1;
        }
        @keyframes move-glow {
          0% {
            transform: translateX(0) translateY(0);
          }
          50% {
            transform: translateX(20px) translateY(20px);
          }
          100% {
            transform: translateX(0) translateY(0);
          }
        }
        .glowing-text {
          animation: text-glow 1.5s infinite alternate;
        }
        @keyframes text-glow {
          from {
            text-shadow: 0 0 10px #9fc610, 0 0 20px #9fc610, 0 0 30px #9fc610,
              0 0 40px #9fc610, 0 0 50px #9fc610, 0 0 60px #9fc610,
              0 0 70px #9fc610;
          }
          to {
            text-shadow: 0 0 20px #9fc610, 0 0 30px #9fc610, 0 0 40px #9fc610,
              0 0 50px #9fc610, 0 0 60px #9fc610, 0 0 70px #9fc610,
              0 0 80px #9fc610;
          }
        }
      `}</style>
    </>
  );
};

export default Result;
