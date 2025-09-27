import SignupForm from "@/components/Forms/SignupForm";

const SignupPage = () => {
  return (
    <div
      className="hero min-h-screen"
      style={{
        backgroundImage: "url(images/volunteer2.jpg)",
      }}
    >
      <div className="hero-overlay"></div>
      <div className="hero-content  text-center">
        <SignupForm />
      </div>
    </div>
  );
};

export default SignupPage;
