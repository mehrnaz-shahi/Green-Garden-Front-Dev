import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { get_for_user, get_by_token } from "../services/api";


//image
import logo from "../assets/images/green garden2.svg";

//Component
import SavePlants from "../pages/explore/SavePlants";
import HamburgerMenue from "./HamburgerMenu";


const Navbar = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const [status, setStatus] = useState("usual");
  const [open, setOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [gardenId, setGardenId]  = useState({});

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const style = {
    s1: "dropdown-menu dd-menu dropdown-menu-end bg-white shadow rounded border-0 mt-3 py-3 ",
    s2: "dropdown-menu dd-menu dropdown-menu-end bg-white shadow rounded border-0 mt-3 py-3 show card-shadow",
  };

  useEffect(() => {
    const nav = document.getElementById("topnav");

    window.addEventListener("scroll", () => {
      if (window.scrollY >= 200) {
        nav.style.background = "rgb(255 255 255 / 90%)";
      } else {
        nav.style.background = "";
      }
    });


    const handleResize = () => {
      if (window.innerWidth < 1000) {
        setIsMenuOpen(true);
      } else {
        setIsMenuOpen(false);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };


  }, []);

  const accountHandler = () => {
    setOpen(!open);

    const fetch = async () => {
    
        const res = await get_for_user("accounts/get-user/", cookies["token"]);
        setResult(res);
        setError(res);
      
    };
        fetch();

  };


  useEffect(() => {

    if (error === 401) {
      console.log('401 in')
      setStatus("usual");
    } else if(result && result.is_garden_owner) {
      setStatus("garden_owner");
      const fetch = async () => {
        // Get garden by garden owner token
        const garden = await get_by_token("gardens/get_garden/", cookies["token"]);
        if (garden && garden.id) setGardenId(garden.id);

    };
    fetch();
    
    } else if (result) {
      setStatus("user");
    }
  }, [result, error, cookies['token']]);





  const logout = () => {
    removeCookie("token", {path:'/'});
  };




  return (
    <div>
      {/* <!-- Navbar Start --> */}
      <header id="topnav" className="sticky">
        <div className="container">
          <div>
            <Link className="logo" to="/home">
              <img src={logo} className="l-light" alt="G G loog" />
              Green Garden
            </Link>
          </div>


          <ul className="buy-button list-inline mb-0">
            <li className="list-inline-item mb-0">
              <div className="dropdown">

              {/* {isMenuOpen &&           <HamburgerMenue />} */}

                <button
                  type="button"
                  className="btn btn-link text-decoration-none dropdown-toggle p-0 pe-2"
                  data-bs-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <i className="uil uil-search h5 search"></i>
                </button>
                <div
                  className="dropdown-menu dd-menu dropdown-menu-end bg-white shadow rounded border-0 mt-3 py-0"
                  style={{ width: "300px" }}
                >
                  <form>
                    <input
                      type="text"
                      id="text"
                      name="name"
                      className="form-control border bg-white"
                      placeholder="جستجو..."
                    />
                  </form>
                </div>
              </div>
            </li>
            <li className="list-inline-item mb-0 pe-1">
              <SavePlants />
            </li>
            <li className="list-inline-item mb-0" onClick={accountHandler}>
              <div className="dropdown dropdown-primary">
                <button
                  type="button"
                  className="btn btn-icon  dropdown-toggle nav-icon"
                  data-bs-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <i className="uil uil-user align-middle icons"></i>
                </button>
                {/* user  */}
                <div
                  className={open ? style.s2 : style.s1}
                  style={{ width: "200px", left: "0" }}
                >
                  {status !== "usual" ? (
                    <Link
                      className="dropdown-item text-dark"
                      to="/home/account/"
                    >
                      <i className="uil uil-user align-middle me-1"></i> حساب
                      کاربری
                    </Link>
                  ) : (
                    <Link className="dropdown-item text-dark" to="/login">
                      <i className="uil uil-user align-middle me-1"></i> ورود{" "}
                    </Link>
                  )}
                  {status === "garden_owner" && (
                    <Link
                      className="dropdown-item text-dark"
                      to={`/home/garden/${gardenId}/`}
                    >
                      <i className="uil uil-clipboard-notes align-middle me-1"></i>{" "}
                      حساب گلخانه{" "}
                    </Link>
                  )}
                  <div className="dropdown-divider my-3 border-top"></div>

                  {status !== "usual" && (
                    <Link
                      className="dropdown-item text-dark"
                      to="/home"
                      onClick={logout}
                    >
                      <i className="uil uil-sign-out-alt align-middle me-1"></i>{" "}
                      خروج{" "}
                    </Link>
                  )}
                </div>
              </div>
            </li>
          </ul>


          <div id="navigation">
            <ul className="navigation-menu nav-light">
              <li>
                <Link to="/home" className="sub-menu-item">
                  صفحه اصلی
                </Link>
              </li>

              <li className="has-submenu parent-parent-menu-item">
                <Link to="/home/suggestion">پیشنهاد گیاه </Link>
              </li>

              <li className="has-submenu parent-menu-item">
                <Link to="/home/aboutUs">درباره ما </Link>
              </li>
            </ul>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
