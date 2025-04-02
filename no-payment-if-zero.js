(function waitForCheckout() {
  if (typeof window.Checkout === 'undefined') {
    console.log("⏳ Checkout not ready, retrying...");
    return setTimeout(waitForCheckout, 500);
  }

  console.log("🚀 Auto-coupon + free checkout script started");

  function getUrlCoupon() {
    const params = new URLSearchParams(window.location.search);
    return params.get('coupon') || null;
  }

  function applyUrlCoupon() {
    const urlCoupon = getUrlCoupon();
    if (urlCoupon && window.Checkout && Checkout.store && Checkout.store.coupons && Checkout.store.coupons.currentCode) {
      console.log("🏷️ Applying coupon:", urlCoupon);
      Checkout.store.coupons.currentCode.set(urlCoupon);
      const onApplyCouponEvent = new CustomEvent("ON_APPLY_COUPON", {
        detail: { isCouponValidation: true }
      });
      window.dispatchEvent(onApplyCouponEvent);
    }
  }

  function makeItFree() {
    console.log("💸 Making checkout free — hiding payment");

    // 1. Cacher les modes de paiement ClickFunnels natifs
    document.querySelectorAll('[data-page-element="CheckoutMultiplePayments/V2"], [data-page-element="CheckoutSavedMultiplePayments/V1"]').forEach(el => {
      if (el && el.closest('.elCheckoutRow')) {
        el.closest('.elCheckoutRow').style.display = 'none';
        console.log("🔧 Hidden elCheckoutRow wrapper of payment element");
      }
    });

    // 2. Paiement Pai direct
    const paiSection = document.querySelector('.pai-payment-content');
    if (paiSection) {
      paiSection.style.display = 'none';
      console.log("🔧 Hidden .pai-payment-content");
    }

    const billing = document.querySelector('.pai-billing-address-content');
    if (billing) {
      billing.style.display = 'none';
      console.log("🔧 Hidden .pai-billing-address-content");
    }

    // 3. Modifier texte Billing → Address
    const billingLabel = document.querySelector('.elBillingForm .elCheckoutFormLabel');
    if (billingLabel) billingLabel.innerText = "Address Information";

    // 4. Remplacer le bouton de commande
    const button = document.querySelector('[href="#submit-checkout-form"]');
    if (button) {
      const newButton = button.cloneNode(true);
      button.replaceWith(newButton);

      const label = newButton.querySelector('.elButtonMainText');
      if (label) label.innerText = "Get Instant Access";

      newButton.addEventListener('click', function () {
        console.log("🧼 Submitting free checkout without payment...");
        CheckoutSubmit.customSubmitFromButtonClick(this, () => scrollToFirstVisibleError());
      });
    }
  }

  let isFree = false;
  Checkout.store.summary.listen((newValue) => {
    if (newValue && newValue.state === "ok" && newValue.data && newValue.data.total && newValue.data.total.amount === 0) {
      isFree = true;
      setTimeout(() => makeItFree(), 500);
    }
  });

  // Fallback toutes les 2s au cas où
  setInterval(() => {
    if (isFree) {
      const totalText = document.body.innerText;
      if (totalText.includes('$0.00')) {
        makeItFree();
      }
    }
  }, 2000);

  setTimeout(applyUrlCoupon, 1000);
})();
