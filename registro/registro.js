import { auth, db } from "../firebase.js";
//importamos la funcion para crear un usuario en firebase
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
//importamos lo necesario para crear registros en la base de datos de firebase
import {
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";

//mandamos a llamar inputs y botones
const registerButton = document.getElementById("register");
const emailInput = document.getElementById("email");
const nickInput = document.getElementById("nick");
const passwordInput = document.getElementById("password");

//le damos funcionalidad al boton de registro
registerButton.addEventListener("click", async () => {
  const email = emailInput.value;
  const nick = nickInput.value;
  const password = passwordInput.value;

  //revisamos que no haya ningun campo vacio
  if (!email || !password || !nick) {
    alert("llena todos los campos");
    //falta de llenar los campos
    return;
  }

  try {
    //tratamos de crear el usuario en el servicio de auth de firebase
    const response = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    //registramos el nickname del usuario en la base de datos de firebase
    await addDoc(collection(db, "users"), {
      uid: response.user.uid,
      nick: nick,
      email: email,
    });
    //mostrar estado de la aplicacion donde todo haya sucedido bien
    alert("El usuario ha sido registrado con éxito");
    emailInput.value = "";
    passwordInput.value = "";
    nickInput.value = "";
  } catch (error) {
    //mostrar el mensaje de error correspondiente
    alert("Ocurrio un error tratando de registrar el usuario");
  }
});
