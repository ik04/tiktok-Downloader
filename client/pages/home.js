import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "@/contexts/GlobalContext";
import { Toaster, toast } from "react-hot-toast";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";

const home = (props) => {
  const { updateLoggedIn } = useContext(GlobalContext);
  const [search, setSearch] = useState();
  const [links, setLinks] = useState([]);
  const [download, setDownload] = useState(false);
  const [file, setFile] = useState({});
  // const [vidId, setVidId] = useState();
  useEffect(() => {
    updateLoggedIn(props.loggedIn);
  }, [props.loggedIn]);

  const getTikTokVideoId = (url) => {
    const matches = url.match(/\/(\d+)/);
    if (matches) {
      return matches[1];
    }
    return null;
  };

  const handleSearch = async (e) => {
    const url = "http://127.0.0.1:8000/api/scrape/search";
    const resp = await axios.post(url, {
      username: search,
    });
    console.log(resp.data.video_links);
    setLinks(resp.data.video_links);
  };
  const handleDownload = async (linkId) => {
    try {
      const url = "http://127.0.0.1:8000/api/scrape/download";
      await axios({
        method: "POST",
        url: url,
        data: { vid_id: linkId },
        responseType: "blob",
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${linkId}.mp4`);
        document.body.appendChild(link);
        link.click();
      });
      setDownload(true);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="h-screen ">
      <Toaster />
      <div className="md:fixed block">
        <Navbar />
      </div>

      <div className="h-full flex items-center justify-center">
        <div className="flex md:flex-row flex-col">
          <input
            type="text"
            name="search"
            id=""
            className="border rounded-md p-3 mx-4 md:w-[1200px] w-2/3  border-black"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
          <button
            type="submit"
            className="border border-gray-600 md:p-4 md:rounded-full bg-black text-white duration-200 hover:text-black hover:bg-white hover:border-black"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>
      {links.map((link) => {
        const vidId = getTikTokVideoId(link);

        return (
          <div className="flex my-5" key={link}>
            <div className="font-mono">{link}</div>
            <div className="">
              <a
                className="p-2 mx-2 border border-black font-mono cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  toast.promise(handleDownload(vidId), {
                    loading: "Downloading Video...",
                    success: <b>Video Downloaded Successfully!</b>,
                    error: <b>unexpected error</b>,
                  });
                }}
              >
                Start Download
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
};
// todo: allow for dynamic download, optimize downloads
// todo: implement an amazing ui
//todo: add navbar for allowing logout

export default home;

export async function getServerSideProps(context) {
  try {
    const url = "http://localhost:8000/api/user";
    const cookie = context.req.cookies.at;
    const resp1 = await axios.get(url, { headers: { Cookie: `at=${cookie}` } });
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${resp1.data.access_token}`;
  } catch (error) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }

  try {
    const instance = axios.create({
      withCredentials: true,
    });
    const url = "http://localhost:8000/api/isLog";
    const resp = await instance.post(url, {});
  } catch (error) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }
  return { props: { loggedIn: true } };
}
