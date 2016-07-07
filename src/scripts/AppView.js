import React from 'react'
import ReactDOM from 'react-dom'
import Backbone from 'backbone'

const AppView = React.createClass({
	
	getInitialState: function(){
		return {
			giphyColl: this.props.giphyColl,
			focus: ''
		}
	},

	componentWillMount: function(){
		var self = this
		this.state.giphyColl.on('sync', () => {
			this.setState({
				giphyColl: this.state.giphyColl
			})
		})

		Backbone.Events.on('newFocusId', (id) => { //id is coming from argument on Backbone trigger
			//uses the trigger from the bottom level component, to re-set the state to the individual ID
			this.setState({
				focus: id
			})
		})
	},

	componentWillReceiveProps: function(nextProps){
		console.log('will receive props')
		nextProps.giphyColl.on('sync', () => {
			console.log('sync fired')
			this.setState({
				giphyColl: this.props.giphyColl
			})
		})
	},

	render: function(){
		// console.log(this.state.giphyColl.models)
		console.log(this.state.focus)

		var overlayStyle = {
			display: 'none'
		}

		if(this.state.focus) {
			overlayStyle.display = 'block'
		}

		return (
			<div id="appContainer">
				<Header />
				<GiphyContainer giphId={this.state.focus} giphyColl={this.state.giphyColl} />
				{/*<div style={overlayStyle} id="overlay"></div>*/}
			</div>
			)
	}
})

const Header = React.createClass({
	
	_handleKeyDown: function(event){
		if(event.keyCode === 13) {
			location.hash = `search/${event.target.value}`
			event.target.value = ''
		}
	},

	render: function(){
		return(
			<header id="mainheader">
				<h1>Giphy App</h1>
				<input type="text" placeholder="search" onKeyDown={this._handleKeyDown}/>
			</header>
			)
	}
})

const GiphyContainer = React.createClass({
	
	_giphyMap: function(model){
		return <Giph giphId={this.props.giphId} giphModel={model} key={model.cid} />
	},

	render: function(){
		return (
			<div id="giphyContainer">
				{this.props.giphyColl.map(this._giphyMap)}
			</div>
			)
	}
})

const Giph = React.createClass({
	
	_assignId: function(){
		Backbone.Events.trigger('newFocusId', this.props.giphModel.id) //setup a pubsub listening event, so
		//on this trigger called newFocusId (and passing in the id's -- see Backbone documentation), let the 
		//top-level component know to do something with it
	},


	render: function(){
		// console.log(this.props.giphId)

		var focusClass = 'giph'

		if(this.props.giphModel.id === this.props.giphId) {
		//this.props.giphModel.id is FIXED, while this.props.giphId is VARYING
			focusClass = 'active giph'
		}

		return (
			<div className={focusClass} onClick={this._assignId}>
				<img src={this.props.giphModel.get('images').downsized.url} />
			</div>
			)
	}
})





export default AppView