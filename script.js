'use strict';

const chatContainer = document.getElementById('chat-container');
const chatInput = document.getElementById('chat-input');
const suggestedChips = document.getElementById('suggested-chips');

const responses = {
    'timeline': {
        text: "The election process follows a strict timeline to ensure fairness and accuracy. Here are the key phases:",
        cards: [
            { title: "Voter Registration Deadline", desc: "Usually 30 days before election day. Ensure your details are current." },
            { title: "Early Voting Period", desc: "Begins 15 days prior. Allows you to vote at your convenience." },
            { title: "Election Day", desc: "Polls open from 7 AM to 8 PM. This is the final day to cast your ballot." }
        ]
    },
    'register': {
        text: "Registering to vote is simple! You can do it online, by mail, or in person. Here is what you need to know:",
        steps: [
            "Verify your eligibility (Citizen, 18+ years old).",
            "Gather your ID (Driver's license or State ID).",
            "Submit your application online or at your local election office."
        ],
        action: "Check Registration Status"
    },
    'process': {
        text: "The voting process is designed to be secure and accessible. Here is a step-by-step guide for Election Day:",
        steps: [
            "Arrive at your designated polling station.",
            "Present your valid ID to the poll workers.",
            "Receive your ballot and proceed to a private voting booth.",
            "Mark your choices clearly.",
            "Cast your ballot in the secure scanner or box."
        ]
    },
    'default': {
        text: "I'm not entirely sure about that specific detail, but I can certainly help you with voter registration, understanding the election timeline, or explaining the voting process. Which of those would you like to explore?"
    }
};

function handleFormSubmit(event) {
    event.preventDefault();
    const message = chatInput.value.trim();
    if (message) {
        sendMessage(message);
    }
}

function handleQuickAction(action) {
    sendMessage(`I need help with: ${action}`);
}

function sendMessage(message) {
    // Hide suggested chips once conversation starts
    if (suggestedChips) {
        suggestedChips.style.display = 'none';
    }

    appendUserMessage(message);
    chatInput.value = '';
    
    // Simulate thinking
    showTypingIndicator();

    setTimeout(() => {
        removeTypingIndicator();
        processUserMessage(message);
    }, 1000);
}

function processUserMessage(message) {
    const lowerMessage = message.toLowerCase();
    let responseKey = 'default';

    if (lowerMessage.includes('time') || lowerMessage.includes('date') || lowerMessage.includes('when')) {
        responseKey = 'timeline';
    } else if (lowerMessage.includes('register') || lowerMessage.includes('status') || lowerMessage.includes('sign up')) {
        responseKey = 'register';
    } else if (lowerMessage.includes('process') || lowerMessage.includes('how to vote') || lowerMessage.includes('step')) {
        responseKey = 'process';
    }

    appendBotResponse(responses[responseKey]);
}

function appendUserMessage(message) {
    const msgHTML = `
        <div class="flex gap-sm max-w-[85%] self-end flex-row-reverse animate-fade-in-up">
            <div class="flex-shrink-0 w-8 h-8 rounded-full bg-primary-container flex items-center justify-center mt-1">
                <span class="material-symbols-outlined text-white text-sm" data-icon="person">person</span>
            </div>
            <div class="flex flex-col gap-xs items-end">
                <div class="bg-primary-container text-white p-md rounded-l-xl rounded-br-xl shadow-sm">
                    <p class="font-body-md">${escapeHTML(message)}</p>
                </div>
            </div>
        </div>
    `;
    chatContainer.insertAdjacentHTML('beforeend', msgHTML);
    scrollToBottom();
}

function appendBotResponse(data) {
    let contentHTML = `<p class="font-body-md text-on-surface">${data.text}</p>`;

    if (data.cards) {
        contentHTML += `<div class="mt-md flex flex-col gap-sm">`;
        data.cards.forEach(card => {
            contentHTML += `
                <div class="bg-white border border-outline-variant p-sm rounded-lg flex gap-sm items-start">
                    <span class="material-symbols-outlined text-secondary mt-1">event_available</span>
                    <div>
                        <h4 class="font-label-lg text-primary">${card.title}</h4>
                        <p class="text-sm text-on-surface-variant">${card.desc}</p>
                    </div>
                </div>
            `;
        });
        contentHTML += `</div>`;
    }

    if (data.steps) {
        contentHTML += `
            <div class="mt-md p-sm bg-white border-l-4 border-secondary flex flex-col gap-xs">
                <p class="font-label-lg text-primary">Steps to follow:</p>
                <ol class="list-decimal list-inside text-sm text-on-surface-variant space-y-1">
                    ${data.steps.map(step => `<li>${step}</li>`).join('')}
                </ol>
        `;
        if (data.action) {
            contentHTML += `<button class="mt-sm bg-primary text-white font-label-md py-sm rounded-lg hover:bg-primary-container transition-all">${data.action}</button>`;
        }
        contentHTML += `</div>`;
    }

    const msgHTML = `
        <div class="flex gap-sm max-w-[85%] animate-fade-in-up">
            <div class="flex-shrink-0 w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center mt-1">
                <span class="material-symbols-outlined text-white text-sm" data-icon="smart_toy">smart_toy</span>
            </div>
            <div class="flex flex-col gap-xs">
                <div class="bg-surface-container border border-outline-variant p-md rounded-r-xl rounded-bl-xl shadow-sm">
                    ${contentHTML}
                </div>
            </div>
        </div>
    `;
    
    chatContainer.insertAdjacentHTML('beforeend', msgHTML);
    scrollToBottom();
}

function showTypingIndicator() {
    const indicatorHTML = `
        <div id="typing-indicator" class="flex gap-sm max-w-[85%]">
            <div class="flex-shrink-0 w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center mt-1">
                <span class="material-symbols-outlined text-white text-sm" data-icon="smart_toy">smart_toy</span>
            </div>
            <div class="flex flex-col gap-xs">
                <div class="bg-surface-container border border-outline-variant px-md py-sm rounded-r-xl rounded-bl-xl shadow-sm flex items-center h-10">
                    <div class="typing-indicator">
                        <span></span><span></span><span></span>
                    </div>
                </div>
            </div>
        </div>
    `;
    chatContainer.insertAdjacentHTML('beforeend', indicatorHTML);
    scrollToBottom();
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}

function scrollToBottom() {
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function resetChat() {
    // Clear chat container except for the initial greeting and system message
    const messages = Array.from(chatContainer.children);
    messages.forEach((msg, index) => {
        if (index > 1 && msg.id !== 'suggested-chips') {
            msg.remove();
        }
    });
    
    if (suggestedChips) {
        suggestedChips.style.display = 'flex';
        // Move suggested chips back to the end
        chatContainer.appendChild(suggestedChips);
    }
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

// Add simple animation styles dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up {
        animation: fadeInUp 0.3s ease-out forwards;
    }
`;
document.head.appendChild(style);

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        responses,
        processUserMessage,
        escapeHTML
    };
}
