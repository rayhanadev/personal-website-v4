import Client from '@replit/database';
import type { APIRoute } from 'astro';

// @ts-ignore: @replit/database has incorrect typings
const db = new Client();

export const get: APIRoute = async ({ request }) => {
	if (!request.headers.get('x-replit-user-name')) {
		return new Response('Not authenticated.', {
			status: 401,
			headers: { 'Content-Type': 'text/plain' },
		});
	}

	if (request.headers.get('x-replit-user-name') !== 'RayhanADev') {
		return new Response('Not allowed.', {
			status: 401,
			headers: { 'Content-Type': 'text/plain' },
		});
	}

	try {
		await db.empty();

		const body = JSON.stringify({
			success: true,
		});

		return new Response(body, {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error: any) {
		console.log(error);
		return new Response('Internal server error.', {
			status: 500,
			headers: { 'Content-Type': 'text/plain' },
		});
	}
};
