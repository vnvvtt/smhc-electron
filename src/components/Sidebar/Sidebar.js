/*!

=========================================================
* Paper Dashboard React - v1.3.2
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/main/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import { Nav } from "reactstrap";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";

import useLogout from "../../hooks/useLogout";
import logo from "../../assets/img/ydc_logo.jpg";
import "../../views/Test.css";
import "../../assets/css/paper-dashboard.css";
import useAuth from "../../hooks/useAuth";

// var ps;

function checkRoleMatch(userRoles, allowedRoles) {
  const userRolesSet = new Set(userRoles);
  const allowedRolesSet = new Set(allowedRoles);

  // Check if there is an intersection between userRoles and allowedRoles
  const intersection = [...userRolesSet].filter(role => allowedRolesSet.has(role));

  // If there is an intersection, roles match
  return intersection.length > 0;
}

function Sidebar(props) {
  const location = useLocation();
  const sidebar = React.useRef();
  const { auth } = useAuth();

  const userRole = auth.roles;
  // const allowedRoles = "doctor,admin".split(",").map(role => role.trim());
  const allowedRoles = props.routes.map((route) => {
    if (route.allowedRoles && typeof route.allowedRoles === 'string') {
      return route.allowedRoles.split(',').map(role => role.trim());
    } else if (route.allowedRoles && Array.isArray(route.allowedRoles)) {
      return route.allowedRoles;
    } else {
      return [];
    }
  });

  const isRoleMatch = (allowedRoles) => checkRoleMatch(userRole, allowedRoles);

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return location.pathname.indexOf(routeName) > -1 ? "active" : "";
  };

  let psRef = React.useRef(null);

  React.useEffect(() => {
    if (navigator.userAgent.indexOf("Win") > -1) {
      psRef.current = new PerfectScrollbar(sidebar.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
    }
    return function cleanup() {
      if (psRef.current && navigator.userAgent.indexOf("Win") > -1) {
        psRef.current.destroy();
        psRef.current = null;
      }
    };
  });

  const navigate = useNavigate();
  const logout = useLogout();
  const signOut = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div
      className="sidebar"
      data-color={props.bgColor}
      data-active-color={props.activeColor}
    >
      <div className="logo">
        <div className="logo-img mb-1">
          <img src={logo} alt="SMHC" />
        </div>
        <span style={{ color: "white" }}>YOGIATREYA DIAGNOSTIC CENTER</span>
      </div>
      <div className="sidebar-wrapper" ref={sidebar}>
        <Nav>
          {props.routes
            .filter(
              (prop) =>
                prop.showInSidebar !== false &&
                (prop.allowedRoles ? isRoleMatch(prop.allowedRoles) : true)
            )
            .map((prop, key) => {
              if (prop.action === "logout") {
                // Render the logout option
                return (
                  <li key={key} className="active-pro" style={{ marginLeft: "0.00001rem", padding: "1.5rem" }}>
                    <button className="nav-NavLink logout-button ml-4" onClick={signOut}>
                      <i className="nc-icon nc-button-power" />
                      <p style={{ color: "white" }}>{prop.name}</p>
                    </button>
                  </li>
                );
              } else {
                return (
                  <li
                    className={
                      activeRoute(prop.path) + (prop.pro ? " active-pro" : "")
                    }
                    key={key}
                  >
                    <NavLink to={prop.layout + prop.path} className="nav-NavLink">
                      {/* <i className={prop.icon} /> */}
                      <p>{prop.name}</p>
                    </NavLink>
                  </li>
                );

              }
            })}
        </Nav>
      </div>
    </div>
  );
}

export default Sidebar;
