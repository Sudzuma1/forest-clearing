const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// ✅ Добавляем обработчик для корневого маршрута "/"
app.get('/', (req, res) => {
    res.send('Сервер работает! 🚀');
});

let ads = []; // Временное хранилище объявлений

// Получить все объявления
app.get('/ads', (req, res) => {
    res.json(ads);
});

// Добавить объявление
app.post('/ads', (req, res) => {
    const { title, photo, description, isPremium } = req.body;
    if (!title || !photo || !description) {
        return res.status(400).json({ message: 'Все поля обязательны' });
    }
    const newAd = { id: ads.length + 1, title, photo, description, isPremium };
    ads.push(newAd);
    res.json(newAd);
});

// Удалить объявление
app.delete('/ads/:id', (req, res) => {
    const id = parseInt(req.params.id);
    ads = ads.filter(ad => ad.id !== id);
    res.json({ message: 'Объявление удалено' });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}...`);
});
