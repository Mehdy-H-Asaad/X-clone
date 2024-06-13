import { Routes, Route } from "react-router-dom";
import Signup from "./pages/auth/signup/Signup";
import Login from "./pages/auth/login/Login";
import HomePage from "./pages/Home/HomePage";
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";
import NotificationPage from "./pages/Notifications/NotificationPage";
import ProfilePage from "./pages/Profile/ProfilePage";

function App() {
	return (
		<div className="flex max-w-6xl mx-auto">
			<Sidebar />
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/signup" element={<Signup />} />
				<Route path="/login" element={<Login />} />
				<Route path="/notifications" element={<NotificationPage />} />
				<Route path="/profile/:username" element={<ProfilePage />} />
			</Routes>
			<RightPanel />
		</div>
	);
}

export default App;
