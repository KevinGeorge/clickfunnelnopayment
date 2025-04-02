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

  function hidePaymentElements() {
    const fullPaymentBlock = document.querySelector('[data-page-element="CheckoutMultiplePayments/V2"]');
    if (fullPaymentBlock && fullPaymentBlock.style.display !== 'none') {
      fullPaymentBlock.style.display = 'none';
      console.log("🔧 Hidden full payment block again");
    }

    const billing = document.querySelector('.pai-billing-address-content');
    if (billing && billing.style.display !== 'none') {
      billing.style.display = 'none';
      console.log("🔧 Hidden billing section again");
    }
  }

  // 1. Apply hide now
  hidePaymentElements();

  // 2. Set up a MutationObserver to re-hide if CF rebuilds the DOM
  const targetNode = document.body;
  const observer = new MutationObserver(() => {
    hidePaymentElements();
  });

  observer.observe(targetNode, {
    childList: true,
    subtree: true
  });

  // 3. Change button + label
  const billingLabel = document.querySelector('.elBillingForm .elCheckoutFormLabel');
  if (billingLabel) billingLabel.innerText = "Address Information";

  const button = document.querySelector('[href=\"#submit-checkout-form\"]');
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
