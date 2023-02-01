import { User } from '@stores/Auth';

export const sendMessage = async (
	user: User,
	text: string,
): Promise<boolean> => {
	try {
		const response = await fetch('/api/guestbook', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				username: user.name,
				url: user.url,
				image: user.profileImage,
				message: text,
			}),
		});
		if (response.status === 200) {
			return true;
		}

		return false;
	} catch (error: any) {
		throw new Error('Could not POST /api/guestbook, an error occured.', {
			cause: error,
		});
	}
};
