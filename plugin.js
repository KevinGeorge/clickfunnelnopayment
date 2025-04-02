
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);

// <define:process>
var define_process_default;
var init_define_process = __esm({
  "<define:process>"() {
    define_process_default = { env: {
      NODE_ENV: "production",
      RAILS_ENV: "production"
    } };
  }
});



var renderedPath = () => {
  const renderedPage = document.cookie.split("; ").find((x) => x.match(/^cfhoy_rendered_page=/))?.split("=")[1];
  return renderedPage ?? window.location.pathname;
};
var renderedHref = (extraPath) => {
  const url = new URL(window.location.href);
  url.pathname = renderedPath() + (extraPath ?? "");
  return url.toString();
};

var isSavedAddress = (address) => {
  return address.id && !String(address.id).includes("no-id#");
};

async function sleepMs(timeMs) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeMs);
  });
}

//import { buildCustomFields, checkValidCustomFields, hasPhysicalProducts } from './checkout-utils'
function buildCustomFields() {
  const fields = {};
  document.querySelectorAll(
    "[type='custom_type'], select[data-custom-type], [type='custom_type'] [type='checkbox']"
  ).forEach((input) => {
    fields[input.name] = input.type === "checkbox" ? input.checked : input.value;
  });
  return fields;
}
function setupOrderSummaries(component) {
  const pageOrderSummaries = document.querySelector('[data-page-element="CheckoutOrderSummary/V1"].elCheckout');
  if (pageOrderSummaries) {
    component.getComponents("CheckoutOrderSummary/V1").forEach((c) => {
      c.element.style.display = "none";
    });
  }
}
function scrollToFirstVisibleError(el) {
  const $errorWrapper = el ? $(el) : $('[data-error-container="active"]:visible:first').closest("[data-error-wrapper]");
  const $checkoutFormError = $(".elCheckoutFormErrors:visible:first");
  if ($errorWrapper.length > 0) {
    $("html, body").stop(true, true).animate(
      {
        scrollTop: $errorWrapper.offset().top - 100
      },
      500
    );
  } else if ($checkoutFormError.length > 0) {
    $("html, body").stop(true, true).animate(
      {
        scrollTop: $checkoutFormError.offset().top - 100
      },
      500
    );
  }
}
var pageElementContexts = [
  { selector: '[data-page-element="ModalContainer/V1"]', context: "Modal" },
  { selector: '[data-page-element="ContentNode"]', context: "ContentNode" }
];
function getCheckoutContext(checkoutElement) {
  let found;
  pageElementContexts.find(({ selector }) => {
    found = checkoutElement.closest(selector);
    return found;
  });
  return found;
}
var phoneErrorMap = ["Invalid number", "Invalid country code", "Too short", "Too long", "Invalid number"];
var checkInputPatternValid = (input) => {
  const validityState = input.validity;
  const $inputParent = $(input).closest(".elFormItemWrapper");
  if (validityState.patternMismatch) {
    input.setCustomValidity("Contains invalid characters");
    input.reportValidity();
    $inputParent.removeClass("elInputValid");
    $inputParent.addClass("elInputError");
    return false;
  } else {
    $inputParent.removeClass("elInputError");
    $inputParent.addClass("elInputValid");
    return true;
  }
};
var checkEmailInputValid = (input) => {
  const re = /^(([^<>()[\]\.,;:#%\s@"]+(\.[^<>()[\]\.,;:#%\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const value = $(input).val();
  const parsedEmail = $.trim(value);
  const $inputParent = $(input).closest(".elFormItemWrapper");
  if (re.test(parsedEmail)) {
    $inputParent.removeClass("elInputError");
    $inputParent.addClass("elInputValid");
    return true;
  } else {
    $inputParent.removeClass("elInputValid");
    $inputParent.addClass("elInputError");
    return false;
  }
};
var resetInputErrors = (input) => {
  const $inputParent = $(input).closest(".elFormItemWrapper");
  const $status = $inputParent.find("[data-input-status-type]");
  $inputParent.removeClass("elInputError");
  $inputParent.css("border-color", "");
  $inputParent.css("border-width", "");
  $status.attr("data-input-status-type", "");
  $status.text("");
};
var resetErrorsAndCheckPhoneNumber = (input) => {
  resetInputErrors(input);
  const value = input.value.trim();
  if (value) {
    const $inputParent = $(input).closest(".elFormItemWrapper");
    const $status = $inputParent.find("[data-input-status-type]");
    if (input.iti && !input.iti.isValidNumber()) {
      const errorCode = input.iti.getValidationError();
      $inputParent.addClass("elInputError");
      $inputParent.removeClass("elInputValid");
      $status.attr("data-input-status-type", "error");
      $status.text(phoneErrorMap[errorCode]);
      return false;
    } else {
      resetInputErrors(input);
    }
  }
  return true;
};
var validateInput = (input, options = {}) => {
  const $input = $(input);
  const $inputParent = $input.closest(".elFormItemWrapper");
  const inputValue = $input.is("select") ? $input.find(":selected").attr("value") : $input.val();
  const inputName = $input.attr("name");
  const inputType = $input.attr("type");
  const inputPattern = $input.attr("pattern");
  if ($input.hasClass("required1") && inputType == "checkbox") {
    if ($input.is(":checked")) {
      $inputParent.removeClass("elInputError");
      $inputParent.addClass("elInputValid");
      return true;
    } else {
      $inputParent.removeClass("elInputValid");
      $inputParent.addClass("elInputError");
      return false;
    }
  } else if ($input.hasClass("required1") && inputValue == "" || inputValue == null || typeof inputValue == "undefined") {
    $inputParent.removeClass("elInputValid");
    $inputParent.addClass("elInputError");
    return false;
  } else {
    if (inputName == "email" || options.validateAsEmail) {
      return checkEmailInputValid(input);
    } else if (inputName == "phone_number") {
      if (resetErrorsAndCheckPhoneNumber(input)) {
        $inputParent.removeClass("elInputError");
        $inputParent.addClass("elInputValid");
        return true;
      } else {
        $inputParent.addClass("elInputError");
        $inputParent.removeClass("elInputValid");
        return false;
      }
    } else {
      if (inputPattern) {
        return checkInputPatternValid(input);
      } else {
        $inputParent.removeClass("elInputError");
        $inputParent.addClass("elInputValid");
        return true;
      }
    }
  }
};
function checkValidCustomFields(checkoutElement) {
  const contextElement = getCheckoutContext(checkoutElement);
  if (!contextElement) return true;
  contextElement.querySelectorAll(".elFormItemWrapper:not(.elCheckoutInput)").forEach((el) => {
    el.classList.remove("elInputError", "elInputWarning", "elInputValid");
  });
  const formItems = Array.from(
    contextElement.querySelectorAll(".elFormItem.required1:not(.elCheckoutInput .elFormItem.required1)")
  ).filter((input) => !!input.getAttribute("data-custom-type") || input.getAttribute("type") == "checkbox");
  const results = [];
  formItems.forEach((input) => {
    const result = validateInput(input);
    results.push(result);
    let thisInput = $(input);
    const parent = thisInput.parents(".elFormItemWrapper");
    thisInput = parent.length && parent.find(".inputHolder, .borderHolder, .elCheckbox").length ? parent.find(".inputHolder, .borderHolder, .elCheckbox") : thisInput;
    if (result) {
      thisInput.css("border-color", "#4a8920");
      thisInput.css("border-width", "3px");
    } else {
      thisInput.css("border-color", "#B91517");
      thisInput.css("border-width", "3px");
    }
  });
  return results.every((r) => !!r);
}

function hasPhysicalProducts(cart) {
  return cart.items.some(({ product_id, variant_id }) => {
    const product = globalThis.globalResourceData.productsById[product_id];
    const variant = globalThis.globalResourceData.variantsById[variant_id];
    let productType = variant?.product_type;
    productType = productType || product?.product_type;
    return productType == "physical";
  });
}


////////////////////////////////////

var _redirecTo, _threedsListenerEnabled, _formSubmitPayload, _CheckoutSubmit_static, leadSourceGenerator_fn, submitRebilly_fn, buildPaymentMethodDetails_fn, buildRegistrationDetails_fn, shouldIncludeRegistration_fn, buildAddressParams_fn, submitOrderAsync_fn, handleFormSubmitRedirect_fn, add3dsListener_fn;
var CheckoutSubmit = class {

  static submitFromButtonClick(submitButton, onValidationError) {
    __privateMethod(this, _CheckoutSubmit_static, add3dsListener_fn).call(this);
    const checkoutElement = submitButton.closest(".elCheckout");
    if (this.checkSubmitShowErrors({ skipFields: /* @__PURE__ */ new Set(["payment"]) }) && this.checkSubmitShowErrors({ onlyFields: /* @__PURE__ */ new Set(["payment"]) }) && globalThis.Checkout.utils.canSubmit() && checkValidCustomFields(checkoutElement)) {
      globalThis.Checkout.store.state.set(globalThis.Checkout.StoreStates.SUBMITTING);
      globalThis.Checkout.store.submitting.set({
        state: globalThis.Checkout.SubmittingStates.START
      });
      const isUpgradeDowngrade = globalThis.Checkout.store.checkout.mode.get() == globalThis.Checkout.CheckoutStates.UPGRADE_DOWNGRADE;
      const capturedPaymentMethodId = globalThis.Checkout.store.payment.id.get();
      const canSkipSubmitRebilly = isUpgradeDowngrade || capturedPaymentMethodId;
      if (canSkipSubmitRebilly) {
        const payload = this.buildPayloadFromStore({
          contact: globalThis.Checkout.store.contact.get(),
          turnstileToken: globalThis.Checkout.turnstileToken,
          shippingAddress: globalThis.Checkout.store.shipping.get(),
          billingAddress: globalThis.Checkout.store.billing.get(),
          paymentMethodDetails: __privateMethod(this, _CheckoutSubmit_static, buildPaymentMethodDetails_fn).call(this) ?? {},
          selectedShippingOption: globalThis.Checkout.store.shippingOption.get(),
          skipBillingAddress: globalThis.Checkout.utils.skipBillingAddress(globalThis.Checkout.store)
        });
        return this.submit(payload);
      } else {
        const paymentType = globalThis.Checkout.store.payment.type.get();
        if (paymentType == "payment-card") {
          return __privateMethod(this, _CheckoutSubmit_static, submitRebilly_fn).call(this, onValidationError).then((tokenData) => {
            globalThis.Checkout.store.payment[paymentType].token.set(tokenData.id);
            const payload = this.buildPayloadFromStore({
              contact: globalThis.Checkout.store.contact.get(),
              turnstileToken: globalThis.Checkout.turnstileToken,
              shippingAddress: globalThis.Checkout.store.shipping.get(),
              billingAddress: globalThis.Checkout.store.billing.get(),
              paymentMethodDetails: __privateMethod(this, _CheckoutSubmit_static, buildPaymentMethodDetails_fn).call(this) ?? {},
              selectedShippingOption: globalThis.Checkout.store.shippingOption.get(),
              skipBillingAddress: globalThis.Checkout.utils.skipBillingAddress(globalThis.Checkout.store)
            });
            return this.submit(payload);
          });
        } else {
          const payload = this.buildPayloadFromStore({
            contact: globalThis.Checkout.store.contact.get(),
            turnstileToken: globalThis.Checkout.turnstileToken,
            shippingAddress: globalThis.Checkout.store.shipping.get(),
            billingAddress: globalThis.Checkout.store.billing.get(),
            paymentMethodDetails: __privateMethod(this, _CheckoutSubmit_static, buildPaymentMethodDetails_fn).call(this) ?? {},
            selectedShippingOption: globalThis.Checkout.store.shippingOption.get(),
            skipBillingAddress: globalThis.Checkout.utils.skipBillingAddress(globalThis.Checkout.store)
          });
          return this.submit(payload);
        }
      }
    } else {
      onValidationError();
    }
  }

  static customSubmitFromButtonClick(submitButton, onValidationError) {
    __privateMethod(this, _CheckoutSubmit_static, add3dsListener_fn).call(this);
    const checkoutElement = submitButton.closest(".elCheckout");

    if (this.checkSubmitShowErrors({ skipFields: /* @__PURE__ */ new Set(["payment"]) }) && globalThis.Checkout.utils.canSubmit() && checkValidCustomFields(checkoutElement)) {

      globalThis.Checkout.store.state.set(globalThis.Checkout.StoreStates.SUBMITTING);
      globalThis.Checkout.store.submitting.set({
        state: globalThis.Checkout.SubmittingStates.START
      });

      const payload = this.buildPayloadFromStore({
        contact: globalThis.Checkout.store.contact.get(),
        turnstileToken: globalThis.Checkout.turnstileToken,
        shippingAddress: globalThis.Checkout.store.shipping.get(),
        billingAddress: globalThis.Checkout.store.billing.get(),
        paymentMethodDetails: {},
        selectedShippingOption: globalThis.Checkout.store.shippingOption.get(),
        skipBillingAddress: globalThis.Checkout.utils.skipBillingAddress(globalThis.Checkout.store)
      });
      if (!payload.purchase.order_id) {
        //delete payload.purchase.order_id
      };
      return this.submit(payload);

    } else {
      onValidationError();
    }
  }

  static checkSubmitShowErrors(options) {
    const { onlyFields, skipFields } = options ?? {};
    return Object.entries(globalThis.Checkout.computed.errorsByName).map(([name, computed2]) => {
      if (onlyFields && !onlyFields.has(name)) return true;
      if (skipFields && skipFields.has(name)) return true;
      globalThis.Checkout.store.showAllErrors[name].set(true);
      return !globalThis.Checkout.utils.hasErrors(computed2.get());
    }).every((v) => !!v);
  }
  static buildPayloadFromStore(payload) {
    const addressParams = __privateMethod(this, _CheckoutSubmit_static, buildAddressParams_fn).call(this, {
      billingAddress: payload.billingAddress,
      shippingAddress: payload.shippingAddress
    }, {
      skipBillingAddress: payload.skipBillingAddress
    }) ?? {};
    const paymentDetails = payload.paymentMethodDetails;
    const purchaseCartDetails = this.buildPurchaseCartDetails();
    const customFields = buildCustomFields();
    const contact = payload.contact;
    const couponCode = globalThis.Checkout.store.coupons.appliedCode.get();
    const couponData = couponCode ? { coupon_codes: [couponCode] } : {};
    const rebillyPayload = {
      // NOTE: Temp fix for FHL 2023
      ...customFields ? customFields : {},
      contact: {
        ...contact,
        ...addressParams.shipping ?? {}
      },
      turnstileToken: payload.turnstileToken,
      ...addressParams.billing ?? {},
      purchase: {
        ...couponData,
        ...purchaseCartDetails,
        ...paymentDetails,
        process_new_order: true
      }
    };
    if (__privateMethod(this, _CheckoutSubmit_static, shouldIncludeRegistration_fn).call(this)) rebillyPayload["registration"] = __privateMethod(this, _CheckoutSubmit_static, buildRegistrationDetails_fn).call(this);
    const selected_shipping_option = payload.selectedShippingOption;
    if (selected_shipping_option && Object.keys(selected_shipping_option).length > 1) {
      rebillyPayload.purchase.selected_shipping_option = selected_shipping_option;
    }
    if (__privateGet(this, _redirecTo)) {
      rebillyPayload.redirect_to = __privateGet(this, _redirecTo);
    }
    if (globalThis.straightforward_onboarding_flow_redirect_url) {
      rebillyPayload.straightforward_onboarding_flow_redirect_url = globalThis.straightforward_onboarding_flow_redirect_url;
    }
    return rebillyPayload;
  }
  static generateShippingOptionId(shippingOption) {
    return [shippingOption.description, shippingOption.amount_formatted].join("$");
  }
  static buildDigitalWalletTransactionData(summaryData, cart, shippingEnabled, shippingOptions) {
    const { line_items } = summaryData;
    const lineItems = line_items.map(({ price, description }, index) => {
      let label;
      if (line_items.length == cart.items.length) {
        const variantId = cart.items[index].variant_id;
        const variant = globalThis.Checkout.variantsById[variantId];
        label = variant.name;
      } else {
        label = description;
      }
      return {
        label,
        amount: price
      };
    });
    if (summaryData.tax?.amount > 0) {
      lineItems.push({
        label: "Taxes",
        amount: summaryData.tax.amount
      });
    }
    if (summaryData.shipping?.amount > 0) {
      lineItems.push({
        label: "Shipping",
        amount: summaryData.shipping.amount
      });
    }
    return {
      amount: summaryData.total.amount,
      lineItems,
      ...shippingEnabled ? {
        status: shippingOptions.length ? "success" : "fail",
        shippingOptions: shippingOptions.map((shippingOption) => ({
          id: this.generateShippingOptionId(shippingOption),
          label: shippingOption.description,
          description: "",
          amount: Number(shippingOption.amount.amount)
        }))
      } : {}
    };
  }
  static buildPurchaseCartDetails() {
    const checkoutCart = globalThis.Checkout.computed.checkoutCart.get();
    const lineItems = checkoutCart.items.map(
      ({ variant_id, price_id, line_item_id, quantity }) => {
        return {
          id: variant_id,
          quantity,
          price_id,
          ...line_item_id ? { line_item_id } : {}
        };
      }
    );
    return { order_id: checkoutCart.order_id, product_variants: lineItems };
  }
  static submit(payload) {
    if (localStorage.getItem("cf2:devtools:enabled")) {
      console.log("submitted data", payload);
    }
    globalThis.CFDispatchEvent(globalThis.CFEvents.FORM_SUBMITTED, payload);
    let timer = null;
    __privateMethod(this, _CheckoutSubmit_static, submitOrderAsync_fn).call(this, payload, 3, () => {
      clearInterval(timer);
      globalThis.Checkout.store.submitting.set({
        state: globalThis.Checkout.SubmittingStates.START
      });
    }, (sleepTime) => {
      let remainingSeconds = sleepTime / 1e3;
      clearInterval(timer);
      timer = setInterval(() => {
        remainingSeconds -= 1;
        globalThis.Checkout.store.submitting.set({
          state: globalThis.Checkout.SubmittingStates.WAITING_ON_QUEUE,
          remainingSeconds
        });
      }, 1e3);
    }).then((response) => {
      if (response.status == 422) {
        response.json().then((responseJSON) => {
          const errorDetails = responseJSON.error_details;
          let errorDetailsMessage = responseJSON.error;
          if (responseJSON.error_details && !!errorDetails?.length) {
            errorDetailsMessage = errorDetails.map((e) => e.graceful_message ?? e.message).join("</br>");
            const mode = globalThis.Checkout.store.checkout.mode.get();
            const isRetrieablePayment = mode == globalThis.Checkout.CheckoutStates.OTO && errorDetails.find((e) => e.source == "payment_gateway");
            if (isRetrieablePayment) {
              globalThis.Checkout.store.showAllErrors.payment.set(false);
              globalThis.Checkout.store.payment.id.set(null);
            }
          }
          globalThis.Checkout.store.submitting.set({
            state: globalThis.Checkout.SubmittingStates.ERROR,
            code: globalThis.Checkout.ErrorTypes.SERVER_ERROR_WITH_MESSAGE,
            message: errorDetailsMessage
          });
        });
      } else if (response.ok) {
        __privateSet(this, _formSubmitPayload, payload);
        globalThis.CFDispatchEvent(globalThis.CFEvents.FORM_SUBMITTED_OK, payload);
        if (response.headers.get("X-CF2-APPROVAL-URL")) {
          globalThis.Checkout.store.threeds.set({
            show: true,
            approvalUrl: response.headers.get("X-CF2-APPROVAL-URL")
          });
        } else {
          globalThis.Checkout.store.submitting.set({
            state: globalThis.Checkout.SubmittingStates.DONE
          });
          globalThis.Checkout.store.state.set(globalThis.Checkout.StoreStates.SUBMITTED);
          globalThis.CFDispatchEvent(globalThis.CFEvents.FORM_SUBMITTED_FINALIZED, payload);
          __privateMethod(this, _CheckoutSubmit_static, handleFormSubmitRedirect_fn).call(this, response, response.headers.get("Location"));
        }
      } else if (response.status >= 300 && response.status < 400) {
        globalThis.Checkout.store.submitting.set({
          state: globalThis.Checkout.SubmittingStates.DONE
        });
        globalThis.Checkout.store.state.set(globalThis.Checkout.StoreStates.SUBMITTED);
        globalThis.CFDispatchEvent(globalThis.CFEvents.FORM_SUBMITTED_FINALIZED, payload);
        __privateMethod(this, _CheckoutSubmit_static, handleFormSubmitRedirect_fn).call(this, response, response.headers.get("Location") ?? globalThis.location.href);
      } else if (response.status === 429) {
        clearInterval(timer);
        globalThis.Checkout.store.submitting.set({
          state: globalThis.Checkout.SubmittingStates.ERROR,
          code: globalThis.Checkout.ErrorTypes.EXCEEDED_MAX_RETRIES
        });
      } else {
        globalThis.Checkout.store.submitting.set({
          state: globalThis.Checkout.SubmittingStates.ERROR,
          code: globalThis.Checkout.ErrorTypes.UNHANDLED_SERVER_RESPONSE
        });
      }
    }).catch((err) => {
      console.error(err);
      clearInterval(timer);
      globalThis.Checkout.store.submitting.set({
        state: globalThis.Checkout.SubmittingStates.ERROR,
        code: globalThis.Checkout.ErrorTypes.SERVER_ERROR
      });
    });
  }
};
_redirecTo = new WeakMap();
_threedsListenerEnabled = new WeakMap();
_formSubmitPayload = new WeakMap();
_CheckoutSubmit_static = new WeakSet();
leadSourceGenerator_fn = function() {
  const DEFAULT_MAX_CHARS_LENGTH = 512;
  const leadQueryParamMapping = {
    utm_source: {
      name: "source"
    },
    utm_medium: {
      name: "medium"
    },
    utm_campaign: {
      name: "campaign"
    },
    utm_term: {
      name: "term"
    },
    utm_content: {
      name: "content"
    },
    affiliate: {},
    subAffiliate: {},
    clickId: {},
    salesAgent: {}
  };
  const params = new URLSearchParams(globalThis.location.search);
  return Array.from(params.keys()).reduce((acc, key) => {
    const mappedValue = leadQueryParamMapping[key];
    if (mappedValue) {
      const paramValue = params.get(key);
      const leadSourceName = mappedValue.name ?? key;
      acc[leadSourceName] = paramValue.substring(0, DEFAULT_MAX_CHARS_LENGTH);
    }
    return acc;
  }, {});
};
submitRebilly_fn = function(onValidationError) {
  const selectedPaymentMethod = globalThis.Checkout.store.payment.type.get();
  const Rebilly = globalThis.Rebilly;
  let extraData = {
    method: selectedPaymentMethod
  };
  const leadSource = __privateMethod(this, _CheckoutSubmit_static, leadSourceGenerator_fn).call(this);
  if (Object.keys(leadSource).length) {
    extraData = { ...extraData, leadSource };
  }
  const form = document.querySelector("#cfAR");
  const rebillyDataMapping = {
    firstName: "first_name",
    lastName: "last_name",
    emails: "email"
  };
  const rebillyFieldKeyMapping = {
    "paymentInstrument.cvv": "cvv"
  };
  Object.entries(rebillyDataMapping).forEach(([rebillyKey, dataKey]) => {
    const input = form.querySelector(`[data-rebilly="${rebillyKey}"]`);
    if (input) {
      input.value = globalThis.Checkout.store.contact.get()[dataKey];
    }
  });
  return Rebilly.createToken(form, extraData).catch((e) => {
    console.error(e);
    if (e.invalidFields && e.invalidFields.length) {
      e.invalidFields.forEach((error) => {
        const key = rebillyFieldKeyMapping[error.field];
        if (key) {
          const event = { valid: false, error: { message: error.message } };
          globalThis.Checkout.store.payment["payment-card"].events.setKey(key, event);
        }
      });
      globalThis.Checkout.store.submitting.set({
        state: globalThis.Checkout.SubmittingStates.ERROR,
        code: globalThis.Checkout.ErrorTypes.REBILLY_ERROR
      });
    } else {
      let message = e.message;
      if (e.details.length) {
        const details = e.details.join(" - ");
        message = `${message} - ${details}`;
      }
      globalThis.Checkout.store.submitting.set({
        state: globalThis.Checkout.SubmittingStates.ERROR,
        code: globalThis.Checkout.ErrorTypes.REBILLY_ERROR,
        message
      });
    }
    onValidationError(e);
  });
};
buildPaymentMethodDetails_fn = function() {
  const mode = globalThis.Checkout.store.checkout.mode.get();
  if (mode == globalThis.Checkout.CheckoutStates.UPGRADE_DOWNGRADE) return;
  const payment_method_type = globalThis.Checkout.store.payment.type.get();
  const rebilly_token = globalThis.Checkout.store.payment[payment_method_type].token.get();
  const payment_method_id = globalThis.Checkout.store.payment.id.get();
  if (payment_method_id) return { payment_method_id, rebilly_token: null };
  return {
    payment_method_id: null,
    payment_method_type,
    rebilly_token
  };
};
buildRegistrationDetails_fn = function() {
  return {
    calendar_event_id: document.getElementsByName("registration[calendar_event_id]")[0].value,
    occurs_at: document.getElementsByName("registration[occurs_at]")[0].value
  };
};
shouldIncludeRegistration_fn = function() {
  return document.getElementsByName("registration[calendar_event_id]")?.length > 0;
};
buildAddressParams_fn = function(addressParams, options) {
  const mode = globalThis.Checkout.store.checkout.mode.get();
  const billing = addressParams.billingAddress ?? {};
  const shipping = addressParams.shippingAddress ?? {};
  if (mode == globalThis.Checkout.CheckoutStates.UPGRADE_DOWNGRADE) {
    return;
  }
  let billing_address_attributes, physical_address_attributes;
  if (isSavedAddress(billing)) {
    billing_address_attributes = {
      id: billing.id
    };
  } else {
    billing_address_attributes = {
      address_one: billing.address,
      address_two: billing.address_2,
      city: billing.city,
      region_name: billing.state,
      country_id: billing.country,
      postal_code: billing.zip
    };
  }
  if (isSavedAddress(shipping)) {
    physical_address_attributes = {
      id: shipping.id
    };
  } else {
    physical_address_attributes = {
      address_one: shipping.address,
      address_two: shipping.address_2,
      city: shipping.city,
      region_name: shipping.state,
      country_id: shipping.country,
      postal_code: shipping.zip
    };
  }
  const checkoutCart = globalThis.Checkout.computed.checkoutCart.get();
  if (hasPhysicalProducts(checkoutCart)) {
    const billingSameAsShipping = globalThis.Checkout.store.billingSameAsShipping.get();
    if (options.skipBillingAddress) {
      return { shipping: { shipping_addresses_attributes: [{ physical_address_attributes }] } };
    }
    if (mode == globalThis.Checkout.CheckoutStates.OTO) {
      return {
        shipping: { shipping_addresses_attributes: [{ physical_address_attributes }] },
        billing: { billing_address_attributes, billing_same_as_shipping: false }
      };
    }
    if (billingSameAsShipping) {
      return {
        shipping: { shipping_addresses_attributes: [{ physical_address_attributes }] },
        billing: { billing_same_as_shipping: true }
      };
    } else {
      return {
        shipping: { shipping_addresses_attributes: [{ physical_address_attributes }] },
        billing: { billing_address_attributes, billing_same_as_shipping: false }
      };
    }
  } else {
    if (options.skipBillingAddress) return;
    return { billing: { billing_address_attributes } };
  }
};
submitOrderAsync_fn = async function(data, maxRetries = 3, onBeforeSubmit, onRetryAfter) {
  let response;
  for (let i = 0; i < maxRetries; i++) {
    onBeforeSubmit();
    response = await fetch(renderedHref(), {
      credentials: "same-origin",
      method: "post",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        "X-CF2-POST-TYPE": "submit"
      }
    }).then((res) => {
      if (res.status >= 500) {
        console.error(res);
        throw Error("500 error");
      }
      return res;
    });
    if (response.status === 429) {
      const sleepTime = parseInt(response.headers.get("Retry-After"));
      onRetryAfter(sleepTime);
      console.log(`Waiting on queue, retrying after ${sleepTime}`);
      await sleepMs(sleepTime);
    } else {
      break;
    }
  }
  return response;
};
handleFormSubmitRedirect_fn = async function(response, urlToRedirect) {
  const userRedirectSignInUrl = response.headers.get("X-CF2-USER-REDIRECT-URL");
  const signInToken = response.headers.get("X-CF2-USER-SIGN-IN-TOKEN");
  if (userRedirectSignInUrl && signInToken && globalThis.straightforward_onboarding_flow_enabled) {
    const shouldRedirectImmediately = globalThis.straightforward_onboarding_flow_redirect_url;
    if (shouldRedirectImmediately) {
      globalThis.location.href = userRedirectSignInUrl;
    } else {
      const MAX_WAIT_TIME = 120;
      let fetchedActiveWorkspace;
      const startTime = Date.now();
      while (true) {
        const currentTime = Date.now();
        const elapsedTime = (currentTime - startTime) / 1e3;
        if (elapsedTime > MAX_WAIT_TIME) {
          fetchedActiveWorkspace = false;
          break;
        }
        const meRequest = `https://accounts.${globalThis.cfRootDomain}/me.json?token=${encodeURIComponent(
          signInToken
        )}`;
        const response2 = await fetch(meRequest);
        if (response2.ok) {
          const responseJson = await response2.json();
          const team = responseJson.teams[0];
          const workspaceCreationStatus = team?.workspaces[0]?.creation_status;
          if (team?.subscription_status == "active" && workspaceCreationStatus == "install_finalized") {
            globalThis.location.href = userRedirectSignInUrl;
            fetchedActiveWorkspace = true;
            break;
          }
        }
        await new Promise((resolve) => setTimeout(resolve, 4e3));
      }
      if (!fetchedActiveWorkspace) globalThis.location.href = urlToRedirect;
    }
  } else {
    globalThis.location.href = urlToRedirect;
  }
};
add3dsListener_fn = function() {
  if (__privateGet(this, _threedsListenerEnabled)) return;
  __privateSet(this, _threedsListenerEnabled, true);
  globalThis.addEventListener("message", (event) => {
    if (event.data.sender == "CfOrderStatus") {
      const orderDetails = event.data.details;
      if (__privateGet(this, _redirecTo)) {
        orderDetails.redirect_to = __privateGet(this, _redirecTo);
      }
      if (globalThis.straightforward_onboarding_flow_redirect_url) {
        orderDetails.straightforward_onboarding_flow_redirect_url = globalThis.straightforward_onboarding_flow_redirect_url;
      }
      fetch(renderedHref(), {
        credentials: "same-origin",
        method: "post",
        body: JSON.stringify(orderDetails),
        headers: {
          "Content-Type": "application/json",
          "X-CF2-POST-TYPE": "submit"
        }
      }).then((response) => {
        if (orderDetails["orderResult"] == "declined") {
          globalThis.Checkout.store.submitting.set({
            state: globalThis.Checkout.SubmittingStates.ERROR,
            code: globalThis.Checkout.ErrorTypes.THREEDS_DECLINED_ERROR
          });
        } else {
          if (response.ok) {
            globalThis.Checkout.store.state.set(globalThis.Checkout.StoreStates.SUBMITTED);
            globalThis.CFDispatchEvent(globalThis.CFEvents.FORM_SUBMITTED_FINALIZED, __privateGet(this, _formSubmitPayload));
            __privateMethod(this, _CheckoutSubmit_static, handleFormSubmitRedirect_fn).call(this, response, response.headers.get("Location"));
          } else {
            response.json().then((r) => {
              globalThis.Checkout.store.submitting.set({
                state: globalThis.Checkout.SubmittingStates.ERROR,
                code: globalThis.Checkout.ErrorTypes.THREEDS_DECLINED_CUSTOM_ERROR,
                message: r.error
              });
            });
          }
        }
        globalThis.Checkout.store.threeds.set({
          show: false,
          approvalUrl: null
        });
      });
    }
  });
};
__privateAdd(CheckoutSubmit, _CheckoutSubmit_static);
__privateAdd(CheckoutSubmit, _redirecTo, document.querySelector('[href="#submit-checkout-form"]').getAttribute("data-on-submit-go-to"));
__privateAdd(CheckoutSubmit, _threedsListenerEnabled, false);
__privateAdd(CheckoutSubmit, _formSubmitPayload, null);


// The code above this line was basically extracted from the site
// except the `customSubmitFromButtonClick` method 
////////////////////////////////////


function getFreeSubmitText() {
  return "Get My Free Course!";
}

function getAddressText() {
  return "Address Information";
}

function getUrlCoupon() {
  let urlVariablePairStrings = window.location.search.substring(1).split("&");
  for (let i=0; i<urlVariablePairStrings.length; i++) {
    let uvps = urlVariablePairStrings[i];
    let [key, value] = uvps.split("=");
    if (key.toLowerCase() == "coupon" || key.toLowerCase() == "code") {
      return value;
    }
  }
  return null;
}

function makeItFree() {
  $('[data-page-element="CheckoutMultiplePayments/V2"], [data-page-element="CheckoutSavedMultiplePayments/V1"]').slideUp("slow").prev(".elCheckoutSeparator").slideUp("slow");
  $('[href="#submit-checkout-form"]').each(function() {
    $(this).replaceWith($(this).clone());
  });

  $('.elBillingForm .elCheckoutFormLabel').text(getAddressText());

  $('[href="#submit-checkout-form"]').click(function() {
    CheckoutSubmit.customSubmitFromButtonClick(this, () => scrollToFirstVisibleError())
  });
  $('[href="#submit-checkout-form"] .elButtonMainText').text(getFreeSubmitText());
};

let isFree = false;

Checkout.store.summary.listen((newValue) =>{
  if (newValue.state=="ok" && newValue?.data?.total?.amount===0) {
    isFree = true;
    setTimeout(function() {
      makeItFree();
    },10);
  }
});

function applyUrlCoupon() {
  let urlCoupon = getUrlCoupon();
  if (urlCoupon) {


    Checkout.store.coupons.currentCode.set(urlCoupon);

    const onApplyCouponEvent = new CustomEvent("ON_APPLY_COUPON", {
      detail: { isCouponValidation: true }
    });
    window.dispatchEvent(onApplyCouponEvent);
  }
}


applyUrlCoupon();

Checkout.store.state.listen(function(state) {
  //debugger;
  if (state == Checkout.StoreStates.FILLING_FORM) {
    //alert("got to fillin form");
    setTimeout(function() {
      applyUrlCoupon();
    },10);
  }
});

// Ugly hack
setInterval(function() {
  if (isFree && $('[href="#submit-checkout-form"] .elButtonMainText').text().toLowerCase().includes("complete")
    && Checkout.store.summary.get()?.state !== "waiting"
  ) {
    makeItFree();
  }
},500);



