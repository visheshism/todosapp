import axios from "axios"
import { toast } from "react-hot-toast"
import { toast as toastify } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const axiosReq = async (
  method,
  url,
  body = {},
  setLoading,
  email = false,
  checkLoggedIn = true
) => {
  
  // Note: Here instead of two deployments, only one is enough if it is fast & supports email feature. Make sure to modify the code wherever required.
  
  const server = !email
    ? process.env.REACT_APP_VERCEL_LINK
    : process.env.REACT_APP_RENDER_LINK
  let data = JSON.stringify(body)

  let config = {
    method,
    url: `${server}/api/v1${url}`,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
    data,
  }

  setLoading && toast.dismiss()
  setLoading && toast.loading("Processing your request, please wait.")

  let res

  try {
    setLoading && setLoading(true)
    res = await axios.request(config)
  } catch (error) {
    res = error.response
  } finally {
    setLoading && setLoading(false)
  }

  if (
    !res.data.success &&
    res.data.message === "Log In first" &&
    checkLoggedIn
  ) {
    window.location.assign("/")
  }

  return res
}

const handleToastify = (success, message, duration = false) => {
  if (success) {
    toastify.success(message, {
      autoClose: duration,
    })
  } else {
    toastify.error(message, {
      autoClose: duration,
    })
  }
}

const handleHotToast = (success, message, duration = Infinity) => {
  toast.dismiss()

  if (success) {
    toast.success(message, {
      duration,
    })
  } else {
    toast.error(message, {
      duration,
    })
  }
}
export { axiosReq, handleHotToast, handleToastify }
