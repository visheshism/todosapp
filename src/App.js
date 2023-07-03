import { createContext, useEffect, useState } from "react"
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom"
import Header from "./components/Header/Header"
import Home from "./pages/Home/Home"
import Login from "./pages/Login/Login"
import Signup from "./pages/Signup/Signup"
import ResetPass from "./pages/Reset Password/Reset_password"
import UserNav from "./pages/UserNav/UserNav"
import Logout from "./components/Logout/Logout"
import ConfirmEmail from "./pages/Confirm User/Confirm_user"
import NotFound from "./components/404/404"
import Loader from "./components/LoaderAnimation/Loader"
import { Toaster } from "react-hot-toast"
import { ToastContainer } from "react-toastify"
import { axiosReq } from "./utils"

export const ctx = createContext({ isAuth: false })

function App() {
  const [isAuth, setIsAuth] = useState(false)
  const [headerHeight, setHeaderHeight] = useState(64)
  const [user, setUser] = useState({})
  const [showPopup, setShowPopup] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleResize = () => {
    const width = window.innerWidth
    if (width <= 500) {
      return "xs"
    } else if (width > 500 && width < 800) {
      return "sm"
    } else if (width >= 800 && width < 1024) {
      return "md"
    } else {
      return "lg"
    }
  }
  
  const [deviceType, setDeviceType] = useState(handleResize)

  window.onresize = () => {
    setDeviceType(handleResize)
  }

  useEffect(() => {
    let instance = 0
    const checkIsAuth = async () => {
        instance === 0 && setLoading(true)
        instance++
      const res=await axiosReq("get", "/users/me", {}, null, false)
      if(res.data.success){
          setIsAuth(true)
          instance === 1 && setLoading(false)
          setUser(res.data.User)

      }else{
         setIsAuth(false)
          instance === 1 && setLoading(false)
          setUser({})

      }
    }

    checkIsAuth()

    setInterval(checkIsAuth, 300000)
  }, [])


  return (
    <>
      <Router>
        <ctx.Provider
          value={{
            isAuth,
            setIsAuth,
            showPopup,
            setShowPopup,
            deviceType,
            headerHeight,
            setHeaderHeight,
            loading,
            setLoading,
            user,
            setUser,
          }}
        >
          <Loader loading={loading} />
          <Header />
          <Routes>
            <Route path={"/"} element={<Home />} />

            {isAuth ? (
              <>
                <Route
                  path={"/logout"}
                  element={
                    <Logout setIsAuth={setIsAuth} setLoading={setLoading} />
                  }
                />
                <Route path={"/userNav"} element={<UserNav />} />
              </>
            ) : (
              <>
                <Route exact path={"/login"} element={<Login />} />
                <Route exact path={"/signup"} element={<Signup />} />
                <Route exact path={"/reset_password"} element={<ResetPass />} />
                <Route
                  exact
                  path={"/confirm_user"}
                  element={<ConfirmEmail />}
                />
              </>
            )}

            <Route path={"*"} element={<NotFound />} />
          </Routes>
          <Toaster position="top-center" reverseOrder={false} />
        </ctx.Provider>
          <ToastContainer
            position="top-right"
            hideProgressBar={false}
            newestOnTop
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable={false}
            pauseOnHover={false}
            theme="colored"
            closeButton={false}
            />
      </Router>
    </>
  )
}

export default App
