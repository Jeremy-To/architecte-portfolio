async function connexionUser() {
	const formEl = document.getElementById('login-form');
	const formData = new FormData(formEl);
	const response = await fetch('http://localhost:5678/api/users/login', {
		method: 'POST',
		headers: { accept: 'application/json', 'Content-Type': 'application/json' },
		body: JSON.stringify(Object.fromEntries(formData)),
	});

	if (response.status === 200) {
		const userInfos = await response.json();
		const token = JSON.stringify(userInfos.token);
		sessionStorage.setItem('token', JSON.parse(token));
		sessionStorage.setItem('isLoggedIn', true);
		sessionStorage.setItem('isLoggedOut', false);
		const isLoggedOutList = document.querySelectorAll('.isLoggedOut');
		isLoggedOutList.forEach((outList) => {
			outList.hidden = true;
		});
		const isLoggedInList = document.querySelectorAll('.isLoggedIn');
		isLoggedInList.forEach((inList) => {
			inList.hidden = false;
		});
		window.location.href = './index.html';
	} else {
		alert("Le mot de passe et/ou l'e-mail est incorrecte");
		sessionStorage.setItem('isLoggedIn', false);
		sessionStorage.setItem('isLoggedOut', true);
		const isLoggedOutList = document.querySelectorAll('.isLoggedOut');
		isLoggedOutList.forEach((outList) => {
			outList.hidden = false;
		});
		const isLoggedInList = document.querySelectorAll('.isLoggedIn');
		isLoggedInList.forEach((inList) => {
			inList.hidden = true;
		});
	}
}

function deconnecter() {
	sessionStorage.removeItem('isLoggedIn', false);
	sessionStorage.removeItem('isLoggedOut', true);
	const isLoggedOutList = document.querySelectorAll('.isLoggedOut');
	isLoggedOutList.forEach((outList) => {
		outList.hidden = false;
	});
	const isLoggedInList = document.querySelectorAll('.isLoggedIn');
	isLoggedInList.forEach((inList) => {
		inList.hidden = true;
	});
	window.location.href = './index.html';
}
