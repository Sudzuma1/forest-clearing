const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Хранение объявлений в памяти
let ads = [];

// Middleware для обработки статических файлов
app.use(express.static(path.join(__dirname, 'public')));

// WebSocket соединение
io.on('connection', (socket) => {
    console.log('Новый пользователь подключен:', socket.id);

    // Отправляем текущие объявления новому пользователю
    socket.emit('initial-ads', ads);

    // Обработка нового объявления
    socket.on('new-ad', (ad) => {
        ads.push(ad);
        io.emit('new-ad', ad); // Отправляем новое объявление всем клиентам
    });

    // Обработка удаления объявления
    socket.on('delete-ad', (id) => {
        ads = ads.filter(ad => ad.id !== id);
        io.emit('delete-ad', id); // Уведомляем всех клиентов об удалении
    });

    // Обработка отключения пользователя
    socket.on('disconnect', () => {
        console.log('Пользователь отключен:', socket.id);
    });
});

// Запуск сервера
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});