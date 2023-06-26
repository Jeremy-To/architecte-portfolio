function stopPropagation(e) {
	e.stopPropagation();
}

let modal = null;
const focusableSelector = 'button, a, input, textarea';
let focusables = [];
let previouslyFocusedElement = null;

function openModal(e) {
	e.preventDefault();
	modal = document.getElementById(e.target.getAttribute('href'));
	const focusableSelector = 'button, a, input, textarea';
	const focusables = Array.from(modal.querySelectorAll(focusableSelector));
	previouslyFocusedElement = document.querySelector(':focus');
	modal.style.display = null;
	focusables[0].focus();
	modal.removeAttribute('aria-hidden');
	modal.setAttribute('aria-modal', 'true');
	modal.querySelector('.closeModal').addEventListener('click', closeModal);
	modal.querySelector('.closeModal').addEventListener('click', stopPropagation);
}

function closeModal(e) {
	if (modal === null) return;
	if (previouslyFocusedElement !== null) previouslyFocusedElement.focus();
	e.preventDefault();
	modal.style.display = 'none';
	modal.setAttribute('aria-hidden', 'true');
	modal.removeAttribute('aria-modal');
	modal.removeEventListener('click', closeModal);
	modal.querySelector('.closeModal').removeEventListener('click', closeModal);
	modal
		.querySelector('.closeModal')
		.removeEventListener('click', stopPropagation);
	modal = null;
}

function focusInModal(e) {
	e.preventDefault();
	let index = focusables.findIndex((f) => f === modal.querySelector(':focus'));
	if (e.shiftKey === true) {
		index = (index - 1 + focusables.length) % focusables.length;
	} else {
		index = (index + 1) % focusables.length;
	}
	focusables[index].focus();
}

function escapeModal(e) {
	if (e.key === 'Escape' || e.key === 'Esc') {
		closeModal(e);
	}
	if (e.key === 'Tab' && modal !== null) {
		focusInModal(e);
	}
}

document.querySelectorAll('.openModal').forEach((a) => {
	a.addEventListener('click', openModal);
});

window.addEventListener('keydown', function (e) {
	escapeModal(e);
});

async function getProjectModal() {
	try {
		const response = await fetch('http://localhost:5678/api/works');
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const projects = await response.json();
		const modalGallery = document.querySelector('.modalGallery');
		modalGallery.innerHTML = '';
		projects.forEach((project) => addProjectToModal(project));
	} catch (error) {
		console.log(`Fetch error: ${error}`);
	}
}

function addProjectToModal(project) {
	const modalGallery = document.querySelector('.modalGallery');

	const figure = document.createElement('figure');
	figure.classList.add('figureModal');

	const img = document.createElement('img');
	img.classList.add('imgModal');
	img.src = project.imageUrl;
	img.width = 100;

	const figcaption = document.createElement('figcaption');
	figcaption.classList.add('figCaption');
	figcaption.alt = project.title;
	figcaption.textContent = 'éditer';

	const categoryId = document.createElement('p');
	categoryId.src = project.categoryId;

	const deleteWork = document.createElement('i');
	deleteWork.classList.add('deleteTrashIcon', 'fa', 'fa-solid', 'fa-trash-can');
	deleteWork.dataset.id = project.id;

	figure.append(img, figcaption, categoryId, deleteWork);

	modalGallery.append(figure);
}

async function deleteProjectWithConfirmation(e) {
	if (e.target.classList.contains('deleteTrashIcon')) {
		const projectId = e.target.dataset.id;
		console.log(sessionStorage.getItem('token'));
		const response = await fetch(
			'http://localhost:5678/api/works/' + projectId,
			{
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json; charset=utf-8',
					authorization: `Bearer ${sessionStorage.getItem('token')}`,
				},
			}
		);
		if (response.ok) {
			if (confirm("Voulez-vous supprimer l'image?") == true) {
				e.target.parentElement.remove(); //suppression du target
				document.querySelector('.bouton-tous').click();
			} else {
				backToBasicModal;
			}
		} else {
			console.log(
				"Une erreur s'est produite lors de la suppression du projet."
			);
		}
	}
}
function addPicture(e) {
	e.preventDefault();
	let modalPhoto = document.querySelector('.modalPhoto');
	let modalAjout = document.querySelector('.modalAjout');
	modalPhoto.style.display = 'none';
	modalAjout.style.display = 'block';
	modalAjout.addEventListener('click', stopPropagation);
	modalAjout.addEventListener('click', changeBtnColor);
}

async function getCategoriesModal() {
	fetch('http://localhost:5678/api/categories', {
		method: 'get',
		headers: {
			accept: 'application/json',
		},
	})
		.then(function (response) {
			return response.json();
		})
		.then(function (category) {
			addCategoriesToModal(category);
		});

	function addCategoriesToModal(categories) {
		const categoriePhotoContainer = document.getElementById('categoriePhoto');

		categories.forEach(function (category) {
			const filtres = document.createElement('option');
			filtres.dataset.id = category.id;
			filtres.value = category.name;
			filtres.innerHTML = category.name;
			categoriePhotoContainer.appendChild(filtres);
		});
	}
}

