import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { QUERY_KEYS } from "../QueryKeys";
import {
	CommentProps,
	CreatePostProps,
	PostProps,
} from "../../../../types/Types";

export const useDeletePost = (postId: string) => {
	const queryClient = useQueryClient();
	const { mutate: deletePost, isPending: isDeleting } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch(`/api/posts/${postId}`, {
					method: "DELETE",
				});

				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Something went wrong");
				return data;
			} catch (error: any) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			toast.success("Post deleted successfully");
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.POSTS] });
		},
	});

	return { deletePost, isDeleting };
};

export const useLikePost = (postId: string, feedType: string) => {
	const queryClient = useQueryClient();
	const { mutate: likePost, isPending: isLiking } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch(`/api/posts/like/${postId}`, {
					method: "POST",
				});
				const data = await res.json();

				if (!res.ok) throw new Error(data.error || "Something went wrong");

				return data;
			} catch (error: any) {
				throw new Error(error);
			}
		},

		onSuccess: updatedLikes => {
			// setComment("");
			// queryClient.invalidateQueries({ queryKey: ["posts"] }); NOT GOOD APPROACH !!!!

			if (feedType == "likedPosts") {
				queryClient.setQueryData(
					[QUERY_KEYS.POSTS, "likedPosts"],
					(oldLikedPosts: PostProps[]) => {
						return oldLikedPosts?.filter(likedPost => likedPost._id !== postId);
					}
				);
				return;
			}

			queryClient.setQueryData(
				[QUERY_KEYS.POSTS, feedType],
				(oldPostData: PostProps[]) => {
					return oldPostData.map(currentPostData => {
						if (currentPostData._id === postId)
							return { ...currentPostData, likes: updatedLikes };
						return currentPostData;
					});
				}
			);
		},
	});

	return { likePost, isLiking };
};

export const useCommentOnPost = (
	postId: string,
	feedType: string,
	comment: string
) => {
	const queryClient = useQueryClient();

	const { mutate: commentOnPost, isPending: isCommenting } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch(`/api/posts/comment/${postId}`, {
					method: "POST",
					headers: {
						"Content-type": "application/json",
					},
					body: JSON.stringify({ text: comment }),
				});

				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Something went wrong");
				return data;
			} catch (error: any) {
				throw new Error(error.message);
			}
		},
		onSuccess: (updatedComments: CommentProps[]) => {
			queryClient.setQueryData(
				[QUERY_KEYS.POSTS, feedType],
				(oldPostData: PostProps[]) => {
					if (!oldPostData) return;
					return oldPostData.map((currentPostData: PostProps) => {
						if (currentPostData._id === postId)
							return { ...currentPostData, comments: updatedComments };
						return currentPostData;
					});
				}
			);
		},

		onError: (error: any) =>
			toast.error(error.message || "Something went wrong"),
	});
	return { commentOnPost, isCommenting };
};

export const useGetPosts = (feedType: string, POSTS_ENDPOINT: string) => {
	const {
		data: posts,
		isLoading,
		isRefetching,
	} = useQuery({
		queryKey: [QUERY_KEYS.POSTS, feedType],
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

	return { posts, isLoading, isRefetching };
};

export const useCreatePost = () => {
	const queryClient = useQueryClient();
	const {
		mutate: createPost,
		isPending,
		error,
		isError,
	} = useMutation({
		mutationFn: async ({ img, text }: CreatePostProps) => {
			try {
				const res = await fetch("/api/posts/create", {
					method: "POST",
					headers: {
						"Content-type": "application/json",
					},
					body: JSON.stringify({ img, text }),
				});

				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Something went wrong");
				return data;
			} catch (error: any) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			toast.success("Added new post");
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.POSTS] });
		},
	});
	return { createPost, isError, error, isPending };
};
