(function () {
  "use strict";

  const form = document.querySelector("[data-apply-wizard]");

  if (!form) {
    return;
  }

  const steps = Array.from(form.querySelectorAll("[data-wizard-step]"));
  const tabs = Array.from(document.querySelectorAll("[data-wizard-tab]"));
  const progressFill = document.querySelector("[data-wizard-progress]");
  const progressText = document.querySelector("[data-wizard-count]");
  const previousButton = form.querySelector("[data-wizard-prev]");
  const nextButton = form.querySelector("[data-wizard-next]");
  const submitButton = form.querySelector("[data-wizard-submit]");
  const status = form.querySelector("[data-submit-status]");
  let currentStep = 0;
  let highestStep = 0;

  function setConditionalState() {
    const conditionals = Array.from(form.querySelectorAll("[data-show-if]"));

    conditionals.forEach(section => {
      const fieldName = section.dataset.showIf;
      const expectedValue = section.dataset.showValue;
      const controller = form.elements[`loan_application[${fieldName}]`];
      let currentValue = "";

      if (controller instanceof RadioNodeList) {
        currentValue = controller.value;
      } else if (controller) {
        currentValue = controller.value;
      }

      const shouldShow = currentValue === expectedValue;
      section.classList.toggle("apply-hidden", !shouldShow);
      section.querySelectorAll("input, select, textarea").forEach(field => {
        field.disabled = !shouldShow;
      });
    });
  }

  function visibleRequiredFields(step) {
    return Array.from(step.querySelectorAll("input, select, textarea")).filter(field => {
      return field.required && !field.disabled && field.offsetParent !== null;
    });
  }

  function validateStep(index) {
    setConditionalState();
    const requiredFields = visibleRequiredFields(steps[index]);
    const invalidField = requiredFields.find(field => !field.checkValidity());

    if (invalidField) {
      invalidField.reportValidity();
      invalidField.focus({ preventScroll: true });
      invalidField.scrollIntoView({ behavior: "smooth", block: "center" });
      return false;
    }

    return true;
  }

  function renderStep(index) {
    currentStep = Math.max(0, Math.min(index, steps.length - 1));

    steps.forEach((step, stepIndex) => {
      step.classList.toggle("is-active", stepIndex === currentStep);
      step.hidden = stepIndex !== currentStep;
    });

    tabs.forEach((tab, tabIndex) => {
      tab.classList.toggle("is-complete", tabIndex < currentStep);
      tab.setAttribute("aria-current", tabIndex === currentStep ? "step" : "false");
      tab.setAttribute("aria-disabled", tabIndex > highestStep ? "true" : "false");
    });

    const progress = ((currentStep + 1) / steps.length) * 100;
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `Step ${currentStep + 1} of ${steps.length}`;
    previousButton.hidden = currentStep === 0;
    nextButton.hidden = currentStep === steps.length - 1;
    submitButton.hidden = currentStep !== steps.length - 1;
    setConditionalState();
  }

  function goToStep(index) {
    if (index > highestStep) {
      return;
    }

    renderStep(index);
    form.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => goToStep(index));
  });

  nextButton.addEventListener("click", () => {
    if (validateStep(currentStep)) {
      highestStep = Math.max(highestStep, currentStep + 1);
      renderStep(currentStep + 1);
      form.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  previousButton.addEventListener("click", () => {
    renderStep(currentStep - 1);
    form.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  form.addEventListener("change", event => {
    if (event.target.matches("input, select, textarea")) {
      setConditionalState();
    }
  });

  form.addEventListener("submit", event => {
    event.preventDefault();

    if (!validateStep(currentStep)) {
      return;
    }

    const submissionEvent = new CustomEvent("ranch:application-submit", {
      detail: {
        formData: new FormData(form)
      }
    });

    form.dispatchEvent(submissionEvent);
    status.classList.add("is-visible");
    status.focus();
  });

  setConditionalState();
  renderStep(0);
})();
