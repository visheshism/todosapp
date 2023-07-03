import React from "react"
import { Link } from "react-router-dom"
import { axiosReq, handleHotToast } from "../../utils"

const DeleteAccount = ({ setIsAuth, setLoading, navigate }) => {
  const deleteHandler = async () => {
    const req = await axiosReq("delete", "/users/me", {}, setLoading)
    const {
      data: { success, message },
    } = req

    handleHotToast(success, message, 10000)
    if (success) {
      setIsAuth(false)
      navigate("/")
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center -z-10 bg-gray-100">
      <div className="bg-white rounded-lg shadow-deleteAcc p-8 max-w-[90%]">
        <p className="text-xl font-semibold text-gray-800 mb-6 text-justify">
          Are you sure you want to delete your account?
        </p>

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded font-semibold hover:bg-red-600 mr-2"
            onClick={deleteHandler}
          >
            Yes
          </button>
          <Link
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded font-semibold hover:bg-gray-400"
            to={"/userNav?page=settings"}
          >
            No
          </Link>
        </div>
      </div>
    </div>
  )
}

export default DeleteAccount
