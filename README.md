# REST API Project

Прост REST API с Express.js и SQLite база данни.

## Инсталация

```bash
npm install
```

## Стартиране

```bash
npm start
```

## API Endpoints

- `GET /api/users` - Вземане на всички потребители
- `GET /api/users/:id` - Вземане на потребител по ID
- `POST /api/users` - Създаване на нов потребител
- `PUT /api/users/:id` - Обновяване на потребител
- `DELETE /api/users/:id` - Изтриване на потребител

## Пример заявка

```bash
# Създаване на потребител
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Ivan","email":"ivan@example.com"}'

# Вземане на всички потребители
curl http://localhost:3000/api/users
```
