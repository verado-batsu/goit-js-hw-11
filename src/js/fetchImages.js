const API_KEY = '33254993-061d896ec6732e6df17c8cb18';


export async function fetchImages(queryName, page) {

	const url = `https://pixabay.com/api/?key=${API_KEY}&q=${queryName}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;

	const response = await fetch(url);

	return response;
}