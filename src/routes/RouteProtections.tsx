// RouteProtections.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../redux/store";
import { FullScreenLoading } from "@/components/custom/FullScreenLoading";
import { useEffect, useState } from "react";
import { UserRole } from "@/types/user";

interface IEnsureAuthProps {
	requiredRoles?: (UserRole | 'customer')[]; // Add optional role requirements
}

// Updated EnsureAuth component with account activation check
export const EnsureAuth = ({ requiredRoles }: IEnsureAuthProps) => {
	const { user, isLoading } = useAppSelector(state => state.auth);
	const location = useLocation();
	const [hasTimeoutElapsed, setHasTimeoutElapsed] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => {
			setHasTimeoutElapsed(true);
		}, 2000);
		return () => clearTimeout(timer);
	}, []);

	if (isLoading && !hasTimeoutElapsed) {
		return <FullScreenLoading />;
	}

	// Redirect to login if not authenticated
	if (!user) {
		return <Navigate to='/authentication/login' state={{ from: location }} replace />;
	}

	// Check if user is a system user with inactive status
	if (user.type === "system" && user.status === "inactive") {
		// Allow access only to the activation page
		if (location.pathname === "/pages/admin/activate") {
			return <Outlet />;
		}
		// Redirect to activation page for any other admin route
		return <Navigate to="/pages/admin/activate" replace />;
	}

	// If no roles are required, allow access to all authenticated users
	if (!requiredRoles || requiredRoles.length === 0) {
		return <Outlet />;
	}

	// Get the user's role
	const userRole = user.type === "system" ? user.role : 'customer';

	// Check if the user's role is included in the required roles
	const hasRequiredRole = requiredRoles.includes(userRole);

	if (!hasRequiredRole) {
		return <Navigate to="/pages/unauthorized" replace />;
	}

	return <Outlet />;
};

export const EnsureGuest = () => {
	const { user, isLoading } = useAppSelector(state => state.auth);
	const location = useLocation();
	const [showContent, setShowContent] = useState(false);

	useEffect(() => {
		// Fallback timeout to prevent infinite loading
		const timer = setTimeout(() => {
			setShowContent(true);
		}, 2000); // 2 second timeout

		return () => clearTimeout(timer);
	}, []);

	if (isLoading && !showContent) {
		return <FullScreenLoading />;
	}

	if (user) {
		const from = location.state?.from?.pathname ||
			(user.type === "system" ? "/pages/admin/dashboard" : "/pages/customer/home");

		return <Navigate to={from} replace />;
	}

	return <Outlet />;
};


export const EnsureRole = ({ roles }: { roles: string[] }) => {
	const { user, isLoading } = useAppSelector(state => state.auth);
	const [hasTimeoutElapsed, setHasTimeoutElapsed] = useState(false);

	useEffect(() => {
		// Fallback timeout to prevent infinite loading
		const timer = setTimeout(() => {
			setHasTimeoutElapsed(true);
		}, 1000); // 2 second timeout

		return () => clearTimeout(timer);
	}, []);

	// Show loading while auth state is being determined (with timeout fallback)
	if (isLoading && !hasTimeoutElapsed) {
		return <FullScreenLoading />;
	}

	// Redirect to login if not authenticated
	if (!user) {
		return <Navigate to='/authentication/login' replace />;
	}

	// Get user roles based on user type
	let userRoles: string;

	if (user.type === 'system') {
		userRoles =  user.role;
	} else {
		userRoles = 'customer';
	}

	// Check if user has any of the required roles
	const hasRequiredRole = roles.some(role => userRoles.includes(role));

	if (!hasRequiredRole) {
		return <Navigate to="/pages/unauthorized" replace />;
	}

	return <Outlet />;
};