import mongoose,{Document,Schema,ObjectId} from "mongoose";


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

export default mongoose.model<IUser>("User",userSchema);