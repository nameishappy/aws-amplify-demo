import React, { useState } from 'react'
import {
    PollyClient,
    ListLexiconsCommand,
    SynthesizeSpeechCommandInput,
} from '@aws-sdk/client-polly'
import { SynthesizeSpeechCommand } from '@aws-sdk/client-polly'
import fs from 'fs'

const TextToSpeech = () => {
    const [audioUrl, setAudioUrl] = useState<string | null>(null)
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
            if (data.AudioStream) {
                const audioBlob = new Blob([data.AudioStream.buffer], {
                    type: 'audio/mpeg',
                })
                const url = URL.createObjectURL(audioBlob)
                setAudioUrl(url)
            }
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
            {audioUrl && <audio controls src={audioUrl}></audio>}
        </div>
    )
}

export default TextToSpeech
