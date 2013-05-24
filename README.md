GW2NodeLib
==========

Guild Wars 2 JSON Api Library for Node.js

How To Use: Simple - Just require it and it returns an object with the following functions:

For reference, a list of API keys and what they link to:
events: /events.json
eventNames: /event_names.json
mapNames: /map_names.json
worldNames: /world_names.json
wvwMatches: /wvw/matches.json
wvwMatchDetails: /wvw/match_details.json
wvwObjectiveNames: /wvw/objective_names.json
items: 'items.json',
itemDetails: 'item_details.json',
recipes: 'recipes.json',
recipeDetails: 'recipe_details.json',

API Key(function, [optional] object, [optional] boolean) - This function is the same for all API keys. The first argument is a callback; it will be passed all of the JSON upon success. The second argument is an optional object of parameters, to be converted to query parameters and appended to the URL. The third argument can be passed as the second argument if you do need to pass query parameters. The third argument, if true, will cause the API request to bypass the cache and get the data from the official API. This will also update the cache.

loadCacheFromFile([optional] string) - By default, the cache is stored in memory for however long the application is running. Set this to a valid file path to load and store cache to this file. It is recommended to do this.

setCacheTime(integer, [optional] string) - The first argument is the amount of seconds the cache is retained before it will update (once requested). The default is 1800 seconds, or 30 minutes. The default changes when you use this function without setting a second argument. If you set the second argument to an API key, it will change the cache time for that API key only, and that API key will not be updated when the default is changed.

resetCacheTime([optional] string) - If no argument is supplied, resets the cache time back to default for all API keys. You can optionally supply a specific API key as an argument, and it will reset the cache time for that API key back to default.