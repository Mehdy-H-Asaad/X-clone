import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/auth/signup/Signup";
import Login from "./pages/auth/login/Login";
import HomePage from "./pages/Home/HomePage";
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";
import NotificationPage from "./pages/Notifications/NotificationPage";
import ProfilePage from "./pages/Profile/ProfilePage";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";

function App() {
	const { data: AuthorizedUser, isLoading } = useQuery({
		queryKey: ["authorizedUser"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/auth/authuser");
				const data = await res.json();
				// if (data.error) return null;
				if (!res.ok) throw new Error(data.error || "Something went wrong");
				return data;
			} catch (error: any) {
				throw new Error(error);
			}
		},
		retry: false,
	});

	if (isLoading)
		return (
			<div className="flex h-screen justify-center items-center">
				<LoadingSpinner size="lg" />
			</div>
		);

	return (
		<div className="flex max-w-6xl mx-auto">
			{AuthorizedUser && <Sidebar />}
			<Routes>
				<Route
					path="/"
					element={AuthorizedUser ? <HomePage /> : <Navigate to={"/login"} />}
				/>
				<Route
					path="/signup"
					element={!AuthorizedUser ? <Signup /> : <Navigate to={"/"} />}
				/>
				<Route
					path="/login"
					element={!AuthorizedUser ? <Login /> : <Navigate to={"/"} />}
				/>
				<Route
					path="/notifications"
					element={
						AuthorizedUser ? <NotificationPage /> : <Navigate to={"/login"} />
					}
				/>
				<Route
					path="/profile/:username"
					element={
						AuthorizedUser ? <ProfilePage /> : <Navigate to={"/login"} />
					}
				/>
			</Routes>
			{AuthorizedUser && <RightPanel />}
			<Toaster />
		</div>
	);
}

export default App;
