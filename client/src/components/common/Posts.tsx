import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import { PostProps } from "../../types/Types";

const Posts = ({ feedType }: { feedType: string }) => {
	const getPostsEndPoint = () => {
		switch (feedType) {
			case "forYou":
				return "api/posts/allposts";
			case "following":
				return "api/posts/followingposts";
			default:
				return "api/posts/allposts";
		}
	};

	const POSTS_ENDPOINT = getPostsEndPoint();
	const {
		data: posts,
		isLoading,
		isRefetching,
	} = useQuery({
		queryKey: ["posts", feedType],
		queryFn: async () => {
			try {
				const res = await fetch(POSTS_ENDPOINT);

				const data = await res.json();

				if (!res.ok) throw new Error(data.error || "Something went wrong");
				return data;
			} catch (error: any) {
				throw new Error(error);
			}
		},
	});

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
