import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";

const Signup = () => {
  const navigate = useNavigate();

  const handleSignupSuccess = () => { 
    navigate("/login"); 
  };

  return <AuthForm type="signup" onLogin={handleSignupSuccess} />;
};

export default Signup;
