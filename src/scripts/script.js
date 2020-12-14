import
    Glide,
    {Autoplay, Breakpoints, Controls, Swipe}
    from '@glidejs/glide/dist/glide.modular.esm';
import anime from 'animejs';
import {requests} from './requests.js';

const glide = new Glide('.glide', {
    type: 'carousel',
    autoplay: 2000,
    startAt: 0,
    animationDuration: 1000,
    peek: 50,
    perView: 4,
    breakpoints: {
        480: {
            perView: 1,
        },
        767: {
            perView: 2
        },
        990: {
            perView: 3
        },
    }
});

function process_unsupported_browser() {
  // IntersectionObserver not supported, show all animated elements
  const els = document.querySelectorAll('.section-stagger');
  const images = document.querySelectorAll('.section-fade');

  for (let i = 0; i < els.length; i++) {
      els[i].style.opacity = 1;
  }

  for (let i = 0; i < images.length; i++) {
      images[i].style.opacity = 1;
  }
}

function registerIOs() {
    const io_options = {
      rootMargin: '0px',
      threshold: 0.5
    };
    const element_in_view = (element) => {
        if (element[0].isIntersecting && !element[0].target.dataset.loaded) {
            // Only play animations once
            element[0].target.dataset.loaded = true;
            const tl = anime.timeline();
            const stagger_els = element[0].target.querySelectorAll('.section-stagger');
            const fade_in_els = element[0].target.querySelectorAll('.section-fade');

            tl.add({
              targets: stagger_els,
              translateY: [30, 0],
              opacity: [0, 1],
              delay: anime.stagger(75),
              easing: 'easeOutExpo',
            })
            .add({
              targets: fade_in_els,
              opacity: [0, 1],
              duration: 1000,
              easing: 'linear',
            }, 0);
        }
    };
    const sections = document.querySelectorAll('section');

    sections.forEach((section) => {
        let observer = new IntersectionObserver(element_in_view, io_options);

        observer.observe(section);
    });
}

function resizeHeaderOnScroll() {
    const headerEl = document.querySelector('header');
    const distanceY = window.pageYOffset ||
        document.documentElement.scrollTop;
    const shrinkOn = 200;

    if (distanceY > shrinkOn) {
        headerEl.classList.add('scrolled');
    } else {
        headerEl.classList.remove('scrolled');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Detect if browser supports IntersectionObserver
    if (!('IntersectionObserver' in window) ||
        !('IntersectionObserverEntry' in window) ||
        !('intersectionRatio' in window.IntersectionObserverEntry.prototype)) {
        process_unsupported_browser();
        send_email();
    }
    else {
        registerIOs();
    }
    glide.mount({Autoplay, Breakpoints, Controls, Swipe});
    window.addEventListener('scroll', resizeHeaderOnScroll);
    send_email();

}, false);

window.onscroll = () => {
    let nav = document.querySelector('#navbar');
    if(scrollY <= 10) nav.className = ''; else nav.className = 'scroll';
  };

const toggle = document.querySelector('.theme-switch input[type="checkbox"]');
const switch_theme = document.documentElement;

function changeTheme(th) {
    if (th.target.checked) {
        switch_theme.setAttribute('my-theme', 'dark');
    } else {
        switch_theme.setAttribute('my-theme', 'root');
    }
}

toggle.addEventListener('change', changeTheme, false);

function process_cookie_modal() {
    if (getCookie('cookie_accepted') !== 'true') {
        document.getElementById('cookies-overlay').style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    process_cookie_modal();
}, false);

var accept_cookie_button = document.getElementById('accept_cookie_button');
var cookieEnabled = navigator.cookieEnabled;

if (!cookieEnabled) {
    accept_cookie_button.onclick = () => {
    
        setCookie('cookie_accepted', 'true');
    
        var hide = document.getElementById('cookies-overlay');
    
        if (hide) {
            hide.classList.remove('fade-up');
            hide.classList.add('fade-down')
            document.getElementById('cookies-overlay').style.display = 'none';
        }
    };
}

function getCookie(cname) {
    let name = cname + '=';
    let etCookie = document.cookie.split(';');
    for (let i = 0; i < etCookie.length; i++) {
        let et = etCookie[i];
        while (et.charAt(0) === ' ') {
            et = et.substring(1);
        }
        if (et.indexOf(name) === 0) {
            return et.substring(name.length, et.length);
        }
    }
    return '';
}

