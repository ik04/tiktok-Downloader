import { GlobalContext } from "@/contexts/GlobalContext";
import axios from "axios";
import { useContext } from "react";

const navLinks = [{ name: "links", href: "#" }]; // * add future links here to map automatically, uncomment the map in the navbar

export const Navbar = () => {
  const { username } = useContext(GlobalContext);
  const handleLogout = async (e) => {
    e.preventDefault();
    const url = "http://localhost:8000/api/logout";
    const resp = axios.post(url, {});
    console.log(resp);
    location.href = "/login";
  };
  return (
    <div className="bg-black flex items-center justify-between w-screen h-16">
      <h1 className="text-white font-mono mx-3 cursor-default">{username}</h1>
      <div className="flex">
        {/* {navLinks.map((link) => (
          <a className="text-white" href={link.href}>
            {link.name}
          </a>
        ))} */}
        <a
          className="text-red-600 hover:text-red-700 ease-out duration-300 cursor-pointer mx-3"
          onClick={handleLogout}
        >
          Logout
        </a>
      </div>
    </div>
  );
};
