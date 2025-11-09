const navToggle = document.querySelector(".mobile-menu-toggle");
const nav = document.querySelector(".nav");
const links = document.querySelectorAll(".nav__link");

const syncBodyScrollState = (isOpen) => {
    document.body.classList.toggle("nav-open", isOpen);
    navToggle?.setAttribute("aria-expanded", isOpen ? "true" : "false");
};

if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
        const nextState = !nav.classList.contains("is-open");
        nav.classList.toggle("is-open", nextState);
        syncBodyScrollState(nextState);
    });

    links.forEach((link) => {
        link.addEventListener("click", () => {
            if (nav.classList.contains("is-open")) {
                nav.classList.remove("is-open");
                syncBodyScrollState(false);
            }
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const current = window.location.pathname.split("/").pop() || "index.html";
    links.forEach((link) => {
        const href = link.getAttribute("href");
        if (href === current || (current === "" && href === "index.html")) {
            link.classList.add("is-active");
        }
    });

    const forms = document.querySelectorAll("form[data-gs-endpoint]");
    forms.forEach((form) => {
        const endpoint = form.dataset.gsEndpoint;
        const statusEl = form.querySelector("[data-form-status]");
        const submitButton = form.querySelector("button[type='submit']");

        form.addEventListener("submit", async (event) => {
            if (!endpoint) {
                return;
            }

            event.preventDefault();

            if (endpoint.includes("YOUR_SCRIPT_ID")) {
                if (statusEl) {
                    statusEl.textContent = "Update the Google Apps Script endpoint before submitting.";
                    statusEl.dataset.status = "error";
                }
                return;
            }

            const formData = new FormData(form);
            if (statusEl) {
                statusEl.textContent = "Transmitting…";
                statusEl.dataset.status = "pending";
            }
            if (submitButton) {
                submitButton.disabled = true;
            }

            try {
                const response = await fetch(endpoint, {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error(`Request failed with status ${response.status}`);
                }

                if (statusEl) {
                    statusEl.textContent = "Thank you. We’ll respond shortly.";
                    statusEl.dataset.status = "success";
                }
                form.reset();
            } catch (error) {
                if (statusEl) {
                    statusEl.textContent = "Unable to transmit. Please retry or email raskbindx@gmail.com.";
                    statusEl.dataset.status = "error";
                }
                console.error("Form submission error", error);
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                }
            }
        });
    });
});

