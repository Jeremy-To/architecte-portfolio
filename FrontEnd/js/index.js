window.addEventListener('load', function () {
	let isLoggedIn = sessionStorage.getItem('isLoggedIn');
	let isLoggedOut = sessionStorage.getItem('isLoggedOut');
	if (isLoggedIn) {
		const isLoggedInList = document.querySelectorAll('.isLoggedIn');
		isLoggedInList.forEach((inList) => {
			inList.style.display = 'flex';
		});
	}
	if (isLoggedOut) {
		const isLoggedOutList = document.querySelectorAll('.isLoggedOut');
		isLoggedOutList.forEach((outList) => {
			outList.style.display = 'none';
		});
	}
});

const fileInput = document.getElementById('ajoutPhotoBtn');
fileInput.onchange = () => {
	const selectedFile = fileInput.files[0];
};

document.getElementById('logout').addEventListener('click', function (event) {
	event.preventDefault();
	deconnecter();
});

window.addEventListener('load', async () => {
	await getCategory();

	document.querySelector('.bouton-tous').click();
	const arrowBack = document.getElementById('arrowBack');
	arrowBack.addEventListener('click', backToBasicModal);

	getProjectModal();
	getCategoriesModal();

	document.addEventListener('click', deleteProjectWithConfirmation);

	const ajoutButton = document.getElementById('ajout-image');
	ajoutButton.addEventListener('click', addPicture);
	ajoutButton.addEventListener('click', changeBtnColor);
});

let ajoutPhotoBouton = document.getElementById('ajoutPhotoBtn');
ajoutPhotoBouton.addEventListener('change', () => {
	validateImageProject();
});

titrePhoto.addEventListener('input', (e) => {
	validateTitleProject(e);
});

const submitPhoto = document.getElementById('validerBtn');
submitPhoto.addEventListener('click', (e) => {
	e.preventDefault();
	validateFormProject();
});
