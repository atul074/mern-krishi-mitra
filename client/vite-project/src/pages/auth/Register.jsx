


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
                Sign Up 
              </h2>
    
              {/* Full Name */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="full name"
                  value={userSignup.userName}
                  onChange={(e) =>
                    setUserSignup({ ...userSignup, userName: e.target.value })
                  }
                  className="bg-[#C1F6ED] border border-[#3B945E] px-4 py-3 w-full rounded-md outline-none placeholder-[#3B945E] focus:ring-2 focus:ring-green-400"
                />
              </div>
    
              {/* Email */}
              <div className="mb-4">
                <input
                  type="email"
                  placeholder="email address"
                  value={userSignup.email}
                  onChange={(e) =>
                    setUserSignup({ ...userSignup, email: e.target.value })
                  }
                  className="bg-[#C1F6ED] border border-[#3B945E] px-4 py-3 w-full rounded-md outline-none placeholder-[#3B945E] focus:ring-2 focus:ring-green-400"
                />
              </div>
    
              {/* Password */}
              <div className="mb-6">
                <input
                  type="password"
                  placeholder="password"
                  value={userSignup.password}
                  onChange={(e) =>
                    setUserSignup({ ...userSignup, password: e.target.value })
                  }
                  className="bg-[#C1F6ED] border border-[#3B945E] px-4 py-3 w-full rounded-md outline-none placeholder-[#3B945E] focus:ring-2 focus:ring-green-400"
                />
              </div>
    
              {/* Submit Button */}
              <button
                type="button"
                onClick={onSubmit}
                className="w-full bg-[#039b17] hover:bg-[#3B945E] text-white font-semibold py-3 rounded-md transition"
              >
                Sign Up
              </button>
    
              {/* Switch to Login */}
              <p className="mt-5 text-center text-[#182628]">
                Already have an account ?{" "}
                <Link
                  to="/auth/login"
                  className="font-bold text-black hover:underline"
                >
                  Log In
                </Link>
              </p>
            </div>
          </div>
        </div>
      );
    
    
    
}

export default Register;