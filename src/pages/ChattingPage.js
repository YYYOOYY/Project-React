import { useRecoilState } from "recoil";
import { jwtState, loginIdState } from "..";
import React, { useEffect, useRef, useState } from "react";
import { REST_SERVER_ADDRESS } from "../common/constant";
import NavBar from "../component/NavBar";
import defaultImg from "../component/image/defaultImg.png";
import noImage from "../component/image/noImage.png";

const getWrittenTime = (writed) => {
    const writedDate = new Date(writed);
    const year = writedDate.getFullYear();
    const month = writedDate.getMonth() + 1;
    const day = writedDate.getDate();
    const hours = writedDate.getHours();
    const minutes = writedDate.getMinutes();

    let period = '오전';
    let hour = hours;

    if (hours >= 12) {
        period = '오후';
        hour = hours === 12 ? 12 : hours - 12;
    }

    const formattedDate = `${year}-${month}-${day}`;
    const formattedTime = `${period} ${hour}:${minutes < 10 ? '0' : ''}${minutes}`;

    return `${formattedDate} ${formattedTime}`;
};

function ChattingPage() {
    const [jwt, setJwt] = useRecoilState(jwtState);
    const [loginId, setLoginId] = useRecoilState(loginIdState);

    const [data, setData] = useState();
    const messageRef = useRef();


    useEffect(() => {
        const result = JSON.parse(sessionStorage.getItem('chatData'));
        if (result !== undefined || result !== null) {
            setData(result)
            setTimeout(scrollToBottom, 300);
        }
    }, []);

    useEffect(() => {
        
        const intervalId = setInterval(updateChat, 3000);

        return () => {
            clearInterval(intervalId);
        };
    }, [data]);


    const scrollToBottom = () => {
        const targetElement = document.getElementById('bottomElement');
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
    };

    // 글쓰기 이벤트 처리
    const writeChat = (roomId) => {
        const xhr = new XMLHttpRequest();
        let message = "";

        if (messageRef.current) {
            message = messageRef.current.value.trim();
            message = message.replace(/\n/g, "<br>").replace(/\s+/g, " ");
        }
        xhr.open("POST", REST_SERVER_ADDRESS + "/chat/write", false);
        xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("Authorization", jwt);
        xhr.send("message=" + message + "&chatRoomId=" + roomId);

        if (xhr.status === 200) {
            messageRef.current.value = "";
            document.querySelector("#chatInput").style.height = "10px";
        }
        updateChat();
        setTimeout(scrollToBottom, 300);
    };

    const textarea = document.querySelector("#chatInput");
    const button = document.querySelector("#button-addon2");
    if (textarea) {
        textarea.addEventListener("keydown", (e) => {
            if (e.keyCode === 13 && !e.shiftKey) {
                if (messageRef.current.value.trim() !== "") {
                    e.preventDefault();
                    button.click();
                }
            }
        });
    }

    const formatMessage = (message) => {
        return message.split('<br>').map((line, index) => (
            <React.Fragment key={index}>
                {line}
                <br />
            </React.Fragment>
        ));
    };

    const updateChat = () => {
        if (data && data.id) {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", REST_SERVER_ADDRESS + "/chat/update/" + data.id, false);
            xhr.setRequestHeader("Authorization", jwt);
            xhr.send();
            if (xhr.status === 200) {
                const body = JSON.parse(xhr.responseText);
                setData(body);
            }
        }
    }

    const handleChangeChatRoom = (postId) => {
        sessionStorage.setItem('chatData', JSON.stringify(data));
    
        window.opener.location.href = `/post/detail/${postId}`;
      };

    return (<>
        <div style={{ display: "none" }}>
            <NavBar />
        </div>
        {data && <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
                <div style={{ fontWeight: "bold", paddingLeft: 20, cursor: "pointer" }} onClick={() => handleChangeChatRoom(data.post.id)}>
                    {!data.post.status ?
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <img src={data.post.photos.length > 0 ? data.post.photos[0].imageUrl : noImage} alt="..." style={{ width: 50, borderRadius: '7px' }} />
                            <span style={{ fontSize: 23, paddingLeft: 10 }}>
                                {data.post.title.length > 17 ? `${data.post.title.slice(0, 17)}...` : data.post.title}
                            </span>
                            <div style={{ fontSize: 13, paddingLeft: 10 }}>{!data.post.status && '(판매중)'}</div>
                        </div>
                        :
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <span style={{ opacity: "0.5" }}><img src={data.post.photos.length > 0 ? data.post.photos[0].imageUrl : noImage} alt="..." style={{ width: 50, borderRadius: '7px' }} /></span>
                            <span style={{ fontSize: 25, color: "darkgray" }}>
                                {data.post.title.length > 17 ? `${data.post.title.slice(0, 17)}...` : data.post.title}
                            </span>
                            <div style={{ color: 'gray', fontSize: 13, paddingLeft: 10 }}>{data.post.status && '(판매완료)'}</div>
                        </div>
                    }
                </div>

            </div>
            <div style={{ paddingRight: 20, textAlign: "right", fontSize: 13, paddingTop: 10 }}>판매자 : {data.post.writer.nickname === "관리자" ? "탈퇴한 유저" : data.post.writer.nickname}
                <span style={{ fontSize: 12 }}>(@{data.post.writer.loginId === "admin0" ? "" : data.post.writer.loginId})</span></div>
            <hr />
            <div id="chatting">
                {data.chattings && (<div style={{ paddingTop: 10, marginBottom: 70 }}>
                    {data.chattings.map((e) => (
                        <div key={e.id} style={{ padding: 5 }}>{e.chatWriter.loginId === loginId ?
                            <div id="messageBox" style={{ textAlign: "right", paddingLeft: 20, paddingRight: 20 }}>
                                <div className="alert alert-secondary" role="alert">
                                    <div style={{ fontSize: 13 }}>
                                        <span style={{ fontSize: 10, color: "gray" }}>{getWrittenTime(e.writed)} </span>
                                    </div>
                                    <div style={{ paddingRight: 10 }}>
                                        <span style={{ fontWeight: "bold" }}>{formatMessage(e.message)}</span>
                                    </div>
                                </div>
                            </div>
                            :
                            <div style={{ textAlign: "left", paddingLeft: 20, paddingRight: 20 }}>
                                <div className="alert alert-primary" role="alert">
                                    <div style={{ fontSize: 13 }}>
                                        <img src={e.chatWriter.profileImage !== null ? e.chatWriter.profileImage : defaultImg} alt="..." style={{ width: 25, borderRadius: "30px" }} />
                                        <span style={{ paddingLeft: 5 }}>{e.chatWriter.nickname === "관리자" ? "탈퇴한 유저" : e.chatWriter.nickname}</span>
                                        <span style={{ fontSize: 10, color: "gray" }}> {getWrittenTime(e.writed)}</span>
                                    </div>
                                    <div style={{ paddingLeft: 10 }}>
                                        <span style={{ fontWeight: "bold" }}>{formatMessage(e.message)}</span>
                                    </div>
                                </div>
                            </div>
                        }
                        </div>
                    ))}
                </div>)}
            </div>
            <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, paddingLeft: 10 }}>
                <div className="input-group mb-3">
                    <textarea
                        ref={messageRef}
                        id="chatInput"
                        className="form-control"
                        placeholder={!data.post.status ? '상대방과 대화해 거래를 진행하세요' : '거래가 끝난 게시물입니다'}
                        aria-label="Recipient's username"
                        aria-describedby="button-addon2"
                        style={{ resize: "none", height: 10 }}
                        onInput={(e) => {
                            e.target.style.height = "auto";
                            e.target.style.height = e.target.scrollHeight + "px";
                        }}
                        disabled={data.post.status}
                    ></textarea>
                    <button
                        className="btn btn-outline-secondary btn-cm"
                        type="button"
                        id="button-addon2"
                        onClick={() => writeChat(data.id)}
                    >
                        보내기
                    </button>
                </div>
            </div>
            <div id="bottomElement">
            </div>
        </div>
        }
    </>);
}

export default ChattingPage;