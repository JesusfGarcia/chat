import { db } from "../firebase.js";

import {
  collection,
  getDocs,
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

function writeMessage() {
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
      },
    ],
  });
  textInput.value = "";
}

const renderChat = () => {
  chat.innerHTML = "";
  messages.forEach((message) => {
    const divMessage = document.createElement("div");
    const spanMessage = document.createElement("span");
    divMessage.className = message.owner !== myUid ? "sent" : "recived";
    spanMessage.innerText = message.text;
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
    const newMessages = data.messages.map((item) => {
      return {
        text: item.text,
        owner: item.owner,
      };
    });
    messages = newMessages;
    renderChat();
  });
};

//carga inicial
loadUsers();
sidebarButton.addEventListener("click", toggleSidebar);
menuButton.addEventListener("click", toogleMenu);
sendButton.addEventListener("click", writeMessage);
textInput.addEventListener("keydown", (e) => {
  if (e.code === "Enter") {
    writeMessage();
  }
});
