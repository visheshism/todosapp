import React, { useState } from "react"
import { Link } from "react-router-dom"
import { axiosReq, handleHotToast } from "../../utils"

const ChangeName = ({ setLoading, user, setUser }) => {
  const { name: oldName } = user

  const [error, setError] = useState("")
  const [newName, setNewName] = useState("")
  
  const changeName = async () => {
    const req = await axiosReq("put", "/users/update?q=name", {
      newName,
    }
    setLoading)
    const {
      data: { success, message },
    } = req

    handleHotToast(success, message, 10000)
    if (success) setUser({ ...user, name: newName })
    setNewName("")
  }
 
  const checkName = () => {
    if (newName === oldName) {
      setError("New name can't be same as the old name, please try again.")
    } else {
      setError("")
      changeName()
    }
  } 

  return (
    <div className="fixed inset-0 flex items-center justify-center -z-10 bg-gray-100 h-full sm:h-full">
      <div className="flex flex-col items-center bg-white pt-10 pb-8 px-6 md:pt-14 md:pb-14 md:px-16 rounded-lg shadow-deleteAcc min-w-[80%] sm:min-w-[420px] max-w-[500px]">
        <h2 className="text-3xl pb-6 font-semibold text-gray-700 font-oxy px-4">
          Change Name
        </h2>

        <div
          className={`${
            error.length < 1 && "hidden"
          } bg-red-500 text-white max-w-[300px] px-4 py-2 rounded mb-4`}
        >
          {error}
        </div>

        <div className="mb-10 w-full px-4">
          <label
            htmlFor="newName"
            className="block text-lg font-semibold text-gray-600 mb-1 font-pt"
          >
            New Name
          </label>
          <input
            type="text"
            id="newName"
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-indigo-500"
            value={newName}
            onChange={(e) =>
              setNewName(e.target.value.trim().length < 1 ? "" : e.target.value)
            }
          />
        </div>

        <div className="flex flex-col justify-between space-y-3 w-full px-4">
          <button
            className="px-8 py-2.5 bg-indigo-500 text-white rounded font-semibold hover:bg-indigo-600 active:scale-95 text-lg transition-transform ease-in-out"
            onClick={checkName}
          >
            Change Name
          </button>
          <Link
            to={"/userNav?page=settings"}
            className="px-8 py-2.5 text-indigo-500 rounded font-semibold text-lg text-center"
          >
            Back to Settings
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ChangeName
