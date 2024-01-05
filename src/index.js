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
import ReactDOM from "react-dom/client";
// import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { HashRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { StrictMode } from "react";

import "bootstrap/dist/css/bootstrap.css";
import "assets/scss/paper-dashboard.scss?v=1.3.0";
import "assets/demo/demo.css";
import "perfect-scrollbar/css/perfect-scrollbar.css";

import { AuthProvider } from "./context/AuthProvider";
import AdminLayout from "layouts/Admin.js";
import Login from 'views/Login';
import PersistLogin from './components/PersistLogin';
import RequireAuth from './components/RequireAuth';
import UnauthorizedComponent from './views/UnauthorizedComp'


import 'react-chat-widget/lib/styles.css';

const ROLES = {
  'GroupAdmin': 'admin',
  'BranchAdmin': 'admin',
  'Doctor': 'doctor',
  'Nurse': 'nurse',
  'User': 'user'
}

const queryClient = new QueryClient();
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
    <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            {/* <Route element={<PersistLogin />}> */}
              <Route element={<RequireAuth allowedRoles={[ROLES.GroupAdmin, ROLES.BranchAdmin, ROLES.Doctor, ROLES.Nurse, ROLES.User]} />}>
                <Route path="/admin/*" element={<AdminLayout />} />
              </Route>
              <Route element={<RequireAuth allowedRoles={[ROLES.GroupAdmin, ROLES.BranchAdmin, ROLES.Doctor, ROLES.Nurse, ROLES.User]} />}>
                <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
              </Route>
              <Route element={<RequireAuth allowedRoles={[ROLES.GroupAdmin, ROLES.BranchAdmin, ROLES.Doctor, ROLES.Nurse, ROLES.User]} />}>
                <Route path="/userdashboard" element={<Navigate to="/admin/userdashboard" replace />} />
              </Route>
            {/* </Route> */}
            <Route>
            <Route path="/unauthorized" element={<UnauthorizedComponent />} />
            </Route>
          </Routes>
        </AuthProvider>
        </Router>
    </QueryClientProvider>
  </StrictMode>
);
