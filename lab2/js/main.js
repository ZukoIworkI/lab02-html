document.addEventListener('DOMContentLoaded', init);

function init() {
    // Універсальні (запускаємо всюди)
    initDynamicYear();
    initThemeToggle();
    initActiveNav();
    initMenuToggle();
    initBackToTop();

    // Специфічні (працюватимуть лише там, де є відповідний HTML)
    initAccordion();
    initFilters();
    initModal();
    initContactForm();
}

// ---------------------------------------------------------
// 2. Підсвічування активної сторінки в навігації
// ---------------------------------------------------------
function initActiveNav() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link'); // Клас твоїх посилань у меню
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && currentPath.includes(href.replace('../', '').replace('./', ''))) {
            link.classList.add('is-active');
        }
    });
}

// ---------------------------------------------------------
// 3. Кнопка відкриття/закриття мобільного меню
// ---------------------------------------------------------
function initMenuToggle() {
    const menuBtn = document.querySelector('.menu-btn'); // Кнопка бургер-меню
    const navMenu = document.querySelector('.nav-menu'); // Блок самого меню

    if (menuBtn && navMenu) {
        menuBtn.addEventListener('click', () => {
            const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
            menuBtn.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('is-open'); // Додаємо клас для показу меню
        });

        // Автоматичне закриття при кліку на посилання
        navMenu.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                navMenu.classList.remove('is-open');
                menuBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }
}

// ---------------------------------------------------------
// 4. Перемикач світлої/темної теми
// ---------------------------------------------------------
function initThemeToggle() {
    const themeBtn = document.querySelector('.theme-toggle'); // Кнопка зміни теми
    const body = document.body;
    const themeKey = 'siteTheme';

    // Відновлення збереженої теми
    const savedTheme = localStorage.getItem(themeKey);
    if (savedTheme) {
        body.classList.add(savedTheme);
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            body.classList.toggle('theme-dark');
            
            // Збереження вибору
            if (body.classList.contains('theme-dark')) {
                localStorage.setItem(themeKey, 'theme-dark');
            } else {
                localStorage.removeItem(themeKey);
            }
        });
    }
}

// ---------------------------------------------------------
// 5. Кнопка «Вгору» та динамічний рік у footer
// ---------------------------------------------------------
function initDynamicYear() {
    const yearSpan = document.querySelector('#current-year'); // id для <span> у футері
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

function initBackToTop() {
    const topBtn = document.querySelector('.back-to-top'); // Клас кнопки "Вгору"
    
    if (topBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                topBtn.classList.add('is-visible'); // Клас, що робить кнопку видимою (напр. opacity: 1)
            } else {
                topBtn.classList.remove('is-visible');
            }
        });

        topBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// ---------------------------------------------------------
// 6. Акордеон (наприклад, для блоку FAQ)
// ---------------------------------------------------------
function initAccordion() {
    const accordionHeaders = document.querySelectorAll('.accordion-header'); 
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling; // Контент має йти одразу за заголовком у HTML
            const isActive = header.classList.contains('is-active');

            // Згортаємо всі інші (опційно, але зручно)
            document.querySelectorAll('.accordion-content').forEach(item => item.hidden = true);
            document.querySelectorAll('.accordion-header').forEach(item => item.classList.remove('is-active'));

            // Розгортаємо поточний, якщо він не був активний
            if (!isActive && content) {
                header.classList.add('is-active');
                content.hidden = false;
            }
        });
    });
}

// ---------------------------------------------------------
// 7. Фільтрація карток (для портфоліо чи послуг)
// ---------------------------------------------------------
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn'); // Кнопки фільтрів
    const cards = document.querySelectorAll('.filterable-card'); // Картки, які треба фільтрувати

    if (filterBtns.length === 0 || cards.length === 0) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Перемикаємо активний стан кнопок
            filterBtns.forEach(b => b.classList.remove('is-active'));
            btn.classList.add('is-active');

            const category = btn.dataset.filter; // Беремо значення з data-filter="назва_категорії"
            
            cards.forEach(card => {
                // Беремо категорію картки з data-category="назва_категорії"
                const match = category === 'all' || card.dataset.category === category;
                card.hidden = !match; // Використовуємо атрибут hidden
            });
        });
    });
}

// ---------------------------------------------------------
// 8. Модальне вікно
// ---------------------------------------------------------
function initModal() {
    const modalTriggers = document.querySelectorAll('.modal-trigger'); // Кнопки, що відкривають модалку
    const modals = document.querySelectorAll('.modal'); // Самі модальні вікна
    const closeBtns = document.querySelectorAll('.modal-close'); // Кнопки закриття всередині модалки

    // Відкриття
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const targetId = trigger.dataset.target; // data-target="id_модалки"
            const targetModal = document.getElementById(targetId);
            if (targetModal) targetModal.classList.add('is-open'); // Клас, що показує модалку (display: block)
        });
    });

    // Закриття по хрестику
    closeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) modal.classList.remove('is-open');
        });
    });

    // Закриття по кліку на overlay (фон)
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) { 
                modal.classList.remove('is-open');
            }
        });
    });
}

