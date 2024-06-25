import React from 'react'
import {
    PollyClient,
    ListLexiconsCommand,
    SynthesizeSpeechCommandInput,
} from '@aws-sdk/client-polly'
import { SynthesizeSpeechCommand } from '@aws-sdk/client-polly'
import fs from 'fs'

const TextToSpeech = () => {
    const pollyClient = new PollyClient({
        region: 'us-east-1',
        credentials: {
            accessKeyId: 'kwnekjwn',
            secretAccessKey: 'sjwj',
        },
    })

    // Set the parameters
    const params: SynthesizeSpeechCommandInput = {
        OutputFormat: 'mp3', // For example, "mp3"
        Text: 'Hello, welcome to AWS Polly text to speech conversion.',
        VoiceId: 'Joanna', // For example, "Joanna"
    }

    // Create the command
    const run = async () => {
        try {
            const data = await pollyClient.send(
                new SynthesizeSpeechCommand(params)
            )
            // Save the audio stream to a file
            console.log(data)
            const writeStream = fs.createWriteStream('speech.mp3')
            writeStream.write(data.AudioStream)
            writeStream.end()
            console.log('The file was saved as speech.mp3!')
        } catch (err) {
            console.error('Error', err)
        }
    }

    run()
    return <div>tts</div>
}

export default TextToSpeech
