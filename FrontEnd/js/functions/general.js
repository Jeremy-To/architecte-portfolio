function getProject(event) {
	const divGallery = document.querySelector('.gallery');
	divGallery.innerHTML = '';

	fetch('http://localhost:5678/api/works')
		.then(function (response) {
			return response.json();
		})
		.then(function (projects) {
			const travauxObjets = projects.filter(function (travaux) {
				if (event.target.dataset.id >= 1) {
					return travaux.categoryId == event.target.dataset.id;
				} else {
					return travaux.categoryId >= 1;
				}
			});

			travauxObjets.forEach(function (project) {
				const div = document.createElement('div');
				div.classList.add(['cartesBody']);
				const figureCaption = document.createElement('figcaption');
				figureCaption.className = 'figureGallery';
				const image = document.createElement('img');
				image.src = project.imageUrl;
				figureCaption.append(image);
				div.append(image);
				const h3 = document.createElement('h3');
				h3.innerText = project.title;
				div.append(h3);
				divGallery.append(div);
			});
		})
		.catch(function (error) {
			console.log('Erreur : ' + error);
		});
}

async function getCategory() {
	const divCategory = document.querySelector('.categories');

	await fetch('http://localhost:5678/api/categories')
		.then(function (response) {
			return response.json();
		})
		.then(function (categories) {
			const boutonTous = document.createElement('button');
			boutonTous.classList.add('bouton-tous');
			boutonTous.classList.add('filtres');
			boutonTous.innerText = 'Tous';
			boutonTous.dataset.id = 0;
			boutonTous.onclick = (event) => getProject(event);
			divCategory.append(boutonTous);

			categories.forEach(function (category) {
				const button = document.createElement('button');
				button.classList.add('filtres');
				button.dataset.id = category.id;
				button.innerText = category.name;
				button.onclick = (event) => getProject(event);
				divCategory.append(button);
			});
		});

	const elements = divCategory.querySelectorAll('.filtres');
	elements.forEach((element) => {
		element.addEventListener('click', () => {
			elements.forEach((element) => {
				element.classList.remove('activated');
			});
			element.classList.add('activated');
		});
	});
}
