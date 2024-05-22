// form loading animation
const form = [...document.querySelector('.form').children];

form.forEach((item, i) => {
    setTimeout(() => {
        item.style.opacity = 1;
    }, i * 100);
})

window.onload = () => {
    // Check if user is logged in
    if (sessionStorage.name) {
        location.href = '/';
    }
}

// form validation
const email = document.querySelector('.email');
const password = document.querySelector('.password');
const submitBtn = document.querySelector('.submit-btn');       
const deleteUserBtn = document.querySelector('.delete-user-btn');

// Login
submitBtn.addEventListener('click', () => {
    fetch('/login-user', {
        method: 'post',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
            email: email.value,
            password: password.value
        })
    })
    .then(res => res.json())
    .then(data => {
        validateData(data);
    })
})

// Register
if (document.querySelector('.name')) {
    const name = document.querySelector('.name');

    submitBtn.addEventListener('click', () => {
        fetch('/register-user', {
            method: 'post',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({
                name: name.value,
                email: email.value,
                password: password.value
            })
        })
        .then(res => res.json())
        .then(data => {
            validateData(data);
        })
    })
} else {
    // Show delete user option
    const deleteUserBtn = document.querySelector('.delete-user-btn');
    deleteUserBtn.style.display = 'block';

    // Delete User
    deleteUserBtn.addEventListener('click', () => {
        fetch('/delete-user', {
            method: 'DELETE',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({
                email: email.value,
                password: password.value
            })
        })
        .then(res => res.json())
        .then(data => {
            // Redirect to login page after successful deletion
            if (data.success) {
                sessionStorage.clear(); // Clear session storage
                location.href = '/login';
            } else {
                alertBox(data);
            }
        })
    })
}

const validateData = (data) => {
    if (data.token) {
        sessionStorage.name = data.user.name;
        sessionStorage.email = data.user.email;
        sessionStorage.token = data.token;
        location.href = '/';
    } else {
        alertBox(data);
    }
}

const alertBox = (data) => {
    const alertContainer = document.querySelector('.alert-box');
    const alertMsg = document.querySelector('.alert');
    alertMsg.innerHTML = data;

    alertContainer.style.top = `5%`;
    setTimeout(() => {
        alertContainer.style.top = null;
    }, 5000);
}
