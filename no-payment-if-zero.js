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
  const fullBlock = document.querySelector('[data-page-element="CheckoutMultiplePayments/V2"]');
  if (fullBlock) {
    fullBlock.style.setProperty('visibility', 'hidden', 'important');
    fullBlock.style.setProperty('height', '0', 'important');
    fullBlock.style.setProperty('overflow', 'hidden', 'important');
    fullBlock.style.setProperty('padding', '0', 'important');
    fullBlock.style.setProperty('margin', '0', 'important');
    console.log("🛑 Forced full block to disappear visually and structurally");
  }

  const framepayIframe = document.querySelector('iframe[src*="framepay.payments.ai"]');
  if (framepayIframe) {
    framepayIframe.style.setProperty('display', 'none', 'important');
    console.log("🛑 Hidden Framepay iframe with !important");
  }

  const billing = document.querySelector('.pai-billing-address-content');
  if (billing) {
    billing.style.setProperty('display', 'none', 'important');
    console.log("🛑 Hidden billing section with !important");
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
