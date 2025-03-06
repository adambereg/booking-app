import { useEffect, useState } from 'react'
import { useSupabase } from '../contexts/SupabaseContext'

function TestSupabase() {
  const { supabase } = useSupabase()
  const [testResult, setTestResult] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function testConnection() {
      try {
        const { count, error } = await supabase
          .from('properties')
          .select('*', { count: 'exact', head: true })
        
        if (error) throw error
        
        setTestResult(`Подключение успешно! Количество объектов в базе: ${count || 0}`)
      } catch (err) {
        console.error('Ошибка при подключении к Supabase:', err)
        setError(err.message)
      }
    }

    testConnection()
  }, [supabase])

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Тест подключения к Supabase</h2>
      {error ? (
        <div className="text-red-600">
          Ошибка: {error}
        </div>
      ) : testResult ? (
        <div className="text-green-600">
          {testResult}
        </div>
      ) : (
        <div>Проверка подключения...</div>
      )}
    </div>
  )
}

export default TestSupabase 