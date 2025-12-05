import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState(null)
  const retellClientRef = useRef(null)

  useEffect(() => {
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
      const publicKey = import.meta.env.VITE_RETELL_PUBLIC_KEY || ''
      
      // Retell.ai SDK'nın yüklenmesini bekle
      let retries = 0
      const maxRetries = 20
      while (!window.RetellWebClient && retries < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 300))
        retries++
      }

      if (!window.RetellWebClient) {
        throw new Error('Retell.ai SDK yüklenemedi. Sayfayı yenileyin ve internet bağlantınızı kontrol edin.')
      }

      // Retell.ai Web SDK kullanarak konuşmayı başlat
      const config = {
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
      }

      // Public key varsa ekle
      if (publicKey) {
        config.publicKey = publicKey
      }

      const client = new window.RetellWebClient(config)

      await client.start()
      retellClientRef.current = client
    } catch (err) {
      console.error('Konuşma başlatılamadı:', err)
      setError(err.message || 'Konuşma başlatılamadı. Lütfen mikrofon izinlerini kontrol edin ve Retell.ai Public Key\'inizi eklediğinizden emin olun.')
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

