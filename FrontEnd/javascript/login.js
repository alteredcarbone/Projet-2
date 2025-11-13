const LOGIN_API = "http://localhost:5678/api/users/login";

const form = document.querySelector("form");

const errorMessage = document.getElementById("login-error");

form.addEventListener("submit", function (e) {
    e.preventDefault(); 

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    errorMessage.textContent = "";

    if (!email || !password) {
        errorMessage.textContent = "Erreur dans l’identifiant ou le mot de passe";
        return;
    }

    fetch(LOGIN_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    })
    .then(async (res) => {

        if (!res.ok) {
            
            errorMessage.textContent = "Erreur dans l’identifiant ou le mot de passe";
            throw new Error("login failed");
        }

        return res.json();
    })
    .then(data => {
        
        localStorage.setItem("token", data.token);

        window.location.href = "index.html";
    })
    .catch(err => console.error(err));
});