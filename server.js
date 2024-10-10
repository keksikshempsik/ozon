const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Используем body-parser для обработки POST-запросов с JSON-данными
app.use(bodyParser.json());

// Раздаем статические файлы (например, HTML, CSS, JS)
app.use(express.static('public'));

// Путь к файлу с заказами
const ordersFilePath = path.join(__dirname, 'orders.json');

// Путь к файлу для хранения последнего порядкового номера заказа
const orderNumberFilePath = path.join(__dirname, 'orderNumber.txt');

// Получение следующего порядкового номера заказа
function getNextOrderNumber() {
    let orderNumber = 1; // Начальный номер
    if (fs.existsSync(orderNumberFilePath)) {
        orderNumber = parseInt(fs.readFileSync(orderNumberFilePath, 'utf-8')) + 1;
    }
    fs.writeFileSync(orderNumberFilePath, orderNumber.toString());
    return orderNumber;
}

// Обработчик POST-запроса для получения данных заказа
app.post('/order', (req, res) => {
    const { nickname, orderItem, price } = req.body;
    const orderNumber = getNextOrderNumber();
    const newOrder = {
        orderNumber,
        nickname,
        orderItem,
        price,
        status: 'На рассмотрении' // По умолчанию
    };

    let orders = [];
    if (fs.existsSync(ordersFilePath)) {
        orders = JSON.parse(fs.readFileSync(ordersFilePath, 'utf-8'));
    }
    orders.push(newOrder);
    fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2));
    res.status(200).send('Заказ успешно сохранен');
});

// Обработчик GET-запроса для получения всех заказов (страница администратора)
app.get('/admin/orders', (req, res) => {
    if (fs.existsSync(ordersFilePath)) {
        const orders = JSON.parse(fs.readFileSync(ordersFilePath, 'utf-8'));
        res.send(`
            <html lang="ru">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Админ - Заказы</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h1 { text-align: center; }
                    .orders { margin-top: 20px; }
                    .order { background: #f5f5f5; padding: 10px; margin: 10px 0; border-radius: 5px; }
                    .status { font-weight: bold; }
                    .order-buttons { margin-top: 10px; }
                    .order-buttons button { margin-right: 10px; }
                </style>
            </head>
            <body>
                <h1>Все заказы</h1>
                <div class="orders">
                    ${orders.map(order => `
                        <div class="order">
                            <p>Заказ №${order.orderNumber}: Ник: ${order.nickname}, Заказ: ${order.orderItem}, Цена: ${order.price} руб.</p>
                            <p class="status">Статус: ${order.status}</p>
                            <div class="order-buttons">
                                <button onclick="changeStatus(${order.orderNumber}, 'Одобрен')">Одобрить</button>
                                <button onclick="changeStatus(${order.orderNumber}, 'Отказан')">Отказать</button>
                                <button onclick="deleteOrder(${order.orderNumber})">Удалить</button>
                            </div>
                        </div>`).join('')}
                </div>
                <script>
                    function changeStatus(orderNumber, newStatus) {
                        fetch('/admin/orders/change-status', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ orderNumber, newStatus })
                        })
                        .then(response => response.text())
                        .then(data => {
                            alert(data);
                            location.reload();
                        })
                        .catch(error => console.error('Ошибка:', error));
                    }

                    function deleteOrder(orderNumber) {
                        fetch('/admin/orders/delete', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ orderNumber })
                        })
                        .then(response => response.text())
                        .then(data => {
                            alert(data);
                            location.reload();
                        })
                        .catch(error => console.error('Ошибка:', error));
                    }
                </script>
            </body>
            </html>
        `);
    } else {
        res.send('Заказы отсутствуют.');
    }
});

// Обработчик для изменения статуса заказа
app.post('/admin/orders/change-status', (req, res) => {
    const { orderNumber, newStatus } = req.body;

    let orders = [];
    if (fs.existsSync(ordersFilePath)) {
        orders = JSON.parse(fs.readFileSync(ordersFilePath, 'utf-8'));
    }

    const order = orders.find(o => o.orderNumber === orderNumber);
    if (order) {
        order.status = newStatus;
        fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2));
        res.status(200).send(`Статус заказа №${orderNumber} изменен на "${newStatus}"`);
    } else {
        res.status(404).send('Заказ не найден');
    }
});

// Обработчик для удаления заказа
app.post('/admin/orders/delete', (req, res) => {
    const { orderNumber } = req.body;

    let orders = [];
    if (fs.existsSync(ordersFilePath)) {
        orders = JSON.parse(fs.readFileSync(ordersFilePath, 'utf-8'));
    }

    const updatedOrders = orders.filter(o => o.orderNumber !== orderNumber);
    fs.writeFileSync(ordersFilePath, JSON.stringify(updatedOrders, null, 2));
    res.status(200).send(`Заказ №${orderNumber} удален`);
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
