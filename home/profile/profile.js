import { db } from "../../firebase.js";
import {
  getAuth,
  updatePassword,
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";

import { auth } from "../../firebase.js";

import {
  collection,
  getDocs,
  doc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";

const nickInput = document.getElementById("nick");
const updateButton = document.getElementById("update");
const passwordInput = document.getElementById("password");
const updatePasswordButton = document.getElementById("updatePassword");

let idRef = null;

const loadNick = async () => {
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    const element = doc.data();

    if (element.uid === localStorage.getItem("uid")) {
      idRef = doc.id;
      nickInput.value = element.nick;
      return;
    }
  });
};

const updateNick = async () => {
  const documentRef = doc(db, "users", idRef);

  await updateDoc(documentRef, {
    nick: nickInput.value,
  });
};

const checkIfValidUser = () => {
  if (!localStorage.getItem("uid")) {
    window.location.href = "http://localhost:5500/index.html";
  }
};

const changePassword = async () => {
  const { currentUser } = auth;
  try {
    await updatePassword(currentUser, passwordInput.value);
    passwordInput.value = "";
    alert("contraseña actualizada con exito");
  } catch (error) {
    console.log(error);
    alert("ocurrio un error al actualizar contraseña");
  }
};

//carga inicial
checkIfValidUser();
loadNick();
updateButton.addEventListener("click", updateNick);
updatePasswordButton.addEventListener("click", changePassword);
