import LoginForm from "@/components/Forms/LoginForm";

const LoginPage = () => {
  return (
    <div
      className="hero min-h-screen"
      style={{
        backgroundImage: "url(images/volunteer.jpg)",
      }}
    >
      <div className="hero-overlay"></div>
      <div className="hero-content  text-center">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
