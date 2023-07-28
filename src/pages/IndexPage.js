import { useRecoilValue } from "recoil";
import { jwtState } from "..";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import NavBar from "../component/NavBar";
import post from "../component/image/post.png";
import chatting from "../component/image/chatting.png";
import indexImg from "../component/image/indexImg.png";


function IndexPage() {
    const jwt = useRecoilValue(jwtState);
    const navigate = useNavigate();


    useEffect(() => {
        if (jwt) {
        }
    }, []);

    return (<>
        <NavBar />
        <p className="pt-2 mt-2"></p>
        <div style={{ display: "flex", backgroundColor: "beige", paddingBottom: 100 }}>
            <div style={{ flex: 6, paddingLeft: 350, paddingTop: 350 }}>
                <h1 style={{ fontWeight: "bold" }}>중고물품은</h1>
                <h1 style={{ fontWeight: "bold" }}>중고마켓</h1>
                <div>다양한 중고물품을 거래해보세요.</div>
            </div>
            <div style={{ flex: 4 }}>
                <div style={{ paddingTop: 120, paddingRight: 350 }}>
                    <img src={post} alt="..." style={{ width: 430, height: 600 }} />
                </div>
            </div>
        </div>
        <div style={{ display: "flex", backgroundColor: "white", paddingBottom: 100 }}>
            <div style={{ flex: 6 }}>
                <div style={{ paddingTop: 120, paddingLeft: 250 }}>
                    <img src={chatting} alt="..." style={{ width: 430, height: 600 }} />
                </div>
            </div>
            <div style={{ flex: 4, paddingRight: 170, paddingTop: 350 }}>
                <h1 style={{ fontWeight: "bold" }}>중고마켓의</h1>
                <h1 style={{ fontWeight: "bold" }}>실시간채팅</h1>
                <div>실시간 채팅을 통해 중고거래를 경험해보세요.</div>
            </div>
        </div>
        <div style={{ display: "flex", backgroundColor: "rgb(230, 243, 230)", paddingBottom: 250 }}>
            <div style={{ flex: 6, paddingLeft: 350, paddingTop: 400 }}>
                <h1 style={{ fontWeight: "bold" }}>매너와</h1>
                <h1 style={{ fontWeight: "bold" }}>배려</h1>
                <div>기분 좋게 거래하는 즐거움, 함께 느껴봐요!</div>
            </div>
            <div style={{ flex: 4 }}>
                <div style={{ paddingTop: 250, paddingRight: 200 }}>
                    <img src={indexImg} alt="..." style={{ width: 600, height: 400 }} />
                </div>
            </div>
        </div>
    </>);
}
export default IndexPage;