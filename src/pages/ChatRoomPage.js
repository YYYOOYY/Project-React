import { useRecoilState } from "recoil";
import { jwtState, loginIdState } from "..";
import { REST_SERVER_ADDRESS } from "../common/constant";
import { useEffect, useState } from "react";
import NavBar from "../component/NavBar";
import defaultImg from "../component/image/defaultImg.png"

function ChatRoomPage() {

    const [jwt, setJwt] = useRecoilState(jwtState);
    const [loginId, setLoginId] = useRecoilState(loginIdState);
    const [roomList, setRoomList] = useState();

    const findAllChatRoomHandle = () => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", REST_SERVER_ADDRESS + "/chat/findAllChatRoom", false);
        xhr.setRequestHeader("Authorization", jwt);
        xhr.send();

        if (xhr.status === 200) {
            const body = JSON.parse(xhr.responseText);
            setRoomList(body);
        }
    }

    useEffect(() => {
        findAllChatRoomHandle();
    }, [jwt])

    const ChatLink = (chatRoomId) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", REST_SERVER_ADDRESS + "/chat/openChatRoom/"+chatRoomId, false);
        xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("Authorization", jwt);
        xhr.send();
        if (xhr.status === 200) {
            const body = JSON.parse(xhr.responseText);
            sessionStorage.setItem('chatData', JSON.stringify(body));
            const chatWindow = window.open('/chatting', 'Chatting', 'width=500, height=700');

            if (chatWindow) {
                chatWindow.addEventListener('resize', () => {
                    chatWindow.resizeTo(500, 700);
                });
                chatWindow.focus();
            }
            window.location.reload();
        }
    }

    return (<>
        <NavBar />
        <div className="pt-5 mt-5">
            <h1 style={{ textAlign: "center" }}>채팅</h1>
            {roomList && roomList.length <= 0 && 
                <div style={{textAlign: "center", paddingTop: 50, fontSize: 18}}>
                    채팅방이 없습니다.
                </div>
            }
            {roomList && roomList.map((one) => (
                one.chattings.length > 0 &&
                <div key={one.id} className="chat-item" style={{ width: "500px", margin: "auto" }} onClick={() => ChatLink(one.id)}>
                    <div className="chat-item-avatar">
                        {one.buyer.loginId === loginId ?
                            <img className="chat-item-avatar" src={one.seller.profileImage !== null ? one.seller.profileImage : defaultImg} alt="..." />
                            :
                            <img className="chat-item-avatar" src={one.buyer.profileImage !== null ? one.buyer.profileImage : defaultImg} alt="..." />
                        }
                    </div>
                    <div className="chat-item-info">
                        <h3>{one.buyer.loginId === loginId ? 
                        (one.seller.nickname === "관리자" ? "탈퇴한 유저" : one.seller.nickname) 
                        : one.buyer.nickname === "관리자" ? "탈퇴한 유저" : one.buyer.nickname}</h3>
                        <div style={{ fontSize: 12, fontWeight: "bold" }}>{one.chattings.length > 0 &&
                            one.chattings[one.chattings.length - 1].message.length > 20 ?
                            one.chattings.length > 0 &&
                            `${one.chattings[one.chattings.length - 1].message.slice(0, 20)}...`
                            :
                            one.chattings.length > 0 &&
                            one.chattings[one.chattings.length - 1].message}
                        </div>
                    </div>
                    {one.unreadCnt > 0 && (
                        <div className="chat-item-unread">{one.unreadCnt}</div>
                    )}
                </div>
            ))}
        </div>
    </>);
}

export default ChatRoomPage;