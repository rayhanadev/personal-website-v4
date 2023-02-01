import Router from '@koa/router';
import { morgan } from '@ts-koa/koa-morgan';
import Koa from 'koa';
import cors from 'koa2-cors';
import cash from 'koa-cash';
import m from 'koa-connect';
import compress from 'koa-compress';
import helmet from 'koa-helmet';
import serve from 'koa-static';
import LRU from 'lru-cache';

import path from 'node:path';

import { handler as ssrHandler } from './utils/astro.mjs';
import contentSecurityPolicy from './utils/contentSecurityPolicy.mjs';
import { handler as imageHandler } from './utils/imagetools.mjs';

const app = new Koa();

app.use(morgan(':status :method :url - :response-time ms'));

app.use(cors());
app.use(
	helmet.contentSecurityPolicy({
		useDefaults: false,
		directives: contentSecurityPolicy,
	}),
);
app.use(helmet.crossOriginOpenerPolicy({ policy: 'same-origin-allow-popups' }));
app.use(helmet.crossOriginResourcePolicy({ policy: 'same-site' }));
app.use(helmet.hsts());
app.use(helmet.noSniff());
app.use(helmet.originAgentCluster());
app.use(helmet.ieNoOpen());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.xssFilter());

const cache = new LRU({
	ttl: 1000 * 60 * 60 * 4,
	max: 50,
	maxSize: 5000,
});

app.use(
	cash({
		get: (key) => cache.get(key),
		set: (key, value) => cache.set(key, value),
	}),
);

app.use(compress());

app.use(serve(path.join(process.cwd(), 'dist/', 'client/')));

const _ = new Router();

_.get('/db', async (ctx) => {
	ctx.body = JSON.stringify({
		url: process.env.REPLIT_DB_URL,
	});
});

app.use(_.routes()).use(_.allowedMethods());

app.use(async (ctx) => {
	if (await ctx.cashed()) return;
	return await m(ssrHandler)(ctx);
});
app.use(m(imageHandler));

app.listen(3000);
