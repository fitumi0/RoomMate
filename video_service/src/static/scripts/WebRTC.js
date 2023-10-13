/**
 * Web Rtc connection for synchronized watch videos.
 */
// video chat

// const peers = {};

// // peer connection
// const pc = new RTCPeerConnection({
//     iceServers: [
//         {
//             urls: "stun:stun.l.google.com:19302",
//         },
//     ],
// });

// // set peer connection to the room
// pc.ontrack = (event) => {
//     peers[event.track.id] = event.track;
//     console.log("Peer connection is set");
// };

// file share
const filePick = document.getElementById("file-share-button");
filePick.addEventListener("change", handleFileInput);

function handleFileInput(event) {
    const file = event.target.files[0];
    if (file) {
        console.log(file);
    }
}
