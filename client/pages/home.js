import axios from "axios";
import React, { useEffect, useState } from "react";

const home = () => {
  const [search, setSearch] = useState();
  const [links, setLinks] = useState([]);
  const [download, setDownload] = useState(false);
  const [file, setFile] = useState({});
  // const [vidId, setVidId] = useState("6782218030668696837");

  const handleSearch = async (e) => {
    const url = "http://127.0.0.1:8000/api/scrape/search";
    const resp = await axios.post(url, {
      username: search,
    });
    console.log(resp.data.video_links);
    setLinks(resp.data.video_links);
  };
  const handleDownload = async (vidId) => {
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
        return (
          <>
            <div>{link}</div>;
            <div className="">
              <button onClick={handleDownload()}>Start Download</button>
            </div>
          </>
        );
      })}
    </div>
  );
};
// todo: allow for dynamic download
// todo: implement an amazing ui
// todo:

export default home;

// export async function getServerSideProps(context) {
//   const url = "http://localhost:8000/api/user";
//   const cookie = context.req.cookies.at;
//   const resp1 = await axios.get(url, { headers: { Cookie: `at=${cookie}` } });
//   axios.defaults.headers.common[
//     "Authorization"
//   ] = `Bearer ${resp1.data.access_token}`;

//   try {
//     const instance = axios.create({
//       withCredentials: true,
//     });
//     const url = "http://localhost:8000/api/isLog";
//     const resp = await instance.post(url, {});
//   } catch (error) {
//     return {
//       redirect: {
//         permanent: false,
//         destination: "/",
//       },
//     };
//   }
//   return { props: {} };
// }
