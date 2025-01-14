// This class is used to translate the speech from the microphone to the desired language.
class Translator {
    _translationRecognizer
    _hasAlreadyStarted = false
    _phrases = []
    start(options) {
        console.log("Started")
        this._hasAlreadyStarted = true

        const speechConfig = SpeechSDK.SpeechTranslationConfig.fromSubscription(options.key, options.region);
        speechConfig.speechRecognitionLanguage = options.fromLanguage;
        speechConfig.setProfanity(SpeechSDK.ProfanityOption.Raw);
        speechConfig.setProperty(SpeechSDK.PropertyId.SpeechServiceConnection_EndSilenceTimeoutMs, "2500")
        speechConfig.addTargetLanguage(options.toLanguage);
        const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
        this._translationRecognizer = new SpeechSDK.TranslationRecognizer(speechConfig, audioConfig);
        const phraseList = SpeechSDK.PhraseListGrammar.fromRecognizer(this._translationRecognizer);
        // read the phrases from the file phrases.txt and add them to the phraseList
        fetch("/scripts/phrases.txt")
            .then(response => response.text())
            .then(text => {
                this._phrases = text.split("\n");
                this._phrases = this._phrases.filter(phrase => phrase !== "");
                this._phrases.forEach(phrase => {
                    if (phrase === "") return;
                    phraseList.addPhrase(phrase);
                });
            })
            .catch(err => console.error(err));

        this._translationRecognizer.startContinuousRecognitionAsync();

        this._translationRecognizer.recognizing = this._translationRecognizer.recognized = recognizerCallback.bind(this)
        
        function recognizerCallback(s, e) {
            if (e.result.text) {
                console.log(e.result.text)
                options.captions.innerHTML = e.result.translations.get(options.toLanguage);
                scrollToBottom(options.captions);
            } else {
                options.captions.innerHTML = "";
            }
        }
        
       
    }

    stop() {
        console.log("Ended")
        this._hasAlreadyStarted = false
        this._translationRecognizer.stopContinuousRecognitionAsync(
            stopRecognizer.bind(this),
            function (err) {
                stopRecognizer().bind(this)
                console.error(err)
            }.bind(this)
        )

        function stopRecognizer() {
            this._hasAlreadyStarted = false
            this._translationRecognizer.close()
            this._translationRecognizer = undefined
        }
    }
}

function scrollToBottom(element) {
    element.scrollTop = element.scrollHeight;
}
document.addEventListener("DOMContentLoaded", function () {
    // HTML elements
    var captionsDiv;
    var subscriptionKeyElement;
    var rangeSlider;
    var colorSlider;
    var recordingButton;
    var languageBar;
    var translator = new Translator();
    var checkBox;
    var passwordBox;
    var resetButton;

    // subscription key and region for speech services.
    var subscriptionKey;
    var serviceRegion;

    subscriptionKeyElement = document.getElementById("key");
    regionElement = document.getElementById("region");
    checkBox = document.getElementById("show");
    passwordBox = document.getElementsByClassName("password_box")[0];
    resetButton = document.getElementsByClassName("reset_box")[0];

    checkBox.onclick = function () {
        if (checkBox.checked) {
            subscriptionKeyElement.type = "text";
        } else {
            subscriptionKeyElement.type = "password";
        }
    }

    resetButton.onclick = function () {
        captionsDiv.style.color = "#ffffff";
        captionsDiv.style.fontSize = "100px";
        fontSizeSlider.value = fontSizeSlider.defaultValue;
        colorFontSlider.value = colorFontSlider.defaultValue;

    }
    serviceRegion = regionElement.value;
    subscriptionKeyElement.addEventListener("change", (event) => {
        subscriptionKey = event.target.value;
    })

    // To add in case of another language
    const sourceLanguageBar = document.getElementById("from-language");
    const targetLanguageBar = document.getElementById("to-language");
    var sourceLanguage = sourceLanguageBar.value;//"fr-FR";
    var targetLanguage = targetLanguageBar.value;

    // Update the language from which we translate and
    // In case we already started a real-time translation session, we switch to another langage (Purpose of demonstration)
    targetLanguageBar.addEventListener("change", (event) => {
        targetLanguage = event.target.value;
        if (translator._hasAlreadyStarted){
            console.log("Changed")
            translator.stop()
            translator.start({
                key: subscriptionKey,
                region: serviceRegion,
                fromLanguage: sourceLanguage,
                toLanguage: event.target.value,
                captions: captionsDiv
            });
        }

    } )



    recordingButton= document.getElementsByClassName("rec-button")[0];
    rangeSlider = document.getElementById("range-slider");
    colorSlider = document.getElementById("color-slider");
    captionsDiv = document.getElementById("captions-container");
    languageBar = document.getElementsByClassName("language-bar")[0];

    // Start/Stop the translation when pressing CTRL + R
    document.addEventListener("keydown", (event) => {
        if (event.ctrlKey && event.key === 'r'){
            event.preventDefault();
            if (!subscriptionKey) {
                alert("Enter subscription key.");
                return;
            } else {
                if (!translator._hasAlreadyStarted) {
                    subscriptionKeyElement.value = "";
                    captionsDiv.innerHTML = "";
                    //languageBar.style.visibility = "hidden";
                    resetButton.style.visibility = "hidden";
                    passwordBox.style.visibility = "hidden";
                    subscriptionKeyElement.style.visibility = "hidden";
                    rangeSlider.style.visibility = "hidden";
                    colorSlider.style.visibility = "hidden";
                    recordingButton.classList.toggle("blink")
                    // Update the language from which we translate
                    translator.start({
                        key: subscriptionKey,
                        region: serviceRegion,
                        fromLanguage: sourceLanguage,
                        toLanguage: targetLanguage,
                        captions: captionsDiv
                    });
                } else {
                    translator.stop();
                    captionsDiv.innerHTML = "Real-time translator";
                    recordingButton.classList.toggle("blink")
                    //languageBar.style.visibility  = "visible";
                    resetButton.style.visibility = "visible";
                    passwordBox.style.visibility = "visible";
                    rangeSlider.style.visibility  = "visible";
                    colorSlider.style.visibility  = "visible";
                    subscriptionKeyElement.style.visibility  = "visible";
                    
                }
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

    // Adapt the font size with the slider value
    const fontSizeSlider = document.getElementById("captions-font-size");
    fontSizeSlider.addEventListener("change", (event) => {
        captionsDiv.style.fontSize = event.target.value + "px";
    });

    // Adapt the color font with the slider value
    // The color is in hexadecimal
    const colorFontSlider = document.getElementById("color-font");
    colorFontSlider.addEventListener("change", (event) => {
        captionsDiv.style.color = `hsl(${event.target.value}, 100%, 50%)` ;
    });
});
