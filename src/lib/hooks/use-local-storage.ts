import { useState, useEffect } from "react"

export function useLocalStorage<T>(key: string, initialValue: T) {

  const [storedValue, setStoredValue] = useState<T>(initialValue)

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {

    setIsClient(true)

    try {

      const item = window.localStorage.getItem(key)

      setStoredValue(item ? JSON.parse(item) : initialValue)
    } catch (error) {
      console.error("Error reading localStorage", error)
    }
  }, [key, initialValue])

  const setValue = (value: T | ((val: T) => T)) => {

    try {

      const valueToStore = value instanceof Function ? value(storedValue) : value

      setStoredValue(valueToStore)
      if (typeof window !== "undefined") {

        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } 
    
    catch (error) {
      console.error("Error writing to localStorage", error)
    }
  }

  return [isClient ? storedValue : initialValue, setValue] as const
}
