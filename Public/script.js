const usernameInput = document.querySelector(".Username");
const passwordInput = document.querySelector(".Password");
const loginButton = document.querySelector(".Login");
const signUpButton = document.querySelector(".SignUp");
const formTitle = document.getElementById("formTitle");

let isRegisterMode = false;

function setMode(registerMode) {
    isRegisterMode = registerMode;

    if (isRegisterMode) {
        formTitle.textContent = "Sign up";
        loginButton.textContent = "Create account";
        signUpButton.textContent = "Back to login";
    } else {
        formTitle.textContent = "Log in";
        loginButton.textContent = "Login";
        signUpButton.textContent = "Sign up";
    }
}

signUpButton.addEventListener("click", async function () {
    if (!isRegisterMode) {
        setMode(true);
        return;
    }

    setMode(false);
});

loginButton.addEventListener("click", async function () {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
        alert("Please enter username and password");
        return;
    }

    const endpoint = isRegisterMode ? "/register" : "/login";

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (data.success) {
            alert(data.message);

            if (isRegisterMode) {
                usernameInput.value = "";
                passwordInput.value = "";
                setMode(false);
            } else {
                window.location.href = "/hovedside.html";
            }
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Could not connect to server");
    }
});