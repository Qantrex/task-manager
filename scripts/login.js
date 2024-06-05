document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();

    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    if (username === "admin" && password === "admin") {
        localStorage.setItem("isLoggedIn", "true");

        window.location.href = "task_manager.html";
    } else {
        alert("Invalid credentials. Please try again.");
    }
});