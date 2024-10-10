// Получаем элементы
const orderBtn = document.getElementById("orderBtn");
const orderModal = document.getElementById("orderModal");
const closeBtn = document.querySelector(".close-btn");

// Открытие модального окна при нажатии на кнопку "Сделать заказ"
orderBtn.addEventListener("click", function() {
    orderModal.style.display = "flex"; // Показываем модальное окно
});

// Закрытие модального окна при нажатии на крестик
closeBtn.addEventListener("click", function() {
    orderModal.style.display = "none";
});

// Закрытие модального окна при нажатии вне окна
window.addEventListener("click", function(event) {
    if (event.target === orderModal) {
        orderModal.style.display = "none";
    }
});

// Обработка формы заказа
document.getElementById("orderForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const nickname = document.getElementById("nickname").value;
    const orderItem = document.getElementById("orderItem").value;
    const price = document.getElementById("price").value;

    // Отправляем данные заказа на сервер
    fetch('/order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nickname: nickname,
            orderItem: orderItem,
            price: price
        })
    })
    .then(response => response.text())
    .then(data => {
        console.log(data);
        alert("Ваш заказ был отправлен, для уточнения статуса заказа приходите в ПВЗ OZON в 20:00-21:00 по МСК");
    })
    .catch(error => {
        console.error("Ошибка:", error);
        alert("Ошибка отправки заказа.");
    });

    // Закрываем модальное окно после отправки
    orderModal.style.display = "none";

    // Очистка формы
    document.getElementById("orderForm").reset();
});

// Получаем элементы
const adminBtn = document.getElementById("adminBtn");
const adminModal = document.getElementById("adminModal");
const adminCloseBtn = adminModal.querySelector(".close-btn");

// Открытие модального окна для администратора
adminBtn.addEventListener("click", function() {
    adminModal.style.display = "flex";
});

// Закрытие модального окна для администратора
adminCloseBtn.addEventListener("click", function() {
    adminModal.style.display = "none";
});

// Закрытие модального окна при нажатии вне окна
window.addEventListener("click", function(event) {
    if (event.target === adminModal) {
        adminModal.style.display = "none";
    }
});

// Обработка формы администратора
document.getElementById("adminForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    const password = document.getElementById("password").value;

    // Проверка пароля
    if (password === "qwe") {
        // Если пароль верный, перенаправляем на страницу администратора
        window.location.href = "/admin/orders";
    } else {
        alert("Неправильный пароль");
    }

    // Очистка формы
    document.getElementById("adminForm").reset();
});

// Массив товаров с изображением, названием и ценой
const products = [
    {
        id: 1,
        name: 'Земля 5 стаков (в наличии +-70к)',
        price: 1,
        image: 'dirt.png'
    },
    {
        id: 2,
        name: 'Березовая древесина стак(в наличии +-4к)',
        price: 4,
        image: 'bereza.png'
    },
    {
        id: 3,
        name: 'Камень 5 стаков (в наличии +-100к)',
        price: 1,
        image: 'stone.jpg'
    },
    {
        id: 4,
        name: "Булыга 5 стаков (в наличии +-35к)",
        price: 1,
        image: "cobblestone.png"
    },
    {
        id: 5,
        name: "Соты 4 стака (в наличии дохуя)",
        price: 1,
        image: "soti.png",
    },
    {
        id: 6,
        name: "Бумага 3 стака (в наличии +-30к)",
        price: 1,
        image: 'paper.png',
    }
];

// Функция для отображения товаров на странице
function displayProducts() {
    const productsContainer = document.getElementById('products');
    productsContainer.innerHTML = ''; // Очищаем контейнер перед добавлением товаров

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">${product.price} ар.</p>
        `;

        productsContainer.appendChild(productCard);
    });
}

// Запуск функции отображения товаров при загрузке страницы
window.onload = displayProducts;


