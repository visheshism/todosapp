import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { axiosReq } from "../../utils"
import { handleHotToast } from "../../utils"

const Logout = ({ setIsAuth, setLoading }) => {
  const navigate = useNavigate()
  useEffect(() => {
    const logoutReq = async () => {
      const {
        data: { success, message },
      } = await axiosReq("get", "/users/logout", setLoading)
      if (success) {
        handleHotToast(success, message)
        setIsAuth(false)
      } else {
        handleHotToast(false, "Something went wrong, try reloading the page.")
      }
      navigate("/")
    }
    logoutReq()
  }, [])
}

export default Logout
