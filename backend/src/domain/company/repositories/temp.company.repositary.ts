import tempCompanyModel,{ITempCompany} from "../../../shared/models/temp.company.model";
interface createTempCompanyDTO {
    
}
export class TempCompanyRepositary {
    async findByEmail(email:string):Promise<ITempCompany|null>{
        return tempCompanyModel.findOne({email}).select('+password')
    }
    async findById(id:string):Promise<ITempCompany|null>{
        return tempCompanyModel.findById(id)
    }
    async createTempUser(tempUserData:createTempCompanyDTO):Promise<ITempCompany>{
        const tempCompany=new tempCompanyModel(tempUserData);
        tempCompany.save();
        return tempCompany;
    }
}