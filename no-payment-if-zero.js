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
                detail: { isCouponValidation: true }
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

    function makeItFree() {
        console.log("💸 Making checkout free — hiding payment");

        document.querySelectorAll('[data-page-element="CheckoutMultiplePayments/V2"], [data-page-element="CheckoutSavedMultiplePayments/V1"]').forEach(el => {
            el?.closest('.elCheckoutRow')?.style.display = 'none';
        });

        const paiCardSection = document.querySelector('.pai-payment-content');
        if (paiCardSection) paiCardSection.style.display = 'none';

        const billingSection = document.querySelector('.pai-billing-address-content');
        if (billingSection) billingSection.style.display = 'none';

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
    Checkout.store.summary.listen((newValue) => {
        if (newValue?.state === "ok" && newValue?.data?.total?.amount === 0) {
            isFree = true;
            setTimeout(() => makeItFree(), 500);
        }
    });

    setInterval(() => {
        const totalText = document.body.innerText;
        const btn = document.querySelector('[href="#submit-checkout-form"] .elButtonMainText');
        if (isFree && totalText.includes('$0.00') && btn) {
            makeItFree();
        }
    }, 1000);

    setTimeout(applyUrlCoupon, 1000);
})();