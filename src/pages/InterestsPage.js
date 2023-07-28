import { useRecoilState } from "recoil";
import NavBar from "../component/NavBar";
import { REST_SERVER_ADDRESS } from "../common/constant";
import { jwtState } from "..";
import { useEffect, useState } from "react";
import noImage from "../component/image/noImage.png";
import { useNavigate } from "react-router-dom";

function InterestsPage() {

    const [jwt, setJwt] = useRecoilState(jwtState);
    const [data, setData] = useState();
    const navigate = useNavigate();

    const findAllInterestsHandle = () => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", REST_SERVER_ADDRESS + "/interests/findAll", false);
        xhr.setRequestHeader("Authorization", jwt);
        xhr.send();

        if (xhr.status === 200) {
            const body = JSON.parse(xhr.responseText);
            setData(body);
        }
    }

    useEffect(() => {
        findAllInterestsHandle();
    }, [jwt])

    return (<>
        <NavBar />
        <div className="pt-5 mt-5">
            <h1 style={{ textAlign: "center", paddingBottom: 15 }}>관심상품</h1>
            <div className="grid-container">
                {data && data.map((one, index) => (
                    <div className="card" key={index} onClick={() => navigate(`/post/detail/${one.post.id}`)} style={{ cursor: "pointer", width: 265, margin: "auto" }}>
                        <p>({one.post.status ? "판매완료" : "판매중"}) {one.post.cate}</p>
                        <div className="card">
                            <div className="image-container">
                                {one.post.status === true ?
                                    <img src={one.post.photos.length > 0 ? one.post.photos[0].imageUrl : noImage} className="card-img-top" alt="..." style={{ opacity: 0.5 }} />
                                    :
                                    <img src={one.post.photos.length > 0 ? one.post.photos[0].imageUrl : noImage} className="card-img-top" alt="..." />
                                }
                            </div>
                        </div>
                        <div className="card-body">
                            {one.post.status === true ?
                                <div style={{ color: "gray" }}>
                                    <h5 className="card-title">{one.post.title.length > 10 ? `${one.post.title.slice(0, 10)}...` : one.post.title}</h5>
                                    <div className="card-text">{one.post.price.toLocaleString()}원</div>
                                    <p style={{ fontSize: 13 }}>{one.post.city}</p>
                                </div>
                                :
                                <div>
                                    <h5 className="card-title">{one.post.title.length > 10 ? `${one.post.title.slice(0, 10)}...` : one.post.title}</h5>
                                    <div className="card-text">{one.post.price.toLocaleString()}원</div>
                                    <p style={{ fontSize: 13 }}>{one.post.city}</p>
                                </div>
                            }
                            <p style={{ fontSize: 12, color: "gray" }}>조회수 {one.post.viewCount} ∙ 관심 {one.post.interestedCount} ∙ 채팅 {one.post.chatRoomCnt}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </>);
}

export default InterestsPage;