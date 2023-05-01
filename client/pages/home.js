import axios from "axios";
import React, { useEffect, useState } from "react";

const home = () => {
  const [search, setSearch] = useState();
  const [links, setLinks] = useState([]);
  const [download, setDownload] = useState(false);
  const [file, setFile] = useState({});
  const [vidId, setVidId] = useState("6782218030668696837");

  const handleSearch = async (e) => {
    const url = "http://127.0.0.1:8000/api/scrape/search";
    const resp = await axios.post(url, {
      username: search,
    });
    console.log(resp.data.video_links);
    setLinks(resp.data.video_links);
  };
  const handleDownload = async (e) => {
    e.preventDefault();
    const url = "http://127.0.0.1:8000/api/scrape/download";
    // const resp = await axios
    //   .post(url, { vid_id: vidId })
    //   .then((response) => {
    //     const url = window.URL.createObjectURL(new Blob([response.data]));
    //     const link = document.createElement("a");
    //     link.href = url;
    //     link.setAttribute("download", `${vidId}.mp4`);
    //     document.body.appendChild(link);
    //     link.click();
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });

    await axios({
      method: "POST",
      url: url,
      data: { vid_id: vidId },
      responseType: "blob",
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${vidId}.mp4`);
      document.body.appendChild(link);
      link.click();
    });

    // console.log(resp);
    // const link = document.createElement("a");
    // link.href = resp.data.file_path;
    // link.download = resp.data.file_name;
    // link.click();
    // setFile({ filePath: resp.data.file_path, fileName: resp.data.file_name });
    setDownload(true);
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

      {!download ? (
        <div className="">
          <button onClick={handleDownload}>Start Download</button>
        </div>
      ) : (
        <div className="">
          <a href={file.filePath} download={file.fileName}>
            Download File
          </a>
        </div>
      )}
    </div>
  );
};
// todo: get the file downloaded on user inteface
export default home;
