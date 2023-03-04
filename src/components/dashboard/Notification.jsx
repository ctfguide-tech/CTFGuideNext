import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullseye, faClock, faUser } from "@fortawesome/free-solid-svg-icons";

const Notification = ({ date, message, type }) => {
  const icon =
    type === "CHALLENGE" ? (
      <FontAwesomeIcon icon={faBullseye} className="h-5 w-5" />
    ) : type === "GENERAL" ? (
      <FontAwesomeIcon icon={faClock} className="h-5 w-5" />
    ) : type === "FRIEND" ? (
      <FontAwesomeIcon icon={faUser} className="h-5 w-5" />
    ) : null;

  return (
    <div style={{ backgroundColor: "#212121", color: "#F9FAFB" }} className="rounded-md px-4 py-3">
      <div className="flex items-center">
        <div className="flex-shrink-0">{icon}</div>
        <div className="ml-3">
          <p className="block text-sm font-medium text-gray-200">{date}</p>
          <p className="block text-sm font-medium text-gray-200">{message}</p>
        </div>
      </div>
    </div>
  );
};


export default Notification;
