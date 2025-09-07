const organizationService=require('../services/organization.service')

const createOrganization=async(req,res)=>{
    try {
        const{name,slug}=req.body
        console.log(name,slug)
        if(!name || !slug){
            return res.status(400).json({error:'name and slug are required'})
        }
        const org =await organizationService.createOrganization(name,slug)
        return res.status(201).json({
            success:true,
            org,
            message:'Organization created successfully'
        })
        
    } catch (error) {
        return res.status(500).json({error:'Internal server error'})
    }
}

const updateOrganization=async(req,res)=>{
    try {
        const { id } = req.params;
        const { name, slug } = req.body;
        if (!name || !slug) {
            return res.status(400).json({ error: 'name and slug are required' });
        }
        const org = await organizationService.updateOrganization(id, { name, slug });
        return res.status(200).json({
            success: true,
            org,
            message: 'Organization updated successfully'
        });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const deleteOrganization = async (req, res) => {
    try {
        const { id } = req.params;
        const org = await organizationService.deleteOrganization(id);
        return res.status(200).json({
            success: true,
            org,
            message: 'Organization deleted successfully'
        });
    } catch (error) {
        
    }
}

module.exports={createOrganization ,updateOrganization,deleteOrganization}

