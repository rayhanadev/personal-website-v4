import { useStore } from '@nanostores/react';
import React from 'react';

import user from '@stores/Auth';
import expanded from '@stores/Expanded';

import { sendMessage } from '@libs/useMessage';

const Wave: React.FC = () => {
	const $expanded = useStore(expanded);
	const $user = useStore(user);

	const sendWave = async () => {
		expanded.set('wave');

		const responses = [
			'Hello! 👋',
			'Hiya! 👋',
			'Hey there! 👋',
			'Howdy! 👋',
			'Greetings! 👋',
		];

		await sendMessage(
			$user,
			responses[Math.floor(Math.random() * (responses.length - 1))],
		);

		setTimeout(() => {
			expanded.set('none');
		}, 5000);
	};

	return (
		<button
			className={`bg-background-dimmer border border-outline-dimmest outline-none active:bg-background-dimmest active:border-outline-default focus:bg-background-dimmest focus:border-outline-default px-4 py-2 my-2 rounded-lg cursor-pointer ${
				$expanded === 'wave' ? '' : 'basis-1/2'
			} ${$expanded === 'wave' ? 'w-full animate-pulse' : 'w-auto'} ${
				$expanded === 'message' ? 'hidden' : 'block'
			}`}
			onClick={() =>
				$expanded === 'message' ? expanded.set('none') : sendWave()
			}
			disabled={$expanded === 'wave'}
		>
			{$expanded === 'message' ? '👋' : '👋 Say Hello'}
		</button>
	);
};

export default Wave;
