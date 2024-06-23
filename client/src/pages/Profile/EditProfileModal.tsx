import { ChangeEvent, useEffect, useState } from "react";
import { UserProps, editProfileProps } from "../../types/Types";
import { useUpdateProfile } from "../../utils/lib/React Query/QueriesAndMutations/UserQueries";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const EditProfileModal = ({
	authUser,
}: {
	authUser: UserProps | undefined;
}) => {
	const [formData, setFormData] = useState<editProfileProps>({
		fullname: "",
		username: "",
		email: "",
		bio: "",
		link: "",
		newPassword: "",
		currentPassword: "",
	});

	const handleInputChange = (
		e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
	) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const openModal = () => {
		const modal = document.getElementById(
			"edit_profile_modal"
		) as HTMLDialogElement | null;
		if (modal) {
			modal.showModal();
		}
	};

	const { updateProfile, isUpdating } = useUpdateProfile();

	useEffect(() => {
		if (authUser) {
			setFormData({
				fullname: authUser.fullname,
				bio: authUser.bio,
				email: authUser.email,
				link: authUser.link,
				username: authUser.username,
				currentPassword: "",
				newPassword: "",
			});
		}
	}, []);

	return (
		<>
			<button
				className="btn btn-outline rounded-full btn-sm"
				onClick={openModal}
			>
				Edit profile
			</button>
			<dialog id="edit_profile_modal" className="modal">
				<div className="modal-box border rounded-md border-gray-700 shadow-md">
					<h3 className="font-bold text-lg my-3">
						{isUpdating ? <LoadingSpinner size="sm" /> : "Update profile"}
					</h3>
					<form
						className="flex flex-col gap-4"
						onSubmit={e => {
							e.preventDefault();
							updateProfile(formData);
						}}
					>
						<div className="flex flex-wrap gap-2">
							<input
								type="text"
								placeholder="Full Name"
								className="flex-1 input border border-gray-700 rounded p-2 input-md"
								value={formData.fullname}
								name="fullname"
								onChange={handleInputChange}
							/>
							<input
								type="text"
								placeholder="Username"
								className="flex-1 input border border-gray-700 rounded p-2 input-md"
								value={formData.username}
								name="username"
								onChange={handleInputChange}
							/>
						</div>
						<div className="flex flex-wrap gap-2">
							<input
								type="email"
								placeholder="Email"
								className="flex-1 input border border-gray-700 rounded p-2 input-md"
								value={formData.email}
								name="email"
								onChange={handleInputChange}
							/>
							<textarea
								placeholder="Bio"
								className="flex-1 input border border-gray-700 rounded p-2 input-md"
								value={formData.bio}
								name="bio"
								onChange={handleInputChange}
							/>
						</div>
						<div className="flex flex-wrap gap-2">
							<input
								type="password"
								placeholder="Current Password"
								className="flex-1 input border border-gray-700 rounded p-2 input-md"
								value={formData.currentPassword}
								name="currentPassword"
								onChange={handleInputChange}
							/>
							<input
								type="password"
								placeholder="New Password"
								className="flex-1 input border border-gray-700 rounded p-2 input-md"
								value={formData.newPassword}
								name="newPassword"
								onChange={handleInputChange}
							/>
						</div>
						<input
							type="text"
							placeholder="Link"
							className="flex-1 input border border-gray-700 rounded p-2 input-md"
							value={formData.link}
							name="link"
							onChange={handleInputChange}
						/>
						<button className="btn btn-primary rounded-full btn-sm text-white">
							Update
						</button>
					</form>
				</div>
				<form method="dialog" className="modal-backdrop">
					<button className="outline-none">close</button>
				</form>
			</dialog>
		</>
	);
};
export default EditProfileModal;
