import React from 'react';
import useSWR from 'swr';

type ItemProps = {
	image: string;
	username: string;
	url: string;
	message: string;
};

const Item: React.FC<ItemProps> = ({ image, username, url, message }) => {
	return (
		<figure className="bg-background-dimmer py-2 rounded-md px-4 flex flex-row flex-nowrap justify-start items-center w-full gap-4">
			<img
				src={image}
				width={48}
				height={48}
				className="rounded-full aspect-square object-cover"
				loading="lazy"
			/>
			<summary className="flex flex-col flex-nowrap justify-start items-start">
				<header className="transition-all duration-300 underline hover:decoration-accentPrimary-default">
					<a href={url}>@{username}</a>
				</header>
				<p>{message}</p>
			</summary>
		</figure>
	);
};

const ItemSkeleton: React.FC = () => {
	return (
		<figure className="bg-background-dimmer py-2 rounded-md px-4 flex flex-row flex-nowrap justify-start items-center w-full gap-4">
			<div className="rounded-full bg-background-dimmest animate-pulse w-12 h-12 flex-none"></div>
			<summary className="flex flex-col flex-nowrap justify-start items-start w-full gap-2">
				<div className="rounded bg-background-dimmest animate-pulse w-full h-5"></div>
				<div className="rounded bg-background-dimmest animate-pulse w-full h-3"></div>
			</summary>
		</figure>
	);
};

const Guestbook: React.FC = () => {
	const fetcher = (input: RequestInfo, init?: RequestInit) =>
		fetch(input, init).then((res) => res.json());
	const { data, error } = useSWR('/api/guestbook', fetcher, {
		refreshInterval: 1000,
	});

	return (
		<div className="flex flex-col flex-nowrap justify-start items-center w-full gap-4">
			{data &&
				data.items.map((props: ItemProps, index: number) => (
					<Item {...props} key={index} />
				))}
			{!data && (
				<React.Fragment>
					<ItemSkeleton />
					<ItemSkeleton />
					<ItemSkeleton />
					<ItemSkeleton />
					<ItemSkeleton />
					<ItemSkeleton />
				</React.Fragment>
			)}
			{error && (
				<p className="text-accentNegative-default">
					There was an error fetching guestbook pages. Please refresh
					this page.
				</p>
			)}
		</div>
	);
};

export default Guestbook;
