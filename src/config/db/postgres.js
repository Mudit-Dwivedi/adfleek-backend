const {PrismaClient} =require('@prisma/client')

const db = new PrismaClient(
    {
        log: ['query']
    }
)
db.$connect()
    .then(() => {
        console.log('Postgres Database connected successfully.');
    })
    .catch((err) => {
        console.error('Postgres Database connection failed:', err);
    });

module.exports = db
