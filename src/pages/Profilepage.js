import "./styles.css";
import { Redirect } from 'react-router-dom';
import ProfileView from "../profileView/profile";
import {Navbar} from "../components/Navbar"
import useMatrixClient from '../hooks/useMatrixClient';

const Profile = () => {
  const { isLogin } = useMatrixClient();

  const photo =
    "https://scontent-sea1-1.xx.fbcdn.net/v/t39.30808-6/272188985_4740394449341148_1137162891876592970_n.jpg?_nc_cat=109&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=UtjMQXEeX7cAX9wTGUq&_nc_ht=scontent-sea1-1.xx&oh=00_AT-GwOW26liDh-7ph3qK3hUqLVS6vOZAkm5qUl6gdGr_Eg&oe=625FA44C";
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
    <>
      {isLogin() ? (
        <div className="App">
          <Navbar/>
          <ProfileView/>
        {/* <div style={{ margin: "0 auto", width: "100%" }}>
          <UserProfile
            photo={photo}
            userName={userName}
            location={location}
            initialLikesCount={121}
            initialFollowingCount={723}
            initialFollowersCount={4433}
            initialComments={comments}
          />
        </div> */}
        
      </div>
      ) : (
          <Redirect to="/403" />
      )}
  </>
  );
}

export default Profile;
