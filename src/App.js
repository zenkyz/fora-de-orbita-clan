import React, { useEffect, useState } from "react";

const CLAN_ID = "61f243a7-153e-447b-817f-4316da1e385c"; // Fora de Órbita
const API_KEY = process.env.REACT_APP_WOLVESVILLE_API_KEY;

export default function App() {
  const [clanInfo, setClanInfo] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchClan() {
      try {
        setLoading(true);
        const resClan = await fetch(
          `https://api.wolvesville.com/api/v1/clans/${CLAN_ID}`,
          {
            headers: { Authorization: `Bearer ${API_KEY}` },
          }
        );
        if (!resClan.ok) throw new Error("Erro ao buscar dados do clã");
        const clanData = await resClan.json();
        setClanInfo(clanData);

        const resMembers = await fetch(
          `https://api.wolvesville.com/api/v1/clans/${CLAN_ID}/members`,
          {
            headers: { Authorization: `Bearer ${API_KEY}` },
          }
        );
        if (!resMembers.ok) throw new Error("Erro ao buscar membros");
        const membersData = await resMembers.json();
        setMembers(membersData);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchClan();
  }, []);

  if (loading) return <div className="loading">Carregando...</div>;
  if (error) return <div className="error">Erro: {error}</div>;

  return (
    <div className="app">
      <header>
        <h1>Clã Fora de Órbita</h1>
        <p>
          Nível: {clanInfo.level} | Membros: {clanInfo.membersCount} | Reputação:{" "}
          {clanInfo.reputation}
        </p>
      </header>
      <main>
        <h2>Membros</h2>
        <ul>
          {members.map((m) => (
            <li key={m.id}>
              {m.name} - Level: {m.level} - XP: {m.xp} - Cargo: {m.role}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}