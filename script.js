let menuIcon = document.querySelector("#menu-icon");
let navbar = document.querySelector(".navbar");
let sections = document.querySelectorAll("section");
let navLinks = document.querySelectorAll("header nav a");

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

function sendMail() {
  const sendButton = document.querySelector(".form-group .btn");
  console.log(sendButton);
  sendButton.disabled = true;

  (function () {
    emailjs.init("at_MwKRnpK0Owe9uR");
  })();

  var params = {
    toName: document.querySelector("#toName").value,
    toEmail: document.querySelector("#toEmail").value,
    phone: document.querySelector("#phone").value,
    subject:
      "This is an automated email to confirm that we received your message.",
    message: document.querySelector("#message").value,
    // replyto: "noreply@gmail.com",
  };

  var serviceID = "service_aubetcr";
  var templateID = "template_287p8yr";

  emailjs
    .send(serviceID, templateID, params)
    .then((res) => {
      alert("Email sent successfully!");

      // Reset the form fields
      document.querySelector("#toName").value = "";
      document.querySelector("#toEmail").value = "";
      document.querySelector("#phone").value = "";
      // document.querySelector("#subject").value = '';
      document.querySelector("#message").value = "";
    })
    .catch((err) => {
      alert("Failed to send email. Please try again later.");
      console.error("Error sending email:", err);
    })
    .finally(() => {
      sendButton.disabled = false;
    });
}

// emailjs.send(serviceID, templateID, fullFormData)
//     .then(function(response) {
//         console.log('Email sent successfully', response);
//         alert('Message sent successfully. Thank you!');
//     }, function(error) {
//         console.log('Email sending failed', error);
//         alert('Oops! Something went wrong. Please try again later.');
//     });

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
        value: "Docker, Docker Compose, Postman, GitHub, Visual Studio, VS Code",
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
