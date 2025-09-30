import { Request } from 'express';
import session from 'express-session';

export interface SessionUser {
	_id: string;
	email?: string;
	password?: string;
}

declare module 'express-session' {
	interface SessionData {
		user?: SessionUser;
	}
}

export interface RequestWithUser extends Request {
	session: session.Session & Partial<session.SessionData>;
}
