let menuIcon = document.querySelector("#menu-icon");
let navbar = document.querySelector(".navbar");
let sections = document.querySelectorAll("section");
let navLinks = document.querySelectorAll("header nav a");
let cooldownTimer = null;

window.onscroll = () => {
  sections.forEach((sec) => {
    let top = window.scrollY;
    let offset = sec.offsetTop - 150;
    let height = sec.offsetHeight;
    let id = sec.getAttribute("id");

    if (top >= offset && top < offset + height) {
      navLinks.forEach((links) => {
        links.classList.remove("active");
        document
          .querySelector("header nav a[href*=" + id + "]")
          .classList.add("active");
      });
    }
  });
};

menuIcon.onclick = () => {
  menuIcon.classList.toggle("bx-x");
  navbar.classList.toggle("active");
};

// init EmailJS 1 lần thôi
emailjs.init("at_MwKRnpK0Owe9uR");

// ===== anti-spam cooldown config =====
const COOLDOWN_MS = 30000; // 30s
const LAST_SENT_KEY = "contact_last_sent_at";

function getRemainingCooldownMs() {
  const last = Number(localStorage.getItem(LAST_SENT_KEY) || "0");
  const now = Date.now();
  const remain = COOLDOWN_MS - (now - last);
  return remain > 0 ? remain : 0;
}

// ===== show cooldown immediately on page load =====
function applyCooldownOnLoad() {
  const sendButton =
    document.getElementById("sendBtn") ||
    document.querySelector(".form-group .btn");
  const statusEl = document.getElementById("formStatus");
  if (!sendButton) return;

  const oldText = sendButton.dataset.originalText || "Send Message";

  const tick = () => {
    const remain = getRemainingCooldownMs();

    if (remain <= 0) {
      sendButton.disabled = false;
      sendButton.textContent = oldText;

      if (statusEl) {
        statusEl.textContent = "";
        statusEl.className = "form-status";
      }
      return false;
    }

    const sec = Math.ceil(remain / 1000);
    sendButton.disabled = true;
    sendButton.textContent = `Wait ${sec}s`;

    if (statusEl) {
      statusEl.textContent = `Please wait ${sec}s before sending again.`;
      statusEl.className = "form-status error";
    }
    return true;
  };

  // clear timer cũ để tránh nhiều interval
  if (cooldownTimer) {
    clearInterval(cooldownTimer);
    cooldownTimer = null;
  }

  // chạy ngay + chạy mỗi giây nếu còn cooldown
  if (tick()) {
    cooldownTimer = setInterval(() => {
      if (!tick()) {
        clearInterval(cooldownTimer);
        cooldownTimer = null;
      }
    }, 1000);
  }
}

document.addEventListener("DOMContentLoaded", applyCooldownOnLoad);

// function startCooldownUI(btn, statusEl, oldText, cooldownMs) {
//   const start = Date.now();
//   btn.disabled = true;
//   btn.classList.remove("is-loading");
//   btn.textContent = "Try again soon";

//   if (statusEl) {
//     statusEl.textContent = "❌ Failed to send. Retry available soon.";
//     statusEl.className = "form-status error";
//   }

//   const timer = setInterval(() => {
//     const elapsed = Date.now() - start;
//     const remain = cooldownMs - elapsed;

//     if (remain <= 0) {
//       clearInterval(timer);
//       btn.disabled = false;
//       btn.textContent = oldText;
//       if (statusEl) {
//         statusEl.textContent = "You can try sending again now.";
//         statusEl.className = "form-status";
//       }
//       return;
//     }

//     const sec = Math.ceil(remain / 1000);
//     if (statusEl) {
//       statusEl.textContent = `❌ Failed to send. Retry available in ${sec}s.`;
//       statusEl.className = "form-status error";
//     }
//   }, 1000);
// }

