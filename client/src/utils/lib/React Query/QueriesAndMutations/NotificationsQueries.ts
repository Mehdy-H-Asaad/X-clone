import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NotificationsProps } from "../../../../types/Types";
import toast from "react-hot-toast";
import { QUERY_KEYS } from "../QueryKeys";

export const useGetNotifications = () => {
	const { data: getNotifications, isLoading } = useQuery<NotificationsProps[]>({
		queryKey: [QUERY_KEYS.NOTIFICATIONS],
		queryFn: async () => {
			try {
				const res = await fetch("/api/notifications");
				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Something went wrong");
				return data;
			} catch (error: any) {
				throw new Error(error);
			}
		},
	});
	return { getNotifications, isLoading };
};

export const useDeleteNotifications = () => {
	const queryClient = useQueryClient();
	const { mutate: deleteNotifications } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch("/api/notifications", {
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
			toast.success("Delete Notifications successfully");
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
		},
	});

	return { deleteNotifications };
};
