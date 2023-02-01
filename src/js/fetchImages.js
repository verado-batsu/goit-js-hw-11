import axios from "axios";

const API_KEY = '33254993-061d896ec6732e6df17c8cb18';
const URL = `https://pixabay.com/api/`;


export async function fetchImages(queryName, page) {

	const response = await axios.get(URL, {
		params: {
			key: API_KEY,
			q: queryName,
			image_type: "photo",
			orientation: "horizontal",
			safesearch: true,
			page,
			per_page: 40,
		}
	});

	return response.data;
}
