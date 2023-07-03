import React, { useContext, useEffect, useState } from "react"
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom"
import { FaUserCircle, FaKey } from "react-icons/fa"
import { RiDeleteBin5Fill } from "react-icons/ri"
import { BiRename } from "react-icons/bi"
import "./UserNav.css"
import ChangeName from "../../components/ChangeName/ChangeName"
import ChangePassword from "../../components/ChangePassword/ChangePassword"
import DeleteAccount from "../../components/DeleteAccount/DeleteAccount"
import { ctx } from "../../App"
import { axiosReq } from "../../utils"
import { toast } from "react-hot-toast"

const UserNav = () => {
  const { deviceType, setLoading, user, setUser, setIsAuth } = useContext(ctx)
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  const navigate = useNavigate()

  const param1 = queryParams.get("page")
  const param2 = queryParams.get("tab")

  let userDetails

  if (!param1 || (param1 !== "profile" && param1 !== "settings"))
    return <Navigate to={"/"} />

  const currentComponent =
    param1 === "profile" ? (
      <Profile userDetails={userDetails} setLoading={setLoading} />
    ) : param1 === "settings" ? (
      param2 ? (
        param2 === "changeName" ? (
          <ChangeName user={user} setUser={setUser} setLoading={setLoading} />
        ) : param2 === "changePassword" ? (
          <ChangePassword setLoading={setLoading} />
        ) : param2 === "deleteAccount" ? (
          <DeleteAccount
            navigate={navigate}
            setIsAuth={setIsAuth}
            setLoading={setLoading}
          />
        ) : (
          <Navigate to={"/"} />
        )
      ) : (
        <Settings deviceType={deviceType} />
      )
    ) : (
      <Navigate to={"/"} />
    )

  return currentComponent
}

const Profile = ({ setLoading }) => {
  document.title = "Profile - TodosApp"

  const [user, setUser] = useState({})
  const [loadedData, setLoadedData] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      const req = await axiosReq("get", "/users/me", {}, setLoading)
      const {
        data: { User },
      } = req

      const loadSearches = await axiosReq(
        "get",
        "/recent-searches",
        {},
        setLoading
      )

      const {
        data: { recentSearches },
      } = loadSearches

      setUser({
        name: User.name,
        email: User.email,
        recentSearches: recentSearches
          ? recentSearches.map((item) => item.query)
          : [],
      })
    }

    loadData()
  }, [])

  useEffect(() => {
    if (user.name && user.email && user.recentSearches) {
      toast.dismiss()

      setLoading(false)
      setLoadedData(true)
    }
  }, [user])

  return (
    <div className="h-[calc(100vh-64px)] bg-slate-100 w-full flex items-center justify-center">
      {loadedData && (
        <div className="rounded shadow-lg md:-mt-16 lg:mt-0 text-center">
          <div className="div-bg-gradient py-16 px-20 rounded rounded-b-none"></div>
          <div className="pt-0 pb-12 bg-gray-200 px-20">
            <div className="icon-wrapper -mb-16">
              <FaUserCircle className="text-9xl mx-auto text-[#67ebfffc] bg-violet-600 rounded-full" />
            </div>
            <h2 className="text-4xl font-semibold mb-2 text-gray-600">
              {user.name}
            </h2>
            <p className="text-base text-red-900/80">{user.email}</p>
            <div>
              <h3 className="text-2xl font-semibold text-center mt-5 text-gray-700">
                Recent Searches
              </h3>
              <ul className="text-center mt-2 space-y-2 font-pt">
                {user.recentSearches.length > 0 ? (
                  user.recentSearches.slice(0, 3).map((item) => (
                    <li
                      className="text-base font-medium tracking-wide hover:bg-gray-600 hover:text-white rounded py-1.5 px-0 my-1"
                      key={item}
                    >
                      {item}
                    </li>
                  ))
                ) : (
                  <li className="text-base font-medium tracking-wide hover:bg-gray-600 hover:text-white rounded py-1.5 px-2.5 mt-3">
                    Recent searches don't exist.
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const Settings = ({ deviceType }) => {
  document.title = "Settings - TodosApp"

  return (
    <div className="h-[calc(100vh-64px)] bg-gray-300 flex items-center justify-center">
      <div
        className={`flex flex-col items-center bg-white shadow-settings  px-${
          deviceType === "xs" ? "4 py-10 -mt-20" : "10 pt-12 pb-14 mt-0"
        } rounded-lg min-w-[75%] sm:min-w-[360px]`}
      >
        <h2 className="text-4xl pb-6 font-semibold text-gray-700 font-oxy">
          Settings
        </h2>
        <ul className="space-y-5 mx-4 my-2">
          <li className="hover:bg-gray-100 active:bg-gray-200 px-3 py-3 rounded text-slate-600 font-pt tracking-wider">
            <Link
              to={"/userNav?page=settings&tab=changeName"}
              className="flex justify-evenly items-center space-x-2"
            >
              <span className="font-semibold text-xl">Change Name</span>
              {<BiRename className="w-6 h-6" />}
            </Link>
          </li>
          <li className="hover:bg-gray-100 active:bg-gray-200 px-3 py-3 rounded text-slate-600 font-pt tracking-wider">
            <Link
              to={"/userNav?page=settings&tab=changePassword"}
              className="flex justify-evenly items-center space-x-2"
            >
              <span className="font-semibold text-xl">Change Password</span>
              {<FaKey className="w-6 h-6" />}
            </Link>
          </li>
          <li className="hover:bg-red-400 hover:scale-95 active:scale-105 px-3 py-3 rounded bg-red-500 text-white font-pt tracking-wider transition-all ease-in-out">
            <Link
              to={"/userNav?page=settings&tab=deleteAccount"}
              className="flex justify-evenly items-center space-x-2"
            >
              {<RiDeleteBin5Fill className="w-6 h-6" />}
              <span className="font-semibold text-xl">Delete Account</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default UserNav
