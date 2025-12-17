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
4.Для Prisma:
npx prisma generate

## Запуск тестів

Prisma:
node PrismaTest.js

Sequelize:
node SequelizeTest.js

RAW SQL:
node SQLTest.js
