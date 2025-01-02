



  import { useState } from "react";
import { Link ,useNavigate} from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../../store/auth-slice";
import bg from "../../assets/bg.jpg"
const Login = () => {
    
   
    // navigate 
    const navigate = useNavigate();
    const dispatch = useDispatch(); 
    // User Signup State 
    const [userLogin, setUserLogin] = useState({
        email: "",
        password: ""
    });

    function onSubmit(event) {
        if (userLogin.email === "" || userLogin.password === "") {
            alert("All Fields are required");
            return;
        }
        event.preventDefault();
    
        dispatch(loginUser(userLogin)).then((data) => {
          if (data?.payload?.success) {
            alert(data?.payload?.message);
          } else {
            alert(data?.payload?.message);
          }
        });
      }

    return (
        <div>
        <div className='flex justify-center items-center h-screen  bg-center bg-cover filter  ' style={{ backgroundImage: `url(${bg})` }}>
             
            <div className="login_Form scale-150 bg-[#7ccda2] px-1 lg:px-8 py-6   border border-[#182628] rounded-xl shadow-md">

              
                <div className="mb-5">
                    <h2 className='text-center text-2xl font-bold text-[#182628] '>
                        
लॉग इन
                    </h2>
                </div>

             
                <div className="mb-3">
                    <input
                       type="email"
                       name="email"
                       placeholder='ई-मेल एड्रेस'
                       value={userLogin.email}
                       onChange={(e) => {
                           setUserLogin({
                               ...userLogin,
                               email: e.target.value
                           })
                       }}
                        className='bg-[#C1F6ED] border border-[#3B945E] px-2 py-2 w-96 rounded-md outline-none placeholder-[#3B945E]'
                    />
                </div>

                
                <div className="mb-5">
                    <input
                         type="password"
                         placeholder='
पासवर्ड'
                         value={userLogin.password}
                         onChange={(e) => {
                             setUserLogin({
                                 ...userLogin,
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
                         
लॉग इन 
                    </button>
                </div>

                <div>
                <h2  className="text-[#3a3a3a]">   खाता नहीं है <Link className=' text-[#000000] font-bold' to={'/auth/register'}>
                साइन अप</Link></h2>
               
                </div>

            </div>
            
        </div>
        </div>
    );
}

export default Login;