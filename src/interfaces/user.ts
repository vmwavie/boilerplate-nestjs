type UserInterface = {
	id?: number;
	name: string;
	email: string;
	passwordHash?: string;
	role: string;
	photo?: string;
	verifyToken: string;
};

type RegisterUserQuery = {
	name: string;
	email: string;
	password: string;
	verifyToken: string;
};

export type {UserInterface, RegisterUserQuery};

