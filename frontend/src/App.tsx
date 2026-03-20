import { useState, useEffect } from 'react'

function App() {
  const [data, setData] = useState<{ message: string } | null>(null)
  
  // Your `.env` specifies VITE_API_URL=http://localhost:5000
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5002'

  useEffect(() => {
    fetch(`${apiUrl}/api/hello`)
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("Error fetching data:", err))
  }, [apiUrl])

  return (
    <div>
      <h1>Frontend is running!</h1>
      <p>Backend response: {data ? data.message : "Loading..."}</p>
    </div>
  )
}

export default App