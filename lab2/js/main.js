import * as api from './api.js';

let catalogData = [];

document.addEventListener('DOMContentLoaded', () => {
    // Виклик твоїх старих функцій (тема, рік і т.д.)
    if (typeof initDynamicYear === 'function') initDynamicYear();
    if (typeof initThemeToggle === 'function') initThemeToggle();
    if (typeof initMenuToggle === 'function') initMenuToggle();
    
    // Запуск логіки каталогу
    initCatalogPage();
    initFormHandler();
});

// 1. ЗАВАНТАЖЕННЯ ДАНИХ
async function initCatalogPage() {
    const grid = document.getElementById('catalog-grid');
    if (!grid) return;

    try {
        showStatus('loading');
        catalogData = await api.getItems(); 
        renderCatalog(catalogData);
        showStatus('idle');
    } catch (err) {
        showStatus('error', err.message);
    }
}

// 2. МАЛЮВАННЯ КАРТОК
function renderCatalog(items) {
    const grid = document.getElementById('catalog-grid');
    if (!grid) return;
    
    grid.innerHTML = items.map(item => `
        <div class="card">
            <div class="card-header">
                <img src="${item.image || 'assets/image/1.jpg'}" alt="${item.title}" onerror="this.src='https://via.placeholder.com/150'">
            </div>
            <div class="card-body">
                <h3>${item.title}</h3>
                <p>Ціна: <strong>${item.price} грн</strong></p>
                <div class="admin-btns">
                    <button class="btn-edit" data-id="${item.id}">✏️</button>
                    <button class="btn-delete" data-id="${item.id}">🗑️</button>
                </div>
            </div>
        </div>
    `).join('');

    initCardEvents(); // Підключаємо кнопки видалення/редагування
}

// 3. ПОДІЇ НА КНОПКАХ
function initCardEvents() {
    // Видалення
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.onclick = async (e) => {
            const id = e.currentTarget.dataset.id;
            if (confirm('Видалити цей елемент?')) {
                await api.deleteItem(id);
                catalogData = catalogData.filter(i => String(i.id) !== String(id));
                renderCatalog(catalogData);
            }
        };
    });

    // Редагування
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.onclick = async (e) => {
            const id = e.currentTarget.dataset.id;
            const item = catalogData.find(i => String(i.id) === String(id));
            const newTitle = prompt('Нова назва:', item.title);
            if (newTitle) {
                const updated = await api.updateItem(id, { title: newTitle });
                catalogData = catalogData.map(i => String(i.id) === String(id) ? updated : i);
                renderCatalog(catalogData);
            }
        };
    });
}

// 4. ДОДАВАННЯ ЧЕРЕЗ ФОРМУ
function initFormHandler() {
    const form = document.getElementById('item-form');
    if (!form) return;

    form.onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        data.price = Number(data.price);

        try {
            const newItem = await api.createItem(data);
            catalogData.push(newItem);
            renderCatalog(catalogData);
            form.reset();
        } catch (err) {
            alert('Помилка: ' + err.message);
        }
    };
}

// 5. ДОПОМІЖНА ФУНКЦІЯ СТАТУСІВ
function showStatus(state, msg = '') {
    const loader = document.getElementById('catalog-loading');
    const error = document.getElementById('catalog-error');
    if (loader) loader.hidden = (state !== 'loading');
    if (error) {
        error.hidden = (state !== 'error');
        if (msg) error.textContent = msg;
    }
}