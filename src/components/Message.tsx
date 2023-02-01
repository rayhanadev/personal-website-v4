import { zodResolver } from '@hookform/resolvers/zod';
import { useStore } from '@nanostores/react';
import React, { useEffect, useId, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import user from '@stores/Auth';
import expanded from '@stores/Expanded';

import { sendMessage } from '@libs/useMessage';

type FormType = {
	message: string;
};

const zodSchema = z.object({
	message: z
		.string({
			required_error: 'Tell me something!',
			invalid_type_error: "That doesn't look like a string to me...",
		})
		.min(5)
		.max(200),
});

const Message: React.FC = () => {
	const [disabled, setDisabled] = useState(false);

	const $expanded = useStore(expanded);
	const $user = useStore(user);

	const messageId = useId();
	const inputRef = useRef<HTMLInputElement>(null);

	const { register, handleSubmit, formState, reset, getValues, setFocus } =
		useForm({
			resolver: zodResolver(zodSchema),
		});

	const processForm = async (data: FormType) => {
		if (disabled === false) {
			setDisabled(true);

			await sendMessage($user, data.message);

			expanded.set('none');
			setFocus(null);
			setDisabled(false);
		}
	};

	useEffect(() => {
		if (formState.isSubmitSuccessful) reset();
	}, [formState, reset]);

	return (
		<form
			onSubmit={handleSubmit(processForm)}
			className={`flex flex-row flex-nowrap justify-between items-end gap-4 w-full ${
				$expanded === 'message' ? '' : 'basis-1/2'
			} ${$expanded === 'wave' ? 'hidden' : ''}`}
		>
			<div className="flex flex-col flex-nowrap justify-start items-start gap-0 w-full">
				{$expanded === 'message' && (
					<div className="flex flex-row flex-nowrap justify-between items-center w-full">
						<label htmlFor={messageId} className="mt-2 my-0 py-0">
							Message
						</label>
						<p className="text-accentNegative-default">
							{formState?.errors?.message
								? (formState?.errors?.message
										?.message as string)
								: ''}
						</p>
					</div>
				)}
				<input
					{...register('message')}
					onFocus={() => expanded.set('message')}
					onBlur={() => {
						if (getValues('message').length === 0) {
							reset();
							expanded.set('none');
						}
					}}
					onInput={() => expanded.set('message')}
					id={messageId}
					name="message"
					placeholder="Custom Message"
					readOnly={disabled}
					className={`transition-all duration-300 bg-background-dimmer border border-outline-dimmest outline-none active:bg-background-dimmest active:border-outline-default focus:bg-background-dimmest focus:border-outline-default px-4 py-2 mt-1 mb-2 rounded-lg cursor-pointer w-full ${
						$expanded === 'message' ? 'text-left' : 'text-center'
					} ${$expanded === 'wave' ? 'hidden' : 'block'}`}
				/>
			</div>
			{$expanded === 'message' && (
				<input
					type="submit"
					value="Send"
					className="bg-background-dimmer border border-outline-dimmest outline-none active:bg-background-dimmest active:border-outline-default focus:bg-background-dimmest focus:border-outline-default px-4 py-2 my-2 rounded-lg cursor-pointer flex-none w-auto transition-all duration-300 disabled:bg-opacity-50 disabled:cursor-not-allowed"
					disabled={disabled}
				/>
			)}
		</form>
	);
};

export default Message;
