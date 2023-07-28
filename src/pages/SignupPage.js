import NavBar from "../component/NavBar";
import { REST_SERVER_ADDRESS } from "../common/constant";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SignupPage() {

    const emailRef = useRef();
    const codeRef = useRef();
    const idRef = useRef();
    const passRef = useRef();
    const nickRef = useRef();

    const navigate = useNavigate();

    const [verifyStatus, setVerifyStatus] = useState(0);
    const [email, setEmail] = useState();

    const sendCodeHandle = () => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", REST_SERVER_ADDRESS + "/user/verify-code", false);
        xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
        xhr.send("email=" + emailRef.current.value);

        if (xhr.status === 200) {
            setEmail(emailRef.current.value);
            setVerifyStatus(1);
        } else if (xhr.status === 409) {
            setVerifyStatus(9);
        } else if (xhr.status === 500) {
            setVerifyStatus(5);
        }

    }

    const verifyCodeHandle = () => {
        const xhr = new XMLHttpRequest();
        xhr.open("PATCH", REST_SERVER_ADDRESS + "/user/verify-code", false);
        xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
        xhr.send("email=" + email + "&code=" + codeRef.current.value);
        if (xhr.status === 200) {
            setVerifyStatus(2);
        } else if (xhr.status === 403) {
            const body = JSON.parse(xhr.responseText);
            if (body.code === 403) {
                setVerifyStatus(7);
            } else {
                setVerifyStatus(8);
            }
        }
    }

    const signupHandle = () => {
        const id = idRef.current.value;
        const idPattern = /^[a-z][a-z0-9]{4,11}$/;
        const isIdValid = idPattern.test(id);

        const pass = passRef.current.value;
        const passPattern = /^(?=.*[a-zA-Z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$/;
        const isPassValid = passPattern.test(pass);

        const nick = nickRef.current.value;
        const nickPattern = /^[a-zA-Z가-힣]{2,8}$/;
        const isNickValid = nickPattern.test(nick);

        const xhr = new XMLHttpRequest();
        xhr.open("POST", REST_SERVER_ADDRESS + "/user/join", false);
        xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
        xhr.send("loginId=" + id + "&loginPassword=" + pass + "&nickname=" + nick + "&email=" + email)

        if (xhr.status === 200) {
            navigate("/user/login")
        } else if (xhr.status === 409) {
            setVerifyStatus(6);
        } else if (xhr.status === 400) {
            if (!isIdValid) {
                idRef.current.classList.add("is-invalid");
            }
            if (!isPassValid) {
                passRef.current.classList.add("is-invalid");
            }
            if (!isNickValid) {
                nickRef.current.classList.add("is-invalid");
            }
            setVerifyStatus(4);
        } else {
            setVerifyStatus(8);
        }
    }

    return (<>
        <NavBar />
        <div className="user-container">
            <div className="user-header">
                <h1>회원가입</h1>
            </div>
            {(verifyStatus === 0 || verifyStatus === 9 || verifyStatus === 8 || verifyStatus === 5) &&
                <div className="sign-form-group">
                    <input ref={emailRef} type="email" className="form-control" placeholder="이메일을 입력해주세요" aria-label="email" autoComplete="off"/>
                    <br />
                    <button type="button" className="sign-button" onClick={sendCodeHandle}>인증코드전송</button>
                    {verifyStatus === 9 &&
                        <div className="info-error">이미 사용중인 이메일입니다.</div>
                    }
                    {verifyStatus === 8 &&
                        <div className="info-error">이메일인증을 다시 진행해주세요.</div>
                    }
                    {verifyStatus === 5 &&
                        <div className="info-error">이메일형식으로 다시 입력해주세요.</div>
                    }
                </div>
            }
            {(verifyStatus === 1 || verifyStatus === 7) &&
                <div className="sign-form-group">
                    <input ref={codeRef} type="text" className="form-control" placeholder="인증코드를 입력해주세요" autoComplete="off"/>
                    <br />
                    <button type="button" className="sign-button" onClick={verifyCodeHandle}>코드인증</button>
                    {verifyStatus === 7 &&
                        <div className="info-error">인증코드를 다시 입력해주세요.</div>
                    }
                </div>
            }
            {(verifyStatus === 2 || verifyStatus === 6 || verifyStatus === 4) &&
                <div className="sign-form-group">
                    <input ref={idRef} type="text" className="form-control" placeholder="아이디 (영소문자, 숫자 5~12자)"
                        pattern="^[a-z][a-z0-9]{4,11}$"
                        title="아이디는 5자 이상 12자 이하의 영어 소문자와 숫자 조합이어야 합니다." autoComplete="off"/>
                    {verifyStatus === 4 && idRef.current.classList.contains("is-invalid") &&
                        <div class="invalid-feedback" style={{ fontSize: 12 }}>
                            영소문자로 시작하며 숫자포함 5~12자를 입력해주세요.
                        </div>
                    }

                    <input ref={passRef} type="password" className="form-control" placeholder="비밀번호 (영어, 숫자, 특문 포함 8자 이상)"
                        pattern="^(?=.*[a-zA-Z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$"
                        title="비밀번호는 8자 이상의 영어, 숫자, 특수문자 조합이어야 합니다." autoComplete="off"/>
                    {verifyStatus === 4 && passRef.current.classList.contains("is-invalid") &&
                        <div class="invalid-feedback" style={{ fontSize: 12 }}>
                            영어, 숫자, 특수문자 포함 8자 이상을 입력해주세요.
                        </div>
                    }

                    <input ref={nickRef} type="text" className="form-control" placeholder="닉네임 (영어, 한글 2~8자)"
                        pattern="^[a-zA-Z가-힣]{2,8}$"
                        title="닉네임은 2자 이상 8자 이하의 영어와 한글만 가능합니다." autoComplete="off"/>
                    {verifyStatus === 4 && nickRef.current.classList.contains("is-invalid") &&
                        <div class="invalid-feedback" style={{ fontSize: 12 }}>
                            영어와 한글 2~8자를 입력해주세요.
                        </div>
                    }
                    <br />
                    <button type="button" className="sign-button" onClick={signupHandle}>회원가입</button>
                    {verifyStatus === 6 &&
                        <div className="info-error">이미 사용중인 아이디입니다.</div>
                    }
                    {verifyStatus === 4 &&
                        <div className="info-error">입력란의 형식이 요구사항과 일치하지 않습니다.</div>
                    }
                </div>
            }
        </div>
        <div className="info">이미 계정이 있으신가요? <Link to="/user/login" style={{textDecoration: "none"}}>로그인</Link></div>
    </>);
}

export default SignupPage;  