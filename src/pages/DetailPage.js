import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { REST_SERVER_ADDRESS } from "../common/constant";
import React, { useEffect, useState } from "react";
import NavBar from "../component/NavBar";
import defaultImg from "../component/image/defaultImg.png";
import { jwtState, loginIdState } from "..";
import { useRecoilState } from "recoil";
import noImage from "../component/image/noImage.png";

function DetailPage() {

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const { postId } = useParams();
    const [post, setPost] = useState();
    const [date, setDate] = useState();
    const [jwt, setJwt] = useRecoilState(jwtState);
    const [loginId, setLoginId] = useRecoilState(loginIdState);
    const [interested, setInterested] = useState();
    const navigate = useNavigate();

    const postDate = new Date(date);
    const today = new Date();
    const timeDiff = today - postDate;


    const findPostHandle = () => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", REST_SERVER_ADDRESS + "/post/detail/" + postId, false);
        if (jwt !== null)
            xhr.setRequestHeader("Authorization", jwt);
        xhr.send();
        if (xhr.status === 200) {
            const body = JSON.parse(xhr.responseText);
            setPost(body.post);
            setDate(body.post.writed)
            if (jwt !== null) {
                setInterested(body.interested);
            }
        }
    }

    const existInterested = () => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", REST_SERVER_ADDRESS + "/post/interested/exist?postId=" + postId + "&token=" + jwt, false)
        xhr.send();
        if (xhr.status === 200) {
            const body = JSON.parse(xhr.responseText);
            setInterested(body);
        }
    }

    useEffect(() => {
        findPostHandle();

    }, [jwt]);

    const interestHandle = () => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", REST_SERVER_ADDRESS + "/post/interested", false);
        xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
        xhr.send("postId=" + postId + "&token=" + jwt);
        if (xhr.status === 200) {
            existInterested();
            importInterestedCountHandle();
        }
    }

    const importInterestedCountHandle = () => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", REST_SERVER_ADDRESS + "/post/interested/import?postId=" + postId, false)
        xhr.send();
        if (xhr.status === 200) {
            const body = JSON.parse(xhr.responseText);
            document.querySelector("#interested").innerHTML = "관심 " + body;
        }
    }

    let timeAgo;
    if (timeDiff < 0) {
        timeAgo = "Invalid date"; // 날짜가 유효하지 않은 경우
    } else if (timeDiff < 1000 * 60) {
        timeAgo = "방금";
    } else if (timeDiff < 1000 * 60 * 60) {
        const minutesDiff = Math.floor(timeDiff / (1000 * 60));
        timeAgo = minutesDiff + "분 전";
    } else if (timeDiff < 1000 * 60 * 60 * 24) {
        const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
        timeAgo = hoursDiff + "시간 전";
    } else {
        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        timeAgo = daysDiff + "일 전";
    }

    const chatLink = () => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", REST_SERVER_ADDRESS + "/chat/create", false);
        xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("Authorization", jwt);
        xhr.send("postId=" + postId);
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
        }
    }

    const updateStatus = () => {
        if (window.confirm("거래를 완료하셨습니까?                                                                         (거래를 마치신 후 상태를 변경해주시길 바랍니다)                                   ※거래완료 처리시 게시글 삭제가 불가능합니다.")) {
            const xhr = new XMLHttpRequest();
            xhr.open("PATCH", REST_SERVER_ADDRESS + "/post/status", false);
            xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
            xhr.setRequestHeader("Authorization", jwt);
            xhr.send("postId=" + postId);

            if (xhr.status === 200) {
                window.location.reload();
            }
        }
    }

    const formatContent = (content) => {
        return content.split('<br>').map((line, index) => (
            <React.Fragment key={index}>
                {line}
                <br />
            </React.Fragment>
        ));
    };

    const deleteByPostHandle = () => {

        if (window.confirm("게시글을 삭제하시겠습니까?")) {

            const xhr = new XMLHttpRequest();
            xhr.open("delete", REST_SERVER_ADDRESS + "/post/delete", false);
            xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
            xhr.setRequestHeader("Authorization", jwt);
            xhr.send("postId=" + postId);

            if (xhr.status === 200) {
                window.alert("게시글이 삭제되었습니다.");
                navigate("/main");
            } else if (xhr.status === 403) {
                window.alert("판매완료된 상품은 삭제가 불가능합니다.                                                삭제하시려면 관리자에게 문의해주세요.");
            }
        }
    }

    return (<>
        <NavBar />
        {post && <div className="pt-5 mt-5" style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 100 }}>
            <div id="carouselExampleDark" className="carousel carousel-dark slide" data-bs-ride="carousel"
                style={{ width: "30%", margin: "0 auto" }}>
                <div className="carousel-indicators">
                    {post.photos.length > 0 &&
                        post.photos.slice(0, 5).map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                data-bs-target="#carouselExampleDark"
                                data-bs-slide-to={index}
                                className={index === 0 ? 'active' : ''}
                                aria-label={`Slide ${index + 1}`}
                            ></button>
                        ))}
                </div>
                <div className="carousel-inner">
                    {post.photos.length > 0 ?
                        post.photos.map((photo, index) => (
                            <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                <img src={photo.imageUrl} className="d-block w-100" alt="..." style={{ borderRadius: "15px", height: 440 }} />
                            </div>
                        ))
                        :
                        <img src={noImage} className="d-block w-100" alt="..." style={{ borderRadius: "15px" }} />
                    }
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
            <div style={{ paddingTop: 7 }}>
                <span style={{ fontSize: 13, fontWeight: "bold" }}>{post.status === true ? "판매완료" : "판매중"}</span>
            </div>
            <div style={{ width: "55%", marginTop: "1rem", textAlign: "left" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <img src={post.writer.profileImage !== null ? post.writer.profileImage : defaultImg} alt="..." style={{ width: 40, borderRadius: "30px" }} />
                    <div style={{ marginLeft: "0.5rem", flexGrow: 1 }}>
                        <div>{post.writer.nickname === "관리자" ? "탈퇴한 유저" : post.writer.nickname}</div>
                        <div style={{ color: "gray", fontSize: 12 }}>{post.city}</div>
                    </div>
                    {jwt && post.writer.loginId !== loginId &&
                        <div onClick={interestHandle} style={{ cursor: "pointer" }}>
                            {interested === true ?
                                <span className="cm-heart-red">💗</span>
                                :
                                <span className="cm-heart-white">🤍</span>}
                        </div>
                    }
                </div>
                <hr />
                <div>
                    <div style={{ fontWeight: "bold", fontSize: 25 }}>{post.title}</div>
                    <div style={{ fontSize: 12, color: "gray" }}>{post.cate} ∙ {timeAgo}</div>
                    <div style={{ fontWeight: "bold", paddingTop: 10 }}>
                        {post.price.toLocaleString()}원
                    </div>
                    <div className="mt-3" style={{ paddingLeft: 10 }}>
                        {formatContent(post.content)}
                    </div>

                    <div style={{ fontSize: 12, color: "gray", marginTop: 30 }}>조회 {post.viewCount} ∙
                        <span id="interested"> 관심 {post.interestedCount}</span> ∙
                        <span id="chatting"> 채팅 {post.chatRoomCnt}</span>
                        {jwt && (post.writer.loginId === loginId || loginId === "admin0") &&
                            <>
                                <span className="cm-button" style={{ color: "red" }} onClick={deleteByPostHandle}>삭제</span>
                                <span style={{ float: "right", fontSize: 15, fontWeight: "bold" }}>&nbsp;∙&nbsp;</span>
                                <span className="cm-button" style={{ color: "dodgerblue" }} onClick={() => navigate(`/post/modify/${postId}`)}>수정</span>
                            </>
                        }
                    </div>
                </div>
                <hr />
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Link to="/main" className="cm-list-button">목록보기</Link>
                    {jwt && post.writer.loginId !== loginId &&
                        <span id="chatting" className="cm-status-button"
                            onClick={e => {
                                e.preventDefault();
                                chatLink();
                            }}>채팅하기</span>
                    }
                    {jwt && post.writer.loginId === loginId &&
                        <span id="chatting" className="cm-status-button"
                            onClick={e => {
                                e.preventDefault();
                                updateStatus();
                            }}>거래상태변경</span>
                    }
                </div>
            </div>
        </div>}
    </>



    );
}

export default DetailPage;