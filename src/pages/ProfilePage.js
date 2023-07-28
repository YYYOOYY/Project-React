import { useRecoilState } from "recoil";
import { jwtState } from "..";
import { REST_SERVER_ADDRESS } from "../common/constant";
import { useEffect, useState } from "react";
import NavBar from "../component/NavBar";
import defaultImg from "../component/image/defaultImg.png";
import { useNavigate } from "react-router-dom";

function ProfilePage() {

    const [jwt, setJwt] = useRecoilState(jwtState);
    const [profile, setProfile] = useState();
    const navigate = useNavigate();

    const profileHandle = () => {
        if (jwt === null) {
            return;
        }

        const xhr = new XMLHttpRequest();
        xhr.open("GET", REST_SERVER_ADDRESS + "/user/profile", false);
        if (jwt !== null) {
            xhr.setRequestHeader("Authorization", jwt);
        }
        xhr.send();
        if (xhr.status === 200) {
            const body = JSON.parse(xhr.responseText);
            setProfile(body);
        }
    }

    useEffect(() => {
        profileHandle();

    }, [jwt]);

    const withdrawalHandle = () => {
        if (window.confirm("회원탈퇴를 진행하시면 기존 데이터는 복구되지 않습니다.                     그래도 진행하시겠습니까?")) {
            const xhr = new XMLHttpRequest();
            xhr.open("DELETE", REST_SERVER_ADDRESS + "/user/delete", false);
            xhr.setRequestHeader("Authorization", jwt);
            xhr.send();
            if (xhr.status === 200) {
                window.alert("회원탈퇴가 완료되었습니다. 이용해주셔서 감사합니다.");
                navigate("/user/logout");
            }
        }
    }

    return (<>
        <NavBar />
        <p className="pt-5 mt-5"></p>
        <div className="grid-container" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "30vh" }}>
            {profile && <div className="card-cm" style={{ width: 380, margin: "auto" }}>
                <div className="card-cm">
                    <div className="image-container-2">
                        <img src={profile.profileImage !== null ? profile.profileImage : defaultImg} alt="..." style={{ width: 350, borderRadius: "30px" }} />
                    </div>
                </div>
                <hr />
                <div className="card-body" style={{ textAlign: "left" }}>
                    <h4 style={{ textAlign: "center" }}>{profile.nickname}
                        <span style={{ textAlign: "center", fontSize: 17 }}>({profile.loginId})</span>
                    </h4>
                    <div style={{ textAlign: "center", fontSize: 12, color: "gray" }}>{profile.joined}</div>
                    <div>{profile.email}</div>
                    <hr />
                </div>
                <div className="d-grid gap-2 col-6 mx-auto">
                    <button className="btn btn-secondary" type="button" onClick={() => navigate(`/profile/modify`)}>프로필 수정</button>
                </div>
                <div className="d-grid gap-2 col-6 mx-auto mt-2">
                    <button className="btn btn-danger" type="button" onClick={withdrawalHandle}>회원탈퇴</button>
                </div>

            </div>}
        </div>
    </>);

}

export default ProfilePage;