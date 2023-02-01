import { handler as middleware } from '../dist/server/entry.mjs';

export const handler = async (req, res, next) => {
	const response = await middleware(req, res, next);
	return response;
};
