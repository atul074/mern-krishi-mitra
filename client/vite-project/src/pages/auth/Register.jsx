


//import { registerUser } from "@/store/auth-slice/Index";
import { registerUser } from "../../store/auth-slice";
import { Link,useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import bg from "../../assets/bg.jpg"
const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [userSignup, setUserSignup] = useState({
        userName: "",
        email: "",
        password: "",
    });
    function onSubmit(event) {
        if (userSignup.userName === "" || userSignup.email === "" || userSignup.password === "") {
          
            
            alert("All Fields are required");
            
            console.log("alert");
            
              return;
        }
      event.preventDefault();
      dispatch(registerUser(userSignup)).then((data) => {
        console.log(data);
        
        if (data?.payload?.success) {
        
          alert(data?.payload?.message);
          navigate("/auth/login");
        } else {
          
        alert(data?.payload?.message);
        }
      });
    }
  

    return (
        <div className='flex justify-center items-center h-screen  bg-center bg-cover filter  ' style={{ backgroundImage: `url(${bg})` }}>
            <div className="login_Form scale-150 bg-[#7ccda2] px-1 lg:px-8 py-6  border border-[#182628] rounded-xl shadow-md">

                {/* Top Heading  */}
                <div className="mb-5">
                    <h2 className='text-center text-2xl font-bold text-[#182628] '>
                        
                    साइन अप
                    </h2>
                </div>

             
                <div className="mb-3">
                    <input
                        type="text"
                        placeholder='पूरा नाम'
                        value={userSignup.userName}
                        onChange={(e) => {
                            setUserSignup({
                                ...userSignup,
                                userName: e.target.value
                            })
                        }}
                        className='bg-[#C1F6ED] border border-[#3B945E] px-2 py-2 w-96 rounded-md outline-none placeholder-[#3B945E]'
                    />
                </div>

                
                <div className="mb-3">
                    <input
                        type="email"
                        placeholder='ई-मेल एड्रेस'
                        value={userSignup.email}
                        onChange={(e) => {
                            setUserSignup({
                                ...userSignup,
                                email: e.target.value
                            })
                        }}
                        className='bg-[#C1F6ED] border border-[#3B945E] px-2 py-2 w-96 rounded-md outline-none placeholder-[#3B945E]'
                    />
                </div>

              
                <div className="mb-5">
                    <input
                        type="password"
                        placeholder='पासवर्ड'
                        value={userSignup.password}
                        onChange={(e) => {
                            setUserSignup({
                                ...userSignup,
                                password: e.target.value
                            })
                        }}
                        className='bg-[#C1F6ED] border border-[#3B945E] px-2 py-2 w-96 rounded-md outline-none placeholder-[#3B945E]'
                    />
                </div>

               
                <div className="mb-5">
                    <button
                        type='button'
                        onClick={onSubmit}
                        className='bg-[#039b17] hover:bg-[#3B945E] w-full text-white text-center py-2 font-bold rounded-md '
                    >
                        
साइन अप 
                    </button>
                </div>

                <div>
                    <h2 className='text-[#4f4f4f]'>खाता है <Link className=' text-[#000000] font-bold' to={'/auth/login'}>
                    लॉग इन</Link></h2>
                </div>

            </div>
        </div>
    );
}

export default Register;