let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    sections.forEach (sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
            navLinks.forEach (links => {
                links.classList.remove('active');
                document.querySelector('header nav a [href*=' + id + ' ]').classList.add('active')
            })
        }
    })
}

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
}

function sendMail() {
    (function() {
        emailjs.init("DvtCWTTErXVYkID27");
    })();

    var params = {
        toName: document.querySelector("#toName").value,
        toEmail: document.querySelector("#toEmail").value,
        phone: document.querySelector("#phone").value,
        subject: document.querySelector("#subject").value,
        message: document.querySelector("#message").value,
        // replyto: "noreply@gmail.com",
    };

    var serviceID = "service_aubetcr";
    var templateID = "template_287p8yr";

    emailjs.send(serviceID, templateID, params)
    .then( res => {
        alert("Email sent successfully!");
    })
    .catch();
}

        // emailjs.send(serviceID, templateID, fullFormData)
        //     .then(function(response) {
        //         console.log('Email sent successfully', response);
        //         alert('Message sent successfully. Thank you!');
        //     }, function(error) {
        //         console.log('Email sending failed', error);
        //         alert('Oops! Something went wrong. Please try again later.');
        //     });