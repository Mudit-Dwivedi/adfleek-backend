const {PrismaClient} =require('@prisma/client')

const db = new PrismaClient(
    {
        log: ['query']
    }
)
db.$connect()
    .then(() => {
        console.log('Database connected successfully.');
    })
    .catch((err) => {
        console.error('Database connection failed:', err);
    });

module.exports = db
