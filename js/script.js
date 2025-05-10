// --- Инициализация тестовых аккаунтов ---
if (!localStorage.getItem('accounts')) {
  const initialAccounts = [
    { role: "student", username: "Айбек", email: "student@test.com", password: "123456" },
    { role: "teacher", username: "Ербол", email: "teacher@test.com", password: "654321" },
    { role: "teacher", username: "Нұрсұлтан", email: "teacher2@test.com", password: "112233" }
  ];
  localStorage.setItem('accounts', JSON.stringify(initialAccounts));
}

// --- Основной код при загрузке страницы ---
document.addEventListener('DOMContentLoaded', function() {
  const userInfo = document.getElementById('user-info');
  const loggedIn = localStorage.getItem('loggedIn');
  const username = localStorage.getItem('username');
  const userRole = localStorage.getItem('userRole');
  const currentPage = window.location.pathname.split('/').pop();

  // --- Отображение имени пользователя ---
  if (userInfo) {
    if (loggedIn && username) {
      userInfo.innerHTML = `
        <span class="user-name">👤 ${username}</span> 
        <button onclick="logoutUser()" class="logout-btn">Выйти</button>
      `;
    } else {
      userInfo.innerHTML = `<a href="login.html" class="btn-login">Вход</a>`;
    }
  }

  // --- Переадресация для преподавателей с учётом разных страниц ---
  if (currentPage === 'index.html' || currentPage === '') {
    if (loggedIn && userRole === 'teacher') {
      if (username === 'Нұрсұлтан') {
        window.location.href = 'teacher-index2.html';
      } else if (username === 'Ербол') {
        window.location.href = 'teacher-index.html';
      }
    }
  }

  // --- Анимация заголовков и кнопок Hero ---
  const elements = document.querySelectorAll('.hero h1, .hero p, .direction-btn');
  elements.forEach((el, index) => {
    setTimeout(() => {
      el.style.opacity = 1;
      el.style.transform = 'translateY(0)';
    }, 200 * index);
  });

  // --- Проверка защищённых страниц ---
  const restrictedPages = ['subjects-school.html', 'subjects-university.html', 'subjects-languages.html'];
  if (restrictedPages.includes(currentPage)) {
    if (!loggedIn) {
      window.location.href = 'register.html';
    }
  }

  // --- Плавное появление блоков при скролле ---
  window.addEventListener('scroll', function() {
    const featureTexts = document.querySelectorAll('.feature-text');
    const featureImages = document.querySelectorAll('.feature-image');
    const triggerBottom = window.innerHeight / 5 * 4;

    featureTexts.forEach(text => {
      if (text.getBoundingClientRect().top < triggerBottom) {
        text.classList.add('show');
      }
    });

    featureImages.forEach(img => {
      if (img.getBoundingClientRect().top < triggerBottom) {
        img.classList.add('show');
      }
    });
  });

  // --- Поиск в FAQ ---
  if (document.getElementById('faq-search')) {
    const searchInput = document.getElementById('faq-search');
    const faqItems = document.querySelectorAll('.faq-item');

    searchInput.addEventListener('input', function() {
      const query = this.value.toLowerCase();
      faqItems.forEach(item => {
        const question = item.querySelector('.faq-question').textContent.toLowerCase();
        if (question.includes(query)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });

    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
      question.addEventListener('click', () => {
        question.classList.toggle('active');
        const answer = question.nextElementSibling;
        if (answer.style.maxHeight) {
          answer.style.maxHeight = null;
        } else {
          answer.style.maxHeight = answer.scrollHeight + "px";
        }
      });
    });
  }
});

// --- Переход к направлению после логина ---
function goTo(page) {
  const loggedIn = localStorage.getItem('loggedIn');
  if (loggedIn) {
    window.location.href = page;
  } else {
    window.location.href = 'register.html';
  }
}

// --- Регистрация нового пользователя ---
function registerUser() {
  const username = document.getElementById('username').value.trim();
  const surname = document.getElementById('surname') ? document.getElementById('surname').value.trim() : '';
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const role = localStorage.getItem('selectedRole') || 'student';

  if (username && email && password) {
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('username', username);
    localStorage.setItem('userRole', role);
    if (role === 'teacher') {
      localStorage.setItem('surname', surname);
    }
    window.location.href = 'index.html';
  } else {
    alert('Пожалуйста, заполните все поля.');
  }
}

// --- Только разрешённые аккаунты для входа ---
const allowedAccounts = [
  { email: "student@test.com", password: "123456", username: "Айбек", role: "student" },
  { email: "teacher@test.com", password: "654321", username: "Ербол", role: "teacher" },
  { email: "teacher2@test.com", password: "112233", username: "Нұрсұлтан", role: "teacher" }
];

// --- Вход в систему через тестовые аккаунты ---
function loginUser() {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value.trim();

  const found = allowedAccounts.find(acc => acc.email === email && acc.password === password);

  if (found) {
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('username', found.username);
    localStorage.setItem('userRole', found.role);
    window.location.href = 'index.html';
  } else {
    alert('Неверный email или пароль!');
  }
}

// --- Выход из аккаунта ---
function logoutUser() {
  localStorage.removeItem('loggedIn');
  localStorage.removeItem('username');
  localStorage.removeItem('userRole');
  localStorage.removeItem('surname');
  localStorage.removeItem('selectedRole');
  window.location.href = 'index.html';
}

// --- Плавный скролл наверх к Hero-блоку ---
function scrollToTop() {
  const topSection = document.getElementById('top');
  if (topSection) {
    topSection.scrollIntoView({ behavior: 'smooth' });
  }
}

// --- Выбор роли и отображение галочки + показ поля фамилии ---
function selectRole(role) {
  localStorage.setItem('selectedRole', role);

  const selectedRoleDiv = document.getElementById('selected-role');
  const studentBtn = document.getElementById('student-btn');
  const teacherBtn = document.getElementById('teacher-btn');
  const surnameField = document.getElementById('surname');

  if (role === 'student') {
    selectedRoleDiv.innerText = "Вы выбрали: Студент ✅";
    studentBtn.innerHTML = "✅ Я студент";
    teacherBtn.innerHTML = "Я преподаватель";
    if (surnameField) surnameField.style.display = "none";
  } else if (role === 'teacher') {
    selectedRoleDiv.innerText = "Вы выбрали: Преподаватель ✅";
    teacherBtn.innerHTML = "✅ Я преподаватель";
    studentBtn.innerHTML = "Я студент";
    if (surnameField) surnameField.style.display = "block";
  }
}
