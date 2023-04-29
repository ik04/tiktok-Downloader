import axios from "axios";
import React, { useEffect, useState } from "react";

const home = () => {
  const [search, setSearch] = useState();
  const [links, setLinks] = useState([]);

  const handleSearch = async (e) => {
    const url = "http://127.0.0.1:8000/api/scrape/search";
    const resp = await axios.post(url, {
      username: search,
    });
    console.log(resp.data.video_links);
    setLinks(resp.data.video_links);
  };

  return (
    <div className="">
      <div className="flex">
        <input
          type="text"
          name="search"
          id=""
          className="border border-black"
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <button type="submit" onClick={handleSearch}>
          Search
        </button>
      </div>
      {links.map((link) => {
        return <div>{link}</div>;
      })}
    </div>
  );
};

export default home;
