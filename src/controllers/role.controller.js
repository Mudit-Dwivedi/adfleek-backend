const roleService=require('../services/role.service');

const createRole=async(req,res)=>{
    try {
        const { name, orgID } = req.body;
        if (!name || !orgID) {
            return res.status(400).json({ message: 'name and orgID are required' });
        }
        const result = await roleService.createRole(name, orgID);
        return res.status(201).json({ result, message: 'Role created successfully' });
    } catch (error) {
        console.log(error, "error in creating role");
        return res.status(500).json({ message: 'Internal server error' });
    }
    
};

const updateRole=async(req,res)=>{
    try {
        const { id } = req.params;
        const { name, orgID } = req.body;
        if (!name || !orgID) {
            return res.status(400).json({ message: 'name and orgID are required' });
        }
        const result = await roleService.updateRole(id, { name, orgID });
        return res.status(200).json({ result, message: 'Role updated successfully' });
    } catch (error) {
        console.log(error, "error in updating role");
        return res.status(500).json({ message: 'Internal server error' });
    }
};
module.exports={createRole,updateRole}