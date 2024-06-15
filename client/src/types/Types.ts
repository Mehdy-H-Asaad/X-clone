export type CommentProps = {
	_id: string;
	text: string;
	user: {
		username: string;
		profileImg?: string;
		fullname: string;
	};
};

export type PostProps = {
	_id: string;
	text: string;
	img?: string;
	user: {
		_id: any;
		username: string;
		profileImg: string;
		fullName: string;
	};
	comments: CommentProps[];
	likes: string[];
};

export type UserProps = {
	_id: string;
	username: string;
	profileImg: string;
	fullname: string;
};

export type CreatePostProps = {
	img?: string | ArrayBuffer | null;
	text: string;
};
