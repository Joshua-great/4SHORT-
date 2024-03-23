
function displayErrorMessage(message) {
    const errorMessageElement = document.getElementById('error-message');
    if (errorMessageElement) {
        errorMessageElement.textContent = message;
        errorMessageElement.style.display = 'block'; 
    }
}


function clearErrorMessage() {
    const errorMessageElement = document.getElementById('error-message');
    if (errorMessageElement) {
        errorMessageElement.textContent = ''; 
        errorMessageElement.style.display = 'none'; 
    }
}


displayErrorMessage("User not found");

clearErrorMessage();
