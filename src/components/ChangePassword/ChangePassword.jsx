import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { handleInputChange } from "../../pages/Login/Login"
import { axiosReq, handleHotToast } from "../../utils"

const ChangePassword = ({ setLoading }) => {
  const [error, setError] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
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
    !isPasswordValid
      ? setError(
          "Password should be at least 8 characters long and include at least one letter, one number, and one symbol (@$!%*?&)."
        )
      : setError("")
    setConfirmPasswordValid(isConfirmPasswordValid)
  }, [newPassword, confirmPassword])

  const changePass = async () => {
    const req = await axiosReq(
      "put",
      "/users/update?q=password",
      { currentPass: currentPassword, newPass: newPassword },
      setLoading
    )
    const {
      data: { success, message },
    } = req

    handleHotToast(success, message, 10000)
    if (success) {
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    }
  }

  return (
    <div className="inset-0 flex items-center justify-center -z-10 bg-gray-100 mt-5 mb-5 md:h-[calc(100vh+64px)] md:fixed px-6 md:px-0">
      <div className="flex flex-col items-center bg-white pt-6 pb-6 px-6 rounded-lg shadow-deleteAcc md:-mt-8">
        <h2 className="text-2xl md:text-4xl pb-4 font-semibold text-gray-700 font-oxy">
          Change Password
        </h2>

        <div
          className={`${
            error.length > 0 ? "" : "hidden"
          } text-justify bg-red-500 text-white max-w-[350px] px-2 md:px-4 py-1 md:py-2 rounded mb-2 transition-all ease-in-out`}
        >
          {error}
        </div>

        <div className="mb-3 w-full px-4">
          <label
            htmlFor="currentPassword"
            className="block text-lg font-semibold text-gray-700 mb-1 font-pt"
          >
            Current Password
          </label>
          <input
            type="password"
            id="currentPassword"
            className={` w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-indigo-500`}
            placeholder="Enter current password"
            value={currentPassword}
            onChange={(e) => handleInputChange(e, setCurrentPassword)}
          />
        </div>

        <div className="mb-3 w-full px-4">
          <label
            htmlFor="newPassword"
            className="block text-lg font-semibold text-gray-700 mb-1 font-pt"
          >
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            className={`${
              !newPasswordValid ? "text-red-400" : ""
            } w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-indigo-500`}
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => handleInputChange(e, setNewPassword)}
          />
        </div>

        <div className="mb-6 w-full px-4">
          <label
            htmlFor="confirmPassword"
            className="block text-lg font-semibold text-gray-700 mb-1 font-pt"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            className={`${
              !confirmPasswordValid ? "text-red-400" : ""
            } w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-indigo-500`}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => handleInputChange(e, setConfirmPassword)}
          />
        </div>

        <div className="flex flex-col justify-between space-y-3 w-full px-4">
          <button
            className="px-6 py-2 bg-indigo-500 text-white rounded font-semibold hover:bg-indigo-600 text-lg"
            onClick={changePass}
            disabled={!newPasswordValid || !confirmPasswordValid}
          >
            Change Password
          </button>
          <Link
            to={"/userNav?page=settings"}
            className="px-6 py-2 text-indigo-500 rounded font-semibold text-center text-lg"
          >
            Back to Settings
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ChangePassword
