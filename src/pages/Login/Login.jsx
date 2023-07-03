import React, { useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { VscEye, VscEyeClosed } from "react-icons/vsc"
import { toast } from "react-hot-toast"
import "./Login.css"
import { ctx } from "../../App"
import { axiosReq, handleHotToast } from "../../utils"

const Login = () => {
  const { deviceType, setLoading, setIsAuth } = useContext(ctx)

  return (
    <LoginComponent
      deviceType={deviceType}
      setLoading={setLoading}
      setIsAuth={setIsAuth}
    />
  )
}

const LoginComponent = ({ deviceType, setLoading, setIsAuth }) => {
  const navigate = useNavigate()

  const [Email, setEmail] = useState("")
  const [Password, setPassword] = useState("")
  const [eyeOpen, seteyeOpen] = useState(false)

  const LoginHandler = async () => {
    const req = await axiosReq(
      "post",
      "/users/login",
      {
        email: Email,
        password: Password,
      },
      setLoading
    )
    const {
      data: { success, message },
    } = req

    if (message === "Confirm Email to Log In") {
      toast.dismiss()
      toast(
        <>
          <div className="py-2.5 break-all">{message}&nbsp;&nbsp;</div>
          <button
            className="bg-green-500 text-white px-1 py-1.5 rounded min-w-[100px] max-h-[40px] my-1 mx-0.5"
            onClick={confirmEmail}
          >
            Send Email
          </button>
        </>,
        {
          duration: 50000,
        }
      )
    } else {
      handleHotToast(success, message)
    }

    if (success) {
      setIsAuth(true)
      navigate("/")
    }
  }

  const confirmEmail = async () => {
    toast.dismiss()
    let success = false
    let message = "Maximum attempts exceeded, please contact Administrator"

    const url = `${window.location.origin}/confirm_user`
    const req = await axiosReq(
      "get",
      `/users/confirm_email?mail=${Email}&url=${encodeURIComponent(url)}`,
      {},
      setLoading,
      true
    )
    const { data } = req
    success = data.success
    message = data.message

    if (success) {
      message = (
        <>
          <div>
            {message.split(",")[0]}.&nbsp;&nbsp;
            <button
              className="underline text-red-400 active:text-red-500"
              onClick={confirmEmail}
            >
              Resend Email?
            </button>
          </div>
        </>
      )
    }
    handleHotToast(success, message)
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center overflow-hidden bg-slate-100 text-white [font-family:'Muli']">
      <div className="bg-[rgba(38,85,124,0.79)] scale-95 sm:scale-100 min-w-[90%] sm:min-w-[0%] py-12 px-10 rounded-md shadow-2xl shadow-slate-600">
        <h1 className="mb-4 text-3xl font-bold tracking-wide animate-transformOpaque">
          Welcome Back !
        </h1>
        <h2 className="text-center mb-6 text-lg  tracking-wide">
          Login to Your Account
        </h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <div
            className={`relative mt-5 w-80 ${deviceType === "xs" && "w-full"}`}
          >
            <input
              type="email"
              required
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              className="invalid:text-red-400 bg-transparent border-0 border-b-[2px] w-full py-4 px-0 text-[18px] focus:outline-none valid:outline-none focus:border-b-[#4cbfe5] valid:border-b-[#4cbfe5]"
              value={Email}
              onChange={(e) => handleInputChange(e, setEmail)}
            />
            <label
              className={`absolute top-[15px] left-0 cursor-text select-none`}
              onClick={(e) =>
                document.querySelector("input[type='email']").focus()
              }
            >
              {returnSpan("Email", Email)}
            </label>
          </div>
          <div
            className={`relative mt-5 w-80 ${deviceType === "xs" && "w-full"}`}
          >
            <input
              type={eyeOpen ? "text" : "password"}
              minLength="8"
              required
              autoComplete="off"
              autoCorrect="off"
              className="invalid:text-red-400 bg-transparent border-0 border-b-[2px] w-full py-4 pr-9 text-[18px] focus:outline-none valid:outline-none focus:border-b-[#4cbfe5] valid:border-b-[#4cbfe5]"
              value={Password}
              onChange={(e) => handleInputChange(e, setPassword)}
            />
            <label
              className={`absolute top-[15px] left-0 cursor-text select-none`}
              onClick={(e) =>
                e.target.parentElement.previousElementSibling.focus() ||
                e.target.previousElementSibling.focus()
              }
            >
              {returnSpan("Password", Password)}
            </label>
            <span
              className={`absolute right-0.5 top-4 text-3xl ${
                eyeOpen ? "text-cyan-300" : "text-white"
              }`}
              onMouseDown={() => seteyeOpen(true)}
              onMouseUp={() => seteyeOpen(false)}
            >
              {Password.length > 0 &&
                (!eyeOpen ? <VscEye /> : <VscEyeClosed />)}
            </span>
          </div>
          <p className="w-full text-right mt-2 text-red-300 select-none">
            <Link to={"/reset_password"}>Forgot Password?</Link>
          </p>
          <button
            className="bg-[#3eb4dc] w-full cursor-pointer inline-block p-3.5 text-lg border-none rounded-[4.5px] focus:outline:none active:scale-[0.98] mt-4"
            onClick={LoginHandler}
            disabled={
              Password.trim().length < 8 ||
              !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(Email)
            }
          >
            Login
          </button>
          <p className="mt-7">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#5bc8ec]">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export const handleInputChange = (e, setter) => setter(e.target.value.trim())

export const returnSpan = (text, sibling) => {
  return text.split("").map((letter, idx) => (
    <span
      style={{
        display: "inline-block",
        minWidth: "5px",
        fontSize: "18px",
        transition: " 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        transitionDelay: `${idx * 50}ms`,
      }}
      key={letter + idx}
      className={sibling.length > 0 ? "SpanUp" : ""}
    >
      {letter}
    </span>
  ))
}

export default Login
