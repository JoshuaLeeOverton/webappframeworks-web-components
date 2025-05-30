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
export const getTodosById = (id) => {}

/**
 * Create a todo
 *
 * @param {object} todo
 * @returns {object}
 */
export const createTodo = (todo) => {}

/**
 * update a todo using the id of the todo you are updating and the new data
 *
 * @param {string} id
 * @param {object} todo
 * @returns {object}
 */
export const updateTodo = (id, todo) => {}

/**
 * Delete a todo by its id
 *
 * @param {string} id
 */
export const deleteTodo = (id) => {}

