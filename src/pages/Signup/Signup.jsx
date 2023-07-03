import React, { useContext, useState } from "react"
import { Link } from "react-router-dom"
import { handleInputChange, returnSpan } from "../Login/Login"
import { handleHotToast as handleClick } from "../../utils"
import "./Signup.css"
import { ctx } from "../../App"
import { axiosReq } from "../../utils"

const Signup = () => {
  const { deviceType, setLoading } = useContext(ctx)

  const [Name, setName] = useState("")
  const [Email, setEmail] = useState("")
  const [Password, setPassword] = useState("")

  const signupHandler = async () => {
    const req = await axiosReq(
      "post",
      "/users/register",
      { name: Name, email: Email, password: Password },
      setLoading
    )
    const {
      data: { success, message },
    } = req
    handleClick(success, message)
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center overflow-hidden bg-slate-100 text-white [font-family:'Muli']">
      <div className="bg-[rgba(38,85,124,0.79)]  scale-95 sm:scale-100 min-w-[90%] sm:min-w-[0%] py-12 px-10 rounded-md shadow-2xl shadow-slate-600">
        <h1 className="text-center mb-9 text-2xl font-bold tracking-wide animate-transformOpaqueUp">
          Create Your Account
        </h1>
        <form onSubmit={(e) => e.preventDefault()}>
          <div
            className={`relative mt-5 w-80 ${deviceType === "xs" && "w-full"}`}
          >
            <input
              type="text"
              required
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              className="invalid:text-red-400 bg-transparent border-0 border-b-[2px] w-full py-4 px-0 text-[18px] focus:outline-none valid:outline-none focus:border-b-[#4cbfe5] valid:border-b-[#4cbfe5]"
              value={Name}
              onChange={(e) =>
                setName(e.target.value.trim().length < 1 ? "" : e.target.value)
              }
            />
            <label
              className={`absolute top-[15px] left-0 cursor-text select-none`}
              onClick={() =>
                document.querySelector("input[type='text']").focus()
              }
            >
              {returnSpan("Name", Name)}
            </label>
          </div>

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
                e.target.parentElement.previousElementSibling.focus() ||
                e.target.previousElementSibling.focus()
              }
            >
              {returnSpan("Email", Email)}
            </label>
          </div>

          <div
            className={`relative mt-5 w-80 ${deviceType === "xs" && "w-full"}`}
          >
            <input
              type="password"
              minLength="8"
              required
              autoComplete="off"
              autoCorrect="off"
              className={`${
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/.test(
                  Password
                )
                  ? "text-white"
                  : "text-red-400"
              } bg-transparent border-0 border-b-[2px] w-full py-4 px-0 text-[18px] focus:outline-none valid:outline-none focus:border-b-[#4cbfe5] valid:border-b-[#4cbfe5]`}
              value={Password}
              onChange={(e) => handleInputChange(e, setPassword)}
              pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$"
              onInvalid={(e) =>
                e.target.setCustomValidity(
                  "Password should be at least 8 characters long and include at least one letter, one number, and one symbol (@$!%*?&)."
                )
              }
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
          </div>
          <button
            className="bg-[#3eb4dc] w-full cursor-pointer inline-block p-3.5 text-lg border-none rounded-[4.5px] focus:outline:none active:scale-[0.98] mt-4"
            disabled={
              !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/.test(
                Password
              ) ||
              Name.length < 1 ||
              !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(Email)
            }
            onClick={signupHandler}
          >
            Signup
          </button>
          <p className="mt-7 text-center">
            Existing User?{" "}
            <Link to="/login" className="text-[#5bc8ec]">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Signup
