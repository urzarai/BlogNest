import { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";

export default function Creators() {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    axiosInstance.get("/api/users/admins")
      .then((res) => setCreators(res.data.admins || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div style={{ padding: "3rem clamp(1.5rem, 5vw, 4rem) 2rem", borderBottom: "0.5px solid var(--border)" }}>
        <p className="section-eyebrow">The Team</p>
        <h1 className="section-title">Our Creators</h1>
        <p className="section-subtitle">
          Meet the writers and thinkers behind every article on BlogNest.
        </p>
      </div>

      <div style={{ padding: "2.5rem clamp(1.5rem, 5vw, 4rem)" }}>
        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : creators.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">👤</div>
            <p className="empty-state__title">No creators yet</p>
          </div>
        ) : (
          <div className="creators-grid">
            {creators.map((creator) => (
              <div key={creator._id} className="creator-full-card">
                <img src={creator.photo?.url} alt={creator.name} className="creator-full-card__avatar" />
                <p className="creator-full-card__name">{creator.name}</p>
                <p className="creator-full-card__role">Admin · Creator</p>
                <p className="creator-full-card__education">{creator.education}</p>
                <p className="creator-full-card__email">{creator.email}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}