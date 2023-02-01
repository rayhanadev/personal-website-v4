import node from '@astrojs/node';
import partytown from '@astrojs/partytown';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import compress from 'astro-compress';
import critters from 'astro-critters';
import { astroImageTools } from 'astro-imagetools';
import robotsTxt from 'astro-robots-txt';
import serviceWorker from 'astrojs-service-worker';
import webmanifest from 'astro-webmanifest';
import { defineConfig } from 'astro/config';

import vite from './vite.config.mjs';

// https://astro.build/config
const baseUrl = `https://www.furret.dev`;

// https://astro.build/config
export default defineConfig({
	vite,
	site: baseUrl,
	output: 'server',
	server: {
		port: 3000,
		host: true,
	},
	adapter: node({
		mode: 'middleware',
	}),
	integrations: [
		serviceWorker(),
		tailwind({
			config: {
				path: './tailwind.config.mjs',
			},
		}),
		react(),
		partytown(),
		compress({
			logger: 1,
		}),
		sitemap({
			customPages: [
				`${baseUrl}/`,
				`${baseUrl}/skillset`,
				`${baseUrl}/guestbook`,
			],
		}),
		robotsTxt({
			policy: [
				{
					userAgent: '*',
					allow: '/',
					disallow: ['/guestbook'],
					crawlDelay: 2,
				},
			],
		}),
		webmanifest({
			name: 'Ray Arayilakath',
			short_name: 'Ray Arayilakath',
			icon: './public/logo.svg',
			icons: [
				{
					src: './public/android-chrome-192x192.png',
					sizes: '192x192',
					type: 'image/png',
					purpose: 'any',
				},
				{
					src: './public/android-chrome-512x512.png',
					sizes: '512x512',
					type: 'image/png',
					purpose: 'any',
				},
				{
					src: './public/maskable-192x192.png',
					sizes: '192x192',
					type: 'image/png',
					purpose: 'maskable',
				}
			],
			description:
				'A teen Fullstack Web Developer and Software Engineer based in the Dallas Fort-Worth Area in Texas. With over 3 years of experience creating a variety of tools and websites for different organizations, I am a highly capable and talented developer.',
			lang: 'en-US',
			start_url: '/',
			theme_color: '#14131E',
			background_color: '#14131E',
			display: 'standalone',
			config: {
				outfile: 'manifest.json',
				indent: '',
				eol: '',
				insertManifestLink: false,
			},
		}),
		astroImageTools,
		critters({
			logger: 1,
		}),
	],
});
