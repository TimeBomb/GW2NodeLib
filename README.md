Guild Wars 2 JSON Api Library for Node.js
=========================================


**Install With NPM**
--------------------
```shell
npm install gw2nodelib
```

**How To Use**
---------------
Simple - just require it and it returns an object with the below functions.


**Functions**
-------------
```javascript
API Key(function, [optional] object, [optional] boolean)
```
This function is the same for all API keys. *(Scroll down to read more about API Keys.)* The first argument is a callback; it will be passed all of the JSON upon success. The second argument is an optional object of parameters, to be converted to query parameters and appended to the URL. The third argument, if true, will cause the API request to bypass the cache and get the data from the official API. This will also update the cache. *(The third argument can be passed as the second argument if you do not need to pass query parameters.)*

--

```javascript
loadCacheFromFile([optional] string)
```
By default, the cache is stored in memory for however long the application is running. Set this to a valid file path to load and store cache to this file. It is recommended to do this.

--

```javascript
setCacheTime(integer, [optional] string)
```
The first argument is the amount of seconds the cache is retained before it will update (once requested). The default is 1800 seconds, or 30 minutes. The default changes when you use this function without setting a second argument. If you set the second argument to an API key, it will change the cache time for that API key only, and that API key will not be updated when the default is changed.

--

```javascript
resetCacheTime([optional] string)
```
If no argument is supplied, resets the cache time back to default for all API keys. You can optionally supply a specific API key as an argument, and it will reset the cache time for that API key back to default.


List of API Keys
----------------

*API Keys are used by this module to reference a specific API page (i.e. URL).*

<table>
	<tr>
		<td><b>API Key</b></td>
		<td><b>API Url</b></td>
	</tr>
	<tr>
		<td>events</td>
		<td>/events.json</td>
	</tr>
	<tr>
		<td>eventNames</td>
		<td>/event_names.json</td>
	</tr>
	<tr>
		<td>mapNames</td>
		<td>/map_names.json</td>
	</tr>
	<tr>
		<td>wvwMatches</td>
		<td>/wvw/matches.json</td>
	</tr>
	<tr>
		<td>wvwMatchDetails</td>
		<td>/wvw/match_details.json</td>
	</tr>
	<tr>
		<td>wvwObjectiveNames</td>
		<td>/wvw/objective_names.json</td>
	</tr>
	<tr>
		<td>items</td>
		<td>/items.json</td>
	</tr>
	<tr>
		<td>itemDetails</td>
		<td>/item_details.json</td>
	</tr>
	<tr>
		<td>recipes</td>
		<td>/recipes.json</td>
	</tr>
	<tr>
		<td>recipeDetails</td>
		<td>/recipe_details.json</td>
	</tr>
	<tr>
		<td>guildDetails</td>
		<td>/guild_details.json</td>
	</tr>
	<tr>
		<td>build</td>
		<td>/build.json</td>
	</tr>
	<tr>
		<td>colors</td>
		<td>/colors_details.json</td>
	</tr>
</table>