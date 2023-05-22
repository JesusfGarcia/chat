import { db } from "../../firebase.js";
import { updatePassword } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";

import { auth } from "../../firebase.js";

import {
  collection,
  getDocs,
  doc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";

//inicializar vistas
const nickInput = document.getElementById("nick");
const updateButton = document.getElementById("update");
const passwordInput = document.getElementById("password");
const updatePasswordButton = document.getElementById("updatePassword");

let idRef = null;

//cargar el nick del usuario
const loadNick = async () => {
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    const element = doc.data();

    if (element.uid === localStorage.getItem("uid")) {
      //obtengo el id del renglon en la base de datos
      idRef = doc.id;
      //guardar en mi nick input el valor dle nick actual del usuario
      nickInput.value = element.nick;
      return;
    }
  });
};

//actualizamos el usuario
const updateNick = async () => {
  //creamos referencia del registro
  const documentRef = doc(db, "users", idRef);
  //actualizamos el campo nick, con el valor del nick input
  await updateDoc(documentRef, {
    nick: nickInput.value,
  });
};

//verificar si el usuario esta logeado
const checkIfValidUser = () => {
  if (!localStorage.getItem("uid")) {
    window.location.href = "http://localhost:5500/index.html";
  }
};

//cambiar contrase;a
const changePassword = async () => {
  const { currentUser } = auth;
  try {
    //tratamos de actualiza la contra
    await updatePassword(currentUser, passwordInput.value);
    passwordInput.value = "";
    alert("contraseña actualizada con exito");
  } catch (error) {
    alert("ocurrio un error al actualizar contraseña");
  }
};

//carga inicial
checkIfValidUser();
loadNick();

// se agregan funcionalidades
updateButton.addEventListener("click", updateNick);
updatePasswordButton.addEventListener("click", changePassword);
