import { db } from "../firebase.js";

import {
  collection,
  getDocs,
  addDoc,
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";

import {
  getDatabase,
  ref,
  set,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";

//declaramos variables
let showSidebar = false;
let showMenu = false;
let chatSelected = null;
let usuarios = [];
let messages = [];

//declaramos interfaz
const sidebar = document.getElementById("sidebar");
const menu = document.getElementById("menu");
const chat = document.getElementById("chat");
const myUid = localStorage.getItem("uid");
const sidebarButton = document.getElementById("sidebarButton");
const menuButton = document.getElementById("menuButton");
const sendButton = document.getElementById("send");
const textInput = document.getElementById("textMessage");

const toogleMenu = () => {
  if (showMenu) {
    menu.style.right = "-200px";
    showMenu = !showMenu;
    return;
  }
  menu.style.right = "0px";
  showMenu = !showMenu;
};

const toggleSidebar = () => {
  if (showSidebar) {
    sidebar.style.left = "-200px";
    showSidebar = !showSidebar;
    return;
  }

  sidebar.style.left = "0px";
  showSidebar = !showSidebar;
};

const loadUsers = async () => {
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    const element = doc.data();

    if (element.uid !== localStorage.getItem("uid")) {
      usuarios.push(element);
    }
  });
  //haremos la consulta a la base de datos, para obtener la lista de usuarios
  //codigo de la consulta
  //una vez cargada la informacion, se mostrara

  usuarios.forEach((user) => {
    const divContenedor = document.createElement("div");
    const spanName = document.createElement("span");
    spanName.innerText = user.nick;
    divContenedor.onclick = () => loadChat(user.uid);
    divContenedor.append(spanName);
    sidebar.append(divContenedor);
  });
};

const writeMessage = () => {
  const db = getDatabase();
  const text = textInput.value;

  if (!text) {
    return;
  }

  let rel =
    myUid > chatSelected
      ? `${myUid}-${chatSelected}`
      : `${chatSelected}-${myUid}`;

  set(ref(db, "chats/" + rel), {
    messages: [
      ...messages,
      {
        text: text,
        owner: myUid,
        favoriteBy: [],
      },
    ],
  });
  textInput.value = "";
};

const destacar = async (e, idx) => {
  e.preventDefault();
  const db = getDatabase();

  messages.splice(idx, 1, {
    ...messages[idx],
    favoriteBy: [...messages[idx].favoriteBy, myUid],
  });

  let rel =
    myUid > chatSelected
      ? `${myUid}-${chatSelected}`
      : `${chatSelected}-${myUid}`;

  set(ref(db, "chats/" + rel), {
    messages: [...messages],
  });
};

const renderChat = () => {
  chat.innerHTML = "";
  console.log("message", messages);
  messages.forEach((message, idx) => {
    const divMessage = document.createElement("div");
    const spanMessage = document.createElement("span");
    divMessage.className = message.owner !== myUid ? "sent" : "recived";
    if (message.favoriteBy.some((uid) => myUid === uid)) {
      console.log("entroooo");
      spanMessage.className = "destacado";
    }
    spanMessage.innerText = message.text;
    spanMessage.addEventListener("contextmenu", (e) => destacar(e, idx));
    divMessage.append(spanMessage);
    chat.append(divMessage);
  });
};

const loadChat = (uid) => {
  //ocultar sidebar
  if (chatSelected === uid) {
    return;
  }
  chatSelected = uid;

  let rel =
    myUid > chatSelected
      ? `${myUid}-${chatSelected}`
      : `${chatSelected}-${myUid}`;
  toggleSidebar();

  //buscaremos el chat en la base de datos

  const db = getDatabase();
  const conversation = ref(db, "chats/" + rel);
  onValue(conversation, (snapshot) => {
    const data = snapshot.val();
    if (!data) {
      messages = [];
      renderChat();
      return;
    }
    const newMessages = data.messages.map((item) => {
      return {
        favoriteBy: item.favoriteBy || [],
        text: item.text,
        owner: item.owner,
      };
    });
    messages = newMessages;
    renderChat();
  });
};

const checkIfValidUser = () => {
  if (!localStorage.getItem("uid")) {
    window.location.href = "http://localhost:5500/index.html";
  }
};

//carga inicial

checkIfValidUser();
loadUsers();
sidebarButton.addEventListener("click", toggleSidebar);
menuButton.addEventListener("click", toogleMenu);
sendButton.addEventListener("click", writeMessage);
textInput.addEventListener("keydown", (e) => {
  if (e.code === "Enter") {
    writeMessage();
  }
});
