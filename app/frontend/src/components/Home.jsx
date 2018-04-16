import React, { Component } from 'react';
import axios from 'axios'
import queryString from 'query-string'

import Result from './Result'

class Home extends Component {
	constructor(props){
		super(props);
		this.state = {
			value: '',
			data : [],
			loading : false
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.getRelatedComments = this.getRelatedComments.bind(this)
	}

	componentWillMount(){
		let query = this.props.location.search
		if (query) {
			let parsed = queryString.parse(query)
			this.getRelatedComments(parsed.query)
		}
	}

	handleChange(event){
		this.setState({value: event.target.value});
	}

	handleSubmit(event){
		this.getRelatedComments(this.state.value)
		event.preventDefault();
	}

	getRelatedComments(input_query) {
		this.setState({loading: true})
		var arr = input_query.split(" ")
		var qParams = arr.map(key =>key).join('&');
		console.log('running related comments fetch')
		axios.get('/search', {
				params: { query: qParams }
			})
		.then(response => {
			console.log(response)
			this.setState({
				data: response.data,
				loading: false
			})
		})
	}


	render() {
		let data = this.state.data.filter(comment => { return comment.body !== "[deleted]"})
    return (
    	<div>
	      <form>
	      	<label>
	      		<p className = "title">LEARNDDIT</p>
	      		<span>
	      		I want to learn...
	      		<input className = "searchBar" type="text" value={this.state.value} onChange={this.handleChange} />
	      		</span>
	      		<button id = "submit_button" onClick={this.handleSubmit}>Search</button>
	      	</label>
	      </form>
	      {
	      	this.state.loading ? (<div className="loader"></div>) :
	      	(data.map((comment, i) => {
	      		return <Result key={comment.id} comment={comment} style={i % 2 === 0 ? "white" : "whitesmoke"}/>
	      	}))
	      }
      </div>
	    );
	}
}

export default Home;