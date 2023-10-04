/**
 * Видео проигрыватель vidstack:
 * {@link "https://old.vidstack.io/docs/player/components/media/player"}
 */
const video = document.querySelector("media-player");

// const logElem = document.getElementById("log");

// Options for getDisplayMedia()

const displayMediaOptions = {
    video: {
        displaySurface: "window",
    },
    audio: false,
};

// define start and stop actions

async function startCapture() {
    try {
        video.srcObject = await navigator.mediaDevices.getDisplayMedia(
            displayMediaOptions
        );
        //   dumpOptionsInfo();
    } catch (err) {
        console.error(err);
    }
}

function stopCapture() {
    let tracks = video.srcObject.getTracks();

    tracks.forEach((track) => track.stop());
    video.srcObject = null;
}
