# youtube2playlist

This script will fetch the latest uploads of a youtube channel and add the songs to a spotify playlist.
To run the script you will have to create a config.json file.

```json
{
  "youtubeChannelId": "<search for 'youtube channel id finder'>",
  "spotifyPlaylistId": "<your spotify playlist id, get this from the browser url after opening the playlist>",
  "spotifyAccesToken": "<your spotify acces token>"
}
```

The first run can only add the latest 30 tracks (this is because the underlying library uses web scraping to get the video titles from a channel, and can only see the first page of uploads). Songs already on the playlist wont be added.

Running the script (NodeJS and npm required) <br/>
`npm i` <br/>
`npx tsc` <br/>
`node index.js`
