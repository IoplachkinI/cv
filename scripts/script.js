let popups_active = 0;

//gallery

const gallery_popup_picture = document.querySelector(".gallery-popup__picture");
const gallery_popup_container = document.querySelector(".gallery-popup-container");
const gallery_button_prev = document.querySelector(".button_prev");
const gallery_button_next = document.querySelector(".button_next");

let gallery_popup_active = false;

const pictures = Array.from(document.querySelectorAll(".gallery__picture"));

const srcs = pictures.map(picture => picture.src);

pictures.forEach(picture => {
  picture.addEventListener('click', () => {
    initGalleryPopup(picture.dataset.ind);
  })
});

gallery_button_prev.addEventListener('click', () => {
  scrollGallery(-1);
});

gallery_button_next.addEventListener('click', () => {
  scrollGallery(1);
});

function initGalleryPopup(ind) {
  if (gallery_popup_active) {
    return;
  }
  gallery_popup_container.classList.remove('inactive');
  gallery_popup_container.classList.add('active');
  gallery_popup_picture.src = srcs[ind];
  gallery_popup_picture.dataset.ind = ind;
  handleButtons()
  gallery_popup_active = true;
  ++popups_active;
  popupBackgroundHandler()
}

function closeGalleryPopup() {
  if (!gallery_popup_active) {
    return;
  }
  gallery_button_prev.classList.remove('active');
  gallery_button_prev.classList.add('inactive');
  gallery_button_next.classList.remove('active');
  gallery_button_next.classList.add('inactive');
  gallery_popup_container.classList.remove('active');
  gallery_popup_container.classList.add('inactive');
  gallery_popup_picture.dataset.ind = -1;
  gallery_popup_active = false;
  --popups_active;
  popupBackgroundHandler()
}

function scrollGallery(delta) {
  let cur_ind = parseInt(gallery_popup_picture.dataset.ind);
  if (cur_ind + delta < 0 || cur_ind + delta >= pictures.length) {
    return;
  }
  let new_ind = cur_ind + delta
  gallery_popup_picture.dataset.ind = new_ind;

  handleButtons()

  gallery_popup_picture.src = srcs[new_ind];
}

function handleButtons() {
  if (parseInt(gallery_popup_picture.dataset.ind) === 0) {
    gallery_button_prev.classList.add('inactive');
    gallery_button_prev.classList.remove('active');
  } else if (!gallery_button_prev.classList.contains('active')) {
    gallery_button_prev.classList.add('active');
    gallery_button_prev.classList.remove('inactive');
  }

  if (parseInt(gallery_popup_picture.dataset.ind) === pictures.length - 1) {
    gallery_button_next.classList.add('inactive');
    gallery_button_next.classList.remove('active');
  } else if (!gallery_button_next.classList.contains('active')) {
    gallery_button_next.classList.add('active');
    gallery_button_next.classList.remove('inactive');
  }
}

// info popup

const info_popup_container = document.querySelector(".info-popup-container");
const info_popup_text = document.querySelector(".info-popup__text");

let info_popup_active = false;

function initInfoPopup(message) {
  if (!info_popup_active) {
    info_popup_container.classList.remove('inactive');
    info_popup_container.classList.add('active');
    info_popup_container.style.transform = "scale(1.0)";
    info_popup_active = true;
    ++popups_active;
    popupBackgroundHandler()
  }
  info_popup_text.innerHTML = message;
}

function closeInfoPopup() {
  if (!info_popup_active) {
    return;
  }
  info_popup_container.style.transform = "scale(0.0)"
  info_popup_active = false;
  setTimeout(function () {
    info_popup_container.classList.remove('active');
    info_popup_container.classList.add('inactive');
    --popups_active;
    popupBackgroundHandler();
  }, 500); // the same amount of time the transition takes
}

// feedback form

const form_popup_container = document.querySelector(".form-popup-container");
const form_submit_button = document.querySelector(".submit_button");

const form_link_button = document.querySelector(".form-link");

let form_popup_active = false;

form_link_button.addEventListener('click', () => {
  initFormPopup();
});

form_submit_button.addEventListener('click', () => {
  processForm();
});

function initFormPopup() {
  if (form_popup_active) {
    return;
  }
  if (!form_submit_button.classList.contains("button-loading")) {
    form_submit_button.value = "Отправить";
    form_submit_button.classList.remove("button-success");
    form_submit_button.classList.remove("button-failure");
    form_submit_button.disabled = false;
  }
  form_popup_container.classList.remove('inactive');
  form_popup_container.classList.add('active');
  form_popup_container.style.transform = "scale(1.0)";
  form_popup_active = true;
  ++popups_active;
  popupBackgroundHandler()
}

