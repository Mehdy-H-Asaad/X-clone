import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { PostProps } from "../../types/Types";
import { useGetPosts } from "../../utils/lib/React Query/QueriesAndMutations/PostQueries";

const Posts = ({
	feedType,
	username,
	userId,
}: {
	feedType: string;
	username?: string | undefined;
	userId?: string;
}) => {
	const getPostsEndPoint = () => {
		switch (feedType) {
			case "forYou":
				return "/api/posts/allposts";
			case "following":
				return "/api/posts/followingposts";
			case "profilePosts":
				return `/api/posts/userposts/${username}`;
			case "likedPosts":
				return `/api/posts/likedposts/${userId}`;
			default:
				return "/api/posts/allposts";
		}
	};

	const POSTS_ENDPOINT = getPostsEndPoint();
	const { posts, isLoading, isRefetching } = useGetPosts(
		feedType,
		POSTS_ENDPOINT
	);

	return (
		<>
			{(isLoading || isRefetching) && (
				<div className="flex flex-col justify-center">
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && !isRefetching && posts?.length === 0 && (
				<p className="text-center my-4">No posts in this tab. Switch 👻</p>
			)}
			{!isLoading && !isRefetching && posts && (
				<div>
					{posts.map((post: PostProps) => (
						<Post key={post._id} post={post} feedType={feedType} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;
