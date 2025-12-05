import { useState, useEffect, useRef } from 'react'
import { RetellWebClient } from 'retell-client-js-sdk'
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
          retellClientRef.current.stopCall()
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
      const apiKey = import.meta.env.VITE_RETELL_API_KEY || ''
      
      // Access token almak için Retell.ai API'sini kullan
      // Dokümantasyona göre: POST /v2/create-web-call
      let accessToken = ''
      
      if (apiKey && agentId) {
        try {
          const response = await fetch('https://api.retellai.com/v2/create-web-call', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              agent_id: agentId
            })
          })
          
          if (!response.ok) {
            const errorText = await response.text()
            console.error('API yanıtı:', response.status, errorText)
            throw new Error(`Access token alınamadı: ${response.status} - ${errorText}`)
          }
          
          const data = await response.json()
          // Dokümantasyona göre response'da access_token veya call_id olabilir
          accessToken = data.access_token || data.call_id || data.call?.call_id || data.token
          
          if (!accessToken) {
            console.error('API yanıtı:', data)
            throw new Error('Access token bulunamadı. API yanıtını kontrol edin.')
          }
          
          console.log('Access token başarıyla alındı')
        } catch (err) {
          console.error('Access token hatası:', err)
          throw new Error(`Retell.ai bağlantısı kurulamadı: ${err.message}`)
        }
      } else {
        throw new Error('Retell.ai API Key ve Agent ID gerekli')
      }

      console.log('Retell.ai SDK başlatılıyor...')
      
      // Retell.ai Web Client oluştur
      const client = new RetellWebClient()
      
      // Event listener'ları ekle
      // SDK EventEmitter kullanıyor, olası event'ler: conversation_started, conversation_ended, error, etc.
      client.on('conversation_started', () => {
        console.log('Retell.ai konuşması başladı')
        setIsConnected(true)
        setIsConnecting(false)
      })
      
      client.on('conversation_ended', () => {
        console.log('Retell.ai konuşması sona erdi')
        setIsConnected(false)
      })
      
      client.on('error', (error) => {
        console.error('Retell.ai hatası:', error)
        setError(error?.message || error?.toString() || 'Bir hata oluştu')
        setIsConnecting(false)
        setIsConnected(false)
      })
      
      // Bağlantı başarılı olduğunda da tetiklenebilir
      client.on('connect', () => {
        console.log('Retell.ai bağlantısı kuruldu')
        setIsConnected(true)
        setIsConnecting(false)
      })
      
      client.on('disconnect', () => {
        console.log('Retell.ai bağlantısı kesildi')
        setIsConnected(false)
      })
      
      // Konuşmayı başlat
      await client.startCall({
        accessToken: accessToken
      })
      
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
        retellClientRef.current.stopCall()
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
        <h1 className="title">call.ai</h1>
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

