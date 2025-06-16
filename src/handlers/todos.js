import axios from "axios"

/**
 * Get All Todos
 *
 * @param {string} id
 * @returns {object}
 */
export const getTodos = (response) => {
  //verify response object
  if (
    !response ||
    !response.data ||
    (!response.status && response.status > 300)
  ) {
    throw new Error("Invalid response")
  }

  const { data: responseData } = response

  if (
    !responseData ||
    !responseData.data ||
    responseData.status !== "ok" ||
    !Array.isArray(responseData.data)
  ) {
    throw new Error("Invalid data")
  }
  return responseData.data
}

/**
 * Get Todo by an id
 *
 * @param {string} id
 * @returns {object}
 */
export const getTodosById = () => {}

/**
 * Create a todo
 *
 * @param {object} todo
 * @returns {object}
 */
export const createTodo = async (todo, callback) => {
  try {
    if (todo.title) {
      const response = await axios({
        method: "post",
        url: import.meta.env.VITE_TODO_API_URL,
        data: { ...todo }
      })

      if (response?.data && response.data.status === "ok") {
        callback(response)
      } else {
        throw new Error("Failed to create todo")
      }
    } else {
      throw new Error("Invalid Todo")
    }
  } catch (error) {
    console.error(error?.message || error)
  }
}

/**
 * update a todo using the id of the todo you are updating and the new data
 *
 * @param {string} id
 * @param {object} todo
 * @returns {object}
 */
export const updateTodo = async (id, todo) => {
  try {
    if (id) {
      const response = await axios({
        method: "PATCH",
        url: import.meta.env.VITE_TODO_API_URL,
        params: { id },
        data: { ...todo }
      })

      if (response?.status !== 204) {
        throw new Error("Failed to delete todo")
      }
    } else {
      throw new Error("Invalid Todo ID")
    }
  } catch (error) {
    console.error(error?.message || error)
  }
}

/**
 * Delete a todo by its id
 *
 * @param {string} id
 */
export const deleteTodo = async (id, callback) => {
  try {
    if (id) {
      const response = await axios({
        method: "delete",
        url: import.meta.env.VITE_TODO_API_URL,
        params: { id }
      })

      if (response?.status === 204) {
        callback(response)
      } else {
        throw new Error("Failed to delete todo")
      }
    } else {
      throw new Error("Invalid Todo ID")
    }
  } catch (error) {
    console.error(error?.message || error)
  }
}

