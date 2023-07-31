import { useRecoilState } from "recoil";
import { jwtState, loginIdState } from "..";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import logo from "../component/image/logo.png";


function NavBar() {
  const navigate = useNavigate();
  const [jwt, setJwt] = useRecoilState(jwtState);
  const [loginId, setLoginId] = useRecoilState(loginIdState);

  useEffect(() => {
    const authToken = sessionStorage.getItem("authToken");
    const authLoginId = sessionStorage.getItem("authLoginId");

    if (authToken) {
      setJwt(authToken);
    }

    if (authLoginId) {
      setLoginId(authLoginId);
    }
  }, [setJwt, setLoginId]);

  return (<nav className="navbar bg-body-tertiary fixed-top">
    <div className="container-fluid" style={{background: "white"}}>
      <Link style={{paddingLeft: 10}} className="navbar-brand" to="/"><img src={logo} alt="..." style={{width: 100}}/></Link>
      <button className="btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
        <div>메뉴</div>
      </button>
      <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasNavbarLabel">중고마켓</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
            <li className="nav-item" data-bs-dismiss="offcanvas">
              <Link className="nav-link active" aria-current="page" to="/main">중고매물 보기</Link>
            </li>
            {jwt &&
            <li className="nav-item" data-bs-dismiss="offcanvas">
              <Link className="nav-link active" aria-current="page" to="/post/create">중고매물 판매</Link>
            </li>}

            {!jwt &&
              <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                <li className="nav-item" data-bs-dismiss="offcanvas">
                  <Link className="nav-link" to="/user/login">로그인</Link>
                </li>
                <li className="nav-item" data-bs-dismiss="offcanvas">
                  <Link className="nav-link" to="/user/signup">회원가입</Link>
                </li></ul>}


            {jwt &&
            <li className="nav-item dropdown">
              <Link className="nav-link dropdown-toggle" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                내정보
              </Link>
              <ul className="dropdown-menu" data-bs-dismiss="offcanvas">
                <li><Link className="dropdown-item" to="/profile">프로필수정</Link></li>
                <li><Link className="dropdown-item" to="/chatroom">채팅방 목록보기</Link></li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li><Link className="dropdown-item" to="/myposts">내 게시글</Link></li>
                <li><Link className="dropdown-item" to="/interests">관심상품</Link></li>
              </ul>
                <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                  <li className="nav-item" data-bs-dismiss="offcanvas">
                    <Link className="nav-link" to="/user/logout">로그아웃</Link>
                  </li></ul>
            </li>}
          </ul>
        </div>
      </div>
    </div>
  </nav>);
}

export default NavBar;