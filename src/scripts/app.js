import React from 'react'
import ReactDOM from 'react-dom'	
import Backbone from 'backbone'
import AppView from './AppView.js'


const app = function() {

var GiphyCollection = Backbone.Collection.extend({
	url: "http://api.giphy.com/v1/gifs/search",
	api_key: "dc6zaTOxFJmzC",
	parse: function(rawJSON){
		console.log(rawJSON)
		return rawJSON.data
	}
})

const Router = Backbone.Router.extend({
	routes: {
		"search/:query": "goSearch",
		"home": "goHome",
		"*catchall": "routeHome"
	},

	initialize: function(){
		Backbone.history.start()
		console.log('initialize')
	},

	goSearch: function(query){
		var giphyColl = new GiphyCollection()
		
		giphyColl.fetch({
			data: {
				api_key: giphyColl.api_key,
				q: query
			}
		})
		ReactDOM.render(<AppView giphyColl={giphyColl} />, document.querySelector('.container'))
	},

	routeHome: function(){
		console.log('test')
		location.hash = "search/cats"
	}

	// goHome(){
	// 	ReactDOM.render(<AppView giphyColl={giphyColl} />, document.querySelector('.container'))	
	// }


})

new Router()



}

app()