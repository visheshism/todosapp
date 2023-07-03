import React, { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { handleInputChange } from "../Login/Login"
import { handleHotToast as handleClick } from "../../utils"
import { VscVerifiedFilled } from "react-icons/vsc"
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa"
import "./Reset_password.css"
import { ctx } from "../../App"
import { axiosReq } from "../../utils"

const Reset_password = () => {
  const { setLoading } = useContext(ctx)
  let currentComponent

  const [step, setStep] = useState(1)
  const [success, setSuccess] = useState(false)
  const [showBtn, setShowBtn] = useState(true)

  const [Email, setEmail] = useState("")
  const [userOtp, setUserOtp] = useState(Array(4).fill(""))

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const reqHandler = async () => {
    const req = await axiosReq(
      "get",
      `/users/reset_password?mail=${Email}&url=${window.location.origin}`,

      {},
      setLoading
    )

    const {
      data: { success, message },
    } = req
    handleClick(success, message)

    if (success) {
      setStep(2)
    } else {
      setShowBtn(false)
    }
  }

  const otpHandler = async () => {
    const req = await axiosReq(
      "post",
      `/users/reset_password?mail=${Email}&otp=${userOtp.join("")}`,
      {},
      setLoading
    )
    const {
      data: { success, message },
    } = req
    handleClick(success, message)

    if (success) {
      setStep(3)
    }
  }

  const resetPassword = async () => {
    const req = await axiosReq(
      "post",
      `/users/reset_password?mail=${Email}&otp=${userOtp.join("")}`,

      { newPass: newPassword },
      setLoading
    )
    const {
      data: { success, message },
    } = req
    handleClick(success, message, 10000)

    if (success) {
      setSuccess(true)
      setStep(4)
    }
  }

  switch (step) {
    case 1:
      currentComponent = (
        <Component1
          setStep={setStep}
          setLoading={setLoading}
          Email={Email}
          setEmail={setEmail}
          reqHandler={reqHandler}
        />
      )
      break
    case 2:
      currentComponent = (
        <Component2
          setStep={setStep}
          setLoading={setLoading}
          reqHandler={reqHandler}
          userOtp={userOtp}
          setUserOtp={setUserOtp}
          otpHandler={otpHandler}
          showBtn={showBtn}
        />
      )
      break
    case 3:
      currentComponent = (
        <Component3
          setStep={setStep}
          setLoading={setLoading}
          userOtp={userOtp}
          Email={Email}
          setSuccess={setSuccess}
          resetPassword={resetPassword}
          newPassword={newPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          setNewPassword={setNewPassword}
        />
      )
      break
    case 4:
      currentComponent = <Component4 success={success} />
      break
    default:
      currentComponent = <Component1 />
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-indigo-400 flex justify-center items-center">
      <div class="passReset -mt-12 rounded-sm bg-slate-100 px-8 pb-6 pt-10 shadow-lg shadow-slate-600 md:px-10 min-w-[300px] w-[80%] max-w-[380px] md:min-w-[420px] lg:max-w-[500px]">
        {currentComponent}
      </div>
    </div>
  )
}

const Component1 = ({ Email, setEmail, reqHandler }) => {

  return (
    <>
      <h1 className="pb-2 text-3xl md:text-4xl text-center font-bold font-Nsans">
        Password Reset
      </h1>
      <h2 className="text-center pb-6 text-slate-600 font-semibold font-Nsans">
        Enter your email to continue
      </h2>
      <input
        type="email"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        className="invalid:text-red-400 mx-auto font-Nsans flex max-w-full min-w-full focus:outline-none valid:outline-none px-2 py-2 rounded-md invalid:border-red-300 border-slate-400 border-2 tracking-wider mt-4 mb-2 placeholder:tracking-normal"
        placeholder="Enter email address"
        pattern="^[^\s@]+@[^\s@]+\.[^\s@]{2,}$"
        value={Email}
        onInput={(e) => handleInputChange(e, setEmail)}
      />
      <button
        className="flex justify-center w-full bg-indigo-700 hover:bg-indigo-600 text-white active:scale-95 focus:outline:none py-3 mt-5 transition-transform ease-in-out font-semibold tracking-wide font-Nsans"
        disabled={!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/i.test(Email)}
        onClick={reqHandler}
      >
        Continue
      </button>
      <Link
        to={"/login"}
        className="flex justify-center w-full text-indigo-700 focus:outline:none py-3 my-1 transition-transform ease-in-out font-semibold tracking-wide font-Nsans"
      >
        Back to Login
      </Link>
    </>
  )
}

const Component2 = ({
  reqHandler,
  userOtp,
  setUserOtp,
  otpHandler,
  showBtn,
}) => {

  const codes = Array.from({ length: 4 }, (_, idx) => {
    const handleKeyDown = (e, idx) => {
      if (e.key >= "0" && e.key <= "9") {
        setUserOtp((prevOtp) => {
          const updatedOtp = [...prevOtp]
          updatedOtp[idx] = e.key
          return updatedOtp
        })
        if (idx !== userOtp.length - 1) {
          setTimeout(() => e.target.nextElementSibling.focus(), 10)
        }
      } else if (e.key === "Backspace") {
        setUserOtp((prevOtp) => {
          const updatedOtp = [...prevOtp]
          updatedOtp[idx] = ""
          return updatedOtp
        })
        if (idx !== 0) {
          setTimeout(() => e.target.previousElementSibling.focus(), 10)
        }
      }
    }

    return (
      <input
        className="w-[calc(100%/6)] caret-transparent rounded-md text-4xl border-2 border-[#eee] m-1 font-light appearance-[textfield] text-center py-6 spin valid:border-[#3498db] active:cursor-none"
        type="number"
        maxLength="1"
        placeholder="0"
        value={userOtp[idx]}
        autoComplete="off"
        autoCorrect="off"
        onKeyDown={(e) => handleKeyDown(e, idx)}
        autoFocus={idx === 0}
        key={idx}
      />
    )
  })

  return (
    <>
      <h1 className="pb-2 text-3xl md:text-4xl text-center font-medium font-Nsans">
        Verify Your Account
      </h1>
      <h2 className="text-center pb-1 text-slate-600 [font-semibold] font-Nsans">
        Enter the code sent to your email
      </h2>
      <div className="flex justify-center gap-2 pt-5">{codes}</div>
      {showBtn && (
        <button
          className="w-full text-right mr-2 mt-3 text-red-500 font-semibold font-Nsans tracking-wide hover:underline-offset-4 hover:underline hover:cursor-pointer active:text-black disabled:text-black disabled:hover:no-underline"
          onClick={reqHandler}
        >
          Resend OTP
        </button>
      )}
      <button
        className="font-Nsans flex justify-center w-full bg-indigo-700 hover:bg-indigo-600 text-white active:scale-95 focus:outline:none py-3 mt-4 transition-transform ease-in-out font-semibold tracking-wide"
        disabled={!userOtp.join("").trim().length === 4}
        onClick={otpHandler}
      >
        Verify
      </button>
    </>
  )
}

const Component3 = ({
  resetPassword,
  newPassword,
  confirmPassword,
  setConfirmPassword,
  setNewPassword,
}) => {

  const [newPasswordValid, setNewPasswordValid] = useState(false)
  const [confirmPasswordValid, setConfirmPasswordValid] = useState(false)

  useEffect(() => {
    const passwordPattern =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/

    const isPasswordValid =
      newPassword.length >= 8 && passwordPattern.test(newPassword)
    const isConfirmPasswordValid =
      newPassword === confirmPassword && passwordPattern.test(confirmPassword)

    setNewPasswordValid(isPasswordValid)
    setConfirmPasswordValid(isConfirmPasswordValid)
  }, [newPassword, confirmPassword])

  return (
    <>
      <h1 className="pb-2 text-3xl md:text-4xl text-center font-medium font-Nsans">
        Set New Password
      </h1>
      <h2 className="text-center pb-1 text-slate-600 font-semibold font-Nsans">
        Enter your new password
      </h2>
      <span className="relative">
        <input
          type="password"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          className={`${!newPasswordValid ? "text-red-400" : ""
            } mx-auto font-Nsans flex max-w-full min-w-full focus:outline-none valid:outline-none pl-2.5 pr-8 py-2 rounded-md border-slate-400 border-2 tracking-wider mt-4 mb-2 placeholder:tracking-normal`}
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => handleInputChange(e, setNewPassword)}
        />
        {newPassword.length > 0 &&
          (newPasswordValid ? (
            <FaCheckCircle className="text-green-600 text-xl absolute right-2 top-3" />
          ) : (
            <FaTimesCircle className="text-red-600 text-xl absolute right-2 top-3" />
          ))}
      </span>
      <span className="relative">
        <input
          type="password"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          className={`${!confirmPasswordValid ? "text-red-400" : ""
            } mx-auto font-Nsans flex max-w-full min-w-full focus:outline-none valid:outline-none pl-2.5 pr-8 py-2 mt-4 mb-4 rounded-md border-slate-400 border-2 tracking-wider placeholder:tracking-normal`}
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => handleInputChange(e, setConfirmPassword)}
        />
        {confirmPassword.length > 0 &&
          (confirmPasswordValid ? (
            <FaCheckCircle className="text-green-600 text-xl absolute right-2 top-5" />
          ) : (
            <FaTimesCircle className="text-red-600 text-xl absolute right-2 top-5" />
          ))}
      </span>
      <h2 className="flex gap-2 text-slate-600 font-Nsans text-justify">
        Password should be at least 8 characters long and include at least one
        letter, one number, and one symbol (@$!%*?&).
      </h2>
      <button
        className="font-Nsans flex justify-center w-full bg-indigo-700 hover:bg-indigo-600 text-white active:scale-95 focus:outline:none py-3 mt-6 transition-transform ease-in-out font-semibold tracking-wide"
        disabled={!newPasswordValid || !confirmPasswordValid}
        onClick={resetPassword}
      >
        Change Password
      </button>
    </>
  )
}

const Component4 = ({ success = false }) => {

  const failed = {
    icon: <FaTimesCircle className="text-red-600 text-9xl mb-2" />,
    message: "Failed!",
    desc: "Something went wrong, please try again later.",
    button: { link: "/", text: "Visit Homepage" },
  }

  const succeeded = {
    icon: <VscVerifiedFilled className="text-green-600 text-9xl" />,
    message: "Success!",
    desc: "Your password has been changed successfully",
    button: { link: "/login", text: "Go to Login" },
  }

  const { icon, message, desc, button } = success ? succeeded : failed

  return (
    <>
      <div className="flex justify-center items-center">{icon}</div>
      <h1 className="mt-2 sm:mt-0 pb-4 text-4xl text-center font-medium font-Nsans">
        {message}
      </h1>
      <h2 className="text-center pb-2 md:pb-4 text-slate-600 font-medium font-Nsans">
        {desc}
      </h2>
      <Link
        className="flex justify-center w-full bg-indigo-700 hover:bg-indigo-600 text-white active:scale-95 focus:outline:none py-3 mt-5 transition-transform ease-in-out font-semibold tracking-wide font-Nsans"
        to={button.link}
      >
        {button.text}
      </Link>
    </>
  )
}

export default Reset_password
