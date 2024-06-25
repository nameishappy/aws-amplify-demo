import { useEffect, useState } from 'react'
import { FaMicrophone } from 'react-icons/fa'

const Home = () => {
    const [ourText, setOurText] = useState('')
    const msg = new SpeechSynthesisUtterance()

    useEffect(() => {
        window.speechSynthesis.speak(msg)
    }, [msg])

    const speechHandler = (msg: any) => {
        msg.text = ourText
        window.speechSynthesis.speak(msg)
    }
    return (
        <div className="App">
            <h1>React Text to Speech App</h1>
            <input
                type="text"
                value={ourText}
                placeholder="Enter Text"
                onChange={(e) => setOurText(e.target.value)}
            />
            <button onClick={() => speechHandler(msg)}>
                <FaMicrophone />
            </button>
        </div>
    )
}

export default Home
