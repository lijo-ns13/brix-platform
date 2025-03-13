import mongoose , { Document,mongo,Schema} from "mongoose";
import { object } from "zod";

const industryTypes = [
    "Information Technology",
    "Software Development",
    "E-Commerce",
    "Banking & Financial Services",
    "Healthcare",
    "Pharmaceutical",
    "Telecommunications",
    "Education & Training",
    "Manufacturing",
    "Automotive",
    "Construction",
    "Retail",
    "Logistics & Supply Chain",
    "Media & Entertainment",
    "Hospitality",
    "Real Estate",
    "Legal Services",
    "Agriculture",
    "Energy & Utilities",
    "Non-Profit / NGO",
    "Government / Public Administration",
    "Consulting",
    "Human Resources",
    "Marketing & Advertising",
    "Insurance",
    "Aviation / Aerospace",
    "Chemicals",
    "Fashion & Apparel",
    "Mining & Metals",
    "Sports & Fitness",
    "Food & Beverage",
    "Maritime",
    "Defense & Security",
    "Electronics / Electrical",
    "Environmental Services",
    "Research & Development",
    "Arts & Culture",
  ];
interface DocumentDetails {
    documentType:string;
    url:string;
}

export interface ICompany extends Document {
    _id:mongoose.Types.ObjectId;
    companyName:string;
    password:string;
    about:string;
    email:string;
    industryType:string;
    foundedYear:number;
    website:string;
    location:string;
    companySize:number;
    jobPosted:mongoose.Types.ObjectId[];
    documents:DocumentDetails[];
    isVerified:boolean;
    verificationStatus:"pending" | "accepted" | "rejected";
}

const companySchema=new Schema<ICompany>(
    {
        companyName:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        about:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        industryType:{
            type:String,
            enum:industryTypes,
            required:true
        },
        foundedYear:{
            type:Number,
            required:true
        },
        website:{
            type:String
        },
        location:{
            type:String,
            required:true
        },
        companySize:{
            type:Number,
            required:true
        },
        jobPosted:{
            type:[mongoose.Schema.Types.ObjectId],
            ref:"Job"
        },
        documents:[
            {
                documentType:{
                    type:String,
                    required:true
                },
                url:{
                    type:String,
                    required:true
                }
            }
        ],
        isVerified:{
            type:Boolean,
            required:true
        },
        verificationStatus:{
            type:String,
            enum:['pending','accepted','rejected'],
            default:'pending'
        }
    },
    {
        timestamps:true
    }
)

export default mongoose.model<ICompany>("Company",companySchema)