import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Navbar,
  NavbarBrand,
  // Collapse,
  // NavbarToggler,
  // Nav,
  // Dropdown,
  // DropdownToggle,
  // DropdownMenu,
  // DropdownItem,
  Container,
} from "reactstrap";
import { FaBars, FaTimes } from "react-icons/fa";

import routes from "routes.js";
import useLogout from "../../hooks/useLogout";
import "../../views/Test.css";
import useAuth from "../../hooks/useAuth";

function Header(props) {
  const { auth } = useAuth();
  const name = auth.name;
  const salutation = auth.salutation;
  const specialization = auth.specialization;
  const [isOpen, setIsOpen] = React.useState(false);
  // const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [color, setColor] = React.useState("transparent");
  // const [textColor, setTextColor] = React.useState("black");

  const sidebarToggle = React.useRef();
  const location = useLocation();

  // const toggle = () => {
  //   if (isOpen) {
  //     setTextColor("black");
  //     setColor("transparent");
  //   } else {
  //     setTextColor("yellow");
  //     setColor("dark");
  //   }
  //   setIsOpen(!isOpen);
  // };
  // const dropdownToggle = (e) => {
  //   setDropdownOpen(!dropdownOpen);
  // };

  const openSidebar = () => {
    document.documentElement.classList.toggle("nav-open");
    sidebarToggle.current.classList.toggle("toggled");
    setIsOpen(!isOpen);
  };

  const getBrand = () => {
    let brandName = "Patient Details";
    routes.map((prop, key) => {
      if (window.location.href.indexOf(prop.layout + prop.path) !== -1) {
        brandName = prop.name;
      }
      return null;
    });
    return brandName;
  };
  // function that adds color dark/transparent to the navbar on resize (this is for the collapse)
  const updateColor = () => {
    if (window.innerWidth < 993 && isOpen) {
      setColor("dark");
    } else {
      setColor("transparent");
    }
  };
  React.useEffect(() => {
    window.addEventListener("resize", updateColor.bind(this));
  });
  React.useEffect(() => {
    if (
      window.innerWidth < 993 &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
      sidebarToggle.current.classList.toggle("toggled");
    }
  }, [location]);

  const navigate = useNavigate();
  const logout = useLogout();
  const signOut = async () => {
    await logout();
    navigate("/");
  };

  return (
    // add or remove classes depending if we are on full-screen-maps page or not
    <Navbar
      color={
        location.pathname.indexOf("full-screen-maps") !== -1 ? "dark" : color
      }
      expand="lg"
      className={
        location.pathname.indexOf("full-screen-maps") !== -1
          ? "navbar-absolute fixed-top"
          : "navbar-absolute fixed-top " +
          (color === "transparent" ? "navbar-transparent " : "")
      }
    >
      <Container>
        <div className="navbar-wrapper d-flex justify-content-between" style={{ height: 50 }}>
          <div className="navbar-toggle">
            <button
              type="button"
              ref={sidebarToggle}
              className="custom-toggler"
              onClick={() => openSidebar()}
              style={{ strokeWidth: '2px', width: '20px' }}
            >
              {isOpen ? <FaTimes style={{ strokeWidth: '2px', width: '20px' }} /> : <FaBars style={{ strokeWidth: '2px', width: '20px' }} />}
            </button>
          </div>
          <NavbarBrand>{getBrand()}</NavbarBrand>
          <div className="navbar-brand navbar-brand-right">
            <div className="name">{salutation}{" "}{name}</div>
            <div className="subtitle">{specialization}</div>
            <div style={{ cursor: 'pointer' }} className="logout" onClick={signOut}>Logout</div>
          </div>
        </div>
      </Container>
    </Navbar>
  );
}

export default Header;
