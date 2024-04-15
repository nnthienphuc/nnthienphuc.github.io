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

(function() {
    emailjs.init("vvnB0T_Rg_x8ZpMae"); // Thay YOUR_USER_ID bằng user ID của bạn

    document.getElementById('contact-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Ngăn form gửi đi một cách thông thường

        // Lấy dữ liệu từ form
        var formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        // Gửi email
        emailjs.send('service_swg5f5e', 'template_l6r5a9r', formData)
            .then(function(response) {
                console.log('Email sent successfully', response);
                alert('Message sent successfully. Thank you!');
            }, function(error) {
                console.log('Email sending failed', error);
                alert('Oops! Something went wrong. Please try again later.');
            });
    });
})();