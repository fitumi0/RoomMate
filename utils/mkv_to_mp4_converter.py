import ffmpeg

input_file = "..\\static\\movies\\Monsters.University.Rus.2013.bdrip-avc.dexter_lex.mkv"
output_file = "..\\static\\movies\\Monsters.University.Rus.2013.bdrip-avc.dexter_lex.mp4"

(
    ffmpeg
    .input(input_file)
    .output(output_file, vcodec="copy", acodec="aac", strict="experimental", ac=2)
    .overwrite_output()
    .run()
)