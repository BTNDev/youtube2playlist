// @ts-ignore no types publicly available
import ytch from 'yt-channel-info'
import { readFile } from 'fs';
import SpotifyWebApi from 'spotify-web-api-node';
import { writeFile } from 'fs/promises';

interface ytchResponse {
	channelIdType: number;
	continuation: string;
	items: ytchVideo[];
	alertMessage: string | undefined;
}

interface ytchVideo {
	type: string;
	title: string;
	videoId: string;
	author: string;
	authorId: string;
	videoThumbnails: VideoThumbnail[];
	viewCountText: string;
	viewCount: number;
	publishedText: string;
	durationText: string;
	lengthSeconds: number;
	liveNow: boolean;
	premiere: boolean;
	premium: boolean;
}

interface VideoThumbnail {
	url: string;
	width: number;
	height: number;
}

interface Config {
	youtubeChannelId: string;
	spotifyPlaylistId: string;
	spotifyAccesToken: string;
	addedSongs: string[];
}

const spotifyApi = new SpotifyWebApi();

async function main() {
	const config: Config = await new Promise((resolve, reject) => {
		readFile('./config.json', (err, data) => {
			if (err) {
				return reject(err);
			}
			return resolve(JSON.parse(data.toString()));
		});
	});

	const payload = {
		channelId: config.youtubeChannelId, // Required
		sortBy: 'newest',
		channelIdType: 0
	}

	spotifyApi.setAccessToken(config.spotifyAccesToken);

	// // uncomment to delete playlist
	// const tracks = await spotifyApi.getPlaylistTracks(config.spotifyPlaylistId);
	// for (let i = 0; i < tracks.body.items.length; i++) {
	// 	const item = tracks.body.items[i];
	// 	await spotifyApi.removeTracksFromPlaylist(config.spotifyPlaylistId, [item.track]);

	// }
	// return;

	const response: ytchResponse = await ytch.getChannelVideos(payload);

	if (response.alertMessage) {
		console.error(`Channel could not be found. ${response.alertMessage}`);
		return;
	}

	const newSongs: string[] = [];
	const newSongUris: string[] = [];

	for (let i = 0; i < response.items.length; i++) {
		const video = response.items[i];
		console.log(video.title);

		if (config.addedSongs.includes(video.title)) {
			console.log('Reached an upload that was already uploaded, skipping the rest');
			break;
		}

		let title = video.title;
		const bracketLocation = title.indexOf('(');

		if (bracketLocation > 0) {
			title = video.title.slice(0, bracketLocation).trimEnd();
		}

		title = title.replace(' -', '');
		newSongs.push(video.title);
		// const [artist, song] = title.split('-').map(str => str.trim());

		// get song from spotify
		const searchResults = await spotifyApi.searchTracks(title);
		if (searchResults.statusCode !== 200) {
			console.error(`Spotify search statuscode: ${searchResults.statusCode}`);
			return;
		}
		const track = searchResults.body.tracks?.items[0];

		if (track === undefined) {
			console.error(`No results on spotify for ${title}`);
			continue;
		}
		newSongUris.push(track.uri);
	}

	if (newSongUris.length === 0) {
		console.log('No new uploads')
		return;
	}
	// add to playlist
	await spotifyApi.addTracksToPlaylist(config.spotifyPlaylistId, newSongUris, { position: 0 });
	config.addedSongs.unshift(...newSongs);

	await writeFile('./config.json', JSON.stringify(config, undefined, 2));
}

main().catch(console.error);
