const filePick = document.getElementById("file-share-button");
filePick.accept = "video/mp4, video/quicktime";
filePick.addEventListener("change", handleFileInput);

function handleFileInput(event) {
    const file = event.target.files[0];
    if (file) {
        console.log(file);
        const player = document.querySelector("media-player");
        player.src = URL.createObjectURL(file);
        player.startLoading();
    }
}
