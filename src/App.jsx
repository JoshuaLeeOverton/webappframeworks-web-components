import reactLogo from "./assets/react.svg"
import viteLogo from "/vite.svg"
import { TodoItem } from "../modules/src/index"
import "./App.css"
import { useEffect, useRef } from "react"
import { useRequest } from "./hooks/useRequest"
import { createTodo, getTodos, deleteTodo } from "./handlers/todos"

function App() {
  const cardRef = useRef(null)
  // [{id: 1, todo: 'one'},{id: 1, todo: 'one'}}]
  const { data, loading, error, refetch } = useRequest(
    import.meta.env.VITE_TODO_API_URL,
    { method: "get" },
    {},
    {},
    getTodos
  )

  useEffect(() => {
    const card = cardRef.current
    if (card) {
      card.addEventListener("todo-click", handleTodoClick)
    }
    return () => {
      if (card) {
        card.removeEventListener("todo-click", handleTodoClick)
      }
    }
  }, [])

  const handleTodoClick = (e) => {
    // e.target is the <todo-item> that dispatched the event
    const title = e.target.getAttribute("title")
    const { action, id } = e.detail // if you dispatch detail from your custom event

    switch (action) {
      case "delete":
        deleteTodo(id, refetch)
        break
      default:
        console.error("Unhandled action", title)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const value = e?.target[0]?.value || null

    if (value) {
      await createTodo({ title: value }, refetch)
    }
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>New Todo</label>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <input
            style={{
              marginRight: "8px"
            }}
            type="text"
          ></input>
          <button
            style={{
              backgroundColor: "#3b3b3b",
              borderColor: "#858585",
              borderTopLeftRadius: "0px",
              borderBottomLeftRadius: "0px",
              paddingTop: "4px",
              paddingBottom: "4px",
              paddingLeft: "15px",
              paddingRight: "15px"
            }}
          >
            <span style={{ height: "inherit", fontSize: "14px" }}>Add</span>
          </button>
        </div>
      </form>
      <div className="card" ref={cardRef}>
        {loading ? (
          <p>loading...</p>
        ) : error ? (
          <p>error encountered</p>
        ) : (
          <>
            {data &&
              Array.isArray &&
              data.map(({ id, title, createdAt }) => (
                <todo-item id={id} title={title} date={createdAt}></todo-item>
              ))}
          </>
        )}
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App

