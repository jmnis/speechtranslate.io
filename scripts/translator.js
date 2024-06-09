class Translator {
    _recognizer
    _callback

    constructor(callback) {
        this._callback = callback
    }

    start(options) {
        const alreadyStarted = !!this._recognizer
        if (alreadyStarted) {
            return
        }

        const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput()
        const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(options.subscriptionKey, options.region)

        speechConfig.speechRecognitionLanguage = options.fromLanguage
        speechConfig.addTargetLanguage(options.toLanguage)

        this._recognizer = new SpeechSDK.TranslationRecognizer(speechConfig, audioConfig)
        this._recognizer.recognizing = this._recognizer.recognized = recognizerCallback.bind(this)

        function recognizerCallback(s, e) {
            const result = e.result
            if (result.reason !== SpeechSDK.ResultReason.TranslatingSpeech && result.reason !== SpeechSDK.ResultReason.TranslatedSpeech) {
                return
            }

            const captions = {
                offset: result.offset,
                languages: {}
            }
            captions.languages[getLanguageCode(options.fromLanguage)] = result.text
            const lang = getLanguageCode(options.toLanguage)
            captions.languages[lang] = result.translations.get(lang)

            this._callback({
                original: result.text,
                translations: captions
            })
        }

        function getLanguageCode(lang) {
            return lang.substring(0, 2)
        }
    }

    stop() {
        this._recognizer.stopContinuousRecognitionAsync(
            stopRecognizer.bind(this),
            function (err) {
                stopRecognizer().bind(this)
                console.error(err)
            }.bind(this)
        )

        function stopRecognizer() {
            this._recognizer.close()
            this._recognizer = undefined
            console.log('Stopped')
        }
    }
}

export default Translator