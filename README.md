# Open Source Video Security Camera

###  Portland State University Capstone Project 2022

Project Link: https://securitycameracapstone.netlify.app 

## Demo Link:

Youtube: https://www.youtube.com/watch?v=v_Zcuo2PaQs

## Table of content:

- [Project Overview](#project-overview)
- [Screenshots](#screenshot)
- [Functionality](#functionality)
- [Technologies](#technologies)
- [Setup](#setup)
- [Status](#status)
- [Credits](#credits)
- [License](#license)

## Screenshot

![1](https://user-images.githubusercontent.com/20541596/171967227-24df30fc-bba2-41f8-b977-ebc6584b72f6.PNG)

## Project Overview
We are creating a way to connect a motion-based security camera system to a remote application of our creation using the Matrix chatroom protocol. The reason why consumer security solutions do not always guarantee who has access to your data is that they do not always provide complete security. Consumer security camera systems often store images and videos on the servers of the company providing the system, sending video through their servers. You have no control over their security practices. With our solution, you can host the server yourself, and have end-to-end encryption giving you complete control over your data.

Our system has two main parts: the camera hub software, and the phone client. The camera hub uses MotionEye, an open-source solution to manage security cameras, and their recordings on a Linux-based system. The second part of the app let users be notified when there are motion detection events, and provide images and videos to their phone from the security cameras. The communication between the two takes place using a Matrix chatroom protocol. Users can choose to host the Matrix server themselves, or use any hosting services as they please.

## Functionality
### Camera Hub:
- Use MotionEye as camera manager.
- Take snapshots, and record video.
- Upload recorded images and videos to the Matrix server.
- Accept commands that appear on the Matrix server.
- Accept commands to get a current screenshot.
- Run as a service/daemon on a Linux computer.
- Detect camera configuration and send notifications to Matrix server.
- Has an install script to make setup easier, along with manual instructions.
- Save configurations, so the hub will start back up upon an unexpected reboot.

### Front End
#### Features:
- The authentication pages allow users to log in and log out.
- The layout to create or delete the Matrix Room.
- Showing the thumbnail as receiving the motion detect notifications from the camera.
- Requesting and showing the recording videos.
- Adding and removing other users to the Matrix room.
- Creating and deleting rooms.
- Changing avatar.
- Banning or Unbanning users in a room.

## Technologies

`HTLM`,`CSS`,`bootstrap`,`React`,`tailwindCSS`,`NodeJS`,`Matrix SDK`,`Marix-react SDK`

`MotionEye`, `Matrix NIO`, `Raspberry Pi`

## Setup

### Instruction on how to setup Camera Controller can be found here:

https://github.com/Open-Source-Videos/Matrix-surveillance-camera-controller

### Run the app in the development mode

Download or clone the repository.

Open your terminal, Then run:

```bash
npm install
npm start
```
or
```bash
yarn
yarn start
```

## Status

- Version 1.0

## Credits
List of contributors:
- [Tri Le](a@pdx.edu)
- [Phuoc Nguyen](a@pdx.edu)
- [Thiep Tran](a@pdx.edu)
- [Minh Nguyen](a@pdx.edu)
- [Tuan Dinh](a@pdx.edu)
- [Michael Fulton](a@pdx.edu)
- [Henry Nguyen](a@pdx.edu)

## License
Golden Tiger Capstone Team 2022, Portland State University 2022

Licensed under the [MIT License](LICENSE)
