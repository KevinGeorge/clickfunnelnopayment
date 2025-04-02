
(function waitForCheckout() {
  if (typeof window.Checkout === 'undefined') {
    console.log("⏳ Checkout not ready, retrying...");
    return setTimeout(waitForCheckout, 500);
  }

  console.log("🚀 Auto-coupon + free checkout script started");

  // Instant visual hide while waiting
  const style = document.createElement('style');
  style.innerHTML = `
    [data-page-element="CheckoutMultiplePayments/V2"],
    iframe[src*="framepay.payments.ai"],
    .pai-billing-address-content,
    [data-page-element="Spinner/V1"] {
      visibility: hidden !important;
      opacity: 0 !important;
      height: 0 !important;
      overflow: hidden !important;
      pointer-events: none !important;
    }
  `;
  document.head.appendChild(style);
  console.log("💨 Applied instant CSS hide while loading");

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

  function hidePaymentElements() {
    const paymentBlock = document.querySelector('[data-page-element="CheckoutMultiplePayments/V2"]');
    if (paymentBlock && paymentBlock.parentNode) {
      paymentBlock.remove();
      console.log("💣 Removed entire payment block");
    }

    document.querySelectorAll('iframe[src*="framepay.payments.ai"]').forEach((iframe, i) => {
      iframe.remove();
      console.log(`💣 Removed framepay iframe #${i + 1}`);
    });

    const spinner = document.querySelector('[data-page-element="Spinner/V1"]');
    if (spinner) {
      spinner.remove();
      console.log("💣 Removed spinner");
    }

    const billing = document.querySelector('.pai-billing-address-content');
    if (billing) {
      billing.style.setProperty('display', 'none', 'important');
      console.log("🧼 Hidden billing address");
    }
  }

  function customizeSubmitButton() {
    const billingLabel = document.querySelector('.elBillingForm .elCheckoutFormLabel');
    if (billingLabel) billingLabel.innerText = "Address Information";

    const button = document.querySelector('[href="#submit-checkout-form"]');
    if (button) {
      const newButton = button.cloneNode(true);
      button.replaceWith(newButton);

      const label = newButton.querySelector('.elButtonMainText');
      if (label) label.innerText = "Get Instant Access";

      newButton.addEventListener('click', function (e) {
        e.preventDefault();
        console.log("🧼 Custom submit → bypassing validation");
        if (typeof CheckoutSubmit !== 'undefined') {
          CheckoutSubmit.customSubmitFromButtonClick(this, () => {
            console.log("✅ Custom submit completed successfully");
          });
        } else {
          console.warn("⚠️ CheckoutSubmit not available");
        }
      });
    }
  }

  let isFree = false;

  function makeItFree() {
    console.log("💸 Making checkout free — hiding payment");
    hidePaymentElements();
    customizeSubmitButton();
  }

  Checkout.store.summary.listen((newValue) => {
    if (newValue?.state === "ok" && newValue?.data?.total?.amount === 0) {
      isFree = true;
      setTimeout(() => makeItFree(), 10);
    }
  });

  Checkout.store.state.listen((state) => {
    if (Checkout.store?.coupons?.applied?.get && !Checkout.store.coupons.applied.get().length) {
      console.log("🔁 Reapplying coupon from state change");
      applyUrlCoupon();
    }
  });

  setInterval(() => {
    if (isFree) {
      hidePaymentElements();
    }
  }, 500);

  setTimeout(applyUrlCoupon, 1000);
})();

