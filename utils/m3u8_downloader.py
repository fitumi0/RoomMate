import requests
import ffmpeg

# Определите URL-адрес файла .m3u8, который нужно загрузить
m3u8_url = "https://d0b-000-2600g0.v.plground.live:10402/hs/4/1693268782/L4OyQZmaNeQFKlezzxjc1g/664/74664/4/master.m3u8"

# Используйте requests для получения содержимого файла .m3u8
m3u8_content = requests.get(m3u8_url).text

# Разберите файл .m3u8, чтобы получить URL-адреса видеофрагментов
segment_urls = [line.strip() for line in m3u8_content.split("\n") if line.endswith(".ts")]

# Используйте ffmpeg-python для загрузки и объединения видеофрагментов в один файл
(
    ffmpeg
    .input(m3u8_url)
    .output("../static/movies/output.mp4", c="copy")
    .run()
)