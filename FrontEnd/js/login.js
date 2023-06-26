const form = document.querySelector('#login-form');

form.addEventListener('submit', async (event) => {
	event.preventDefault();

	const email = document.querySelector('#login-email').value;
	const password = document.querySelector('#login-password').value;

	connexionUser();
});
