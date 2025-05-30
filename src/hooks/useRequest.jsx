import axios from "axios"
import { useEffect, useState } from "react"

/**
 * Generic hook to make a request, handle loading, errors, response, and return a function called refetch to recall the same request
 *
 *
 * @param {string} uri
 * @param {object} options
 * @param {object} params
 * @param {object} body
 * @param {func} handler optional function to handle responses in a custom way
 * @returns {object}
 */
export const useRequest = (uri, options, params, body, handler) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [data, setData] = useState(null)

  const request = async () => {
    setLoading(true)

    try {
      const response = await axios({
        method: options?.method || "get",
        url: uri,
        params: typeof params === "object" ? params : {},
        data: body,
        ...options
      })

      if (handler && typeof handler === "function") {
        const handlerData = handler(response)

        setData(handlerData)
      } else {
        const { data: responseData } = response

        setData(responseData)
      }
    } catch (error) {
      console.error(error)
      setError(error?.message || error)
    } finally {
      setLoading(false)
    }
  }

  const refetch = async () => {
    return await request()
  }

  useEffect(() => {
    request()
  }, [])

  return {
    loading,
    error,
    refetch,
    data
  }
}

