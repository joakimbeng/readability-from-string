'use strict';
const url = require('url');
const jsdom = require('jsdom').jsdom;
const readability = require('readability-node');

const Readability = readability.Readability;

module.exports = exports = function (html, options) {
	options = options || {};
	if (!options.href) {
		throw new Error('Missing href option!');
	}
	const uri = url.parse(options.href);
	const doc = jsdom(html.trim(), {
		features: {
			FetchExternalResources: false,
			ProcessExternalResources: false
		}
	});
	const readabilityUrl = toReadabilityUrl(uri);
	const reader = new Readability(readabilityUrl, doc);
	return reader.parse();
};

function toReadabilityUrl(uri) {
	return {
		spec: uri.href,
		host: uri.host,
		prePath: `${uri.protocol}//${uri.host}`,
		scheme: uri.protocol.slice(0, -1),
		pathBase: `${uri.protocol}//${uri.host}${uri.pathname.substring(0, uri.pathname.lastIndexOf('/') + 1)}`
	};
}