function validateImageProject() {
	let ajoutPhotoBouton = document.getElementById('ajoutPhotoBtn');
	let ajoutPhotoLabel = document.getElementById('ajoutPhotoLabel');
	let imgContainer = document.getElementById('imgContainer');

	if (ajoutPhotoBouton.files.length == 0) {
		return;
	} else {
		if (validFileType(ajoutPhotoBouton.files[0].type)) {
			if (ajoutPhotoBouton.files[0].size > 4000000) {
				alert('Photo trop volumineuse');
			} else {
				const imgFile = document.createElement('img');
				let imgErrorMessage = document.createElement('span');

				imgFile.setAttribute('id', 'imgPreview');
				imgFile.setAttribute('alt', "Aperçu de l'image sélectionnée");

				imgErrorMessage.classList.add('imgErrorMessage');

				imgContainer.appendChild(imgFile, imgErrorMessage);

				imgFile.src = URL.createObjectURL(ajoutPhotoBouton.files[0]);
				imgFile.className = 'img-uploaded';

				ajoutPhotoLabel.style.display = 'none';
				let ajoutPhotoIcon = document.getElementById('ajoutPhotoIcon');
				ajoutPhotoIcon.style.display = 'none';
				let pContainer = document.getElementById('pContainer');
				pContainer.style.display = 'none';

				let imgErrorMessageExists = document.querySelector('.imgErrorMessage');

				if (imgErrorMessageExists) {
					imgErrorMessageExists.remove();
				}
			}
		} else {
			alert('Format non accepté');
		}
	}
}

const fileTypes = ['image/jpeg', 'image/png', 'image/jpg'];

function validFileType(type) {
	if (fileTypes.indexOf(type) > -1) {
		return true;
	} else {
		return false;
	}
}

function validateTitleProject() {
	let inputTitle = document.getElementById('titrePhoto');
	let errors = false;

	if (inputTitle.value == '') {
		titleErrorMessage.innerText = 'Veuillez mettre un titre valide.';
		inputTitle.classList.add('inputError');
		errors = true;
	} else {
		titleErrorMessage.innerText = '';
		inputTitle.classList.remove('inputError');
		errors = false;
	}

	return errors;
}

function validateFileProject() {
	let errors = false;
	if (document.getElementById('ajoutPhotoBtn').files.length === 0) {
		errors = true;
		alert('Veuillez sélectionner un fichier.');
	} else {
		errors = false;
	}
	return errors;
}
async function validateFormProject() {
	const imgUploaded = document.getElementById('ajoutPhotoBtn').files[0];

	const inputTitle = document.getElementById('titrePhoto').value;
	const selectCategorie = document.getElementById('categoriePhoto');
	const categoriePhotoId =
		selectCategorie.options[selectCategorie.selectedIndex].dataset.id;
	validationTitle = validateTitleProject();
	validationFile = validateFileProject();

	console.log(validationTitle, validationFile, validationFile === false);

	if (validationFile === false && validationTitle === false) {
		const formData = new FormData();
		formData.append('image', imgUploaded);
		formData.append('title', inputTitle);
		formData.append('category', categoriePhotoId);

		let response = await fetch('http://localhost:5678/api/works', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				Authorization: 'Bearer ' + sessionStorage.getItem('token'),
			},
			body: formData,
		});
		if (response.status === 200 || 201) {
			alert("L'ajout de l'image a été réalisé avec succès");
			document.querySelector('.bouton-tous').click();
			clearForm();
			getProjectModal();
		} else if (response.status === 401 || 400) {
			alert('Veuillez ajouter un titre ou image');
			console.log('Action impossible');
		}
	}
}

function clearForm() {
	document.getElementById('ajoutPhoto-form').reset();

	const userFile = document.getElementById('ajoutPhotoBtn');
	const inputTitle = document.getElementById('titrePhoto');
	const imgUploaded = document.getElementById('imgPreview');
	imgUploaded.remove();
	userFile.value = '';
	inputTitle.value = '';
	let ajoutPhotoLabel = document.getElementById('ajoutPhotoLabel');
	ajoutPhotoLabel.style.display = 'block';
	let ajoutPhotoIcon = document.getElementById('ajoutPhotoIcon');
	ajoutPhotoIcon.style.display = 'block';
	let pContainer = document.getElementById('pContainer');
	pContainer.style.display = 'block';
	changeBtnColor();
}

function changeBtnColor() {
	const validerBtn = document.getElementById('validerBtn');
	let inputTitle = document.getElementById('titrePhoto');

	if (ajoutPhotoBouton.files.length === 0 || inputTitle.value === '') {
		validerBtn.classList.add('validerBtnFalse');
	} else {
		validerBtn.classList.remove('validerBtnFalse');
	}
}

function backToBasicModal() {
	let modalPhoto = document.querySelector('.modalPhoto');
	let modalAjout = document.querySelector('.modalAjout');
	modalPhoto.style.display = 'block';
	modalAjout.style.display = 'none';
	clearForm();
}
