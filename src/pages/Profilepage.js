import "./styles.css";
import UserProfile from "react-user-profile";
import {Navbar} from "../components/Navbar"

export default function Profile() {
  const photo =
    "https://api-cdn.spott.tv/rest/v004/image/images/e91f9cad-a70c-4f75-9db4-6508c37cd3c0?width=587&height=599";
  const userName = "Minh Nguyen";
  const location = "Portland, OR";

  const comments = [
    {
      id: "1",
      photo:
        "https://api-cdn.spott.tv/rest/v004/image/images/e91f9cad-a70c-4f75-9db4-6508c37cd3c0?width=587&height=599",
      userName: "Phuoc Nguyen",
      content:
        "Lorem ipsum dolor sit amet enim. Etiam ullamcorper. Suspendisse a pellentesque dui, non felis. Maecenas malesuada elit lectus felis, malesuada ultricies. Curabitur et ligula. ",
      createdAt: 1543858000000
    },
    {
        id: "1",
        photo:
          "https://api-cdn.spott.tv/rest/v004/image/images/e91f9cad-a70c-4f75-9db4-6508c37cd3c0?width=587&height=599",
        userName: "Tuan Dinh",
        content:
          "Lorem ipsum dolor sit amet enim. Etiam ullamcorper. Suspendisse a pellentesque dui, non felis. Maecenas malesuada elit lectus felis, malesuada ultricies. Curabitur et ligula. ",
        createdAt: 1543858000000
      },
      {
        id: "1",
        photo:
          "https://api-cdn.spott.tv/rest/v004/image/images/e91f9cad-a70c-4f75-9db4-6508c37cd3c0?width=587&height=599",
        userName: "Tri Le",
        content:
          "Lorem ipsum dolor sit amet enim. Etiam ullamcorper. Suspendisse a pellentesque dui, non felis. Maecenas malesuada elit lectus felis, malesuada ultricies. Curabitur et ligula. ",
        createdAt: 1543858000000
      }
  ];

  return (
    <div className="App">
        <Navbar/>
      <div style={{ margin: "0 auto", width: "100%" }}>
        <UserProfile
          photo={photo}
          userName={userName}
          location={location}
          initialLikesCount={121}
          initialFollowingCount={723}
          initialFollowersCount={4433}
          initialComments={comments}
        />
      </div>
    </div>
  );
}
