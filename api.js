// Scroll down a bit to see public API

var config = {
	baseUrl: 'https://api.guildwars2.com/v1/',
	cacheTime: 1800,
	cacheFile: null,
	debug: true,
	api : {
		events: 'events.json',
		eventNames: 'event_names.json',
		eventDetails: 'event_details.json',
		mapNames: 'map_names.json',
		worldNames: 'world_names.json',
		wvwMatches: 'wvw/matches.json',
		wvwMatchDetails: 'wvw/match_details.json',
		wvwObjectiveNames: 'wvw/objective_names.json',
		items: 'items.json',
		itemDetails: 'item_details.json',
		recipes: 'recipes.json',
		recipeDetails: 'recipe_details.json',
		guildDetails: 'guild_details.json',
		build: 'build.json',
		colors: 'colors.json',
		files: 'files.json',
		continents: 'continents.json',
		maps: 'maps.json',
		map_floor: 'map_floor.json',
	},
};

// Fully load api into config; allows for per-uri cache times
for (var apiKey in config.api) {
	config.api[apiKey] = {
		uri: config.api[apiKey],
		cacheTime: config.cacheTime,
	};
}

// Set up the cache to work with or without a file; defaults to without
var fs = null;
var cache = function() {
	var container = {};

	return {
		get: function(key) {
			return container[key];
		},

		set: function(key, value) {
			container[key] = value;
			if (config.cacheFile !== null) {
				fs.writeFile(config.cacheFile, JSON.stringify(container), function(err) {
					if (err) throw err;
				});
			}
		},

		load: function(obj) {
			container = obj;
		},
	};
}();

var Gw2ApiLibException = function(message) {
	this.message = message;
	this.name = 'Gw2ApiLibException';
};

// For easily making HTTP request to API
var request = require('request');

// For converting JS object to URI params
var querystring = require('querystring');

// Invokes callback on requested JSON after it is retrieved via GET/cache; throws Gw2ApiLibException if there are bad arguments or an error accessing API
var apiRequest = function(apiKey, options, callback, bypassCache) {
	// Using argument structure [apiKey, callback]
	if ((typeof callback === 'undefined' || typeof callback === 'boolean') && typeof options === 'function') {
		// Using argument structure [apiKey, callback, bypassCache]
		if (typeof callback === 'boolean' && typeof bypassCache === 'undefined') {
			bypassCache = callback;
		}
		callback = options;
		options = null;
	}
	if (typeof apiKey === 'undefined' || typeof callback === 'undefined' || (typeof options !== 'undefined' && typeof options !== 'object')) {
		throw new Gw2ApiLibException('Bad arguments for apiRequest. Make sure all arguments are valid. Arguments: ' + JSON.stringify(arguments));
	}

	// Time to update and recache
	if (bypassCache || typeof cache.get(apiKey) === 'undefined' || (new Date()) > cache.get(apiKey).updateAt) {
		var url = config.baseUrl + config.api[apiKey].uri + ((options !== null) ? '?' + querystring.stringify(options) : '');

		if (config.debug) console.log('Updating cache for API Key: ' + apiKey + ' from URL: ' + url);

		request(url, function (error, response, body) {
			if (error || response.statusCode !== 200) {
				var msg = ((typeof response !== 'undefined') ? '[Status Code ' + response.statusCode + '] ' : '')
					+ 'There was an error requesting the API (URL ' + url + ')'
					+ ((error !== null) ? ': ' + error : '');
				throw new Gw2ApiLibException(msg);
			}
			cache.set(apiKey, {
				json: JSON.parse(body),
				updateAt: (new Date()).setSeconds((new Date()).getSeconds() + config.api[apiKey].cacheTime),
			});
			callback(cache.get(apiKey).json);
		});
		return;
	}

	// Only runs if already found in cache
	callback(cache.get(apiKey).json);
};

// Return the public API
module.exports = function() {
	var ret = {
		// Returns true if successfully set, false if bad arguments (i.e. file doesn't exist)
		loadCacheFromFile: function(file) {
			if (typeof file === 'undefined' || file === false) {
				config.cacheFile === null
			} else {
				if (typeof file !== 'string') {
					return false;
				}
				fs = require('fs');
				if (!fs.existsSync(file)) {
					return false;
				}

				config.cacheFile = file;
				cache.load(JSON.parse(fs.readFileSync(config.cacheFile, {encoding: 'utf8'})));
			}

			return true;
		},

		// Returns true if successful, false if bad arguments
		setCacheTime: function(seconds, apiKey) {
			// Using argument structure [seconds]
			if (typeof seconds === 'undefined') {
				seconds = apiKey;
				apiKey = null;
			}
			if (typeof seconds !== 'number') {
				return false;
			}

			// Update default cache time and all api keys using default cache time
			if (apiKey === null) {
				var oldCacheTime = config.cacheTime;
				config.cacheTime = seconds;
				for (var apiKey in config.api) {
					// Only updates cache time if using (old) default cache time
					if (config.api[apiKey].cacheTime === oldCacheTime) {
						config.api[apiKey].cacheTime = config.cacheTime;
					}
				}
				if (config.debug) console.log('setCacheTime successful; config.api: ' + JSON.stringify(config.api));
			} else if (!(apiKey in config.api)) {
				return false;
			} else {
				config.api[apiKey].cacheTime = seconds;
				if (config.debug) console.log('setCacheTime successful; config.api.' + apiKey + ': ' + JSON.stringify(config.api[apiKey]));
			}

			return true;
		},

		// Returns true if successful, false if apiKey not found
		resetCacheTime: function(apiKey) {
			if (typeof apiKey === 'undefined') {
				for (var apiKey in config.api) {
					config.api[apiKey].cacheTime = config.cacheTime;
				}
			} else if (!(apiKey in config.api)) {
				return false;
			} else {
				config.api[apiKey].cacheTime = config.cacheTime;
			}
			return true;
		},
	};

	// Allows public access to apiRequest for each apiKey, i.e. this.apiKey(function, [optional] object, [optional] boolean)
	for (var apiKey in config.api) {
		// Returns true if successful, false if bad arguments
		ret[apiKey] = function(apiKey) {
			return function(callback, params, bypassCache) {
				if (typeof callback !== 'function' || (typeof params !== 'undefined' && typeof params !== 'object')) {
					return false;
				}

				apiRequest(apiKey, params, callback, bypassCache);
				return true;
			};
		}(apiKey);
	}

	return ret;
}();