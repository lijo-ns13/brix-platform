import companyModel,{ICompany} from "../../../shared/models/company.model";

export class CompanyRepository {
    async findByEmail (email:string):Promise<ICompany | null>{
        return await companyModel.findOne({email});
    }
    async findById (id:string):Promise<ICompany | null> {
        return await companyModel.findById(id);
    }
    async createCompany (userData:any):Promise<ICompany> {
        const company=new companyModel(userData);
        return company.save();
    }

}