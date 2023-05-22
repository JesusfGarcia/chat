//importamos la funcion para logearnos
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
import { auth } from "./firebase.js";

//vinculamos js con sus correspondientes tags en html
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("loginButton");

//le agregamos la funcionalidad al boton de login
loginButton.addEventListener("click", async () => {
  try {
    //sacamos valores de los inputs
    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email || !password) {
      //mostrar alerta de que estan vacios
      alert("revise que no exista ningun campo vacio");
      return;
    }

    //vamos a mandar la solicitud para logearnos
    const response = await signInWithEmailAndPassword(auth, email, password);
    //guardamos el uid del usuario en nuestro local Storage
    localStorage.setItem("uid", response.user.uid);

    //redireccionamos al usuario a la pantalla de la aplicacion
    window.location.replace("/home");
  } catch (error) {
    //ejecutar cosas que pasaran si hay error
    alert("credenciales inválidas");
  }
});
