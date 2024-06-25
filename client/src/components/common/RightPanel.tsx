import { Link } from "react-router-dom";
import RightPanelSkeleton from "../skeletons/RightPanelSkeletons";
import { UserProps } from "../../types/Types";
import { useFollow } from "../../utils/lib/React Query/QueriesAndMutations/UserQueries";
import LoadingSpinner from "./LoadingSpinner";
import { useSuggestedUsers } from "../../utils/lib/React Query/QueriesAndMutations/UserQueries";
const RightPanel = () => {
	const { isLoading, suggestedUsers, refetch, isRefetching } =
		useSuggestedUsers();
	const { followUnFollow, isPending } = useFollow();

	const handleFollow = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		id: string
	) => {
		e.preventDefault();
		followUnFollow(id);
	};

	return (
		<div className="hidden lg:block my-4 mx-2">
			<div className="bg-[#16181C] p-4 rounded-md sticky top-2">
				<p className="font-bold">Who to follow</p>
				<div className="flex flex-col gap-4">
					{(isLoading || isRefetching) && (
						<>
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
						</>
					)}

					{!isLoading &&
						!isRefetching &&
						suggestedUsers?.map((user: UserProps) => (
							<Link
								to={!isRefetching ? `/profile/${user.username}` : "#s"}
								className="flex items-center justify-between gap-4"
								key={user._id}
								onClick={() => refetch()}
							>
								<div className="flex gap-2 items-center">
									<div className="avatar">
										<div className="w-8 rounded-full">
											<img src={user.profileImg || "/avatar-placeholder.png"} />
										</div>
									</div>
									<div className="flex flex-col">
										<span className="font-semibold tracking-tight truncate w-28">
											{user.fullname}
										</span>
										<span className="text-sm text-slate-500">
											@{user.username}
										</span>
									</div>
								</div>
								<div>
									<button
										className="btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm"
										onClick={e => handleFollow(e, user._id)}
									>
										{isPending ? <LoadingSpinner size="sm" /> : "Follow"}
									</button>
								</div>
							</Link>
						))}
				</div>
			</div>
		</div>
	);
};
export default RightPanel;
