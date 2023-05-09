import { db } from "../../firebase.js";

import {
  collection,
  getDocs,
  doc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";

const nickInput = document.getElementById("nick");
const updateButton = document.getElementById("update");
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

updateButton.addEventListener("click", updateNick);

loadNick();
