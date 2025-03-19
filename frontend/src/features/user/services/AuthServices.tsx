import axios from "axios";


export const SignInUser = async (email:string,password:string) => {
    try {
        const response= await axios.post('http://localhost:3000/auth/signin',{email,password},{
            withCredentials:true
        })
        const {accessToken,role,user}=response.data;
        
        console.log("Access Token:", accessToken);
        console.log("User:", user);
        console.log("Role:", role);

        return { accessToken, user, role };
    } catch (error) {
        console.log('error',error);
        throw error;
    }

}
export const SignUpUser = async (name:string,email:string,password:string,confirmPassword:string) => {
    try {
        const response=await axios.post('http://localhost:3000/auth/signup',{name,email,password,confirmPassword},
            {withCredentials:true}
        )
        const {success}=response.data;
        if(!success){
            alert('failed');
            return;
        }
        alert('success signup')
    } catch (error) {
        console.log('error in serviced',error);
        throw error;
    }
}
export const verifyUserByOTP=async (email:string|null,otp:string) => {
    try {
        const response=await axios.post('http://localhost:3000/auth/verify',{email,otp},{
            withCredentials:true
        })
        const {success}=response.data;
        if(!success){
            alert('failed')
            return;
        }
        alert('success')
    } catch (error) {
        console.log('error in serviced',error);
        throw error;
    }
}
export const resendOTP=async (email:string|null)=> {
    try {
        const response=await axios.post('http://localhost:3000/auth/resend',{email},{
            withCredentials:true
        });
        const {success}=response.data;
        if(!success){
            alert('failed');
            return;
        }
        alert('success');
    } catch (error) {
        console.log('errorin resned',error);
        throw error;
    }
}