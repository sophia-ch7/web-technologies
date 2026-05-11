document.addEventListener("DOMContentLoaded", function () {
  const tabSignup = document.getElementById("tab-signup");
  const tabLogin = document.getElementById("tab-login");
  const formSignup = document.getElementById("form-signup");
  const formLogin = document.getElementById("form-login");

  function switchTab(activeTab, activeForm, inactiveTab, inactiveForm) {
    activeTab.classList.add("active");
    inactiveTab.classList.remove("active");
    activeForm.classList.add("active");
    inactiveForm.classList.remove("active");
  }

  tabSignup.addEventListener("click", () =>
    switchTab(tabSignup, formSignup, tabLogin, formLogin),
  );
  tabLogin.addEventListener("click", () =>
    switchTab(tabLogin, formLogin, tabSignup, formSignup),
  );

  document.querySelectorAll(".toggle-password").forEach((btn) => {
    btn.addEventListener("click", function () {
      const input = document.getElementById(this.getAttribute("data-target"));
      if (input.type === "password") {
        input.type = "text";
        this.textContent = "🙈";
      } else {
        input.type = "password";
        this.textContent = "👁️";
      }
    });
  });

  const countrySelect = document.getElementById("country");
  const citySelect = document.getElementById("city");

  const citiesData = {
    ukraine: [
      "Kyiv",
      "Lviv",
      "Odesa",
      "Kharkiv",
      "Dnipro",
      "Zaporizhzhia",
      "Vinnytsia",
      "Chernivtsi",
    ],
    poland: ["Warsaw", "Krakow", "Wroclaw", "Poznan", "Gdansk", "Lodz"],
    germany: [
      "Berlin",
      "Munich",
      "Hamburg",
      "Frankfurt",
      "Cologne",
      "Stuttgart",
    ],
    france: ["Paris", "Lyon", "Marseille", "Toulouse", "Nice", "Bordeaux"],
    usa: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Miami"],
    uk: [
      "London",
      "Manchester",
      "Birmingham",
      "Glasgow",
      "Liverpool",
      "Edinburgh",
    ],
    italy: ["Rome", "Milan", "Naples", "Turin", "Florence", "Venice"],
    spain: ["Madrid", "Barcelona", "Seville", "Valencia", "Bilbao", "Málaga"],
    czech: ["Prague", "Brno", "Ostrava", "Plzen", "Liberec"],
    slovakia: ["Bratislava", "Košice", "Prešov", "Žilina", "Nitra"],
    hungary: ["Budapest", "Debrecen", "Miskolc", "Pécs", "Győr"],
    romania: ["Bucharest", "Cluj-Napoca", "Timișoara", "Iași", "Brașov"],
    netherlands: [
      "Amsterdam",
      "Rotterdam",
      "The Hague",
      "Utrecht",
      "Eindhoven",
    ],
    sweden: ["Stockholm", "Gothenburg", "Malmö", "Uppsala", "Västerås"],
    canada: ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa"],
  };

  countrySelect.addEventListener("change", function () {
    citySelect.innerHTML =
      '<option value="" disabled selected>Select city</option>';

    citySelect.classList.remove("is-valid", "is-invalid");
    const cityWrap = citySelect.closest(".field-icon-wrap");
    if (cityWrap) {
      const si = cityWrap.querySelector(".status-icon");
      if (si) si.textContent = "";
    }
    citySelect
      .closest(".input-group")
      .querySelector(".error-message").textContent = "";

    if (this.value && citiesData[this.value]) {
      citySelect.disabled = false;
      citiesData[this.value].forEach((city) => {
        const opt = document.createElement("option");
        opt.value = city.toLowerCase().replace(/\s+/g, "-");
        opt.textContent = city;
        citySelect.appendChild(opt);
      });
    } else {
      citySelect.disabled = true;
    }
  });

  function showError(input, message) {
    const group = input.closest(".input-group");
    const errorEl = group.querySelector(".error-message");
    const wrap = input.closest(".field-icon-wrap");
    const si = wrap ? wrap.querySelector(".status-icon") : null;

    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    if (errorEl) errorEl.textContent = message;
    if (si) si.textContent = "✗";
    return false;
  }

  function showSuccess(input) {
    const group = input.closest(".input-group");
    const errorEl = group.querySelector(".error-message");
    const wrap = input.closest(".field-icon-wrap");
    const si = wrap ? wrap.querySelector(".status-icon") : null;

    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
    if (errorEl) errorEl.textContent = "";
    if (si) si.textContent = "✓";
    return true;
  }

  function clearValidationStatus(form) {
    form
      .querySelectorAll("input, select")
      .forEach((el) => el.classList.remove("is-valid", "is-invalid"));
    form
      .querySelectorAll(".error-message")
      .forEach((el) => (el.textContent = ""));
    form
      .querySelectorAll(".status-icon")
      .forEach((el) => (el.textContent = ""));

    const indicator = form.querySelector(".radio-border-indicator");
    if (indicator) indicator.classList.remove("radio-valid", "radio-invalid");
  }

  function checkLength(input, min, max, fieldName) {
    const val = input.value.trim();
    if (!val) return showError(input, `${fieldName} is required`);
    if (val.length < min || val.length > max)
      return showError(input, `${fieldName} must be ${min}–${max} characters`);
    return showSuccess(input);
  }

  function checkEmail(input) {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!input.value.trim()) return showError(input, "Email is required");
    if (!re.test(input.value.trim()))
      return showError(input, "Email is not valid");
    return showSuccess(input);
  }

  function checkPhone(input) {
    const re = /^\+380\d{9}$/;
    if (!input.value.trim()) return showError(input, "Phone is required");
    if (!re.test(input.value.trim()))
      return showError(input, "Format: +380XXXXXXXXX (12 digits total)");
    return showSuccess(input);
  }

  function checkAge(input) {
    if (!input.value.trim())
      return showError(input, "Date of birth is required");
    const dob = new Date(input.value);
    const today = new Date();
    if (dob > today)
      return showError(input, "Date of birth cannot be in the future");
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    if (age < 12) return showError(input, "You must be at least 12 years old");
    return showSuccess(input);
  }

  function checkPasswordsMatch(input1, input2) {
    if (!input2.value.trim())
      return showError(input2, "Please confirm your password");
    if (input1.value !== input2.value)
      return showError(input2, "Passwords do not match");
    return showSuccess(input2);
  }

  function checkRadio(radioName, form) {
    const radios = form.querySelectorAll(`input[name="${radioName}"]`);
    const isChecked = Array.from(radios).some((r) => r.checked);
    const group = document.getElementById("sex-group");
    const errorEl = group.querySelector(".error-message");
    const indicator = group.querySelector(".radio-border-indicator");

    if (!isChecked) {
      errorEl.textContent = "Please select your sex";
      indicator.classList.remove("radio-valid");
      indicator.classList.add("radio-invalid");
      return false;
    }
    errorEl.textContent = "";
    indicator.classList.remove("radio-invalid");
    indicator.classList.add("radio-valid");
    return true;
  }

  function checkSelect(input, fieldName) {
    if (!input.value) return showError(input, `Please select a ${fieldName}`);
    return showSuccess(input);
  }

  function checkRequired(input, fieldName) {
    if (!input.value.trim())
      return showError(input, `${fieldName} is required`);
    return showSuccess(input);
  }

  formSignup.addEventListener("submit", function (e) {
    e.preventDefault();

    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    const phone = document.getElementById("phone");
    const dateBirth = document.getElementById("dateBirth");
    const country = document.getElementById("country");
    const city = document.getElementById("city");

    let isValid = true;

    if (!checkLength(firstName, 3, 15, "First Name")) isValid = false;
    if (!checkLength(lastName, 3, 15, "Last Name")) isValid = false;
    if (!checkEmail(email)) isValid = false;
    if (!checkLength(password, 6, 128, "Password")) isValid = false;
    if (!checkPasswordsMatch(password, confirmPassword)) isValid = false;
    if (!checkPhone(phone)) isValid = false;
    if (!checkAge(dateBirth)) isValid = false;
    if (!checkRadio("sex", formSignup)) isValid = false;
    if (!checkSelect(country, "country")) isValid = false;
    if (!checkSelect(city, "city")) isValid = false;

    if (isValid) {
      const successDiv = document.getElementById("signup-success");
      successDiv.textContent =
        "🎉 Account successfully created! Redirecting to login...";

      formSignup.reset();
      clearValidationStatus(formSignup);
      citySelect.disabled = true;

      setTimeout(() => {
        successDiv.textContent = "";
        switchTab(tabLogin, formLogin, tabSignup, formSignup);
      }, 3000);
    }
  });

  formLogin.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("loginUsername");
    const password = document.getElementById("loginPassword");
    const remember = document.getElementById("rememberMe");

    let isValid = true;

    if (!checkRequired(username, "Username")) isValid = false;
    if (!checkLength(password, 6, 128, "Password")) isValid = false;

    if (isValid) {
      if (remember.checked) {
        localStorage.setItem("rememberedUsername", username.value.trim());
      } else {
        localStorage.removeItem("rememberedUsername");
      }

      const successDiv = document.getElementById("login-success");
      successDiv.textContent = `✅ Welcome back, ${username.value.trim()}! Login successful.`;

      formLogin.reset();
      clearValidationStatus(formLogin);

      setTimeout(() => {
        successDiv.textContent = "";
      }, 4000);
    }
  });

  const saved = localStorage.getItem("rememberedUsername");
  if (saved) {
    document.getElementById("loginUsername").value = saved;
    document.getElementById("rememberMe").checked = true;
  }
});
