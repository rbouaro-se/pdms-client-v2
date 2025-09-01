
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import {  useAppSelector } from "../redux/store";
// import { TAccountType } from "../types/account";
// import { useDispatch } from "react-redux";
// import { clearPassworResetStatus, setPassworResetStatus } from "@/redux/slices/auth";

interface IEnsureAuthProps {
	restrictedTo: ("system" | "customer")[]
}
export const EnsureAuth = ({ restrictedTo }: IEnsureAuthProps) => {
	const { user } = useAppSelector(state => state.auth)

	// const location = useLocation()
	setTimeout(() => {
		console.log(restrictedTo);
		
		if (user === null) {
			console.log("User is null, redirecting to login...");
			
			return <Navigate to='/authentication/login' state={{ from: location.pathname }} replace />;
		} 
	}, 500);

	if (user) {

		console.log("User type:", user.type);
		
		// if (!restrictedTo.includes(user.type)) {
		// 	return <Navigate to='/pages/notfound' replace />;
		// } 

		// if (!user.emailVerified) {
		// 	return <Navigate to='/onboarding/email' replace />;
		// }

		// if (!user.phoneVerified) {
		// 	return <Navigate to='/onboarding/phone' replace />;
		// }
		// if (!user.isActive) {
		// 	return <Navigate to='/onboarding/account-inactive' replace />;
		// }

		// if (user.mustOnboardWithStripe) {
		// 	return <Navigate to='/onboarding/stripe' replace />;
		// }

		// if (user.mustChangePassword) {
		// 	return <Navigate to='/auth/change-password' replace />;
		// }

		return <Outlet />;
	}

};

export const EnsureGuest = () => {
	const { user } = useAppSelector(state => state.auth);
	const location = useLocation();
		console.log("At the login page");

	if (user) {
		const from = location.state?.from?.pathname || '/pages/customer/home';
		return user.type === "system"
			? <Navigate to="/pages/admin" replace />
			: <Navigate to={from} replace state={{ from: location }} />;
	}

	return <Outlet />;
};

export const EnsureMustVerify = () => {
	const { user } = useAppSelector(state => state.auth)

	const navigate = useNavigate()

	setTimeout(() => {
		if (!user) {
			navigate("/authentication/login")
			// return <Navigate to='/authentication/loginy' replace />;
		}
	}, 500);

	if (user) {

		// if (user.emailVerified && user.phoneVerified && !user.mustOnboardWithStripe && user.isActive) {
		// 	if (user.type === 'Individual' || user.type === 'Business') {
		// 		return <Navigate to='/pages/packer/home' replace />;
		// 	}

		// 	if (user.type === 'Client') {
		// 		return <Navigate to='/pages/client/home' replace />;
		// 	}
		// }

		return <Outlet />;

	}

};
export const EnsurePasswordResetConfirmation = () => {
	const { passwordReset } = useAppSelector(state => state.auth)

	// const navigate = useNavigate()

	// const dispatch = useAppDispatch()

	// setTimeout(() => {
	// 	if (!passwordReset) {
	// 		navigate("/recovery/confirm-password-reset")
	// 		// return <Navigate to='/authentication/loginy' replace />;
	// 	}
	// }, 500);


	if (!passwordReset) {
		return <Navigate to='/authentication/forgot-password' replace />;
	}

	if (passwordReset.mustConfirm === false || (new Date(passwordReset.expiresAt) < new Date())) {
		// dispatch(clearPassworResetStatus())
		return <Navigate to='/authentication/forgot-password' replace />;
	}

	return <Outlet />

};


