import React, { useContext, useEffect, useMemo, useState } from "react"
import "./Home.css"
import { Navigate, useLocation } from "react-router-dom"
import { ctx } from "../../App"
import LandingPage from "../../components/LandingPage/LandingPage"
import Sidebar from "../../components/Sidebar/Sidebar"
import { axiosReq } from "../../utils"
import TodoForm from "../../components/TodoForm/TodoForm"
import TodosWrapper from "../../components/TodosWrapper/TodosWrapper"

const Home = () => {
  const { isAuth, isAdmin } = useContext(ctx)

  return isAuth ? <LoggedInUser isAdmin={isAdmin} /> : <LandingPage />
}

const LoggedInUser = () => {
  const {
    showPopup: showForm,
    setShowPopup: setShowForm,
    deviceType,
    headerHeight,
    setLoading,
  } = useContext(ctx)
  const getTodos = async () => {
    const {
      data: { todos },
    } = await axiosReq("get", "/todos/all")
    if (todos) {
      setTodos(todos)
    }
  }
  const getCategs = async () => {
    const {
      data: { categories },
    } = await axiosReq("get", "/categ")
    if (categories) {
      setCategories(categories)
    }
  }
  const [todos, setTodos] = useState([])
  const [categories, setCategories] = useState([])

  useEffect(() => {
    getTodos()
    getCategs()
  }, [])

  const [sideContent, setSideContent] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [currentTodos, setCurrentTodos] = useState([])
  const [currentTodo, setCurrentTodo] = useState({})
  const [currentFilter, setCurrentFilter] = useState("all")
  const [currentMode, setCurrentMode] = useState("create")

  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  const categParam = queryParams.get("categ")
  const searchParam = queryParams.get("q")
  const searchCategParam = queryParams.get("c")

  const todosLength = useMemo(() => {
    if (categories.length > 0) {
      const categLength = categories.reduce((lengths, category) => {
        const count = todos.reduce(
          (accumulator, todo) =>
            accumulator + (todo.categ === category ? 1 : 0),
          0
        )
        return { ...lengths, [category]: count }
      }, {})

      return { all: todos.length, ...categLength }
    } else {
      return { all: todos.length }
    }
  }, [todos, categories])

  useEffect(() => {
    let todosArr = []
    if (searchParam) {
      let backendQuery
      backendQuery = `?query=${searchParam}`

      const backendReq = async () => {
        await axiosReq("get", `/search${backendQuery}`)
      }

      if (searchCategParam) {
        backendQuery += `&categ=${searchCategParam}`
      }
      todosArr = todos.filter((obj) => {
        const { title, description, categ } = obj
        const lowercaseSearch = searchParam.toLowerCase()

        const titleMatch = title.toLowerCase().includes(lowercaseSearch)
        const descriptionMatch = description
          .toLowerCase()
          .includes(lowercaseSearch)
        const categMatch = categ.toLowerCase().includes(lowercaseSearch)

        if (searchCategParam) {
          return (
            (titleMatch || descriptionMatch || categMatch) &&
            categ === searchCategParam
          )
        } else {
          return titleMatch || descriptionMatch || categMatch
        }
      })

      backendReq()

      document.title = `Search: ${searchParam.slice(0, 40)} ${searchCategParam ? "in " + searchCategParam : ""
        } `
    } else {
      if (!categParam && location.search === "") {
        todosArr = todos
        document.title = "Todos: All"
      } else if (categParam && categories.includes(categParam)) {
        todosArr = todos.filter((todo) => todo.categ === categParam)
        document.title = "Todos: " + categParam
      }
    }
    if (currentFilter === "completed") {
      todosArr = todosArr.filter((todo) => todo.isCompleted === true)
    } else if (currentFilter === "incomplete") {
      todosArr = todosArr.filter((todo) => todo.isCompleted === false)
    }

    setSideContent(false)
    setCurrentTodos(todosArr)
    setTimeout(() => setLoadingData(false), 1500)
  }, [location.search, currentFilter, todos])

  useEffect(() => {
    setLoadingData(true)
  }, [location.search, currentFilter])

  if (
    (categParam && !categories.includes(categParam)) ||
    (!categParam && !searchParam && location.search !== "")
  )
    return <Navigate to={"/"} />

  return (
    <>
      <div
        className="flex justify-center 
        transition-all ease-in-out"
        style={{
          height: `calc(100vh - ${headerHeight + (deviceType === "xs" ? 65 : 20)
            }px)`,
        }}
      >
        <Sidebar
          reqs={{
            todosLength,
            categParam,
            location,
            categories,
            setCategories,
            setSideContent,
            deviceType,
            headerHeight,
            sideContent,
            loadingData,
            setLoadingData,
            setTodos,
            todos,
          }}
        />
        <div className="content px-4 text-justify overflow-y-scroll flex-grow mx-auto w-full">
          <TodosWrapper
            reqs={{
              currentTodos,
              setCurrentTodo,
              setCurrentMode,
              setShowForm,
              todos,
              setTodos,
              loadingData,
              currentFilter,
              setCurrentFilter,
              deviceType,
              sideContent,
            }}
          />
          <TodoForm
            reqs={{
              todos,
              setTodos,
              currentTodo,
              setCurrentTodo,
              categories,
              categParam,
              showForm,
              setShowForm,
              setLoading,
              currentMode,
              setCurrentMode,
              deviceType,
              isAdmin
            }}
          />
        </div>
      </div>
    </>
  )
}

export default Home
