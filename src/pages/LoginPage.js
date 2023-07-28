import { Link, useNavigate } from "react-router-dom";
import { REST_SERVER_ADDRESS } from "../common/constant";
import { useEffect, useRef } from "react";
import { useRecoilState } from "recoil";
import { jwtState, loginIdState } from "..";
import NavBar from "../component/NavBar";

function LoginPage() {
    // 필요한 훅 설정
    const navigate = useNavigate();
    const formRef = useRef();
    const [jwt, setJwt] = useRecoilState(jwtState);
    const [loginId, setLoginId] = useRecoilState(loginIdState);


    // 팝업에서 메세지 이벤트 발생시켰을 때 =======================
    window.onmessage = (evt) => {
        if (evt.data.type === "kakaoAuth") {
            setJwt(evt.data.jwtToken);
            setLoginId(evt.data.loginId);
            navigate("/");
        }
    }

    // 이벤트 처리 
    // 사용자 이메일 비번 치고 로그인 시도시 =================================
    const loginFormHandle = (evt) => {
        evt.preventDefault();
        const loginId = formRef.current.username.value;
        const password = formRef.current.password.value;
        if (loginId === "" || password === "") {
            formRef.current.username.focus();
            return;
        }
        const xhr = new XMLHttpRequest();
        xhr.open("POST", REST_SERVER_ADDRESS + "/user/validate", false);
        xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded")
        xhr.send("username=" + loginId + "&password=" + password);
        if (xhr.status === 200) {
            // window.alert(xhr.responseText);
            const response = JSON.parse(xhr.responseText);
            // window.alert(response.token);
            setJwt(response.token);
            sessionStorage.setItem("authToken", response.token);
            setLoginId(response.loginId)
            sessionStorage.setItem("authLoginId", response.loginId);
            navigate("/");
        } else if (xhr.status === 400) {
            formRef.current.username.classList.add("is-invalid");
            formRef.current.password.classList.add("is-invalid");
            formRef.current.password.value = "";
            formRef.current.username.select();
            formRef.current.username.focus();
        } else {
            formRef.current.password.classList.add("is-invalid");
            formRef.current.password.classList.add("is-invalid");
            formRef.current.password.value = "";
        }
    }

    return (
        <>
            <NavBar />
            <div className="user-container">
                <div className="user-header">
                    <h1>로그인</h1>
                </div>
                <form onSubmit={loginFormHandle} ref={formRef}>
                    <div className="mb-3">
                        <span className="form-label">아이디</span>
                        <input type="text" className="form-control" name="username" autocomplete="off" />
                    </div>
                    <div className="mb-3">
                        <span className="form-label">비밀번호</span>
                        <input type="password" className="form-control" name="password" autocomplete="off" />
                    </div>
                    <div className="mb-3">
                        <button type="submit" className="login-button">로그인</button>
                    </div>
                </form>
            </div>
            <div className="info">
                계정이 없으신가요? <Link to="/user/signup" style={{textDecoration: "none"}}>가입하기</Link>
            </div>
        </>);
}

export default LoginPage;