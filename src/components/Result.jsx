import React, { useEffect, useState, useMemo } from "react";
import "../styles/result.css";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";

const Result = () => {
  const navigate = useNavigate();
  const playerValue = useSelector((state) => state.authslice.playerdata);
  const [claimable, setClaimable] = useState(false);
  const [tokensAwarded, setTokensAwarded] = useState(0);

  // Process team data using useMemo for performance
  const team = useMemo(() => {
    if (!playerValue || !Array.isArray(playerValue)) return [];

    return [...playerValue]
      .map((value, index) => ({
        id: value.id || index,
        name: value.state?.profile?.name || "Unknown Soldier",
        img: value.state?.profile?.photo || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback",
        kills: value.state?.kills || 0,
        deaths: value.state?.deaths || 0,
        wallet: value.state?.profile?.wallet || "No Wallet",
        color: value.state?.profile?.color || "#9fc610"
      }))
      .sort((a, b) => b.kills - a.kills)
      .map((p, i) => ({ ...p, rank: i + 1 }));
  }, [playerValue]);

  const mvp = team[0] || null;

  useEffect(() => {
    if (team.length > 0) {
      // Award tokens based on performance
      const totalKills = team.reduce((sum, p) => sum + p.kills, 0);
      if (totalKills > 0) {
        setTokensAwarded(totalKills * 5);
        setClaimable(true);
      }

      // Play victory confetti
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [team]);

  const handleClaim = async () => {
    // Here you would typically trigger an on-chain transaction
    setClaimable(false);
    navigate("/lobby");
  };

  return (
    <div className="result-screen">
      <div className="result-header">
        <h1>Mission Accomplished</h1>
        <p style={{ color: "var(--text-muted)", letterSpacing: "2px" }}>FINAL STANDINGS</p>
      </div>

      {mvp && (
        <section className="mvp-section">
          <div className="mvp-card">
            <div className="mvp-avatar-wrapper">
              <span className="mvp-crown">👑</span>
              <img src={mvp.img} alt={mvp.name} className="mvp-avatar" />
            </div>
            <div className="mvp-info">
              <h2>Most Valuable Player</h2>
              <p className="mvp-name">{mvp.name}</p>
              <div className="mvp-stats">
                <div className="stat-item">
                  <span className="stat-value">{mvp.kills}</span>
                  <span className="stat-label">Total Kills</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{mvp.deaths}</span>
                  <span className="stat-label">Deaths</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{(mvp.kills / (mvp.deaths || 1)).toFixed(2)}</span>
                  <span className="stat-label">K/D Ratio</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="leaderboard-container">
        {team.map((player) => (
          <div key={player.id} className={`player-row rank-${player.rank}`}>
            <div className="rank-badge">
              {player.rank === 1 ? "1st" : player.rank === 2 ? "2nd" : player.rank === 3 ? "3rd" : player.rank}
            </div>
            <div className="player-identity">
              <img src={player.img} alt={player.name} className="player-avatar-mini" />
              <span className="player-name-mini">{player.name}</span>
            </div>
            <div className="stat-group">
              <span className="stat-label">Kills</span>
              <div className="kd-val kills">{player.kills}</div>
            </div>
            <div className="stat-group">
              <span className="stat-label">Deaths</span>
              <div className="kd-val deaths">{player.deaths}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="action-bar">
        <Link to="/lobby" className="btn-premium btn-lobby">
          Return to Lobby
        </Link>
        {claimable && (
          <button onClick={handleClaim} className="btn-premium btn-claim">
            Claim {tokensAwarded} RO$
          </button>
        )}
      </div>
    </div>
  );
};

export default Result;