function closeFormPopup() {
  if (!form_popup_active) {
    return;
  }
  form_popup_container.style.transform = "scale(0.0)"
  form_popup_active = false;
  setTimeout(function () {
    form_popup_container.classList.remove('active');
    form_popup_container.classList.add('inactive');
    --popups_active;
    popupBackgroundHandler();
  }, 500); // the same amount of time the transition takes
}

function processForm() {
  const form_tel = document.querySelector(".form-body__input-field[type=tel]");
  const form_email = document.querySelector(".form-body__input-field[type=email]");
  const form_feedback = document.querySelector(".form-body__input-field[id=feedback]");

  let tel_data = form_tel.value;
  let email_data = form_email.value;
  let feedback_data = form_feedback.value;

  if (!validateTel(tel_data)) {
    initInfoPopup("Неправильный формат телефонного номера!");
    return;
  } else if (!validateEmail(email_data)) {
    initInfoPopup("Неправильный формат электронной почты!");
    return;
  } else if (!validateFeedback(feedback_data)) {
    initInfoPopup("Неправильный текст фидбека " +
        "(используйте только символы кириллицы, цифры 0-9, или символы '.', ',', '?', '!', ':', ';'. '-')");
    return;
  }

  form_submit_button.value = "Отправка...";
  form_submit_button.classList.add("button-loading");
  form_submit_button.disabled = true;
  document.body.style.cursor = 'wait';

  (new Promise(resolve => setTimeout(resolve, 1000))).then(
      () => sendData("").then((response) => {
        if (response.ok) {
          form_submit_button.value = "Успех!";
          form_submit_button.classList.remove("button-loading");
          form_submit_button.classList.add("button-success");
          document.body.style.cursor = 'default';
          form_tel.value = "";
          form_email.value = "";
          form_feedback.value = "";
        } else {
          form_submit_button.value = "Ошибка!";
          form_submit_button.classList.remove("button-loading");
          form_submit_button.classList.add("button-failure");
          document.body.style.cursor = 'default';
        }
      }).catch(() => {
        form_submit_button.value = "Ошибка!";
        form_submit_button.classList.remove("button-loading");
        form_submit_button.classList.add("button-failure");
        document.body.style.cursor = 'default';
      })
  );
}

async function sendData(data) {
  return await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: data
  });
}

function validateTel(tel_data) {
  return /^(\+7|8)\([0-9]{3}\)[0-9]{3}-[0-9]{2}-[0-9]{2}$/.test(tel_data)
      || /^(\+7|8)[0-9]{10}$/.test(tel_data);
}

function validateEmail(email_data) {
  return /^[a-zA-Z0-9\-.]*@[a-zA-Z0-9\-.]*.[a-zA-Z]*$/.test(email_data);
}

function validateFeedback(feedback_data) {
  return /^[а-яА-Я0-9.,?!:;\- ]*$/.test(feedback_data);
}

// Timed popup

const timed_popup_container = document.querySelector(".timed-popup-container");
const timed_popup_link = document.querySelector(".timed-popup__link")

timed_popup_link.addEventListener('mouse', () => {
  closeTimedPopup();
});

let timed_popup_active = false;

function initTimedPopup() {
  if (timed_popup_active) {
    return;
  }
  timed_popup_container.classList.add("active");
  timed_popup_container.classList.remove("inactive");
  timed_popup_container.style.transform = "scale(1.0)";
  timed_popup_active = true;
  ++popups_active;
  popupBackgroundHandler()
}

function closeTimedPopup() {
  if (!timed_popup_active) {
    return;
  }
  timed_popup_container.style.transform = "scale(0.0)"
  timed_popup_active = false;
  setTimeout(function () {
    timed_popup_container.classList.add('inactive');
    timed_popup_container.classList.remove('active');
    --popups_active;
    popupBackgroundHandler()
  }, 500); // the same amount of time the transition takes
}

function timedPopup() {
  if (localStorage.getItem("popup_shown") === "true") {
    return;
  }
  setTimeout(() => {
    initTimedPopup();
    localStorage.setItem("popup_shown", "true");
  }, 30000); // 30s
}

localStorage.setItem("popup_shown", "false");
timedPopup();

// popup background

