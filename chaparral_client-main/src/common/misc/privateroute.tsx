import React from 'react';
import { useLocation, Navigate, PathRouteProps } from 'react-router-dom';
import { Menu } from "../components/menu"
import { cn } from "./utils"

// import { useAppSelector } from 'app/config/store';
// import ErrorBoundary from 'app/shared/error/error-boundary';

// interface IOwnProps extends PathRouteProps {
//   hasAnyAuthorities?: string[];
//   children: React.ReactNode;
// }

export const PrivateRoute = ({ children, hasAnyAuthorities = [], ...rest }: any) => {
  //   const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  //   const sessionHasBeenFetched = useAppSelector(state => state.authentication.sessionHasBeenFetched);
  //   const account = useAppSelector(state => state.authentication.account);
  //   const isAuthorized = hasAnyAuthority(account.authorities, hasAnyAuthorities);
  const location = useLocation();

  if (!children) {
    throw new Error(`A component needs to be specified for private route for path ${(rest as any).path}`);
  }

  //   if (!sessionHasBeenFetched) {
  //     return <div></div>;
  //   }

  //   if (isAuthenticated) {
  //     if (isAuthorized) {
  //       return <ErrorBoundary>{children}</ErrorBoundary>;
  //     }

  //     return (
  //       <div className="insufficient-authority">
  //         <div className="alert alert-danger">You are not authorized to access this page.</div>
  //       </div>
  //     );
  //   }

  const account: any = localStorage.getItem("account");
  if (account && JSON.parse(account).activated) {
    return (
      <div className="h-screen overflow-clip">
        <Menu />
        <div
          className={cn(
            "h-screen overflow-auto border-t bg-background pb-8",
            // "scrollbar-none"
            "scrollbar scrollbar-track-transparent scrollbar-thumb-accent scrollbar-thumb-rounded-md"
          )}
        >
          {children}
        </div>
      </div>
    )
  }

  return (
    <Navigate
      to={{
        pathname: '/login',
        search: location.search,
      }}
      replace
      state={{ from: location }}
    />
  );
};

export const hasAnyAuthority = (authorities: string[], hasAnyAuthorities: string[]) => {
  if (authorities && authorities.length !== 0) {
    if (hasAnyAuthorities.length === 0) {
      return true;
    }
    return hasAnyAuthorities.some(auth => authorities.includes(auth));
  }
  return false;
};

/**
 * Checks authentication before showing the children and redirects to the
 * login page if the user is not authenticated.
 * If hasAnyAuthorities is provided the authorization status is also
 * checked and an error message is shown if the user is not authorized.
 */
export default PrivateRoute;
