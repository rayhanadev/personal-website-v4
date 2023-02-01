import Client from '@replit/database';
import type { APIRoute } from 'astro';
import Filter from 'bad-words';
import * as z from 'zod';
import { fromZodError } from 'zod-validation-error';

const filter = new Filter();

// @ts-ignore: @replit/database has incorrect typings
const db = new Client();

export const get: APIRoute = async ({ request }) => {
	try {
		const items = ((await db.get('items')) as []) || [];

		const body = JSON.stringify({ success: true, items });

		return new Response(body, {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error: any) {
		return new Response('Internal server error.', {
			status: 500,
			headers: { 'Content-Type': 'text/plain' },
		});
	}
};

const zodSchema = z.object({
	username: z.string({
		required_error: 'Username is required',
		invalid_type_error: 'Username must be a string',
	}),
	url: z
		.string({
			required_error: 'Url is required',
			invalid_type_error: 'Url must be a string',
		})
		.url(),
	image: z
		.string({
			required_error: 'Image is required',
			invalid_type_error: 'Image must be a string',
		})
		.url(),
	message: z
		.string({
			required_error: 'Message is required',
			invalid_type_error: 'Message must be a string',
		})
		.min(5)
		.max(200),
});

export const post: APIRoute = async ({ request }) => {
	if (!request.headers.get('x-replit-user-name')) {
		return new Response('Not authenticated.', {
			status: 401,
			headers: { 'Content-Type': 'text/plain' },
		});
	}

	try {
		const data = await request.json();

		try {
			zodSchema.parse(data);
		} catch (error: any) {
			const validationError = fromZodError(error);

			const body = JSON.stringify({
				error: validationError,
			});

			return new Response(body, {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		if (filter.isProfane(data.message)) {
			const body = JSON.stringify({
				error: 'Message contains profane language.',
			});

			return new Response(body, {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		const staleItems = ((await db.get('items')) as []) || [];
		const newItems = [data, ...staleItems];

		await db.set('items', newItems);

		const body = JSON.stringify({
			success: true,
			item: data,
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
