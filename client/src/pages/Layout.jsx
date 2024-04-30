import { NavBar } from "../components/navBar";
import { Outlet } from "react-router-dom";

export const Layout = () => {
  return (
    <>
      <div>
        <NavBar />
        <Outlet />
      </div>
    </>
  );
};
