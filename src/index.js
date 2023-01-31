import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchImages } from './js/fetchImages';

const refs = {
	formEl: document.querySelector('.search-form'),
	btnEl: document.querySelector('.submit-btn'),
	galleryEl: document.querySelector('.gallery'),
	loadMoreBtn: document.querySelector('.load-more'),
}
let inputValue = '';
let page = null;


refs.formEl.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', onMoreClick);




async function onFormSubmit(e) {
	e.preventDefault();
	clearGallery();
	page = 1;

	refs.loadMoreBtn.classList.remove('visible');

	inputValue = e.currentTarget.elements.searchQuery.value.trim();

	if (inputValue === '') {
		Notify.failure('Please enter something');
		return;
	}

	try {
		const response = await fetchImages(inputValue, page);
		const imagesData = await response.json();

		if (imagesData.total === 0) {
			Notify.failure('Sorry, there are no images matching your search query. Please try again.');
			return;
		}

		page += 1;
		const images = imagesData.hits;
		renderImages(images);
		refs.loadMoreBtn.classList.add('visible');

	} catch (error) {
		console.log('Error!!!');
	}
	
}

async function onMoreClick(e) {
	try {
		const response = await fetchImages(inputValue, page);
		const imagesData = await response.json();

		console.log(imagesData.totalHits);
		
		if (imagesData.hits.length === 0) {
			
			Notify.failure("We're sorry, but you've reached the end of search results.");
			refs.loadMoreBtn.classList.remove('visible');
			return;
		}
		const images = imagesData.hits;

		renderImages(images);
		page += 1;

	} catch (error) {
		console.log(error.message);
	}
}

function clearGallery() {
	refs.galleryEl.innerHTML = '';
}

function renderImages(images) {
	const markup = images.map(image => {
		const {
			webformatURL,
			largeImageURL,
			tags,
			likes,
			views,
			comments,
			downloads
		} = image;
		
		return `
		<div class="photo-card">
			<img src="${webformatURL}" alt="${tags}" loading="lazy" />
			<div class="info">
				<p class="info-item">
				<b>Likes</b>
				${likes}
				</p>
				<p class="info-item">
				<b>Views</b>
				${views}
				</p>
				<p class="info-item">
				<b>Comments</b>
				${comments}
				</p>
				<p class="info-item">
				<b>Downloads</b>
				${downloads}
				</p>
			</div>
		</div>
		`
	})
		.join('');
	
	refs.galleryEl.insertAdjacentHTML('beforeend', markup);
}