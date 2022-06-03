# Open Source Video Security Camera

###  Portland State University Capstone Project 2022

Project Link: https://securitycameracapstone.netlify.app \
Camera Controller: https://github.com/Open-Source-Videos/Matrix-surveillance-camera-controller

## Project Overview
We are creating a way to connect a motion-based security camera system to a remote application of our creation using the Matrix chatroom protocol. The reason why consumer security solutions do not always guarantee who has access to your data is that they do not always provide complete security. Consumer security camera systems often store images and videos on the servers of the company providing the system, sending video through their servers. You have no control over their security practices. With our solution, you can host the server yourself, and have end-to-end encryption giving you complete control over your data.

Our system has two main parts: the camera hub software, and the phone client. The camera hub uses MotionEye, an open-source solution to manage security cameras, and their recordings on a Linux-based system. The second part of the app let users be notified when there are motion detection events, and provide images and videos to their phone from the security cameras. The communication between the two takes place using a Matrix chatroom protocol. Users can choose to host the Matrix server themselves, or use any hosting services as they please.

## Functionality
### Camera Hub
#### Features
- Use MotionEye as camera manager.
- Take snapshots, and record video.
- Upload recorded images and videos to the Matrix server.
- Accept commands that appear on the Matrix server.
- Accept commands to get a current screenshot.
- Run as a service/daemon on a Linux computer.
- Detect camera configuration and send notifications to Matrix server.
- Has an install script to make setup easier, along with manual instructions.
- Save configurations, so the hub will start back up upon an unexpected reboot.

#### Dependencies
- MotionEye
- Matrix NIO
- Cameras, Network, or Local.

### Front End
#### Features

- The authentication pages allow users to log in and log out.
- The layout to create or delete the Matrix Room.
- Showing the thumbnail as receiving the motion detect notifications from the camera.
- Requesting and showing the recording videos.
- Adding and removing other users to the Matrix room.
- Creating and deleting rooms.
- Changing avatar.
- Banning or Unbanning users in a room.

#### Dependencies
- Node JS.
- Matrix-react SDK.
- Matrix-JS SDK.
- React JS.

## Getting Started

### Run the app in the development mode

```bash
npm install
npm start
```


