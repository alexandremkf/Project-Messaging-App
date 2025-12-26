const API_URL = "http://localhost:3000/api";
let token = localStorage.getItem("token");
let currentChatUserId = null;
let messagesInterval = null;

if (token) {
  validateToken();
}

/* ---------- AUTH ---------- */

async function register() {
  const username = document.getElementById("username-register").value;
  const email = document.getElementById("email-register").value;
  const password = document.getElementById("password-register").value;

  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  if (res.ok) {
    alert("Usuário registrado com sucesso!");
  } else {
    alert("Erro ao registrar");
  }
}

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (data.token) {
    token = data.token;
    localStorage.setItem("token", token);
    showUsers();
  } else {
    alert("Login inválido");
  }
}

function logout() {
  localStorage.removeItem("token");
  token = null;

  if (messagesInterval) {
    clearInterval(messagesInterval);
    messagesInterval = null;
  }

  document.getElementById("auth-section").style.display = "block";
  document.getElementById("users-section").style.display = "none";
  document.getElementById("chat-section").style.display = "none";
}

async function validateToken() {
  try {
    const res = await fetch(`${API_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      showUsers();
    } else {
      logout();
    }
  } catch {
    logout();
  }
}

function parseJwt(token) {
  const base64 = token.split(".")[1];
  return JSON.parse(atob(base64));
}

/* ---------- USERS ---------- */

async function showUsers() {
  document.getElementById("auth-section").style.display = "none";
  document.getElementById("users-section").style.display = "block";

  const res = await fetch(`${API_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const users = await res.json();
  const list = document.getElementById("users-list");
  list.innerHTML = "";

  users.forEach(user => {
    const li = document.createElement("li");
    li.textContent = user.username;
    li.onclick = () => openChat(user.id, user.username);
    list.appendChild(li);
  });
}

/* ---------- CHAT ---------- */

async function openChat(userId, username) {
  currentChatUserId = userId;
  document.getElementById("chat-section").style.display = "block";
  document.getElementById("chat-with").textContent = `Chat com ${username}`;

  loadMessages();

  if (messagesInterval) {
    clearInterval(messagesInterval);
  }

  messagesInterval = setInterval(loadMessages, 3000);
}

async function loadMessages() {
  const res = await fetch(`${API_URL}/messages/${currentChatUserId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const messages = await res.json();
  const container = document.getElementById("messages");
  container.innerHTML = "";

  messages.forEach(msg => {
    const div = document.createElement("div");
    div.textContent = msg.content;

    if (msg.senderId === undefined) return;

    if (msg.senderId === parseJwt(token).userId) {
        div.style.textAlign = "right";
        div.style.fontWeight = "bold";
    }

    container.appendChild(div);
  });

  container.scrollTop = container.scrollHeight;
}

async function sendMessage() {
  const input = document.getElementById("message-input");
  const content = input.value;

  if (!content) return;

  if (!currentChatUserId) {
    alert("Selecione um usuário para conversar");
    return;
  }

  await fetch(`${API_URL}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      content,
      receiverId: currentChatUserId,
    }),
  });

  input.value = "";
  loadMessages();
}