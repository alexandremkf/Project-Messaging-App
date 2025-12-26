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

  alert(res.ok ? "Usuário registrado!" : "Erro ao registrar");
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

  if (messagesInterval) clearInterval(messagesInterval);

  document.getElementById("auth-section").style.display = "block";
  document.getElementById("app").style.display = "none";
}

/* ---------- TOKEN ---------- */

async function validateToken() {
  const res = await fetch(`${API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  res.ok ? showUsers() : logout();
}

function parseJwt(token) {
  return JSON.parse(atob(token.split(".")[1]));
}

/* ---------- USERS ---------- */

async function showUsers() {
  document.getElementById("auth-section").style.display = "none";
  document.getElementById("app").style.display = "flex";

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

function openChat(userId, username) {
  currentChatUserId = userId;
  document.getElementById("chat-with").textContent = username;

  loadMessages();

  if (messagesInterval) clearInterval(messagesInterval);
  messagesInterval = setInterval(loadMessages, 3000);
}

async function loadMessages() {
  const res = await fetch(`${API_URL}/messages/${currentChatUserId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const messages = await res.json();
  const container = document.getElementById("messages");
  container.innerHTML = "";

  const myId = parseJwt(token).userId;

  messages.forEach(msg => {
    const div = document.createElement("div");
    div.classList.add("message");

    if (msg.senderId === myId) {
      div.classList.add("me");
    }

    div.textContent = msg.content;
    container.appendChild(div);
  });

  container.scrollTop = container.scrollHeight;
}

async function sendMessage() {
  const input = document.getElementById("message-input");
  if (!input.value || !currentChatUserId) return;

  await fetch(`${API_URL}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      content: input.value,
      receiverId: currentChatUserId,
    }),
  });

  input.value = "";
  loadMessages();
}