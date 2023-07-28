import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { RecoilRoot, atom } from 'recoil';
import LogoutPage from './pages/LogoutPage';
import MainPage from './pages/MainPage';
import DetailPage from './pages/DetailPage';
import ChattingPage from './pages/ChattingPage';
import ProfilePage from './pages/ProfilePage';
import ModifyPage from './pages/ModifyPage';
import ChatRoomPage from './pages/ChatRoomPage';
import SignupPage from './pages/SignupPage';
import CreatePostpage from './pages/CreatePostPage';
import InterestsPage from './pages/InterestsPage';
import ModifyPostPage from './pages/ModifyPostPage';
import MyPostsPage from './pages/MyPostsPage';

export const jwtState = atom(
  { key: "jwtState", default: null }
);
export const loginIdState = atom(
  { key: "loginIdState", default: null }
);

const router = createBrowserRouter([
  { path: "/", element: <IndexPage />, },
  { path: "/user/signup", element: <SignupPage /> },
  { path: "/user/login", element: <LoginPage /> },
  { path: "/user/logout", element: <LogoutPage /> },
  { path: "/main", element: <MainPage /> },
  { path: "/post/detail/:postId", element: <DetailPage /> },
  { path: "/post/create", element: <CreatePostpage /> },
  { path: "/chatting", element: <ChattingPage /> },
  { path: "/profile", element: <ProfilePage /> },
  { path: "/profile/modify", element: <ModifyPage /> },
  { path: "/myposts", element: <MyPostsPage />},
  { path: "/chatroom", element: <ChatRoomPage /> },
  { path: "/interests", element: <InterestsPage /> },
  { path: "/post/modify/:postId", element: <ModifyPostPage /> }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RecoilRoot>
    <RouterProvider router={router} />
  </RecoilRoot>
);