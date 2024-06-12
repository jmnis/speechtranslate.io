// This class is used to translate the speech from the microphone to the desired language.
class Translator {
    _translationRecognizer
    _alreadyStarted = false

    start(options) {
        this._alreadyStarted = true

        const speechConfig = SpeechSDK.SpeechTranslationConfig.fromSubscription(options.key, options.region);
        speechConfig.speechRecognitionLanguage = options.fromLanguage;
        speechConfig.addTargetLanguage(options.toLanguage);
        const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
        this._translationRecognizer = new SpeechSDK.TranslationRecognizer(speechConfig, audioConfig);
        this._translationRecognizer.startContinuousRecognitionAsync();

        this._translationRecognizer.recognizing = this._translationRecognizer.recognized = recognizerCallback.bind(this)

        function recognizerCallback(s, e) {
            options.captions.textContent = e.result.translations.get(options.toLanguage);
        }
    }

    stop() {
        this._alreadyStarted = false
        this._translationRecognizer.stopContinuousRecognitionAsync(
            stopRecognizer.bind(this),
            function (err) {
                stopRecognizer().bind(this)
                console.error(err)
            }.bind(this)
        )

        function stopRecognizer() {
            this._translationRecognizer.close()
            this._translationRecognizer = undefined
        }
    }
}
document.addEventListener("DOMContentLoaded", function () {
    // HTML elements
    var captionsDiv;
    var recordingButton;
    var languageBar;
    var translator = new Translator();

    // subscription key and region for speech services.
    const subscriptionKey = "YOUR_SUBSCRIPTION_KEY";
    const serviceRegion = "YOUR_SERVICE_REGION";

    // To add in case of another language
    // const fromLanguageBar = document.getElementById("from-language");
    const toLanguageBar = document.getElementById("to-language");
    var fromLanguage = "fr-FR";
    var toLanguage = toLanguageBar.value;

    /*
    fromLanguageBar.addEventListener("change", (event) => {
        fromLanguage = event.target.value;
    } )*/

    // Update the language to which we translate
    toLanguageBar.addEventListener("change", (event) => {
        toLanguage = event.target.value;
    })

    recordingButton= document.getElementsByClassName("rec-button")[0];
    captionsDiv = document.getElementById("captions");
    languageBar = document.getElementsByClassName("language-bar")[0];
    
    // Start/Stop the translation when pressing CTRL + R
    document.addEventListener("keydown", (event) => {
        if (event.ctrlKey && event.key === 'r'){
            event.preventDefault();
            if (!translator._alreadyStarted) {
                languageBar.style.opacity = 0;
                recordingButton.classList.toggle("blink")
                captionsDiv.innerHTML = "";
                translator.start({
                    key: subscriptionKey,
                    region: serviceRegion,
                    fromLanguage: fromLanguage,
                    toLanguage: toLanguage,
                    captions: captionsDiv
                });
            } else {
                translator.stop();
                captionsDiv.innerHTML = "";
                recordingButton.classList.toggle("blink")
                languageBar.style.opacity = 1;
                
            }
        }

    });

    // Fullscreen mode using CTRL + F
    document.addEventListener("keydown", (event) => {
        if (event.ctrlKey && event.key === 'f'){
            event.preventDefault();
            document.documentElement.requestFullscreen();
        }
    });

});
