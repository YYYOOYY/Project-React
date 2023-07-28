import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { jwtState, loginIdState } from "..";
import { useNavigate } from "react-router-dom";

function LogoutPage() {
    const [jwt, setJwt] = useRecoilState(jwtState);
    const [loginId, setLoginId] = useRecoilState(loginIdState);
    const navigate = useNavigate();
    useEffect(() => {
        if(jwt){
            setJwt(null);
            setLoginId(null);
            sessionStorage.removeItem("authLoginId");
            sessionStorage.removeItem("authToken");
            navigate("/")
        }
    }, []);

    return (<></>
        
        );
}

export default LogoutPage;