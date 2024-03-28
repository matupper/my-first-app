// Buttons
const videoElement = document.querySelector('video');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const videoSelectBtn = document.getElementById('videoSelectBtn');
videoSelectBtn.onclick = getVideoSources();

const { desktopCapturer, remote } = require('electron');
const { Menu } = remote;

//get available video sources
async function getVideoSources() {
    const inputSources = await desktopCapturer.getSources({
        types: ['window', 'screen']
    });

    const videoOptionsMenu = Menu.buildFromTemplate(
        inputSources.map(source => {
            return {
                label: source.name,
                click: () => selectSource(source)
            };
        })
    );

    videoOptionsMenu.popup();
}

async function selectSource(source) {

    videoSelectBtn.innerText = source.name

    const constraints = {
        audio: false,
        video: {
            mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: source.id
            }
        }
    };

    // Create a Stream
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    
    // Preview the source in a video element
    videoElement.srcObject = stream;
    videoElement.play();
}
