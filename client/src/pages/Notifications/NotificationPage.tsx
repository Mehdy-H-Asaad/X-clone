import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import {
	useDeleteNotifications,
	useGetNotifications,
} from "../../utils/lib/React Query/QueriesAndMutations/NotificationsQueries";

const NotificationPage = () => {
	// GET ALL NOTIFICATIONS
	const { getNotifications, isLoading } = useGetNotifications();

	// DELETE ALL NOTIFICATIONS
	const { deleteNotifications } = useDeleteNotifications();

	const handleDeleteNotifications = () => deleteNotifications();

	return (
		<>
			<div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
				<div className="flex justify-between items-center p-4 border-b border-gray-700">
					<p className="font-bold">Notifications</p>
					<div className="dropdown ">
						<div tabIndex={0} role="button" className="m-1">
							<IoSettingsOutline size={16} />
						</div>
						<ul
							tabIndex={0}
							className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
						>
							<li>
								<a onClick={handleDeleteNotifications}>
									Delete all notifications
								</a>
							</li>
						</ul>
					</div>
				</div>
				{isLoading && (
					<div className="flex justify-center h-full items-center">
						<LoadingSpinner size="lg" />
					</div>
				)}
				{getNotifications?.length === 0 && (
					<div className="text-center p-4 font-bold">No notifications 🤔</div>
				)}
				{getNotifications?.map(notification => (
					<div className="border-b border-gray-700" key={notification._id}>
						<div className="flex gap-2 p-4">
							{notification.type === "follow" && (
								<div className="text-primary">
									<FaUser size={28} />
								</div>
							)}
							{notification.type === "like" && (
								<div className="text-red-500">
									<FaHeart size={28} />
								</div>
							)}
							<Link to={`/profile/${notification.sender?.username}`}>
								<div className="avatar">
									<div className="w-8 rounded-full">
										<img
											src={
												notification.reciver?.profileImg ||
												"/avatar-placeholder.png"
											}
										/>
									</div>
								</div>
								<div className="flex gap-1">
									<span className="font-bold">
										@{notification.sender?.username}
									</span>{" "}
									{notification.type === "follow"
										? "followed you"
										: "liked your post"}
								</div>
							</Link>
						</div>
					</div>
				))}
			</div>
		</>
	);
};
export default NotificationPage;
