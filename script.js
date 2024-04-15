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
        emailjs.init("vvnB0T_Rg_x8ZpMae"); // Thay YOUR_USER_ID bằng user ID của bạn
    
        var sender_name = document.getElementById('name').value;
        var sender_email = document.getElementById('email').value;
        var sender_phone = document.getElementById('phone').value;
        var sender_subject = document.getElementById('subject').value;
        var sender_message = document.getElementById('message').value;
    
        var fullFormData = {
            sender_name: sender_name,
            sender_email: sender_email,
            sender_phone: sender_phone,
            sender_subject: sender_subject,
            sender_message: sender_message
        };
    
        // Gửi email
        var serviceID = "service_swg5f5e";
        var templateID = "template_c71x6wk";
        emailjs.send(serviceID, templateID, fullFormData)
            .then(function(response) {
                console.log('Email sent successfully', response);
                alert('Message sent successfully. Thank you!');
            }, function(error) {
                console.log('Email sending failed', error);
                alert('Oops! Something went wrong. Please try again later.');
            });
    })();
}
