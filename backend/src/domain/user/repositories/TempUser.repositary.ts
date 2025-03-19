import tempUserModel,{ITempUser} from "../../../shared/models/temp.user.model";
import { createTempUserDTO } from "../dtos/user.response.dto";

export class TempUserRepositary {
    async findByEmail(email:string):Promise<ITempUser|null>{
        return tempUserModel.findOne({email}).select('+password')
    }
    async findById(id:string):Promise<ITempUser|null>{
        return tempUserModel.findById(id)
    }
    async createTempUser(tempUserData:createTempUserDTO):Promise<ITempUser>{
        const tempUser=new tempUserModel(tempUserData);
        tempUser.save();
        return tempUser;
    }
}