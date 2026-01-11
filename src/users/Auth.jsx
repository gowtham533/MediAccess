import React, { useState } from "react";
import styles from "./Auth.module.css";
import { toast, ToastContainer } from "react-toastify";
import { googleLoginAPI, loginAPI, registerAPI } from "../services/allAPI";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import GoogleAuthButton from "../components/GoogleAuthButton";




function Auth() {
  const [isRegister, setIsRegister] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const navigate = useNavigate()
  
  // store data from form
  const [userDetails,setUserDetails] = useState({
    username:"", email:"", password:""
  })
  // console.log(userDetails);

  const handleRegister = async (e)=>{
    e.preventDefault()
    const {username, password, email} = userDetails
    if(username && password && email){
        // toast.success('API call')
        try{
          const result = await registerAPI(userDetails)
          console.log(result);
          if(result.status==200){
            toast.success("registration successful..!! Please Login!!")
            setUserDetails({username:"",email:"", password:""})
            navigate('/login')
          }else if(result.status==409){
            toast.warning(result.response.data)
            setUserDetails({username:"",email:"", password:""})
            navigate('/login')
          }else{
            console.log(result);
            toast.error("something went wrong")
            setUserDetails({username:"",email:"", password:""})
          }
          
        }catch(err){
          console.log(err);
        }
    }else{
        toast.info("please fill the form completely")
    }

  }

  // login
  const handleLogin = async (e) => {
  e.preventDefault();

  const { email, password } = userDetails;

  if (!email || !password) {
    toast.info("please fill the form completely");
    return;
  }

  try {
    const result = await loginAPI({ email, password });
    console.log(result);

    if (result.status === 200) {
      toast.success("login successful..!!!");

      sessionStorage.setItem("token", result.data.token);
      sessionStorage.setItem("user", JSON.stringify(result.data.user));

      setTimeout(() => {
        if (result.data.user.role === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      }, 2000);
    }

  } catch (err) {
    console.log(err);

    if (err.response) {
      // backend error message
      toast.error(err.response.data || "Invalid credentials");
    } else {
      toast.error("Server not responding");
    }
  }
};



  // google login
  const handleGoogleLogin = async (credentialResponse) => {
  try {
    const decode = jwtDecode(credentialResponse.credential);

    const result = await googleLoginAPI({
      username: decode.name,
      email: decode.email,
      password: "googlePassword",
      picture: decode.picture,
    });

    if (result.status === 200) {
      toast.success("login successful..!!!");

      sessionStorage.setItem("token", result.data.token);
      sessionStorage.setItem("user", JSON.stringify(result.data.user));

      setTimeout(() => {
        if (result.data.user.role === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      }, 2000);
    }

  } catch (err) {
    console.log(err);
    toast.error("Google login failed");
  }
};


  return (
    <>
      {/* Animated Background */}
      
      <div className={styles.darkBg}>
      <div className={styles.authBackground}>
      <div className={styles.authPage}>
        <div
          className={`${styles.authWrapper} ${
            isRegister ? styles.panelActive : ""
          }`}
        >
          {/* Register */}
          <div className={`${styles.authFormBox} ${styles.registerFormBox}`}>
            <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
              <h1 className={styles.title}>Create Account</h1>

              <div className={styles.socialLinks}>
                
                <p className="italic mb-2 text-gray-400">with google</p>
                <GoogleAuthButton onSuccess={handleGoogleLogin}/>
                
              </div>

              <span className={styles.subtitle}>
                or use your email for registration
              </span>

              <input onChange={(e)=>setUserDetails({...userDetails,username:e.target.value})} value={userDetails.username}
                className={styles.input}
                type="text"
                placeholder="Full Name"
              />

              <input onChange={(e)=>setUserDetails({...userDetails,email:e.target.value})} value={userDetails.email}
                className={styles.input}
                type="email"
                placeholder="Email Address"
              />

              {/* Password with Eye */}
              <div className={styles.passwordWrapper}>
                <input onChange={(e)=>setUserDetails({...userDetails,password:e.target.value})} value={userDetails.password}
                  className={styles.input}
                  type={showRegisterPassword ? "text" : "password"}
                  placeholder="Password"
                />
                <button
                  type="button"
                  className={styles.eyeButton}
                  onClick={() =>
                    setShowRegisterPassword(!showRegisterPassword)
                  }
                >
                  <i
                    className={`fa ${
                      showRegisterPassword ? "fa-eye-slash" : "fa-eye"
                    }`}
                  ></i>
                </button>
              </div>

              <button onClick={handleRegister} className={styles.button}>Sign Up</button>

              <div className={styles.mobileSwitch}>
                <p>Already have an account?</p>
                <button 
                  type="button"
                  className={styles.button}
                  onClick={() => setIsRegister(false)}
                >
                  Sign In
                </button>
              </div>
            </form>
          </div>

          {/* Login */}
          <div className={`${styles.authFormBox} ${styles.loginFormBox}`}>
            <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
              <h1 className={styles.title}>Sign In</h1>

              <div className={styles.socialLinks}>
                <p className="italic mb-2 text-gray-400">with google</p>
                <a href="#"><GoogleAuthButton onSuccess={handleGoogleLogin}/></a>
                
              </div>

              <span className={styles.subtitle}>or use your account</span>

              <input onChange={(e)=>setUserDetails({...userDetails,email:e.target.value})} value={userDetails.email}
                className={styles.input}
                type="email"
                placeholder="Email Address"
              />

              {/* Password with Eye */}
              <div className={styles.passwordWrapper}>
                <input onChange={(e)=>setUserDetails({...userDetails,password:e.target.value})} value={userDetails.password}
                  className={styles.input}
                  type={showLoginPassword ? "text" : "password"}
                  placeholder="Password"
                />
                <button
                  type="button"
                  className={styles.eyeButton}
                  onClick={() =>
                    setShowLoginPassword(!showLoginPassword)
                  }
                >
                  <i
                    className={`fa ${
                      showLoginPassword ? "fa-eye-slash" : "fa-eye"
                    }`}
                  ></i>
                </button>
              </div>

              <a href="#" className={styles.link}>
                Forgot your password?
              </a>

              <button onClick={handleLogin} className={styles.button}>Sign In</button>

              <div className={styles.mobileSwitch}>
                <p>Don't have an account?</p>
                <button
                  type="button"
                  className={styles.button}
                  onClick={() => setIsRegister(true)}
                >
                  Sign Up
                </button>
              </div>
            </form>
          </div>

          {/* Sliding Panel (UNCHANGED) */}
          <div className={styles.slidePanelWrapper}>
            <div className={styles.slidePanel}>
              <div
                className={`${styles.panelContent} ${styles.panelContentLeft}`}
              >
                <h1 className={styles.title}>Welcome Back!</h1>
                <p className={styles.text}>
                  Stay connected by logging in with your credentials
                </p>
                <button
                  className={`${styles.button} ${styles.transparentBtn}`}
                  onClick={() => setIsRegister(false)}
                >
                  Sign In
                </button>
              </div>

              <div
                className={`${styles.panelContent} ${styles.panelContentRight}`}
              >
                <h1 className={styles.title}>Hey There!</h1>
                <p className={styles.text}>
                  Begin your amazing journey by creating an account
                </p>
                <button
                  className={`${styles.button} ${styles.transparentBtn}`}
                  onClick={() => setIsRegister(true)}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      <ToastContainer
      position="top-right"
      autoClose={3000}
      theme='colored'/>
      </div>
    </>
  );
}

export default Auth;
