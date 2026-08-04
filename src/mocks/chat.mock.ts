const REPLIES: Record<string, string> = {
  "CA HT ce mois vs M-1": `Voici la lecture **CA HT** (période courante vs M-1) :

[kpi]CA HT|36,33 M€|up 3,3%
[kpi]Panier moyen|84,2 €|up 1,1%
[kpi]Commandes|431 k|up 2,0%

**Points clés**
- La croissance est tirée par **La Réunion** et **Maurice**.
- **Côte d'Ivoire** freine le total (taux d'abandon élevé).
- Hors CI, la croissance serait plutôt autour de **+4,8%**.`,
  "Top 3 pays à risque": `Voici les **3 pays à surveiller** en priorité :

1. **Côte d'Ivoire** — abandon panier **75,5%**, impact CA estimé fort.
2. **Djibouti** — hausse des remboursements et délai moyen allongé.
3. **Guadeloupe** — conversion en baisse vs historique 90j.

**Action suggérée** : prioriser une campagne de relance panier sur CI + revue transporteur sur Djibouti.`,
  "Segment RFM Champions": `Segment **Champions** (RFM) :

[kpi]Clients|12,4 k
[kpi]CA part|41%
[kpi]Fréquence|4,8 / an
[kpi]Panier|112 €

Ils concentrent une part majeure du CA avec une rétention solide.

**Idée** : programme VIP + early access promotions sur les 3 prochaines semaines.`,
  "Brief exécutif du jour": `**Brief Cartin — aujourd'hui**

- CA HT en hausse modérée (**+3,3%** vs M-1).
- Point d'attention : **abandons CI** et **2 erreurs sync HubSpot** (24h).
- Opportunité : pousser le segment Champions via Brevo.
- Logistique : délai moyen stable, sauf Djibouti.

Priorité direction : **stopper la fuite CI** avant d'accélérer l'acquisition.`,
};

const FALLBACK = `Je peux vous aider sur le **pilotage Cartin** : CA, pays, clients RFM, produits, logistique, remboursements ou connecteurs.

Exemples :
- Quel est le panier moyen sur Maurice ?
- Pourquoi les remboursements montent ?
- Résume les alertes critiques`;

const ENTRIES = Object.entries(REPLIES);

export function getMockReply(question: string): string {
  const exact = REPLIES[question];
  if (exact) return exact;
  const lower = question.toLowerCase();
  const close = ENTRIES.find(([title]) =>
    lower.includes(title.toLowerCase().slice(0, 14)),
  );
  if (close) return close[1];
  if (/(ca|chiffre|panier|commande)/i.test(question)) return REPLIES["CA HT ce mois vs M-1"];
  if (/(pays|risque|abandon|ci)/i.test(question)) return REPLIES["Top 3 pays à risque"];
  if (/(rfm|champion|client)/i.test(question)) return REPLIES["Segment RFM Champions"];
  if (/(brief|synth[eè]se|direction)/i.test(question)) return REPLIES["Brief exécutif du jour"];
  return FALLBACK;
}
