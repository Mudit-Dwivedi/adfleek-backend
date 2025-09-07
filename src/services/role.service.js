const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createRole = async (name, orgID) => {
    try {
        const role = await prisma.role.create({
            data: {
                name,
                org: {
                    connect: {
                        id: orgID
                    }
                }
            }
        });
        return { role, message: 'Role created successfully' };
    } catch (error) {
        console.log(error, "error in creating role");
    }
};

const updateRole = async (id, updateData) => {
    try {
        const role = await prisma.role.update({
            where: { id },
            data: {
                ...updateData,
                updatedAt: new Date()
            }
        });
        return { role, message: 'Role updated successfully' };
    } catch (error) {
        console.log(error, "error in updating role");
    }
};

module.exports = {
    createRole,
    updateRole
};
