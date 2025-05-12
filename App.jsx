import { useState } from 'react'
import axios from 'axios'
import Tesseract from 'tesseract.js'

function App() {
  const [image, setImage] = useState(null)
  const [text, setText] = useState('')
  const [aiInsight, setAIInsight] = useState('')

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    setImage(file)

    Tesseract.recognize(file, 'eng').then(({ data: { text } }) => {
      setText(text)
      getAIInsight(text)
    })
  }

  const getAIInsight = async (receiptText) => {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a smart finance assistant.' },
          { role: 'user', content: `Analyze this receipt and summarize key spending: ${receiptText}` },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )
    setAIInsight(response.data.choices[0].message.content)
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>📸 Upload Receipt</h2>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <h3>🧾 Extracted Text:</h3>
      <pre>{text}</pre>
      <h3>🧠 AI Insight:</h3>
      <pre>{aiInsight}</pre>
    </div>
  )
}

export default App
