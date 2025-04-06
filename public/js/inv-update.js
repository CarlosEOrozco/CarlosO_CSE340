// Enable submit button only when form data has changed
document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("updateForm");
    
    // Find the submit button (works for both button and input elements)
    const submitBtn = form.querySelector("button[type='submit'], input[type='submit']");
    
    // Initially disable the submit button
    submitBtn.disabled = true;
    
    // Enable the button when any form field changes
    form.addEventListener("change", function() {
        submitBtn.disabled = false;
    });
    
    // Also enable on 'input' event for text fields (more responsive)
    form.addEventListener("input", function() {
        submitBtn.disabled = false;
    });
    
    // Handle select elements specifically (in case change event doesn't fire)
    const selectElements = form.querySelectorAll("select");
    selectElements.forEach(select => {
        select.addEventListener("change", function() {
            submitBtn.disabled = false;
        });
    });
    
    // Extra safeguard to prevent submission if somehow button is still disabled
    form.addEventListener("submit", function(e) {
        if (submitBtn.disabled) {
            e.preventDefault();
        }
    });
});