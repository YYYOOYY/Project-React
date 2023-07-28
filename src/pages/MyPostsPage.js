import { useRecoilState } from "recoil";
import NavBar from "../component/NavBar";
import { REST_SERVER_ADDRESS } from "../common/constant";
import { jwtState } from "..";
import { useEffect, useState } from "react";
import noImage from "../component/image/noImage.png";
import { useNavigate } from "react-router-dom";

function MyPostsPage() {
    const [jwt, setJwt] = useRecoilState(jwtState);
    const [data, setData] = useState();
    const navigate = useNavigate();

    const findAllInterestsHandle = () => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", REST_SERVER_ADDRESS + "/post/myposts", false);
        xhr.setRequestHeader("Authorization", jwt);
        xhr.send();

        if (xhr.status === 200) {
            const body = JSON.parse(xhr.responseText);
            setData(body.posts);
        }
    }

    useEffect(() => {
        findAllInterestsHandle();
    }, [jwt])

    return (<>
        <NavBar />
        <div className="pt-5 mt-5">
            <h1 style={{ textAlign: "center", paddingBottom: 15 }}>내 게시글</h1>
            <div className="grid-container">
                {data && data.map((one, index) => (
                    <div className="card" key={index} onClick={() => navigate(`/post/detail/${one.id}`)} style={{ cursor: "pointer", width: 265, margin: "auto" }}>
                        <p>({one.status ? "판매완료" : "판매중"}) {one.cate}</p>
                        <div className="card">
                            <div className="image-container">
                                {one.status === true ?
                                    <img src={one.photos.length > 0 ? one.photos[0].imageUrl : noImage} className="card-img-top" alt="..." style={{ opacity: 0.5 }} />
                                    :
                                    <img src={one.photos.length > 0 ? one.photos[0].imageUrl : noImage} className="card-img-top" alt="..." />
                                }
                            </div>
                        </div>
                        <div className="card-body">
                            {one.status === true ?
                                <div style={{ color: "gray" }}>
                                    <h5 className="card-title">{one.title.length > 10 ? `${one.title.slice(0, 10)}...` : one.title}</h5>
                                    <div className="card-text">{one.price.toLocaleString()}원</div>
                                    <p style={{ fontSize: 13 }}>{one.city}</p>
                                </div>
                                :
                                <div>
                                    <h5 className="card-title">{one.title.length > 10 ? `${one.title.slice(0, 10)}...` : one.title}</h5>
                                    <div className="card-text">{one.price.toLocaleString()}원</div>
                                    <p style={{ fontSize: 13 }}>{one.city}</p>
                                </div>
                            }
                            <p style={{ fontSize: 12, color: "gray" }}>조회수 {one.viewCount} ∙ 관심 {one.interestedCount} ∙ 채팅 {one.chatRoomCnt}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </>);
}

export default MyPostsPage;