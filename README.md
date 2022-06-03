# Open Source Videos Capstone Project 

### Capstone Project for Portland State University 2022

Project Link: https://securitycameracapstone.netlify.app \
Camera Controller: https://github.com/Open-Source-Videos/Matrix-surveillance-camera-controller


## Project Overview
This is a method to connect between motion detection security camera system and remote application using Matrix chatroom protocol. 

Security companies do not ensure only the user has access to their security data.

User controls the cameras and the server, complete with end-to-end encryption.

Main components: cameras, camera hub, Matrix homeserver, web application

## Target Audiences

Anyone who wants to secure both their property and data such as Home owners, Business owners.
Bottom line: full control over your data

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


