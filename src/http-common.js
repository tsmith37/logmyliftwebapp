import axios from 'axios';

var base_url = (process.env.API_URL ? process.env.API_URL : "http://localhost:8080/api");
export default axios.create({
	baseURL: base_url,
	headers: {
		"Content-type": "application/json"
	}
});
