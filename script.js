import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
import { auth } from "./firebase.js";

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("loginButton");

console.log("loginButton", loginButton);

loginButton.addEventListener("click", async () => {
  try {
    //funcion de click a boton de login
    const email = emailInput.value;
    const password = passwordInput.value;
    if (!email || !password) {
      //mostrar alerta de que estan vacios
      alert("vacios");
      return;
    }

    const response = await signInWithEmailAndPassword(auth, email, password);
    localStorage.setItem("uid", response.user.uid);
    window.location.replace("/home");
  } catch (error) {
    //ejecutar cosas que pasaran si hay error
  }
});
