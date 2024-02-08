import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./modules/login";
import { Card } from "reactstrap";
import Signup from "./modules/signup";
import Confirm from "./modules/account/confirm";
import ForgotPassword from "./modules/account/forgot-password";
import ResetPassword from "./modules/account/reset";
import DashboardPage from "./modules/user/dashboard/page";
import NotFoundPage from "./modules/404";
import PrivateRoute from "@/common/misc/privateroute";
import ProjectListviewPage from "./modules/user/project/listview/projectListviewPage";
import ProjectFormPage from "@/modules/user/project/form/projectFormPage";
import ProjectEditFormPage from "@/modules/user/project/edit/projectEditFormPage";
import ProjectFileUploadPage from "./modules/user/project/upload/projectFileUploadPage";
const AppRoutes = () => {
  return (
    <div className="view-routes">
      <Card>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/confirm" element={<Confirm />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/user"
            element={
              <PrivateRoute>
                {<DashboardPage />}
              </PrivateRoute>
            }
          />
          <Route
            path="/user/project/*"
            element={
              <PrivateRoute>
                {<ProjectListviewPage />}
              </PrivateRoute>
            }
          />
          <Route
            path="/user/project/form"
            element={
              <PrivateRoute>
                {<ProjectFormPage />}
              </PrivateRoute>
            }
          />
          <Route
            path="/user/project/edit"
            element={
              <PrivateRoute>
                {<ProjectEditFormPage />}
              </PrivateRoute>
            }
          />
          <Route
            path="/user/project/upload"
            element={
              <PrivateRoute>
                {<ProjectFileUploadPage />}
              </PrivateRoute>
            }
          />
          <Route
            path="*"
            element={<NotFoundPage />}
          />
        </Routes>
      </Card>
    </div>
  );
};

export default AppRoutes;
