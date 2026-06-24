const API = "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("token");
}

function redirectIfNotLoggedIn() {
  const token = getToken();
  if (!token) {
    window.location.href = "login.html";
    return null;
  }
  return token;
}

async function loadUsers() {
  const token = redirectIfNotLoggedIn();
  if (!token) return;

  try {
    const res = await fetch(`${API}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401) {
      window.location.href = "login.html";
      return;
    }

    const users = await res.json();
    const container = document.getElementById("users");

    if (!Array.isArray(users) || users.length === 0) {
      container.innerHTML = "<p>No users found</p>";
      return;
    }

    container.innerHTML = users
      .map(
        (user) => `
      <div class="card">
        <h3>${user.name}</h3>
        <p>Skills: ${(user.skills || []).join(", ") || "None"}</p>
        <button onclick="sendRequest('${user._id}')">Send Request</button>
      </div>
    `
      )
      .join("");
  } catch (err) {
    console.log(err);
    document.getElementById("users").innerHTML = "<p>Error loading users</p>";
  }
}

async function searchUsers() {
  const token = redirectIfNotLoggedIn();
  if (!token) return;

  const skill = document.getElementById("searchSkill").value.trim();
  const endpoint = skill
    ? `${API}/users/search?skill=${encodeURIComponent(skill)}`
    : `${API}/users`;

  try {
    const res = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401) {
      window.location.href = "login.html";
      return;
    }

    const users = await res.json();
    const container = document.getElementById("users");

    if (!Array.isArray(users) || users.length === 0) {
      container.innerHTML = "<p>No users found</p>";
      return;
    }

    container.innerHTML = users
      .map(
        (user) => `
      <div class="card">
        <h3>${user.name}</h3>
        <p>Skills: ${(user.skills || []).join(", ") || "None"}</p>
        <button onclick="sendRequest('${user._id}')">Send Request</button>
      </div>
    `
      )
      .join("");
  } catch (err) {
    console.log(err);
    document.getElementById("users").innerHTML = "<p>Error loading users</p>";
  }
}

async function sendRequest(toUserId) {
  const token = redirectIfNotLoggedIn();
  if (!token) return;

  const skillOffered = prompt("Your Skill:");
  const skillWanted = prompt("Their Skill:");
  if (!skillOffered || !skillWanted) return;

  await fetch(`${API}/requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      toUserId,
      skillOffered,
      skillWanted,
    }),
  });

  alert("Request Sent!");
}

loadUsers();
