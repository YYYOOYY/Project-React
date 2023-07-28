import { useEffect, useRef, useState } from "react";
import { REST_SERVER_ADDRESS } from "../common/constant";
import NavBar from "../component/NavBar";
import { jwtState } from "..";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import noImage from "../component/image/noImage.png";

function MainPage() {
    const [jwt, setJwt] = useRecoilState(jwtState);
    const [page, setPage] = useState(1);
    const [searchPage, setSearchPage] = useState(1);
    const [count, setCount] = useState(0);
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();
    const [onSale, setOnSale] = useState(0);
    const searchRef = useRef();
    const [keyword, setKeyword] = useState("");

    const updatePostHandle = () => {

        const xhr = new XMLHttpRequest();

        let url = REST_SERVER_ADDRESS + "/post/list?page=";

        let currentPage = 1;

        if (keyword !== "") {
            url += searchPage + "&q=" + keyword;
            currentPage = searchPage;
        } else {
            url += page;
            currentPage = page;
        }
        xhr.open("GET", url, false);
        xhr.send();
        if (xhr.status === 200) {

            const body = JSON.parse(xhr.responseText);
            setCount(body.total);
            if (currentPage === 1) {
                setPosts(body.posts);
            } else {
                setPosts([...posts, ...body.posts]);
            }
            if (keyword !== "") {
                setSearchPage(currentPage + 1);
            } else {
                setPage(currentPage + 1);
            }
        }
    };

    useEffect(() => {
        updatePostHandle();
    }, [keyword]);

    document.onscroll = (evt) => {
        if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 200) {
            updatePostHandle();
        }
    };

    const handleOnSaleChange = (e) => {
        setOnSale(e.target.checked ? 1 : 0);
    };

    const keywordSetHandle = () => {
        if (keyword !== searchRef.current.value) {
            setPage(1);
            setSearchPage(1);
            setPosts([]);
        }
        setKeyword(searchRef.current.value);
    }

    const reloadHandle = () => {
        window.location.reload();
    }

    const textarea = document.querySelector("#searchInput");
    const button = document.querySelector("#button-addon2");
    if (textarea) {
        textarea.addEventListener("keydown", (e) => {
            if (e.keyCode === 13 && !e.shiftKey) {
                if (searchRef.current.value.trim() !== "") {
                    e.preventDefault();
                    button.click();
                }
            }
        });
    }

    return (<>
        <NavBar />
        <p className="pt-5 mt-5"></p>
        <div style={{ display: "flex", justifyContent: "flex-end", paddingRight: 10 }}>
            <div className="input-group mb-3" style={{ width: "20%" }}>
                <input id="searchInput" ref={searchRef} type="text" className="form-control" placeholder="검색어를 입력해주세요..." aria-label="검색어를 입력해주세요..." aria-describedby="button-addon2" />
                <button className="btn btn-outline-secondary enterbt" type="button" id="button-addon2" onClick={keywordSetHandle}>검색</button>
            </div>
        </div>
        <div className="mb-5" style={{ display: "flex", justifyContent: "flex-end", paddingRight: 15, fontSize: 14 }}>
            <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault"
                    checked={onSale === 1}
                    onChange={handleOnSaleChange} />
                <label className="form-check-label" htmlFor="flexSwitchCheckDefault">판매중인 상품만 보기</label>
            </div>
            <div style={{ paddingLeft: 20 }}>
                <button className="all-button" onClick={reloadHandle}>전체보기</button>
            </div>
        </div>
            {posts.length <= 0 && 
                <h5 style={{textAlign: "center"}}>검색결과가 없습니다.</h5>    
            }
        <div className="grid-container">
            {posts && posts.map((one, index) =>
                onSale === 1 && !one.status ? (
                    <div key={index} className="card" onClick={() => navigate(`/post/detail/${one.id}`)} style={{ cursor: "pointer", width: 265, margin: "auto" }}>
                        <p>{one.status ? "판매완료" : "판매중"}</p>
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
                                    <p style={{ fontSize: 12 }}>{one.cate}</p>
                                    <div className="card-text">{one.price.toLocaleString()}원</div>
                                    <p style={{ fontSize: 13 }}>{one.city}</p>
                                </div>
                                :
                                <div>
                                    <h5 className="card-title">{one.title.length > 10 ? `${one.title.slice(0, 10)}...` : one.title}</h5>
                                    <p style={{ fontSize: 12 }}>{one.cate}</p>
                                    <div className="card-text">{one.price.toLocaleString()}원</div>
                                    <p style={{ fontSize: 13 }}>{one.city}</p>
                                </div>
                            }

                            <p style={{ fontSize: 12, color: "gray" }}>조회수 {one.viewCount} ∙ 관심 {one.interestedCount} ∙ 채팅 {one.chatRoomCnt}</p>
                        </div>
                    </div>
                )
                    : onSale === 0 && (
                        <div key={index} className="card" onClick={() => navigate(`/post/detail/${one.id}`)} style={{ cursor: "pointer", width: 265, margin: "auto" }}>
                            <p>{one.status ? "판매완료" : "판매중"}</p>
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
                                        <p style={{ fontSize: 12 }}>{one.cate}</p>
                                        <div className="card-text">{one.price.toLocaleString()}원</div>
                                        <p style={{ fontSize: 13 }}>{one.city}</p>
                                    </div>
                                    :
                                    <div>
                                        <h5 className="card-title">{one.title.length > 10 ? `${one.title.slice(0, 10)}...` : one.title}</h5>
                                        <p style={{ fontSize: 12 }}>{one.cate}</p>
                                        <div className="card-text">{one.price.toLocaleString()}원</div>
                                        <p style={{ fontSize: 13 }}>{one.city}</p>
                                    </div>
                                }

                                <p style={{ fontSize: 12, color: "gray" }}>조회수 {one.viewCount} ∙ 관심 {one.interestedCount} ∙ 채팅 {one.chatRoomCnt}</p>
                            </div>
                        </div>
                    )
            )}
            <br />
        </div>
    </>);
}

export default MainPage;