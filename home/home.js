import { db } from "../firebase.js";

import {
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";

//base de datos en tiempo real
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
const sidebarButton = document.getElementById("sidebarButton");
const menuButton = document.getElementById("menuButton");
const sendButton = document.getElementById("send");
const textInput = document.getElementById("textMessage");

//obtenemos id del usuario
const myUid = localStorage.getItem("uid");

//abre y cierra el menu derecho
const toogleMenu = () => {
  if (showMenu) {
    menu.style.right = "-200px";
    showMenu = !showMenu;
    return;
  }
  menu.style.right = "0px";
  showMenu = !showMenu;
};

//abre y cierra el sidebar izquierdo
const toggleSidebar = () => {
  if (showSidebar) {
    sidebar.style.left = "-200px";
    showSidebar = !showSidebar;
    return;
  }

  sidebar.style.left = "0px";
  showSidebar = !showSidebar;
};

//carga la lista de usuarios en el sidebar
const loadUsers = async () => {
  //hacer la peticion a firebase para que devuelva la lista de usuarios
  const querySnapshot = await getDocs(collection(db, "users"));

  querySnapshot.forEach((doc) => {
    const element = doc.data();
    //revisamos si el uid no es nuestro, para agregarlo a lista de usuarios
    if (element.uid !== myUid) {
      usuarios.push(element);
    }
  });

  //una vez cargada la informacion, se mostrara

  usuarios.forEach((user) => {
    //por cada usuario encontrado, creamos un codigo html para renderizarlo
    const divContenedor = document.createElement("div");
    const spanName = document.createElement("span");
    spanName.innerText = user.nick;
    divContenedor.onclick = () => loadChat(user.uid);
    divContenedor.append(spanName);
    sidebar.append(divContenedor);
  });
};

//cargamos el chat en la pantalla
const loadChat = (uid) => {
  //ocultar sidebar
  if (chatSelected === uid) {
    return;
  }

  //guardamos el id del usuario al que le mandaremos msg
  chatSelected = uid;

  //creamos un id unico de la conversacion Z-A
  let rel =
    myUid > chatSelected //si uid > id del chat
      ? `${myUid}-${chatSelected}` //true
      : `${chatSelected}-${myUid}`; //false

  toggleSidebar();

  //buscaremos el chat en la base de datos
  const db = getDatabase();
  const conversation = ref(db, "chats/" + rel);
  //listener que se queda escuchando a la conversacion
  onValue(conversation, (snapshot) => {
    //obtenemos la estructura de la base datos
    const data = snapshot.val();

    //si no hay nada en la liga renderizamos chat vacio
    if (!data) {
      messages = [];
      renderChat();
      return;
    }

    //recorremos la lista de mensajes
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

//renderizamos el chat
const renderChat = () => {
  //vaciamos el html del contenedor del chat
  chat.innerHTML = "";

  //creamos un componente por cada mensaje, con sus respectivas clases de css
  messages.forEach((message, idx) => {
    const divMessage = document.createElement("div");
    const spanMessage = document.createElement("span");
    divMessage.className = message.owner !== myUid ? "sent" : "recived";
    //verificamos si le hemos dado destacado al mensaje
    if (message.favoriteBy.some((uid) => myUid === uid)) {
      spanMessage.className = "destacado";
    }

    spanMessage.innerText = message.text;
    //agregamos la funcionalidad de destacar al texto
    spanMessage.addEventListener("contextmenu", (e) => destacar(e, idx));
    divMessage.append(spanMessage);
    chat.append(divMessage);
  });
};

//destacar mensaje
const destacar = async (e, idx) => {
  e.preventDefault();
  const db = getDatabase();

  //buscamos el mensaje y lo editamos para que tenga nuestro uid en el arreglo de favoriteBy
  messages.splice(idx, 1, {
    ...messages[idx],
    favoriteBy: [...messages[idx].favoriteBy, myUid],
  });

  //volvemos a generar llave de la bd
  let rel =
    myUid > chatSelected
      ? `${myUid}-${chatSelected}`
      : `${chatSelected}-${myUid}`;

  //modificamos la base de datos en tiempo real, para que contenga nuestro destacado
  set(ref(db, "chats/" + rel), {
    messages: [...messages],
  });
};

//escribir mensaje
const writeMessage = () => {
  const db = getDatabase();
  const text = textInput.value;

  //revisamos si el texto esta vacio
  if (!text) {
    return;
  }

  //generamos la llave
  let rel =
    myUid > chatSelected
      ? `${myUid}-${chatSelected}`
      : `${chatSelected}-${myUid}`;

  //se agrega el mensaje a la base de datos en tiempo real
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

  //vaciamos el text input
  textInput.value = "";
};

//revisar si el usuario puede visualizar esta pantalla
const checkIfValidUser = () => {
  if (!localStorage.getItem("uid")) {
    window.location.href = "http://localhost:5500/index.html";
  }
};

//carga inicial
checkIfValidUser();
loadUsers();

//agregamos funcionalidades a sidebar, menu, boton de enviar, y text input
sidebarButton.addEventListener("click", toggleSidebar);
menuButton.addEventListener("click", toogleMenu);
sendButton.addEventListener("click", writeMessage);
textInput.addEventListener("keydown", (e) => {
  if (e.code === "Enter") {
    writeMessage();
  }
});
