import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfilePanel from "../components/ProfilePanel";

const Profile = () => {
  const navigate = useNavigate();

  // Redirect to home and show profile panel
  useEffect(() => {
    navigate("/home", { state: { openProfile: true } });
  }, [navigate]);

  return (
    <ProfilePanel isOpen={true} onClose={() => navigate("/home")} />
  );
};

export default Profile;
