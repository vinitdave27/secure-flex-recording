import React, { useEffect, useRef, useState } from 'react';
import Video from 'twilio-video';
import axios from 'axios';

const disconnectedStatuses = ['completed', 'wrapping'];

const VideoComponent = ({ task, manager, channelDefinition, dispatch, icon, iconActive }) => {
	const [activeRoom, setActiveRoom] = useState(null);
	const [taskStatus, setTaskStatus] = useState(null);
	const remoteMediaRef = useRef(null);

	const handleTrackPublication = (trackPublication, participant) => {
		function displayTrack(track) {
			const trackDom = track.attach();
			trackDom.id = participant.identity;
			trackDom.style.maxWidth = '100%';
			remoteMediaRef.current.appendChild(trackDom);
		}
		if (trackPublication.track) displayTrack(trackPublication.track);

		trackPublication.on('subscribed', displayTrack);
	};

	const handleLocalTrackPublication = (trackPublication, participant) => {
		function displayTrack(track) {
			const trackDom = track.attach();
			trackDom.id = participant.identity;
			trackDom.style.maxWidth = '25%';
			trackDom.style.position = 'absolute';
			trackDom.style.bottom = '10px';
			trackDom.style.right = '10px';
			remoteMediaRef.current.appendChild(trackDom);
		}
		if (trackPublication.track) displayTrack(trackPublication.track);

		trackPublication.on('subscribed', displayTrack);
	};

	const handleConnectedParticipant = (participant) => {
		participant.tracks.forEach((trackPublication) => {
			handleTrackPublication(trackPublication, participant);
		});

		participant.on('trackPublished', handleTrackPublication);
	};

	const handleLocalParticipant = (participant) => {
		participant.tracks.forEach((trackPublication) => {
			handleLocalTrackPublication(trackPublication, participant);
		});

		participant.on('trackPublished', handleLocalTrackPublication);
	};
	const onRoomDisconnected = (room) => {
		room.localParticipant.tracks.forEach((publication) => {
			publication.track.detach().forEach((attachedElement) => attachedElement.remove());
		});
	};

	const createComposition = (roomSid) => {
		return axios({
			method: 'POST',
			url: `${process.env.REACT_APP_TWILIO_FUNCTIONS_BASE_URL}/create-video-composition`,
			data: { roomSid },
		});
	};

	const addDataToTask = async (task, roomSid, compositionSid) => {
		const { attributes } = task;

		let newAttributes = { ...attributes };
		if (task.taskChannelUniqueName === 'video') {
			newAttributes.roomSid = roomSid;
		}

		if (compositionSid) {
			const { dateUpdated, sid: reservationSid } = task;
			const conversations = attributes.conversations || {};

			const state = manager.store.getState();
			const flexState = state && state.flex;
			const workerState = flexState && flexState.worker;
			const accountSid = workerState && workerState.source.accountSid;

			const compositionUrl = `${process.env.REACT_APP_AWS_API_GATEWAY_URL}?RecordingSid=${compositionSid}&Type=video`;
			//const compositionUrl = `https://function-secure-video-recording-6772-dev.twil.io/index.html?RecordingSid=${compositionSid}&Type=video`;
			const mediaObj = {
				type: 'Embedded',
				url: compositionUrl,
				title: `VideoRecording`,
			};

			newAttributes.conversations = {
				...conversations,
				media: [mediaObj],
			};

			await task.setAttributes(newAttributes);

			console.log(task.attributes);
		}
	};

	const onRoomJoined = (room) => {
		console.log(`VideoComponent: Joined room '${room.name}' as '${manager.workerClient.name}' successfully`);
		setActiveRoom(room);

		handleLocalParticipant(room.localParticipant);
		room.participants.forEach((participant) => handleConnectedParticipant(participant));
		room.on('participantConnected', handleConnectedParticipant);
		room.on('participantDisconnected', (participant) => {
			participant.removeAllListeners();

			while (remoteMediaRef.current.lastElementChild) {
				remoteMediaRef.current.removeChild(remoteMediaRef.current.lastElementChild);
			}
		});
		room.on('disconnected', onRoomDisconnected);
		window.addEventListener('pagehide', () => room.disconnect());
		window.addEventListener('beforeunload', () => room.disconnect());
		createComposition(room.sid)
			.then((response) => {
				console.log(`VideoComponent: Composition has been enqueued`, response.data);
				addDataToTask(task, room.sid, response.data.compositionSid);
			})
			.catch((error) => {
				console.log(`VideoComponent: Error requesting composition`, error);
			});
	};

	useEffect(() => {
		if (taskStatus !== task.taskStatus) {
			console.log(`VideoComponent: taskStatus is ${task.taskStatus}`);
			setTaskStatus(task.taskStatus);
			if (task.taskStatus === 'assigned') {
				console.log(`VideoComponent: Fetching token...`);
				axios({
					method: 'POST',
					url: `${process.env.REACT_APP_FUNCTIONS_URL}/fetch-video-token`,
					data: { identity: manager.workerClient.name, roomName: task.attributes.videoChatRoom },
				}).then(({ data }) => {
					if (!data.accessToken)
						return console.log('!!!ERROR!!!, there was an error with the video-token response.');
					console.log(`VideoComponent: Fetched token successfully`, data);
					console.log(`VideoComponent: Joining the video room '${task.attributes.videoChatRoom}'...`);
					Video.connect(data.accessToken, { name: task.attributes.videoChatRoom }).then(
						onRoomJoined,
						(error) => {
							alert('Could not connect to Twilio: ' + error.message);
						}
					);
				});
			}
			if (disconnectedStatuses.includes(taskStatus)) {
				disconnect();
			}
		}
		return () => {
			if (disconnectedStatuses.includes(taskStatus)) {
				disconnect();
			}
		};
	}, [task.taskStatus]);

	const disconnect = () => {
		if (!activeRoom) return console.log('VideoComponent: No Active Room Connected!');

		activeRoom.participants.forEach((participant) =>
			participant.tracks.forEach((track) =>
				track.track.detach().forEach((attachedElement) => attachedElement.remove())
			)
		);

		activeRoom.disconnect();
		setActiveRoom(null);
	};

	return (
		<div style={{ textAlign: 'center', width: '100%', margin: '0.5em' }}>
			<div ref={remoteMediaRef} id='remoteMedia' style={{ position: 'relative' }}></div>
			<button onClick={disconnect}>Disconnect</button>
		</div>
	);
};

export default VideoComponent;
