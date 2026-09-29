import Icon from "./Icon";
export default function AuthIntro({ register = false }) {
  return (
    <aside className="auth-intro">
      <span className="eyebrow">PERSONAL GUIDANCE. REAL POSSIBILITIES.</span>
      <h1>
        {register ? (
          <>
            Great learning starts
            <br />
            with a human
            <br />
            <span>connection.</span>
          </>
        ) : (
          <>
            Your next chapter
            <br />
            starts with the
            <br />
            <span>right teacher.</span>
          </>
        )}
      </h1>
      <p>
        {register
          ? "For parents finding the right support. For tutors ready to make a difference. There’s a place for you here."
          : "Find your teacher, continue the conversation and stay close to what you’re learning."}
      </p>
      <div className="auth-benefits">
        <span>
          <Icon name="home" />
          At home or online
        </span>
        <span>
          <Icon name="spark" />
          Personalized with MeritAI
        </span>
        <span>
          <Icon name="message" />
          Connected through conversation
        </span>
      </div>
      <div className="auth-intro-note">
        <Icon name="leaf" size={18} />
        <span>Rooted in Ranchi. Made for meaningful learning.</span>
      </div>
    </aside>
  );
}