const popup_background = document.querySelector(".popup__background");
const popup_link = document.querySelector(".timed-popup__link");

let popup_background_active = false;

popup_link.addEventListener('click', () => {
  closeTimedPopup();
  popup_background_active();
});

function popupBackgroundHandler() {
  if (popups_active === 0 && popup_background_active) {
    popup_background.classList.add("inactive");
    popup_background.classList.remove("active");
    popup_background_active = false;
  } else if (popups_active > 0 && !popup_background_active) {
    popup_background.classList.add("active");
    popup_background.classList.remove("inactive");
    popup_background_active = true;
  }
}

// popup controls

document.addEventListener('click', function (event) {
  if (event.target === gallery_popup_container) {
    closeGalleryPopup();
  }
  if (event.target === form_popup_container) {
    closeFormPopup();
  }
  if (event.target === timed_popup_container) {
    closeTimedPopup();
  }

  if (event.target === info_popup_container) {
    closeInfoPopup();
  }
});

document.addEventListener('keyup', (event) => {
  if (event.key === 'Escape') {
    if (timed_popup_active) {
      closeTimedPopup();
    } else if (info_popup_active) {
      closeInfoPopup();
    } else if (form_popup_active) {
      closeFormPopup();
    } else if (gallery_popup_active) {
      closeGalleryPopup();
    }
  }
});

document.addEventListener('keyup', (event) => {
  if (event.key === 'ArrowLeft' && gallery_popup_active) {
    scrollGallery(-1);
  }
  if (event.key === 'ArrowRight' && gallery_popup_active) {
    scrollGallery(1);
  }
});

// countdown

const countdown_text = document.querySelector(".countdown-text");

function updateCountdown() {
  let final_time = new Date("Nov 11, 1970 00:00:00");
  let cur_time = new Date();

  final_time.setFullYear(cur_time.getFullYear());

  if (final_time < cur_time) {
    final_time.setFullYear(final_time.getFullYear() + 1);
  }

  let left_time = final_time - cur_time;

  let seconds = Math.floor((left_time % (1000 * 60)) / 1000);
  let minutes = Math.floor((left_time % (1000 * 60 * 60)) / (1000 * 60));
  let hours = Math.floor((left_time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let days = Math.floor(left_time / (1000 * 60 * 60 * 24));

  countdown_text.innerHTML = ("000" + days).slice(-3) + ':' + ("00" + hours).slice(-2)
      + ':' + ("00" + minutes).slice(-2) + ':' + ("00" + seconds).slice(-2);
}

updateCountdown();

setInterval(function () {
  updateCountdown();
}, 1000)

// interactive bg

let last_scroll_pos = window.scrollY;
let scroll_pos = window.scrollY;
let ticking = false;

const bg_lines = [];
let rand_coeffs = [];
let start_pos = [];
const svg_container = document.querySelector(".svg-container");

const lines_count = 250;

function init_bg() {
  svg_container.setAttribute("height",
      (document.body.offsetHeight + document.querySelector('.footer').offsetHeight).toString());
  svg_container.setAttribute("width", document.body.offsetWidth.toString());

  for (let i = 0; i < lines_count; ++i) {
    const x = Math.random() * document.body.offsetHeight;
    const y = Math.random() * document.body.offsetWidth;
    let rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
    rect.setAttribute('x', x.toString());
    rect.setAttribute('y', y.toString());
    rect.setAttribute('height', '100');
    rect.setAttribute('width', '3');
    rect.classList.add('bg-line');
    svg_container.insertAdjacentElement('afterbegin',
        rect);
    bg_lines.push(rect);
    start_pos.push(y);
  }
  for (let i = 0; i < lines_count; ++i) {
    rand_coeffs[i] = 0.5 + Math.random();
  }
}

function animate_bg(scroll_pos) {
  for (let i = 0; i < lines_count; ++i) {
    bg_lines[i].setAttribute("y", (start_pos[i] + scroll_pos * rand_coeffs[i]).toString())
  }
}

init_bg();

document.addEventListener("scroll", (event) => {
  scroll_pos = window.scrollY;

  if (!ticking) {
    window.requestAnimationFrame(() => {
      animate_bg(scroll_pos);
      ticking = false;
    });

    ticking = true;
    last_scroll_pos = scroll_pos;
  }
});

window.addEventListener('resize', () => {
  svg_container.setAttribute("height",
      (document.body.offsetHeight + document.querySelector('.footer').offsetHeight).toString());
})



