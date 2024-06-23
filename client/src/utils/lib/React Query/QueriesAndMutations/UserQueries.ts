import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserProps } from "../../../../types/Types";
import toast from "react-hot-toast";
import { QUERY_KEYS } from "../QueryKeys";

export const useSuggestedUsers = () => {
	const { data: suggestedUsers, isLoading } = useQuery<UserProps[]>({
		queryKey: [QUERY_KEYS.SUGGESTED_USERS],
		queryFn: async () => {
			try {
				const res = await fetch("/api/users/suggested");

				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Something went wrong");
				return data;
			} catch (error: any) {
				throw new Error(error);
			}
		},
	});
	return { suggestedUsers, isLoading };
};

export const useFollow = () => {
	const queryClient = useQueryClient();
	const { mutate: followUnFollow, isPending } = useMutation({
		mutationFn: async (id: string) => {
			try {
				const res = await fetch(`/api/users/follow/${id}`, {
					method: "POST",
				});

				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Something went wrong");
				return data;
			} catch (error: any) {
				throw new Error(error);
			}
		},

		onSuccess: () => {
			toast.success("followed");

			Promise.all([
				queryClient.invalidateQueries({
					queryKey: [QUERY_KEYS.SUGGESTED_USERS],
				}),
				queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.AUTH_USER] }),
			]);
		},
		onError: (error: any) => {
			toast.error(error);
		},
	});

	return { isPending, followUnFollow };
};

export const useGetUserProfile = (username: string | undefined) => {
	const {
		data: user,
		isLoading,
		isRefetching,
		refetch,
	} = useQuery({
		queryKey: [QUERY_KEYS.USER_PROFILE],
		queryFn: async () => {
			try {
				const res = await fetch(`/api/users/profile/${username}`);

				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Someting went wrong");

				return data;
			} catch (error: any) {
				throw new Error(error);
			}
		},
	});

	return { user, isLoading, isRefetching, refetch };
};

export const useGetUserProfilePosts = (username: string | undefined) => {
	const {
		data: userPosts,
		refetch: refetchUserPosts,
		isRefetching: isRefetchingPosts,
		isPending,
	} = useQuery({
		queryKey: ["profilePosts"],
		queryFn: async () => {
			try {
				const res = await fetch(`/api/posts/userposts/${username}`);
				const data = await res.json();

				if (!res.ok) throw new Error(data.error || "Something went wrong");
				return data;
			} catch (error: any) {
				throw new Error(error.message);
			}
		},
	});

	return { userPosts, refetchUserPosts, isPending, isRefetchingPosts };
};