async function sendMail() {
  const sendButton =
    document.getElementById("sendBtn") ||
    document.querySelector(".form-group .btn");

  const statusEl = document.getElementById("formStatus");
  const oldText =
    (sendButton && sendButton.dataset.originalText) || "Send Message";

  const setStatus = (msg, type) => {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.className = `form-status ${type || ""}`.trim();
  };

  // ===== cooldown check (FREE - localStorage) =====
  const remain = getRemainingCooldownMs();
  if (remain > 0) {
    const sec = Math.ceil(remain / 1000);
    setStatus(`Please wait ${sec}s before sending again.`, "error");
    return;
  }

  // ===== validate =====
  const toName = document.querySelector("#toName").value.trim();
  const toEmail = document.querySelector("#toEmail").value.trim();
  const phone = document.querySelector("#phone").value.trim();
  const message = document.querySelector("#message").value.trim();

  if (!toName || !toEmail || !message) {
    setStatus("Please fill in Name, Email, and Message.", "error");
    return;
  }

  // ===== OPTIONAL honeypot (nếu bạn thêm input hidden id="company") =====
  const honey = document.querySelector("#company");
  if (honey && honey.value.trim()) {
    // bot filled hidden field -> silently accept
    setStatus("✅ Message sent successfully!", "success");
    return;
  }

  // ===== UI loading =====
  if (sendButton) {
    sendButton.disabled = true;
    sendButton.classList.add("is-loading");
  }
  setStatus("Sending...", "");

  const params = {
    toName,
    toEmail,
    phone,
    message,
    subject: "We received your message via Portfolio Website",
  };

  const serviceID = "service_aubetcr";
  const templateAutoReply = "template_287p8yr"; // gửi cho user (ToEmail={{toEmail}})
  const templateNotifyOwner = "template_vm5242a"; // gửi cho bạn (ToEmail fixed)

  try {
    await Promise.all([
      emailjs.send(serviceID, templateAutoReply, params),
      emailjs.send(serviceID, templateNotifyOwner, params),
    ]);

    // ===== set cooldown timestamp =====
    sendButton?.classList.remove("is-loading");
    localStorage.setItem(LAST_SENT_KEY, String(Date.now()));
    applyCooldownOnLoad(); // bật countdown 30s ngay sau khi gửi thành công

    setStatus(
      "✅ Message sent successfully! I will get back to you soon.",
      "success"
    );

    // reset form
    document.querySelector("#toName").value = "";
    document.querySelector("#toEmail").value = "";
    document.querySelector("#phone").value = "";
    document.querySelector("#message").value = "";
  } catch (err) {
    console.error(err);

    sendButton?.classList.remove("is-loading");

    // set cooldown để chặn spam click kể cả khi fail
    localStorage.setItem(LAST_SENT_KEY, String(Date.now()));
    applyCooldownOnLoad();

    setStatus("❌ Failed to send. Please try again later.", "error");
  } finally {
    sendButton?.classList.remove("is-loading");
  }
}

