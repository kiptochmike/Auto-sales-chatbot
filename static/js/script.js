document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.querySelector('.chat-messages');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const userMessage = chatInput.value.trim();
        
        if (userMessage === '') {
            return; // Do nothing if input is empty
        }

        // Display user's message
        addMessage(userMessage, 'user');

        // Send the message to the server
        try {
            const response = await fetch('/query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query: userMessage })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            displayResult(result);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            displayError('An error occurred. Please try again later.');
        }

        // Clear input field
        chatInput.value = '';
    });

    function addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = `
            <p>${text}</p>
            <span class="timestamp">${getCurrentTime()}</span>
        `;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom
    }

    function displayResult(result) {
        const botMessage = result.message || 'No response from server';
        addMessage(botMessage, 'bot');
    }

    function displayError(message) {
        addMessage(message, 'bot');
    }

    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
});
