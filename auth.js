const users = [
    { username: "admin", password: "admin" },
    { username: "user1", password: "userpass" },
];

function authenticate(event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    const isAuthenticated = users.some(
        (user) => user.username === username && user.password === password
    );

    if (isAuthenticated) {
        sessionStorage.setItem("isLoggedIn", "true");
        window.location.href = "dashboard.html";
    } else {
        document.getElementById("errorMessage").style.display = "block";
    }
}

function checkAuthentication() {
    if (sessionStorage.getItem("isLoggedIn") !== "true") {
        window.location.href = "index.html";
    }
}

function logout() {
    sessionStorage.removeItem("isLoggedIn");
    window.location.href = "index.html";
}

// Run check on restricted pages
if (
    window.location.pathname.includes("dashboard.html") ||
    window.location.pathname.includes("datasheet.html") ||
    window.location.pathname.includes("temp.html")
) {
    checkAuthentication();
}
