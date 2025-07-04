



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
        <div className="relative h-screen w-full overflow-hidden">
          {/* Blurred Background */}
          <div
            className="absolute inset-0 bg-cover bg-center filter blur-md scale-110"
            style={{ backgroundImage: `url(${bg})` }}
          ></div>
    
          {/* Content */}
          <div className="relative z-10 flex justify-center items-center h-full px-4">
            <div className="bg-[#7ccda2]/90 backdrop-blur-lg p-6 sm:p-10 rounded-2xl shadow-2xl w-full max-w-md border border-[#182628] transition-all duration-300">
              {/* Heading */}
              <h2 className="text-center text-3xl font-bold text-[#182628] mb-6">
                Log In
              </h2>
    
              {/* Email Field */}
              <div className="mb-4">
                <input
                  type="email"
                  name="email"
                  placeholder="e-mail address"
                  value={userLogin.email}
                  onChange={(e) =>
                    setUserLogin({ ...userLogin, email: e.target.value })
                  }
                  className="bg-[#C1F6ED] border border-[#3B945E] px-4 py-3 w-full rounded-md outline-none placeholder-[#3B945E] focus:ring-2 focus:ring-green-400"
                />
              </div>
    
              {/* Password Field */}
              <div className="mb-6">
                <input
                  type="password"
                  placeholder="password"
                  value={userLogin.password}
                  onChange={(e) =>
                    setUserLogin({ ...userLogin, password: e.target.value })
                  }
                  className="bg-[#C1F6ED] border border-[#3B945E] px-4 py-3 w-full rounded-md outline-none placeholder-[#3B945E] focus:ring-2 focus:ring-green-400"
                />
              </div>
    
              {/* Login Button */}
              <button
                type="button"
                onClick={onSubmit}
                className="w-full bg-[#039b17] hover:bg-[#3B945E] text-white font-semibold py-3 rounded-md transition"
              >
                Log In
              </button>
    
              {/* Link to Sign Up */}
              <p className="mt-5 text-center text-[#3a3a3a]">
                Don’t have an account yet?{" "}
                <Link
                  to="/auth/register"
                  className="font-bold text-black hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      );
}

export default Login;