import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";

const DownloadVideo = () => {
  const router = useRouter();
  const vidId = router.query.vidId;
  const handleDownload = async (linkId) => {
    try {
      const vidId = getTikTokVideoId(linkId);
      const url = "http://127.0.0.1:8000/api/scrape/download";
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
        toast.success("Download Successful!");
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(
    () => {
      handleDownload(vidId);
    },
    [router.isReady],
    []
  );
  return (
    <>
      <Toaster />
      <div>Downloading your video...</div>;
    </>
  );
};

export default DownloadVideo;
