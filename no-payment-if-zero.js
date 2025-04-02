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
    if (urlCoupon && window.Checkout?.store?.coupons?.currentCode) {
      console.log("🏷️ Applying coupon:", urlCoupon);
      Checkout.store.coupons.currentCode.set(urlCoupon);

      const onApplyCouponEvent = new CustomEvent("ON_APPLY_COUPON", {
        detail: { isCouponValidation: true },
      });
      window.dispatchEvent(onApplyCouponEvent);
    }
  }

  function getFreeSubmitText() {
    return "Get Instant Access";
  }

  function getAddressText() {
    return "Address Information";
  }

function hidePaymentElements() {
  // Supprimer entièrement le bloc paiement
  const paymentBlock = document.querySelector('[data-page-element="CheckoutMultiplePayments/V2"]');
  if (paymentBlock && paymentBlock.parentNode) {
    paymentBlock.remove();
    console.log("💣 Removed entire payment block");
  }

  // Supprimer les iframes Pai manuellement si recréés
  document.querySelectorAll('iframe[src*="framepay.payments.ai"]').forEach((iframe, i) => {
    iframe.remove();
    console.log(`💣 Removed framepay iframe #${i + 1}`);
  });

  // Supprimer aussi la div spinner de loading Pai
  const spinner = document.querySelector('[data-page-element="Spinner/V1"]');
  if (spinner) {
    spinner.remove();
    console.log("💣 Removed spinner");
  }

  // Masquer adresse de facturation si encore là
  const billing = document.querySelector('.pai-billing-address-content');
  if (billing) {
    billing.style.setProperty('display', 'none', 'important');
    console.log("🧼 Hidden billing address");
  }
}

  function customizeSubmitButton() {
    const billingLabel = document.querySelector('.elBillingForm .elCheckoutFormLabel');
    if (billingLabel) billingLabel.innerText = getAddressText();

    const button = document.querySelector('[href="#submit-checkout-form"]');
    if (button) {
      const newButton = button.cloneNode(true);
      button.replaceWith(newButton);

      const label = newButton.querySelector('.elButtonMainText');
      if (label) label.innerText = getFreeSubmitText();

      newButton.addEventListener('click', function () {
        console.log("🧼 Submitting free checkout without payment...");
        CheckoutSubmit.customSubmitFromButtonClick(this, () => scrollToFirstVisibleError());
      });
    }
  }

  let isFree = false;

  function makeItFree() {
    console.log("💸 Making checkout free — hiding payment");
    hidePaymentElements();
    customizeSubmitButton();
  }

  // Listen for summary update
  Checkout.store.summary.listen((newValue) => {
    if (newValue?.state === "ok" && newValue?.data?.total?.amount === 0) {
      isFree = true;
      setTimeout(() => makeItFree(), 10);
    }
  });

  // Reapply coupon if store state resets
  Checkout.store.state.listen((state) => {
    if (Checkout.store?.coupons?.applied?.get && !Checkout.store.coupons.applied.get().length) {
      console.log("🔁 Coupon reapplied");
      applyUrlCoupon();
    }
  });

  // Rehide elements every 500ms if necessary
  setInterval(() => {
    if (isFree) {
      hidePaymentElements();
    }
  }, 500);

  setTimeout(applyUrlCoupon, 1000);
})();
