# youtube2playlist

This script will fetch the latest uploads of a youtube channel and add the songs to a spotify playlist.
To run the script you will have to create a config.json file.

```json
{
  "youtubeChannelId": "<search for 'youtube channel id finder'>",
  "spotifyPlaylistId": "<your spotify playlist id, get this from the browser url after opening the playlist>",
  "spotifyAccesToken": "<your spotify acces token>",
  "addedSongs": []
}
```

The script will update the addedSongs array with the title of the youtube videos which were succesfully added to the playlist. On the next run the script will only add new uploads.
The first run can only add the latest 30 tracks (this is because the underlying library uses web scraping to get the video titles from a channel, and can only see the first page of uploads).