// ---------------------------------------------------------
// 9 та 10. Робота з формою (Валідація, Чернетка, Submit)
// ---------------------------------------------------------
function initContactForm() {
    const form = document.querySelector('#contact-form');
    if (!form) return;

    const draftKey = 'contactDraft';
    const nameInput = form.querySelector('[name="name"]');
    const emailInput = form.querySelector('[name="email"]');
    const messageInput = form.querySelector('[name="message"]');
    const charCounter = document.querySelector('#char-counter');
    const maxChars = 500; // Ліміт символів для textarea

    // --- 10. Відновлення чернетки ---
    const savedDraft = JSON.parse(localStorage.getItem(draftKey) || '{}');
    if (nameInput && savedDraft.name) nameInput.value = savedDraft.name;
    if (emailInput && savedDraft.email) emailInput.value = savedDraft.email;
    if (messageInput && savedDraft.message) messageInput.value = savedDraft.message;

    // --- 9 & 10. Збереження чернетки та лічильник на подію input ---
    form.addEventListener('input', () => {
        // Зберігаємо чернетку
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        localStorage.setItem(draftKey, JSON.stringify(data));

        // Оновлюємо лічильник символів
        if (messageInput && charCounter) {
            const currentLength = messageInput.value.length;
            charCounter.textContent = `${currentLength} / ${maxChars}`;
            if (currentLength > maxChars) {
                charCounter.classList.add('text-danger'); // Клас для червоного тексту
            } else {
                charCounter.classList.remove('text-danger');
            }
        }
    });
    
    // Ініціалізуємо лічильник одразу, якщо чернетка відновила повідомлення
    if (messageInput) messageInput.dispatchEvent(new Event('input'));


    // --- 9 & 10. Валідація та обробка Submit ---
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Зупиняємо стандартну відправку
        let isValid = true;

        // Перевірка імені (мінімум 2 символи)
        if (nameInput && nameInput.value.trim().length < 2) {
            showError(nameInput, 'Ім\'я має містити щонайменше 2 символи');
            isValid = false;
        } else if (nameInput) {
            clearError(nameInput);
        }

        // Перевірка email (простий RegEx)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailInput && !emailRegex.test(emailInput.value)) {
            showError(emailInput, 'Введіть коректний email (наприклад: name@mail.com)');
            isValid = false;
        } else if (emailInput) {
            clearError(emailInput);
        }

        // Перевірка повідомлення
        if (messageInput && messageInput.value.trim().length === 0) {
            showError(messageInput, 'Повідомлення не може бути порожнім');
            isValid = false;
        } else if (messageInput && messageInput.value.length > maxChars) {
            showError(messageInput, 'Перевищено ліміт символів');
            isValid = false;
        } else if (messageInput) {
            clearError(messageInput);
        }

        // Якщо все валідно — імітуємо відправку
        if (isValid) {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Ховаємо форму, показуємо блок успіху
            form.hidden = true;
            let successBlock = document.querySelector('#success-message');
            
            // Якщо блоку немає в HTML, створюємо його динамічно
            if (!successBlock) {
                successBlock = document.createElement('div');
                successBlock.id = 'success-message';
                form.parentNode.insertBefore(successBlock, form.nextSibling);
            }
            
            successBlock.hidden = false;
            successBlock.innerHTML = `
                <div class="success-alert">
                    <h3>Дякуємо, ${data.name}!</h3>
                    <p>Ваше повідомлення відправлено. Ми відповімо на <strong>${data.email}</strong>.</p>
                </div>
            `;

            // Очищаємо форму та чернетку
            localStorage.removeItem(draftKey);
            form.reset();
        }
    });
}

// --- Допоміжні функції для показу помилок під інпутами ---
function showError(inputElement, messageText) {
    let errorEl = inputElement.nextElementSibling;
    if (!errorEl || !errorEl.classList.contains('error-msg')) {
        errorEl = document.createElement('span');
        errorEl.className = 'error-msg';
        errorEl.style.color = 'red';
        errorEl.style.fontSize = '12px';
        errorEl.style.display = 'block';
        inputElement.parentNode.insertBefore(errorEl, inputElement.nextSibling);
    }
    errorEl.textContent = messageText;
    errorEl.hidden = false;
    inputElement.classList.add('input-invalid'); // Твій CSS-клас для червоної рамки
}

function clearError(inputElement) {
    const errorEl = inputElement.nextElementSibling;
    if (errorEl && errorEl.classList.contains('error-msg')) {
        errorEl.hidden = true;
    }
    inputElement.classList.remove('input-invalid');
}