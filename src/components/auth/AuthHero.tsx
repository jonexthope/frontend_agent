import { CartinLogo } from "@/components/common/CartinLogo";

const PILLS = [
  "Brief exécutif",
  "Alertes pays",
  "RFM & clients",
  "Données live",
] as const;

export function AuthHero() {
  return (
    <section className="auth-hero" aria-label="Présentation Cartin AI">
      <div className="auth-hero__grid" aria-hidden />
      <div className="auth-hero__glow" aria-hidden />
      <div className="auth-hero__glow auth-hero__glow--secondary" aria-hidden />

      <div className="auth-hero__brand">
        <div className="auth-hero__brand-mark">
          <CartinLogo width={124} />
        </div>
        <div className="auth-hero__brand-line">
          Assistant conversationnel · Cartin AI
        </div>
      </div>

      <div className="auth-hero__mid">
        <h1>
          Discutez avec vos <em>données Cartin</em>
        </h1>
        <p className="auth-hero__lead">
          Connectez-vous pour poser vos questions sur le CA, les pays, les
          clients et la logistique — dans une interface type ChatGPT.
        </p>

        <div className="auth-hero__preview" aria-hidden>
          <div className="auth-bubble-row auth-bubble-row--me">
            <div className="auth-mini-bubble">
              Quel est le CA HT ce mois vs M-1 ?
            </div>
          </div>
          <div className="auth-bubble-row">
            <div className="auth-mini-av">AI</div>
            <div className="auth-mini-bubble">
              CA HT 36,33 M€ · ▲ 3,3% vs M-1. La croissance est tirée par La
              Réunion et Maurice.
            </div>
          </div>
          <div className="auth-bubble-row">
            <div className="auth-mini-av">AI</div>
            <div className="auth-mini-bubble">
              <span className="auth-typing">
                <i />
                <i />
                <i />
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-hero__pills">
        {PILLS.map((pill) => (
          <span key={pill} className="auth-pill">
            {pill}
          </span>
        ))}
      </div>
    </section>
  );
}
