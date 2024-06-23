import XSvg from "../svgs/X";

import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";

import {
	useAuthUser,
	useLogOut,
} from "../../utils/lib/React Query/QueriesAndMutations/AuthQueries";

const Sidebar = () => {
	const { logout } = useLogOut();

	const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
		e.preventDefault();
		logout();
	};

	const { AuthorizedUser } = useAuthUser();

	return (
		<div className="md:flex-[2_2_0] w-18 max-w-52">
			<div className="sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full">
				<Link to="/" className="flex justify-center md:justify-start">
					<XSvg className="px-2 w-12 h-12 rounded-full fill-white hover:bg-stone-900" />
				</Link>
				<ul className="flex flex-col gap-3 mt-4">
					<li className="flex justify-center md:justify-start">
						<Link
							to="/"
							className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
						>
							<MdHomeFilled size={32} />
							<span className="text-lg hidden md:block">Home</span>
						</Link>
					</li>
					<li className="flex justify-center md:justify-start">
						<Link
							to="/notifications"
							className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
						>
							<IoNotifications size={24} />
							<span className="text-lg hidden md:block">Notifications</span>
						</Link>
					</li>

					<li className="flex justify-center md:justify-start">
						<Link
							to={`/profile/${AuthorizedUser?.username}`}
							className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
						>
							<FaUser size={24} />
							<span className="text-lg hidden md:block">Profile</span>
						</Link>
					</li>
				</ul>
				{AuthorizedUser && (
					<Link
						to={`/profile/${AuthorizedUser.username}`}
						className="mt-auto mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-[#181818] py-2 px-4 rounded-full"
					>
						<div className="avatar hidden md:inline-flex">
							<div className="w-8 rounded-full">
								<img
									src={AuthorizedUser?.profileImg || "/avatar-placeholder.png"}
								/>
							</div>
						</div>
						<div className="flex justify-between flex-1 items-center">
							<div className="hidden md:block">
								<p className="text-white font-bold text-sm w-20 truncate">
									{AuthorizedUser?.fullname}
								</p>
								<p className="text-slate-500 text-sm">
									@{AuthorizedUser?.username}
								</p>
							</div>
							<div onClick={handleClick}>
								<BiLogOut size={20} />
							</div>
						</div>
					</Link>
				)}
			</div>
		</div>
	);
};
export default Sidebar;
