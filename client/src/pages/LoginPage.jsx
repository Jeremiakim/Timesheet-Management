import Button from "@mui/material/Button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const navigate = useNavigate();
  const [inputLogin, setInputLogin] = useState({
    name: "",
    rate: "",
  });
  const [error, setError] = useState(null);

  const onChange = (e) => {
    setInputLogin({
      ...inputLogin,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmitLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:3000/login`,
        inputLogin
      );
      const access_token = response.data.access_token;
      localStorage.setItem("access_token", access_token);
      navigate("/");
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FB] text-gray-900 flex justify-center ">
      <div className="mt-20">
        <div className="max-w-screen-xl m-0 bg-white shadow sm:rounded-lg flex justify-center flex-1">
          <form onSubmit={onSubmitLogin} className="mt-6 mb-6 space-y-6">
            <div className="mb-5">
              <label htmlFor="name-address" className="sr-only">
                Name
              </label>
              <input
                id="name-address"
                name="name"
                type="text"
                autoComplete="off"
                required
                onChange={onChange}
                value={inputLogin.name}
                className="block w-full px-3 py-2 border rounded-sm text-purple-900 focus:outline-none focus:ring focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-lg tracking-wider"
                placeholder="Name"
              />
            </div>
            <div>
              <label htmlFor="rate" className="sr-only">
                Rate
              </label>
              <input
                id="rate"
                name="rate"
                type="text"
                autoComplete="off"
                required
                onChange={onChange}
                value={inputLogin.rate}
                className="block w-full px-3 py-2 border rounded-sm text-purple-900 focus:outline-none focus:ring focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-lg tracking-wider"
                placeholder="Rate"
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <div className="flex flex-row gap-4 justify-center items-center">
              <Button type="submit" variant="contained">
                Simpan
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
