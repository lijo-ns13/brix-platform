// usermodel
import mongoose,{Document,Schema,ObjectId} from "mongoose";
import bcrypt from 'bcrypt'

export interface IUser extends Document {
    _id:ObjectId;
    name:string;
    email:string;
    password:string;
    profilePicture?:string;
    skills:string[] | [];
    certifications:mongoose.Types.ObjectId[] | [];
    experience:mongoose.Types.ObjectId[] | [];
    education:mongoose.Types.ObjectId[] | [];
    projectCollection:mongoose.Types.ObjectId[] | [];
    connections:mongoose.Types.ObjectId[] | [];
    headline?:string;
    about?:string;
    isBlocked:boolean;
    createdAt?:Date;
    updatedAt?:Date
}

const userSchema=new Schema<IUser>({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    profilePicture:{
        type:String,
        default:null
    },
    skills:{
        type: [String],
        default:[]
    },
    certifications:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Certificate"
        }
    ],
    experience:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Experience'
        }
    ],
    education:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Education"
        }
    ],
    projectCollection:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Project"
        }
    ],
    connections:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    headline:{
        type:String,
        trim:true,
        default:""
    },
    about:{
        type:String,
        trim:true,
        default:""
    },
    isBlocked:{
        type:Boolean,
        default:false
    }
},
{
    timestamps:true
}
)
userSchema.pre('save', async function (next) {
    const user = this;
  
    if (!user.isModified('password')) {
      return next();
    }
  
    try {
      const saltRounds = 10; // recommended
       // ✅ Skip if already hashed (check password length or bcrypt hash pattern)
        if (user.password && user.password.startsWith('$2b$')) {
        return next(); // already hashed, no need to rehash
        }
      user.password = await bcrypt.hash(user.password, saltRounds);
      next();
    } catch (err) {
      next(err as Error);
    }
  });
  

export default mongoose.model<IUser>("User",userSchema);