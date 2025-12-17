Дослідження ефективності ORM пакетів
## Вимоги

- Node.js 
- NPM 
- PostgreSQL 
- База даних `course_db` з таблицями `Client`, `Order`, `OrderDetail`, `Product`, `Payment` (за схемою у `prisma/schema.prisma` та `sequelize/models/`)

## Установка

1. Клонуйте репозиторій:
git clone https://github.com/Andrianadyduch/Course-work.git
cd Course-work

2. Встановіть залежності через NPM:
npm install

3. Створіть .env файл у корені проєкту з налаштуваннями бази даних для Prisma та Sequelize:
DATABASE_URL="postgresql://andriana:@localhost:5432/course_db"

4. Генерація Prisma Client
npx prisma generate
Ця команда створює Prisma Client, який використовується у проєкті для взаємодії з базою даних.

5. Створення таблиць за схемою для prisma :
Файл prisma/schema.prisma містить моделі:
Client
Order
OrderDetail
Product
Payment
Щоб створити ці таблиці у вашій базі даних:
npx prisma db push

6. Для sequelize:
Ініціалізація підключення до бази
-Файл sequelize/db.js містить налаштування PostgreSQL.
-Файл sequelize/index.js підключає моделі до Sequelize.

Моделі Sequelize
sequelize/models/Client.js
sequelize/models/Order.js
sequelize/models/OrderDetail.js
sequelize/models/Product.js
sequelize/models/Payment.js

Створення таблиць
У файлі index.js
import sequelize from './index.js';
import './models/Client.js';
import './models/Order.js';
import './models/OrderDetail.js';
import './models/Product.js';
import './models/Payment.js';
await sequelize.sync({ force: true }); 
Опція { force: true } 

## Запуск тестів

Prisma:
node PrismaTest.js

Sequelize:
node SequelizeTest.js

RAW SQL:
node SQLTest.js
