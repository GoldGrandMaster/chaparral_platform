import { Route, Routes } from "react-router-dom";
import Login from "./modules/login";
import Signup from "./modules/signup";
import Confirm from "./modules/account/confirm";
import ForgotPassword from "./modules/account/forgot-password";
import ResetPassword from "./modules/account/reset";
import DashboardPage from "./modules/user/dashboard/page";
import NotFoundPage from "./modules/404";
import PrivateRoute from "@/common/misc/privateroute";
import ProjectListviewPage from "./modules/user/project/listview/projectListviewPage";
import ProjectFormPage from "@/modules/user/project/new/projectFormPage";
import ProjectEditFormPage from "@/modules/user/project/edit/projectEditFormPage";
import ProjectFileUploadPage from "./modules/user/project/upload/projectFileUploadPage";
import OrganizationSetting from "./modules/user/organization/OrganizationSetting";
import OrganizationInvite from "./modules/user/organization/OrganizationInvite";
import SearchPage from "./modules/user/project/search/searchpage";
import ResetPasswordNormal from "./modules/account/reset-normal";
const AppRoutes = () => {
  return (
    <div className="view-routes">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/confirm" element={<Confirm />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-password-normal" element={<PrivateRoute><ResetPasswordNormal /></PrivateRoute>} />
        <Route path="/organization/setting" element={<PrivateRoute><OrganizationSetting /></PrivateRoute>} />
        <Route path="/organization/invite" element={<PrivateRoute><OrganizationInvite /></PrivateRoute>} />
        <Route path="/user/project/search" element={<PrivateRoute><SearchPage /></PrivateRoute>} />
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
    </div>
  );
};

export default AppRoutes;
