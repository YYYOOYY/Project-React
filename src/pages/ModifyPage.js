import { useRecoilState } from "recoil";
import { jwtState } from "..";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { REST_SERVER_ADDRESS } from "../common/constant";
import NavBar from "../component/NavBar";
import defaultImg from "../component/image/defaultImg.png";

function ModifyPage() {
    const [jwt, setJwt] = useRecoilState(jwtState);
    const [profile, setProfile] = useState();
    const [status, setStatus] = useState(0);
    const navigate = useNavigate();
    const fileRef = useRef();
    const imgRef = useRef();
    const nicknameRef = useRef(null);
    const currentPassRef = useRef();
    const newPassRef = useRef();
    const confirmNewPassRef = useRef();
    const [showMessage, setShowMessage] = useState(false);

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

    useEffect(() => {
        if (profile && nicknameRef.current !== null) {
            nicknameRef.current.value = profile.nickname;
        }
    }, [profile]);

    const fileChangeHandle = (evt) => {
        const file = fileRef.current.files[0];
        if (!file)
            return;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
            imgRef.current.src = reader.result;
        }
    }

    const imgClickHandle = (evt) => {
        fileRef.current.dispatchEvent(new MouseEvent("click"));
    }

    const checkByPasswordHandle = (evt) => {
        evt.preventDefault();
        const pass = currentPassRef.current.value;

        const xhr = new XMLHttpRequest();
        xhr.open("POST", REST_SERVER_ADDRESS + "/user/checkPass", false);
        xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("Authorization", jwt);
        xhr.send("pass=" + pass);

        if (xhr.status === 200) {
            const body = JSON.parse(xhr.responseText);

            if (body) {
                setStatus(2)
                if (currentPassRef.current.classList.contains("is-invalid")) {
                    currentPassRef.current.classList.remove("is-invalid");
                }
                currentPassRef.current.classList.add("is-valid");
                currentPassRef.current.disabled = true;
                newPassRef.current.disabled = false;
                confirmNewPassRef.current.disabled = false;
            } else {
                setStatus(9)
                if (currentPassRef.current.classList.contains("is-valid")) {
                    currentPassRef.current.classList.remove("is-valid");
                }
                currentPassRef.current.classList.add("is-invalid");
            }

        }
    }

    const checkByNewPasswordHandle = (evt) => {
        evt.preventDefault();

        const newPass = newPassRef.current.value;
        const confirmNewPass = confirmNewPassRef.current.value;
        const pass = currentPassRef.current.value;

        const passPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        const isPassValid = passPattern.test(newPass);

        if (pass === newPass) {
            setStatus(6);
            if (newPassRef.current.classList.contains("is-valid")) {
                newPassRef.current.classList.remove("is-valid");
            }
            newPassRef.current.classList.add("is-invalid");
            newPassRef.current.focus();
            return;
        }

        if (!isPassValid) {
            setStatus(7);
            if (newPassRef.current.classList.contains("is-valid")) {
                newPassRef.current.classList.remove("is-valid");
            }
            newPassRef.current.classList.add("is-invalid");
            newPassRef.current.focus();
        } else {
            if (newPass === confirmNewPass) {
                setStatus(3)
                if (newPassRef.current.classList.contains("is-invalid")) {
                    newPassRef.current.classList.remove("is-invalid");
                }
                if (confirmNewPassRef.current.classList.contains("is-invalid")) {
                    confirmNewPassRef.current.classList.remove("is-invalid");
                }
                newPassRef.current.classList.add("is-valid");
                confirmNewPassRef.current.classList.add("is-valid");
            } else {
                setStatus(8)
                if (newPassRef.current.classList.contains("is-valid")) {
                    newPassRef.current.classList.remove("is-valid");
                }
                if (confirmNewPassRef.current.classList.contains("is-valid")) {
                    confirmNewPassRef.current.classList.remove("is-valid");
                }
                newPassRef.current.classList.add("is-invalid");
                confirmNewPassRef.current.classList.add("is-invalid");
                confirmNewPassRef.current.focus();
            }
        }

    }

    const updateProfileHandle = (evt) => {
        evt.preventDefault();
        let currentPass = "";
        if (currentPassRef.current && currentPassRef.current.value !== undefined) {
            currentPass = currentPassRef.current.value;
        }

        let newPass = "";
        if (newPassRef.current && newPassRef.current.value !== undefined) {
            newPass = newPassRef.current.value;
        }
        if (currentPassRef.current && currentPassRef.current.value !== undefined) {
            if (status !== 3) {
                setStatus(4);
                return;
            }
        }

        if (nicknameRef.current.value === "" || nicknameRef.current.value === null) {
            setShowMessage(true);
            setTimeout(() => {
                setShowMessage(false);
            }, 5000);
            return;
        }


        const xhr = new XMLHttpRequest();
        xhr.open("POST", REST_SERVER_ADDRESS + "/user/profile/modify", false);
        xhr.setRequestHeader("Authorization", jwt);
        const body = new FormData();
        body.append("nickname", nicknameRef.current.value)
        if (fileRef.current.files.length !== 0) {
            body.append("profile", fileRef.current.files[0]);
        }
        if (currentPass !== "" && newPass !== "") {
            body.append("currentPass", currentPass);
            body.append("newPass", newPass);
        }

        xhr.send(body);
        if (xhr.status === 200) {
            window.alert("프로필이 수정되었습니다.");
            navigate("/profile")

        }
    }

    const alterStatusHandle = () => {
        setStatus(1);
    }

    return (<>
        <NavBar />
        <div>
            <p className="pt-5 mt-5"></p>
            <div style={{ marginBottom: "50px" }}>
                <form onSubmit={updateProfileHandle} className="grid-container" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    {profile && <div className="card-cm" style={{ width: 380, margin: "auto" }}>
                        <div className="card-cm">
                            <div className="image-container-2" style={{ cursor: "pointer" }}>
                                <img ref={imgRef} onClick={imgClickHandle} src={profile.profileImage !== null ? profile.profileImage : defaultImg} alt="..." style={{ width: 350, borderRadius: "30px" }} />
                            </div>
                            <div style={{ display: "none" }}>
                                <input type="file" accept="image/*" ref={fileRef} onChange={fileChangeHandle} />
                            </div>
                        </div>
                        <hr />
                        <div className="card-body" style={{ textAlign: "left", padding: "5px" }}>
                            <div style={{ textAlign: "center", fontSize: 20, fontWeight: "bold" }}>닉네임 수정</div>
                            <input className="form-control" type="text" ref={nicknameRef} style={{ padding: "5px", width: 250, paddingLeft: 5 }} placeholder="닉네임 입력" />
                            {showMessage &&
                                <div style={{ fontSize: 12, color: "red", textAlign: "center", paddingTop: 5 }}>닉네임은 공백으로 설정할 수 없습니다.</div>
                            }
                            <hr />
                            {status === 0 &&
                                <div style={{ display: "flex", justifyContent: "center" }}>
                                    <button className="btn btn-success" onClick={alterStatusHandle} >비밀번호 변경</button>
                                </div>
                            }
                            {(status !== 0) &&
                                <div>
                                    <div style={{ textAlign: "center", fontSize: 20, fontWeight: "bold" }}>비밀번호 재설정</div>
                                    <div className="pb-1">
                                        <input className="form-control" type="password" style={{ padding: "5px", width: 250, paddingLeft: 5 }} ref={currentPassRef} placeholder="기존 비밀번호" />
                                        {status === 9 &&
                                            <span style={{ fontSize: 12, color: "red" }}>기존 비밀번호가 일치하지 않습니다.</span>
                                        }
                                        {(status === 1 || status === 9) &&
                                            <div style={{ display: "flex", justifyContent: "center", padding: 10 }}>
                                                <button style={{ height: 35, fontSize: 13 }} className="btn btn-primary" onClick={checkByPasswordHandle}>비밀번호 확인</button>
                                            </div>
                                        }
                                    </div>
                                    <div className="pb-1">
                                        <input className="form-control" type="password" style={{ padding: "5px", width: 250, paddingLeft: 5 }} ref={newPassRef} placeholder="새 비밀번호" disabled />
                                    </div>
                                    <div className="pb-1">
                                        <input className="form-control" type="password" style={{ padding: "5px", width: 250, paddingLeft: 5 }} ref={confirmNewPassRef} placeholder="비밀번호 확인" disabled />
                                        {status === 7 &&
                                            <span style={{ fontSize: 12, color: "red" }}> 영어, 숫자, 특문 포함 8자 이상을 입력해주세요.</span>
                                        }
                                        {status === 8 &&
                                            <span style={{ fontSize: 12, color: "red" }}>새 비밀번호가 일치하지 않습니다.</span>
                                        }
                                        <div style={{ display: "flex", justifyContent: "center", padding: 10 }}>
                                            <button style={{ height: 35, fontSize: 13 }} className="btn btn-primary" onClick={checkByNewPasswordHandle}>새 비밀번호 확인</button>
                                        </div>
                                        {status === 3 &&
                                            <div style={{ fontSize: 12, color: "green", textAlign: "center" }}>비밀번호 변경이 가능합니다.</div>
                                        }
                                        {status === 4 &&
                                            <div style={{ fontSize: 12, color: "red", textAlign: "center" }}>새 비밀번호 확인을 해주세요.</div>
                                        }
                                        {status === 6 &&
                                            <div style={{ fontSize: 12, color: "red", textAlign: "center" }}>이전 비밀번호와 새 비밀번호가 같습니다.</div>
                                        }
                                    </div>
                                </div>
                            }
                        </div>
                        <div className="d-grid gap-2 col-6 mx-auto">
                            <button className="btn btn-secondary" type="submit">수정하기</button>
                        </div>
                    </div>}
                </form >
            </div>
        </div >
    </>);
}

export default ModifyPage;