function setCookie(cname, cvalue, exdays) {
    let date = new Date();
    date.setTime(date.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = 'expires' + date.toUTCString();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path/';
}

const form = document.getElementById('contact-form');
var contact_page = window.location.pathname;

const register_form = document.getElementById('register-form');


if (contact_page != "/register.html") {
    form.addEventListener('submit', (event) => {
        send_email();
    
        event.preventDefault();
    
        // setTimeout(() => {
        //     let hostname = window.location
    
        //     if (hostname === 'localhost') {
        //         window.location.replace('http://localhost:8180/received.html');
        //     } else {
        //         window.location.replace(`${origin}/received.html`);
        //     }
        // },500);
    });
} else {
    register_form.addEventListener('submit', (event) => {
        register();
        event.preventDefault();
    });
}

function register() {
    var register_form = document.getElementById('register-form');

    console.log(register_form.elements[0].value);
    console.log(register_form.elements[1].value);
    console.log(register_form.elements[2].value);
    console.log(register_form.elements[3].value);
    console.log(register_form.elements[4].value);
    console.log(register_form.elements[5].value);
    console.log(register_form.elements[6].value);
    console.log(register_form.elements[7].value);
    console.log(register_form.elements[8].value);
    console.log(register_form.elements[9].value);
    
}

function send_email() {
    const form = document.getElementById('contact-form');

    let name = form.elements[0].value;
    let email = form.elements[1].value;
    let phone = form.elements[2].value;
    let comment = form.elements[3].value;

    const url = 'https://api.sendinblue.com/v3/smtp/email';
    let api_key = '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';

    requests.send_email(
        {
            url: url,
            'sender':{
               'name':'Contact form',
               'email':'noreply@marusocare.com'
            },
            'to':[
               {
                  'email':'bogdan.vlad.v@gmail.com'
               }
            ],
            'htmlContent': (
                '<h3>Hi </h3>' +
                '<p>A new form has been submitted.</p>' +
                `<h5>Name: ${name}</h5>` +
                `<h5>Email: ${email}</h5>` +
                `<h5>Telephone: ${phone}</h5>` +
                `<h5>Comment: ${comment}</h5>`
            ),
            'subject':'New Contact',
            'replyTo':{
               'email':'noreply@marusocare.com'
            },
        },
        {
            headers: {
                Accept: 'application/json',
                'api-key': api_key,
            },
        }
    );
}

var conviction = document.getElementById('convicted_yes');
var not_convicted = document.getElementById('convicted_no');
var criminal = document.getElementById("criminal");

conviction.onclick = () => {
    if (conviction.id == 'convicted_yes') {
        criminal.style.display = "block";
    }
}
not_convicted.onclick = () => {
    if (not_convicted.id == 'convicted_no') {
        criminal.style.display = "none";
    }
}

var suspension_yes = document.getElementById('suspension_yes');
var suspension_no = document.getElementById('suspension_no');
var investigation = document.getElementById('investigation');

suspension_yes.onclick = () => {
    if (suspension_yes.id == 'suspension_yes') {
        investigation.style.display = "block";
    }
}
suspension_no.onclick = () => {
    if (suspension_no.id == 'suspension_no') {
        investigation.style.display = "none";
    }
}

var health_yes = document.getElementById('health_yes');
var health_no = document.getElementById('health_no');
var health = document.getElementById('health');

health_yes.onclick = () => {
    if (health_yes.id == 'health_yes') {
        health.style.display = "block";
    }
}

health_no.onclick = () => {
    if (health_no.id == 'health_no') {
        health.style.display = "none";
    }
}


// $('.g-recaptcha').attr("data-sitekey", function(){
//     if(window.location.hostname === 'localhost') {
//         return "6Ld_PbsZAAAAAAVXdVCVYH0DtjnrTpb5uGeMM3Ss";
//     } else if (window.location.hostname === 'tuware.com') {
//         return "6LdrQL4ZAAAAAB_De68eFv_WYXCBZ1CXWNbLBTIj";
//     } else if (window.location.hostname === 'https://tuware-website.nw.r.appspot.com/') {
//         return "6LdgZL0ZAAAAAFigyThLoxtZ8LpfLbQ26JNdNsxc";
//     }
//  });

 // Close the modal by clicking anywhere outside of the modal content box

// $(document).click(function(event) {
//     if ($(event.target).closest(".modal,.open-modal").length) {
//         $("body").find(".modal:target").hide();
//     }
//     else {
//         $(".open-modal").click(function() {
//             $(".modal").addClass("visible");
//         });
//     }
// });
