import { useNavigate } from "react-router-dom";

export const NavBar = () => {
  const navigate = useNavigate();

  const handleButtonClickHome = () => {
    navigate("/");
  };
  const handleButtonClickLogin = () => {
    navigate("/login");
  };
  return (
    <>
      <div className="w-screen justify-between bg-white text-neutral-content shadow-md">
        <div className="flex my-[0.5rem] ml-[1.5rem]">
          <div className="flex-2 mr-[1rem] mb-[0.5rem]">
            <p className="relative text-[#F15858] text-sm font-bold">
              Timesheet
            </p>
            <p className="relative text-[#F15858] text-sm font-bold">
              Management
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between bg-white shadow-sm">
        <div className="flex my-[0.5rem] ml-[1rem]">
          <div className="flex-2 my-[0.5rem] mr-[1rem]">
            <p className="relative text-gray-600 text-3xl font-bold">
              HH Timesheet
            </p>
          </div>
        </div>
        <div className="flex flex-row gap-4 ml-[2rem] mb-[0.5rem]">
          <button
            onClick={handleButtonClickHome}
            className="relative text-gray-400 font-semibold hover:underline hover:text-[#2775EC]"
          >
            Daftar Kegiatan
          </button>
          <button
            onClick={handleButtonClickLogin}
            className="relative text-gray-400 font-semibold hover:underline hover:text-[#2775EC]"
          >
            Pengaturan
          </button>
        </div>
      </div>
    </>
  );
};
