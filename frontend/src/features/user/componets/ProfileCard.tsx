import { Link } from "react-router-dom";
import { useAppSelector } from "../../../hooks/useAppSelector";

const ProfileCard = () => {
  const { name } = useAppSelector((state) => state.auth);
  // name is Lijo N S like i want to lijo-n
  const modifiedName = name.toLocaleLowerCase().replace(/ /g, "-");
  console.log("modifiedName", modifiedName);
  return (
    <div className="w-64 bg-white shadow-lg rounded-lg p-4">
      <div className="flex flex-col items-center">
        <img
          className="w-24 h-24 rounded-full mb-4"
          src="https://via.placeholder.com/150"
          alt="Profile"
        />
        <h2 className="text-xl font-semibold">John Doe</h2>
        <p className="text-sm text-gray-500">Software Engineer</p>
        <div className="mt-4">
          <Link
            to={`/${modifiedName}`}
            className="text-green-500 hover:text-green-700"
          >
            View Profile
          </Link>
        </div>
        <div className="mt-2">
          <span className="text-sm text-gray-500">500+ Connections</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
