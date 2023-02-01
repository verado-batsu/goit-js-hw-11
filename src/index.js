import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchImages } from './js/fetchImages';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


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

		if (response.totalHits === 0) {
			Notify.failure('Sorry, there are no images matching your search query. Please try again.');
			return;
		}

		Notify.success(`Hooray! We found ${response.totalHits} images.`);

		page += 1;
		const images = response.hits;
		renderImages(images);

		if (!(response.totalHits <= 40)) {
			refs.loadMoreBtn.classList.add('visible');
		}

	} catch (error) {
		console.log(error.message);
	}
	
}

async function onMoreClick(e) {
	try {
		const response = await fetchImages(inputValue, page);
		
		if (response.hits.length === 0) {
			Notify.failure("We're sorry, but you've reached the end of search results.");
			refs.loadMoreBtn.classList.remove('visible');
			return;
		}
		const images = response.hits;

		renderImages(images);
		page += 1;

		const { height: cardHeight } = document
		.querySelector(".gallery")
		.firstElementChild.getBoundingClientRect();

		window.scrollBy({
			top: cardHeight * 3,
			behavior: "smooth",
		});

		if (images.length <= 40) {
			refs.loadMoreBtn.classList.remove('visible');
		}

	} catch (error) {
		console.log(error.message);
	}
}

function clearGallery() {
	refs.galleryEl.innerHTML = '';
}

let lightbox = new SimpleLightbox('.gallery a', { /* options */ });

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
		<a class="link-card-wrapper" href="${largeImageURL}">
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
		</a>
		`
	})
		.join('');
	
	refs.galleryEl.insertAdjacentHTML('beforeend', markup);

	lightbox.refresh();
}