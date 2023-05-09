import { auth, db } from "../firebase.js";

import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
import {
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";

const registerButton = document.getElementById("register");
//mandamos a llamar los inputs
const emailInput = document.getElementById("email");
const nickInput = document.getElementById("nick");
const passwordInput = document.getElementById("password");

registerButton.addEventListener("click", async () => {
  const email = emailInput.value;
  const nick = nickInput.value;
  const password = passwordInput.value;

  if (!email || !password || !nick) {
    alert("llena todos los campos");
    //falta de llenar los campos
    return;
  }

  try {
    const response = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await addDoc(collection(db, "users"), {
      uid: response.user.uid,
      nick: nick,
      email: email,
    });
    //mostrar estado de la aplicacion donde todo haya sucedido bien
  } catch (error) {
    //mostrar el mensaje de error correspondiente
    console.log("error =>", error);
  }
});
