export type CommentProps = {
	_id: string;
	text: string;
	user: {
		username: string;
		profileImg: string;
		fullName: string;
	};
};

export type PostProps = {
	_id: string;
	text: string;
	img?: string;
	user: {
		username: string;
		profileImg: string;
		fullName: string;
	};
	comments: CommentProps[];
	likes: string[];
};
