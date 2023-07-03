import React, { useContext, useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { VscVerifiedFilled } from "react-icons/vsc"
import { FaTimesCircle } from "react-icons/fa"
import "./Confirm_user.css"
import { axiosReq } from "../../utils"
import { ctx } from "../../App"

const Confirm_email = () => {
  const { setLoading } = useContext(ctx)
  const [data, setData] = useState({
    success: false,
    message: "Invalid Request, please try again.",
  })
  const [loaded, setLoaded] = useState(false)

  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  const userParam = queryParams.get("user")
  const tokenParam = queryParams.get("token")
  const expTimeParam = queryParams.get("expTime")

  useEffect(() => {
    const handler = async () => {
      const req = await axiosReq(
        "post",
        `/users/confirm_email?user=${userParam}&token=${tokenParam}`,
        { url: `${window.location.origin}/login` },
        setLoading
      )
      const {
        data: { success, message },
      } = req

      setData({ success, message })
      setLoaded(true)
      if (!success) {
        setData({ ...data, message: "Something went wrong, please try again." })
      }
    }
    if (userParam && tokenParam && expTimeParam) {
      if (expTimeParam < Date.now()) {
        setData({ ...data, message: "Token expired, place a new request." })
        setLoaded(true)
      } else {
        handler()
      }
    } else {
      setLoaded(true)
    }
  }, [userParam, tokenParam, expTimeParam])

  return (
    <div className="min-h-[calc(100vh-64px)] bg-indigo-400 flex justify-center items-center">
      {loaded && (
        <div
          className="px-10 lg:px-12 pt-7 lg:pt-10 pb-6 bg-slate-100 rounded-sm shadow-lg shadow-slate-600 lg:min-w-[420px] max-w-[320px] lg:max-w-[520px] confirmUser -mt-12"
        >
          <Component message={data.message} success={data.success} />
        </div>
      )}
    </div>
  )
}

const Component = ({ success, message }) => {
  const failed = {
    icon: <FaTimesCircle className="text-red-600 text-9xl mb-2" />,
    message: "Error!",
  }
  const succeeded = {
    icon: <VscVerifiedFilled className="text-green-600 text-9xl" />,
    message: "Success!",
  }
  const { icon, message: title } = success ? succeeded : failed

  return (
    <>
      <div className="flex justify-center items-center">{icon}</div>
      <h1 className="pb-4 text-4xl text-center font-medium font-Nsans">
        {title}
      </h1>
      <h2 className="text-center pb-4 text-slate-600 font-medium font-Nsans">
        {message}
      </h2>
      <Link
        className="flex justify-center w-full bg-indigo-700 hover:bg-indigo-600 text-white active:scale-95 focus:outline:none py-3 mt-5 transition-transform ease-in-out font-semibold tracking-wide font-Nsans"
        to={"/login"}
      >
        Go to Login
      </Link>
    </>
  )
}

export default Confirm_email
