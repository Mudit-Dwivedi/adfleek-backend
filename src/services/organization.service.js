
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createOrganization = async (name, slug) => {
    try {
        console.log(name,slug,"service")
        const org = await prisma.organization.create({
            data: {
                name,
                slug,
                createdAt: new Date(),
              
            }
        });
        return { org, message: 'Organization created successfully' };
    } catch (error) {
       console.log(error,"error in creating service")
    }
};

const updateOrganization = async (id, updateData) => {
    try {
        const org = await prisma.organization.update({
            where: { id },
            data: {
                ...updateData,
                updatedAt: new Date()
            }
        });
        return { org, message: 'Organization updated successfully' };
    } catch (error) {
        console.log(error,"error in updating service")
    }
};

const deleteOrganization = async (id) => {
    try {
        const org = await prisma.organization.delete({
            where: { id }
        });
        return org;
    } catch (error) {
        throw new Error('Error deleting organization');
    }
};
module.exports = {
    createOrganization,
    updateOrganization,
    deleteOrganization
};
