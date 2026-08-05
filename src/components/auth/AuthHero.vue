<script setup>
import CartinLogo from "@/components/common/CartinLogo.vue";

const PILLS = ["Brief exécutif", "Alertes pays", "RFM & clients", "Données live"];
</script>

<template>
  <section class="auth-hero" aria-label="Présentation Cartin AI">
    <div class="auth-hero__grid" aria-hidden />
    <div class="auth-hero__glow" aria-hidden />
    <div class="auth-hero__glow auth-hero__glow--secondary" aria-hidden />

    <div class="auth-hero__brand">
      <div class="auth-hero__brand-mark">
        <CartinLogo :width="124" />
      </div>
      <div class="auth-hero__brand-line">Assistant conversationnel · Cartin AI</div>
    </div>

    <div class="auth-hero__mid">
      <h1>Discutez avec vos <em>données Cartin</em></h1>
      <p class="auth-hero__lead">
        Connectez-vous pour poser vos questions sur le CA, les pays, les clients et la
        logistique — dans une interface type ChatGPT.
      </p>

      <div class="auth-hero__preview" aria-hidden>
        <div class="auth-bubble-row auth-bubble-row--me">
          <div class="auth-mini-bubble">Quel est le CA HT ce mois vs M-1 ?</div>
        </div>
        <div class="auth-bubble-row">
          <div class="auth-mini-av">AI</div>
          <div class="auth-mini-bubble">
            CA HT 36,33 M€ · ▲ 3,3% vs M-1. La croissance est tirée par La Réunion et
            Maurice.
          </div>
        </div>
        <div class="auth-bubble-row">
          <div class="auth-mini-av">AI</div>
          <div class="auth-mini-bubble">
            <span class="auth-typing"><i /><i /><i /></span>
          </div>
        </div>
      </div>
    </div>

    <div class="auth-hero__pills">
      <span v-for="pill in PILLS" :key="pill" class="auth-pill">{{ pill }}</span>
    </div>
  </section>
</template>
