import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";

const Login = ({ onLogin }: { onLogin: () => void }) => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    onLogin();
    navigate("/home"); 
  };

  return <AuthForm type="login" onLogin={handleLoginSuccess} />;
};

export default Login;

