import { useRecoilState } from "recoil";
import NavBar from "../component/NavBar";
import { jwtState } from "..";
import imgPlus from "../component/image/imgPlus.png";
import { useRef, useState } from "react";
import { REST_SERVER_ADDRESS } from "../common/constant";
import { useNavigate } from "react-router-dom";

function CreatePostpage() {

    const [jwt, setJwt] = useRecoilState(jwtState);
    const [images, setImages] = useState([]);
    const formRef = useRef();
    const navigate = useNavigate();

    const imgClickHandle = (evt) => {
        formRef.current.photos.dispatchEvent(new MouseEvent("click"));
    }

    const fileChangeHandle = () => {
        const fileList = Array.from(formRef.current.photos.files);
        const imageFiles = fileList.filter((file) => file.type.startsWith('image/'));

        const MAX_IMAGES = 5;
        const selectedImages = imageFiles.slice(0, MAX_IMAGES);

        setImages(selectedImages);
    }

    const submitHandle = () => {
        const title = formRef.current.title.value;
        let content = "";
        content = formRef.current.content.value.trim();
        content = content.replace(/\n/g, "<br>").replace(/\s+/g, " ");
        let price = formRef.current.price.value;
        const cate = formRef.current.cate.value;
        const city = formRef.current.city.value;

        if(price === "") {
            price = 0;
        }

        if(title === "" || cate === "" || city === "") {
            formRef.current.title.focus();
            window.alert("최소한의 정보를 입력해주세요")
            return;
        }

        const maxImageCount = 5;
        const imageFiles = formRef.current.photos.files;

        const xhr = new XMLHttpRequest();
        xhr.open("POST", REST_SERVER_ADDRESS + "/post/create", false);
        xhr.setRequestHeader("Authorization", jwt);
        const body = new FormData();
        body.append("title", title);
        body.append("content", content);
        body.append("price", price);
        body.append("cate", cate);
        body.append("city", city);
        if (imageFiles.length !== 0) {
            if (imageFiles.length > maxImageCount) {
                const slicedImageFiles = Array.from(imageFiles).slice(0, maxImageCount);
                slicedImageFiles.forEach((file) => {
                    body.append("photos", file);
                });
            } else {
                Array.from(imageFiles).forEach((file) => {
                    body.append("photos", file);
                });
            }
        }

        xhr.send(body);
        if (xhr.status === 201) {
            window.alert("판매글이 등록되었습니다.");
            navigate("/main");
        }
    }

    return (<>
        <NavBar />
        <div className="pt-5 mt-5">
            <div className="pt-5 mt-5 create-post-form">
                <h2 style={{ textAlign: "center", paddingBottom: 30 }}>
                    중고매물 판매등록
                </h2>
                <form onSubmit={submitHandle} ref={formRef}>
                    <div style={{ display: "flex", padding: 10 }}>
                        <img className="mb-2 cm-create-button" onClick={imgClickHandle} src={imgPlus} alt="..." />
                        {images.map((image, index) => (
                            <img
                                key={index}
                                src={URL.createObjectURL(image)}
                                alt="..."
                                style={{ width: 50, height: 50, margin: '2px' }}
                            />
                        ))}
                    </div>
                    <div className="pb-3" style={{ fontSize: 12, color: "gray", paddingLeft: 10 }}>이미지 최대 5장</div>
                    <div>
                        <input className="form-control mb-2" type="file" accept="image/*" name="photos" multiple
                            style={{ display: "none" }} onChange={fileChangeHandle} />
                    </div>
                    <input className="form-control mb-2" style={{ height: 45 }} type="text" name="title" placeholder="제목" autoComplete="off" />
                    <textarea className="form-control mb-2" name="content" placeholder="내용" autoComplete="off" style={{ resize: "none", height: 100 }} />
                    <div style={{ display: "flex" }}>
                        <select name="cate" className="form-select mb-2" style={{ width: "50%" }}>
                            <option value="">카테고리를 선택해주세요</option>
                            <option value="디지털/가전">디지털/가전</option>
                            <option value="가구/인테리어">가구/인테리어</option>
                            <option value="유아/아동">유아/아동</option>
                            <option value="생활식품/가공식품">생활/가공식품</option>
                            <option value="스포츠/레저">스포츠/레저</option>
                            <option value="여성잡화/의류">여성잡화/의류</option>
                            <option value="남성잡화/의류">남성잡화/의류</option>
                            <option value="완구/장난감/인형">완구/장난감/인형</option>
                            <option value="게임/취미">게임/취미</option>
                            <option value="뷰티/미용">뷰티/미용</option>
                            <option value="반려동물용품">반려동물용품</option>
                            <option value="도서/문화">도서/문화</option>
                            <option value="식물">식물</option>
                            <option value="기타">기타</option>
                        </select>
                        <select name="city" className="form-select mb-2" style={{ width: "50%" }}>
                            <option value="">도시를 선택해주세요</option>
                            <option value="서울특별시">서울특별시</option>
                            <option value="부산광역시">부산광역시</option>
                            <option value="대구광역시">대구광역시</option>
                            <option value="인천광역시">인천광역시</option>
                            <option value="광주광역시">광주광역시</option>
                            <option value="대전광역시">대전광역시</option>
                            <option value="울산광역시">울산광역시</option>
                            <option value="세종시">세종시</option>
                            <option value="경기도">경기도</option>
                            <option value="강원도">강원도</option>
                            <option value="충청북도">충청북도</option>
                            <option value="충청남도">충청남도</option>
                            <option value="전라북도">전라북도</option>
                            <option value="전라남도">전라남도</option>
                            <option value="경상북도">경상북도</option>
                            <option value="경상남도">경상남도</option>
                            <option value="제주도">제주도</option>
                        </select>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <input className="form-control mb-2" style={{ height: 35, width: "95%", textAlign: "right" }} type="number" name="price" placeholder="가격" autoComplete="off" />
                        <h6 style={{ paddingLeft: 5 }}>원</h6>
                    </div>
                    <button type="submit" className="sign-button mb-3">등록하기</button>
                </form>
            </div>
        </div>
    </>);
}

export default CreatePostpage;