// ============================
// Project Details (Static Data)
// ============================
const PROJECTS = {
  "smart-library-system": {
    title: "Smart Library System (AI-powered)",
    youtubeEmbedUrl: "https://www.youtube.com/embed/VIDEO_ID",
    githubUrl: "https://github.com/nnthienphuc/Smart_Library_System",
    description:
      "An intelligent library management system designed to digitalize and automate core library operations while enhancing user experience through an AI-powered recommendation agent. The system manages books, authors, publishers, users, staff, memberships, and borrowing/return workflows via a role-based platform. An AI Agent is integrated using n8n to analyze uploaded documents (PDF/text), generate semantic embeddings, and answer user questions or recommend books based on natural language queries. The solution supports both librarians and readers with real-time search, tracking, statistics, and personalized assistance, replacing traditional manual processes with a scalable, modern, and intelligent system.",
    tech: [
      {
        label: "Backend",
        value:
          "ASP.NET Core RESTful API, Repository Pattern, EF Core, JWT Authentication",
      },
      {
        label: "Frontend (Admin)",
        value: "ReactJS (Admin Dashboard for Librarians)",
      },
      {
        label: "Mobile App",
        value: "React Native (Reader-facing application)",
      },
      { label: "Database", value: "PostgreSQL" },
      {
        label: "AI Agent",
        value:
          "n8n (Workflow Orchestration), Pinecone (Vector DB), Google Gemini (LLM & Embeddings)",
      },
      {
        label: "Deploy & Tools",
        value:
          "Docker, Postman, GitHub, Visual Studio, VS Code, Android Studio",
      },
    ],
  },

  "personal-portfolio-tracker": {
    title: "Personal Portfolio Tracker",
    githubUrl:
      "https://github.com/nnthienphuc/Personal-Portfolio-Tracker-Website",
    youtubeEmbedUrl: "https://www.youtube.com/embed/VIDEO_ID",
    description:
      "A full-stack personal investment tracking system built to manage portfolios, accounts, and transactions with transparent and accurate financial calculations. The application supports multiple asset types including stocks, ETFs, funds, bonds, and crypto, while enforcing strict per-user data isolation. All investment logic such as average cost, realized and unrealized PnL is handled in the backend and follows Vietnamese broker standards, ensuring reliability and consistency for long-term portfolio analysis.",
    tech: [
      {
        label: "Backend",
        value:
          "ASP.NET Core Web API, EF Core, Repository Pattern, JWT Authentication",
      },
      { label: "Frontend", value: "React (Vite), TailwindCSS, Axios" },
      { label: "Database", value: "SQL Server" },
      {
        label: "Deploy & Tools",
        value:
          "Docker, Docker Compose, Postman, GitHub, Visual Studio, VS Code",
      },
      {
        label: "Architecture",
        value: "JWT-secured Client–Server, backend-driven calculations",
      },
    ],
  },

  "supply-distributed-db": {
    title: "Supply Management Project (Distributed database)",
    youtubeEmbedUrl: "https://www.youtube.com/embed/VIDEO_ID",
    description:
      "A desktop application designed to manage inventory import and export operations for a company with two branches, built on a distributed database architecture. The system handles employees, warehouses, materials, purchase orders, goods receipts, and delivery notes with full business validation. Data is horizontally fragmented across multiple servers, where each branch stores its own transactional documents while shared reference data (employees and warehouses) is centralized for cross-branch lookup. The application enforces role-based access control (Company, Branch, User), branch-level data isolation, and business constraints such as preventing stock-in without purchase orders and limiting quantities based on ordered amounts. All core operations and reports are implemented using stored procedures, providing secure, consistent, and scalable data processing.",
    githubUrl:
      "https://github.com/nnthienphuc/PTIT-Co-So-Du-Lieu-Phan-Tan-De-Tai-Quan-Ly-Vat-Tu",
    tech: [
      { label: "Desktop", value: "C# .NET WinForms/WinApp" },
      { label: "UI", value: "DevExpress" },
      { label: "Database", value: "SQL Server (multi-server)" },
      {
        label: "Deploy & Tools",
        value: "GitHub, Visual Studio",
      },
    ],
  },
};

// ============================
// Modal Logic
// ============================
const modalOverlay = document.getElementById("projectModal");
const modalTitle = document.getElementById("modalTitle");
const modalVideo = document.getElementById("modalVideo");
const modalDesc = document.getElementById("modalDescription");
const modalTech = document.getElementById("modalTech");
const modalGithub = document.getElementById("modalGithub");

const closeBtn1 = document.getElementById("modalCloseBtn");
const closeBtn2 = document.getElementById("modalCloseBtn2");

function openProjectModal(projectId) {
  const data = PROJECTS[projectId];
  if (!data) return;

  modalTitle.textContent = data.title || "Project";
  modalDesc.textContent = data.description || "";

  // set youtube
  modalVideo.src = data.youtubeEmbedUrl || "";

  // github
  modalGithub.href = data.githubUrl || "#";

  // tech render
  modalTech.innerHTML = "";
  (data.tech || []).forEach((t) => {
    const div = document.createElement("div");
    div.className = "tech-item";
    div.innerHTML = `<strong>${t.label}</strong><span>${t.value}</span>`;
    modalTech.appendChild(div);
  });

  modalOverlay.classList.add("show");
  modalOverlay.setAttribute("aria-hidden", "false");

  // lock scroll
  document.body.style.overflow = "hidden";
}

function closeProjectModal() {
  modalOverlay.classList.remove("show");
  modalOverlay.setAttribute("aria-hidden", "true");

  // stop video (important)
  modalVideo.src = "";

  document.body.style.overflow = "";
}

// bind open buttons
document.querySelectorAll(".project-detail-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const id = btn.getAttribute("data-project-id");
    openProjectModal(id);
  });
});

// close events
closeBtn1?.addEventListener("click", closeProjectModal);
closeBtn2?.addEventListener("click", closeProjectModal);

// click outside modal closes
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeProjectModal();
});

// ESC closes
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modalOverlay.classList.contains("show")) {
    closeProjectModal();
  }
});
