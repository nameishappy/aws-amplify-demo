import { useRef, useState } from 'react'
import {
    PollyClient,
    SynthesizeSpeechCommandInput,
} from '@aws-sdk/client-polly'
import { SynthesizeSpeechCommand } from '@aws-sdk/client-polly'
import AudioPlayer from './AudioPlayer'

const TextToSpeech = () => {
    const [audioUrl, setAudioUrl] = useState<string | null>(null)
    const [audioFile, setAudioFile] = useState<any>(null)
    const audioRef = useRef<HTMLAudioElement | null | undefined>()
    const pollyClient = new PollyClient({
        region: 'us-east-1',
    })

    // Set the parameters
    const params: SynthesizeSpeechCommandInput = {
        OutputFormat: 'mp3', // For example, "mp3"
        Text: 'Hello, welcome to AWS Polly text to speech conversion.',
        VoiceId: 'Joanna', // For example, "Joanna"
    }

    // Create the command
    const convertTextToSpeech = async () => {
        try {
            const data = await pollyClient.send(
                new SynthesizeSpeechCommand(params)
            )
            // Save the audio stream to a file
            console.log(data)
            setAudioFile(data)
            if (data.AudioStream) {
                const streamdata = await (
                    await data.AudioStream.transformToByteArray()
                ).buffer
                const audioURL = URL.createObjectURL(
                    new Blob([streamdata], { type: 'audio/mpeg' })
                )
                audioRef.current.src = audioURL
                console.log(streamdata)
                // Set URL to state
                // setAudioUrl(audioURL)
            }
            console.log(audioUrl)
        } catch (err) {
            console.error('Error', err)
        }
    }

    return (
        <div>
            <button
                className="bg-blue-500 rounded-md p-2 text-white"
                onClick={convertTextToSpeech}
            >
                Convert Text to Speech
            </button>
            {audioUrl && <audio controls ref={audioRef}></audio>}
            {/* <AudioPlayer audioFile={audioFile} /> */}
        </div>
    )
}

export default TextToSpeech
