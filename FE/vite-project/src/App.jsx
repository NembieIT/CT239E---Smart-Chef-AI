import { useState } from "react";
import axios from 'axios';

function App() {
  const [result, setResult] = useState("");
  const [imgList, setImgList] = useState([]);
  const [img, setImg] = useState(null);
  const [req, setReq] = useState(false);

  const dataFormat = {
    orange: "Trái cam",
    berry: "Trái nho",
    apple: "Trái táo",
    eggs: "Trứng",
    onion: "Hành",
    pineapple: "Dứa",
    shrimp: "Tôm",
    squid: "Mực",
    tomato: "Cà chua",
    unknown: "Không thấy món phù hợp"
  }

  const handleChange = (img) => {
    if (!img) return;
    setImg(img);
    // const preview = URL.createObjectURL(img);

    // setImgList(prev => [
    //   ...prev,
    //   {
    //     img,
    //     preview
    //   }
    // ]);
  }

  const handleUpload = async () => {
    // if (imgList.length === 0) {
    //   setReq(true);
    //   return
    // }

    const formData = new FormData();
    // imgList.forEach(img => {
    //   formData.append("files", img.img);
    // })
    formData.append("file", img)
    const res = await axios.post('http://localhost:8000/detect-ingredients', formData)
    const data = res.data;
    console.log(data);
    setResult(data);
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96">
        <h1 className="text-xl font-bold mb-4">Gợi ý món ăn</h1>

        <input
          type="file"
          id="fileInput"
          accept="image/*"
          onChange={(e) => handleChange(e.target.files[0])}
          className="hidden"
        />

        {/* Click vào ảnh */}
        <div className="flex flex-col items-center justify-center p-5">
          <label htmlFor="fileInput" className="cursor-pointer flex gap-5 items-center justify-center flex-wrap">
            {/* {imgList.map((img, index) => (
              <img
                key={index}
                src={img.preview || '../public/vite.svg'}
                alt="Upload"
                className="w-20 h-20 my-5 object-cover rounded-xl border-2 border-red-400 hover:opacity-80"
              />
            ))
            } */}
            <img
              src="../public/vite.svg"
              alt="Upload"
              className="w-20 h-20 my-5 object-cover rounded-xl border-2 border-red-400 hover:opacity-80"
            />
          </label>
          {/* {!imgList.length > 0 && (
            <span>Vui lòng chọn ảnh !</span>
          )} */}
        </div>

        {req && (
          <span className="text-red-500">Chưa có ảnh !</span>
        )}

        <button
          onClick={handleUpload}
          className="w-full bg-green-700 text-white py-2 rounded-lg cursor-pointer hover:bg-black hover:text-white transition-all"
        >
          Gợi ý !
        </button>

        {result && (
          <p className="mt-4 text-center font-semibold">
            Món ăn: {result.dish} <br />
            Nguyên liệu: {result.ingredients.map((ing, index) => (
              <span key={index}>{dataFormat[ing]} </span>
            ))}
          </p>
        )}
      </div>
    </div>
  )
}

export default App
