const API_URL = 'http://localhost:3000/items';

// 1. Отримати всі товари (Read)
export async function getItems() {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Помилка завантаження');
    return await res.json();
}

// 2. Додати новий товар (Create)
export async function createItem(data) {
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return await res.json();
}

// 3. Оновити товар (Update) — ТЕ, ЧОГО БРАКУВАЛО
export async function updateItem(id, data) {
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH', // PATCH оновлює лише частину даних
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return await res.json();
}

// 4. Видалити товар за ID (Delete)
export async function deleteItem(id) {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Не вдалося видалити');
}