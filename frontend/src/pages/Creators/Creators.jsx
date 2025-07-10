import axios from "axios";
import React, { useEffect, useState } from "react";
import "./Creators.css";

function Creators() {
  const [creators, setCreators] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const { data } = await axios.get(
          "https://blognest-gvv7.onrender.com/api/users/admins",
          { withCredentials: true }
        );
        setCreators(data.admins);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCreators();
  }, []);

  const filteredCreators = creators.filter(creator =>
    creator.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="creators-page-beige">
      <h2 className="creators-heading">Creators</h2>
      <div className="creators-searchbar-container">
        <input
          className="creators-searchbar"
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="creators-list">
        {filteredCreators.map((creator) => (
          <div key={creator._id} className="creator-card">
            <div className="creator-image">
              <img src={creator.photo.url} alt="avatar" />
            </div>
            <div className="creator-info">
              <h3>{creator.name}</h3>
              <p>
                <strong>Contact:</strong> {creator.phone}
              </p>
              <p>
                <strong>Email:</strong> {creator.email}
              </p>
              <p>
                <strong>Education:</strong> {creator.education}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Creators;
