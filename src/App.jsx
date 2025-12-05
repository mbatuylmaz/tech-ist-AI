import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState(null)
  const retellClientRef = useRef(null)

  useEffect(() => {
    // Retell.ai SDK'sını dinamik olarak yükle
    const loadRetellSDK = async () => {
      try {
        // Retell.ai SDK script'ini yükle
        if (!document.querySelector('script[src*="retell"]')) {
          const script = document.createElement('script')
          script.src = 'https://cdn.retellai.com/retell-sdk-web/retell-sdk-web.js'
          script.async = true
          document.head.appendChild(script)
          
          // SDK'nın yüklenmesini bekle
          await new Promise((resolve, reject) => {
            script.onload = resolve
            script.onerror = reject
            setTimeout(() => reject(new Error('SDK yükleme zaman aşımı')), 10000)
          })
        }
      } catch (err) {
        console.error('Retell.ai SDK yüklenemedi:', err)
      }
    }

    loadRetellSDK()

    // Cleanup
    return () => {
      if (retellClientRef.current) {
        try {
          retellClientRef.current.stop()
        } catch (e) {
          console.error('Cleanup hatası:', e)
        }
      }
    }
  }, [])

  const startConversation = async () => {
    setIsConnecting(true)
    setError(null)

    try {
      const agentId = import.meta.env.VITE_RETELL_AGENT_ID || 'agent_e137bdf68f6bc9474f8fd37c1e'
      
      // Retell.ai SDK'nın yüklenmesini bekle
      let retries = 0
      while (!window.RetellWebClient && retries < 10) {
        await new Promise(resolve => setTimeout(resolve, 500))
        retries++
      }

      if (!window.RetellWebClient) {
        throw new Error('Retell.ai SDK yüklenemedi. Sayfayı yenileyin.')
      }

      // Retell.ai Web SDK kullanarak konuşmayı başlat
      const client = new window.RetellWebClient({
        agentId: agentId,
        onConnect: () => {
          console.log('Retell.ai bağlantısı kuruldu')
          setIsConnected(true)
          setIsConnecting(false)
        },
        onDisconnect: () => {
          console.log('Retell.ai bağlantısı kesildi')
          setIsConnected(false)
        },
        onError: (error) => {
          console.error('Retell.ai hatası:', error)
          setError(error?.message || error?.toString() || 'Bir hata oluştu')
          setIsConnecting(false)
          setIsConnected(false)
        }
      })

      await client.start()
      retellClientRef.current = client
    } catch (err) {
      console.error('Konuşma başlatılamadı:', err)
      setError(err.message || 'Konuşma başlatılamadı. Lütfen mikrofon izinlerini kontrol edin.')
      setIsConnecting(false)
    }
  }

  const stopConversation = () => {
    if (retellClientRef.current) {
      try {
        retellClientRef.current.stop()
        retellClientRef.current = null
        setIsConnected(false)
      } catch (err) {
        console.error('Durdurma hatası:', err)
        setIsConnected(false)
      }
    }
  }

  return (
    <div className="app">
      <div className="container">
        <h1 className="title">Tech Ist AI</h1>
        <p className="subtitle">Sesli AI Asistanınız</p>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {!isConnected ? (
          <button 
            className="start-button" 
            onClick={startConversation}
            disabled={isConnecting}
          >
            {isConnecting ? 'Bağlanıyor...' : 'Start'}
          </button>
        ) : (
          <div className="connected-state">
            <div className="status-indicator">
              <span className="status-dot"></span>
              <span>Bağlı - Konuşabilirsiniz</span>
            </div>
            <button 
              className="stop-button" 
              onClick={stopConversation}
            >
              Durdur
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default App

