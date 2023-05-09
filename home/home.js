let showSidebar = false;
let showMenu = false;
let chatSelected = null;
const sidebar = document.getElementById("sidebar");
const menu = document.getElementById("menu");
const chat = document.getElementById("chat");
const usuarios = [
  {
    id: 1,
    name: "Anna Soto",
    email: "annaochoa98@gmail.com",
    messages: [
      {
        owner: true,
        text: "Hola, como estas",
      },
      {
        owner: false,
        text: "Muy bien, y tu?",
      },
      {
        owner: false,
        text: "si supiste?",
      },
      {
        owner: true,
        text: "Que cosa?",
      },
      {
        owner: false,
        text: "is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      },
    ],
  },
  {
    id: 2,
    name: "Jesús García",
    email: "jesusblastoise99@gmail.com",
  },
  {
    id: 3,
    name: "Victor Soto",
    email: "victorsoto@gmail.com",
  },
  {
    id: 4,
    name: "Luis Castro",
    email: "cetis68tv@gmail.com",
  },
  {
    id: 5,
    name: "Alhely Celaya",
    email: "alelilolu@gmail.com",
  },
  {
    id: 6,
    name: "Jose Osuna",
    email: "chepe_charmander@gmail.com",
  },
];
const toogleMenu = () => {
  if (showMenu) {
    menu.style.right = "-200px";
    showMenu = !showMenu;
    return;
  }
  menu.style.right = "0px";
  showMenu=!showMenu;
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

const initialLoad = () => {
  loadUsers();
};

const loadUsers = () => {
  //haremos la consulta a la base de datos, para obtener la lista de usuarios
  //codigo de la consulta
  //una vez cargada la informacion, se mostrara

  usuarios.forEach((user) => {
    const divContenedor = document.createElement("div");
    const spanName = document.createElement("span");
    spanName.innerText = user.name;
    divContenedor.onclick = () => loadChat(user.id);
    divContenedor.append(spanName);
    sidebar.append(divContenedor);
  });
};

const loadChat = (id) => {
  //ocultar sidebar
  toggleSidebar();

  //buscaremos el chat en la base de datos
  if (chatSelected === id) {
    return;
  }
  chat.innerHTML = "";
  chatSelected = id;
  const userSelected = usuarios.find((user) => user.id === id);
  if (userSelected.messages) {
    userSelected.messages.forEach((message) => {
      const divMessage = document.createElement("div");
      const spanMessage = document.createElement("span");
      divMessage.className = message.owner ? "sent" : "recived";
      spanMessage.innerText = message.text;
      divMessage.append(spanMessage);
      chat.append(divMessage);
    });
  }
};
