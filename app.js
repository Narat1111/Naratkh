// ==========================================
// API Configuration
// ==========================================
const API_BASE_URL = 'https://api.mail.tm';
const USE_FAKE_MODE = true; // Set to false to use real Mail.tm API

// ==========================================
// State Management
// ==========================================
let currentAccount = null;
let currentToken = null;
let messagesPollingInterval = null;
let fakeMessages = [];
let fakeMessageIdCounter = 1;

// ==========================================
// DOM Elements
// ==========================================
const elements = {
    generateBtn: document.getElementById('generateBtn'),
    loadingState: document.getElementById('loadingState'),
    emailContent: document.getElementById('emailContent'),
    emailInput: document.getElementById('emailInput'),
    copyBtn: document.getElementById('copyBtn'),
    createdTime: document.getElementById('createdTime'),
    messageCount: document.getElementById('messageCount'),
    refreshBtn: document.getElementById('refreshBtn'),
    deleteBtn: document.getElementById('deleteBtn'),
    inboxSection: document.getElementById('inboxSection'),
    inboxList: document.getElementById('inboxList'),
    inboxBadge: document.getElementById('inboxBadge'),
    messageModal: document.getElementById('messageModal'),
    modalOverlay: document.getElementById('modalOverlay'),
    modalClose: document.getElementById('modalClose'),
    modalTitle: document.getElementById('modalTitle'),
    modalBody: document.getElementById('modalBody')
};

// ==========================================
// API Functions
// ==========================================
async function apiRequest(endpoint, options = {}) {
    try {
        const url = `${API_BASE_URL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (currentToken && !options.noAuth) {
            headers['Authorization'] = `Bearer ${currentToken}`;
        }

        const response = await fetch(url, {
            ...options,
            headers
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // For DELETE requests, there might be no content
        if (response.status === 204) {
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

async function getDomains() {
    const response = await apiRequest('/domains', { noAuth: true });
    return response['hydra:member'].filter(domain => domain.isActive && !domain.isPrivate);
}

async function createAccount(address, password) {
    return await apiRequest('/accounts', {
        method: 'POST',
        body: JSON.stringify({ address, password }),
        noAuth: true
    });
}

async function getToken(address, password) {
    return await apiRequest('/token', {
        method: 'POST',
        body: JSON.stringify({ address, password }),
        noAuth: true
    });
}

async function getMessages() {
    return await apiRequest('/messages');
}

async function getMessage(id) {
    return await apiRequest(`/messages/${id}`);
}

async function markMessageAsRead(id) {
    return await apiRequest(`/messages/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ seen: true })
    });
}

async function deleteAccount(id) {
    return await apiRequest(`/accounts/${id}`, {
        method: 'DELETE'
    });
}

// ==========================================
// Utility Functions
// ==========================================
function generateRandomString(length) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function generateRandomPassword() {
    return generateRandomString(16);
}

// ==========================================
// Fake Email Data Generators
// ==========================================
const fakeDomains = ['tempmail.com', 'quickmail.io', 'fastmail.dev', 'instamail.net'];
const fakeFromNames = [
    'Netflix', 'Amazon', 'PayPal', 'Google', 'Facebook', 'Twitter',
    'LinkedIn', 'GitHub', 'Spotify', 'Apple', 'Microsoft', 'Adobe',
    'Dropbox', 'Slack', 'Discord', 'Reddit', 'Instagram', 'TikTok',
    'John Smith', 'Sarah Johnson', 'Mike Williams', 'Emily Davis',
    'Support Team', 'Newsletter', 'No Reply', 'Notifications'
];

const fakeSubjects = [
    'Welcome to our service!',
    'Your verification code is 123456',
    'Password reset requested',
    'New login detected',
    'Your order has been shipped',
    'Special offer just for you - 50% OFF',
    'Weekly newsletter - Top stories',
    'Meeting reminder: Tomorrow at 2 PM',
    'Invoice #12345 - Payment received',
    'Account verification required',
    'Security alert: New device login',
    'Your subscription is expiring soon',
    'Congratulations! You won a prize',
    'Important update to our terms',
    'New comment on your post',
    'Someone mentioned you',
    'Your trial period ends in 3 days',
    'Exclusive deal - Limited time only'
];

const fakeMessageTemplates = [
    'Thank you for signing up! We\'re excited to have you on board. Click the link below to verify your email address and get started.',
    'Your verification code is: 123456. This code will expire in 10 minutes. Please do not share this code with anyone.',
    'We received a request to reset your password. If you didn\'t make this request, please ignore this email.',
    'We noticed a new login to your account from a device we don\'t recognize. If this was you, you can safely ignore this message.',
    'Great news! Your order #12345 has been shipped and is on its way. You can track your package using the link below.',
    'Don\'t miss out on our biggest sale of the year! Get up to 50% off on selected items. Limited time only!',
    'Here\'s your weekly roundup of the most popular stories and updates from our community.',
    'This is a friendly reminder about your upcoming meeting scheduled for tomorrow at 2 PM. Looking forward to seeing you there!',
    'Thank you for your payment. Your invoice #12345 has been processed successfully. A detailed receipt is attached.',
    'Please verify your account to continue using our services. Click the button below to complete the verification.',
    'We detected a login to your account from a new device. Location: New York, US. Time: 2 minutes ago.',
    'Your subscription will expire in 7 days. Renew now to keep enjoying premium features without interruption.',
    'Congratulations! You\'ve been selected as one of our lucky winners. Claim your prize now!',
    'We\'ve updated our terms of service and privacy policy. Please review the changes at your earliest convenience.',
    'Jane Doe commented on your post: "Great article! Thanks for sharing this valuable information."',
    'Michael Brown mentioned you in a comment: "Hey @john, you might find this interesting!"',
    'Your free trial will end in 3 days. Upgrade to premium to continue enjoying all features.',
    'Exclusive offer for our valued customers: Get 30% off your next purchase with code SAVE30.'
];

function generateFakeEmail() {
    const username = generateRandomString(10);
    const domain = fakeDomains[Math.floor(Math.random() * fakeDomains.length)];
    return `${username}@${domain}`;
}

function generateFakeMessage() {
    const fromName = fakeFromNames[Math.floor(Math.random() * fakeFromNames.length)];
    const subject = fakeSubjects[Math.floor(Math.random() * fakeSubjects.length)];
    const text = fakeMessages[Math.floor(Math.random() * fakeMessages.length)];

    return {
        id: `fake_${fakeMessageIdCounter++}`,
        from: {
            name: fromName,
            address: `${fromName.toLowerCase().replace(/\s+/g, '')}@${fakeDomains[Math.floor(Math.random() * fakeDomains.length)]}`
        },
        to: [{ address: currentAccount.address }],
        subject: subject,
        intro: text.substring(0, 100) + '...',
        text: text,
        html: [`<div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #333;">
            <h2 style="color: #667eea;">${subject}</h2>
            <p>${text}</p>
            <hr style="margin: 20px 0; border: 0; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px;">This is a simulated email for demonstration purposes.</p>
        </div>`],
        seen: false,
        createdAt: new Date().toISOString(),
        hasAttachments: Math.random() > 0.8,
        attachments: Math.random() > 0.8 ? [{ filename: 'document.pdf' }] : []
    };
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString();
}

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
        font-weight: 500;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function showLoading() {
    elements.loadingState.style.display = 'block';
    elements.emailContent.style.display = 'none';
}

function hideLoading() {
    elements.loadingState.style.display = 'none';
    elements.emailContent.style.display = 'block';
}

// ==========================================
// Email Generation
// ==========================================
async function generateEmail() {
    try {
        showLoading();
        elements.generateBtn.disabled = true;

        // Get available domains
        const domains = await getDomains();
        if (domains.length === 0) {
            throw new Error('No domains available');
        }

        // Generate random email
        const randomUser = generateRandomString(10);
        const randomDomain = domains[Math.floor(Math.random() * domains.length)];
        const emailAddress = `${randomUser}@${randomDomain.domain}`;
        const password = generateRandomPassword();

        // Create account
        const account = await createAccount(emailAddress, password);

        // Get authentication token
        const tokenResponse = await getToken(emailAddress, password);

        // Store credentials
        currentAccount = account;
        currentToken = tokenResponse.token;

        // Save to localStorage
        localStorage.setItem('tempmail_account', JSON.stringify({
            account,
            token: tokenResponse.token,
            password
        }));

        // Update UI
        updateEmailDisplay(account);
        showNotification('Temporary email generated successfully!');

        // Start polling for messages
        startMessagesPolling();

    } catch (error) {
        console.error('Error generating email:', error);
        showNotification('Failed to generate email. Please try again.', 'error');
        hideLoading();
    } finally {
        elements.generateBtn.disabled = false;
    }
}

function updateEmailDisplay(account) {
    hideLoading();

    elements.emailInput.value = account.address;
    elements.createdTime.textContent = formatDate(account.createdAt);
    elements.messageCount.textContent = '0';

    elements.refreshBtn.style.display = 'inline-flex';
    elements.deleteBtn.style.display = 'inline-flex';
    elements.inboxSection.style.display = 'block';
}

// ==========================================
// Messages Management
// ==========================================
async function refreshInbox() {
    if (!currentToken) return;

    try {
        elements.refreshBtn.disabled = true;

        const response = await getMessages();
        const messages = response['hydra:member'];

        updateMessageCount(messages.length);
        displayMessages(messages);

    } catch (error) {
        console.error('Error refreshing inbox:', error);
        showNotification('Failed to refresh inbox', 'error');
    } finally {
        elements.refreshBtn.disabled = false;
    }
}

function updateMessageCount(count) {
    elements.messageCount.textContent = count;
    elements.inboxBadge.textContent = `${count} message${count !== 1 ? 's' : ''}`;
}

function displayMessages(messages) {
    if (messages.length === 0) {
        elements.inboxList.innerHTML = `
            <div class="empty-state">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                    <circle cx="32" cy="32" r="30" stroke="currentColor" stroke-width="2" opacity="0.2"/>
                    <path d="M16 26l16 12 16-12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M16 26v20a2 2 0 002 2h28a2 2 0 002-2V26" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <h3>No messages yet</h3>
                <p>Your inbox is empty. Messages will appear here when you receive them.</p>
            </div>
        `;
        return;
    }

    elements.inboxList.innerHTML = messages.map(message => `
        <div class="message-item ${!message.seen ? 'unread' : ''}" data-message-id="${message.id}">
            <div class="message-header">
                <div class="message-from">${escapeHtml(message.from.name || message.from.address)}</div>
                <div class="message-time">${formatDate(message.createdAt)}</div>
            </div>
            <div class="message-subject">${escapeHtml(message.subject || 'No subject')}</div>
            <div class="message-intro">${escapeHtml(message.intro || '')}</div>
        </div>
    `).join('');

    // Add click handlers
    document.querySelectorAll('.message-item').forEach(item => {
        item.addEventListener('click', () => {
            const messageId = item.dataset.messageId;
            openMessage(messageId);
        });
    });
}

async function openMessage(messageId) {
    try {
        const message = await getMessage(messageId);

        // Mark as read
        if (!message.seen) {
            await markMessageAsRead(messageId);
        }

        displayMessageModal(message);

    } catch (error) {
        console.error('Error opening message:', error);
        showNotification('Failed to open message', 'error');
    }
}

function displayMessageModal(message) {
    elements.modalTitle.textContent = message.subject || 'No subject';

    const fromName = message.from.name || message.from.address;
    const toAddresses = message.to.map(t => t.address).join(', ');

    let htmlContent = '';
    if (message.html && message.html.length > 0) {
        htmlContent = `<iframe srcdoc="${escapeHtml(message.html[0])}" style="width: 100%; min-height: 400px; border: none; background: white; border-radius: 8px;"></iframe>`;
    } else {
        htmlContent = `<pre style="white-space: pre-wrap; word-wrap: break-word;">${escapeHtml(message.text)}</pre>`;
    }

    elements.modalBody.innerHTML = `
        <div class="message-detail-header">
            <div class="message-detail-field">
                <span class="message-detail-label">From:</span>
                <span class="message-detail-value">${escapeHtml(fromName)}</span>
            </div>
            <div class="message-detail-field">
                <span class="message-detail-label">To:</span>
                <span class="message-detail-value">${escapeHtml(toAddresses)}</span>
            </div>
            <div class="message-detail-field">
                <span class="message-detail-label">Date:</span>
                <span class="message-detail-value">${formatDate(message.createdAt)}</span>
            </div>
            ${message.hasAttachments ? `
                <div class="message-detail-field">
                    <span class="message-detail-label">Attachments:</span>
                    <span class="message-detail-value">${message.attachments.length} file(s)</span>
                </div>
            ` : ''}
        </div>
        <div class="message-detail-content">
            ${htmlContent}
        </div>
    `;

    elements.messageModal.classList.add('active');

    // Refresh inbox to update read status
    setTimeout(() => refreshInbox(), 500);
}

function closeModal() {
    elements.messageModal.classList.remove('active');
}

function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// ==========================================
// Polling
// ==========================================
function startMessagesPolling() {
    // Clear any existing interval
    if (messagesPollingInterval) {
        clearInterval(messagesPollingInterval);
    }

    // Initial refresh
    refreshInbox();

    // Poll every 5 seconds
    messagesPollingInterval = setInterval(() => {
        refreshInbox();
    }, 5000);
}

function stopMessagesPolling() {
    if (messagesPollingInterval) {
        clearInterval(messagesPollingInterval);
        messagesPollingInterval = null;
    }
}

// ==========================================
// Account Management
// ==========================================
async function deleteCurrentAccount() {
    if (!currentAccount) return;

    if (!confirm('Are you sure you want to delete this email account? This action cannot be undone.')) {
        return;
    }

    try {
        elements.deleteBtn.disabled = true;

        await deleteAccount(currentAccount.id);

        // Clear state
        currentAccount = null;
        currentToken = null;
        localStorage.removeItem('tempmail_account');

        // Stop polling
        stopMessagesPolling();

        // Reset UI
        showLoading();
        elements.refreshBtn.style.display = 'none';
        elements.deleteBtn.style.display = 'none';
        elements.inboxSection.style.display = 'none';

        showNotification('Email account deleted successfully');

    } catch (error) {
        console.error('Error deleting account:', error);
        showNotification('Failed to delete account', 'error');
        elements.deleteBtn.disabled = false;
    }
}

// ==========================================
// Copy to Clipboard
// ==========================================
async function copyToClipboard() {
    try {
        await navigator.clipboard.writeText(elements.emailInput.value);

        // Visual feedback
        const originalHTML = elements.copyBtn.innerHTML;
        elements.copyBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M16.667 5L7.5 14.167 3.333 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;

        showNotification('Email copied to clipboard!');

        setTimeout(() => {
            elements.copyBtn.innerHTML = originalHTML;
        }, 2000);

    } catch (error) {
        console.error('Failed to copy:', error);
        showNotification('Failed to copy to clipboard', 'error');
    }
}

// ==========================================
// Event Listeners
// ==========================================
elements.generateBtn.addEventListener('click', generateEmail);
elements.copyBtn.addEventListener('click', copyToClipboard);
elements.refreshBtn.addEventListener('click', refreshInbox);
elements.deleteBtn.addEventListener('click', deleteCurrentAccount);
elements.modalClose.addEventListener('click', closeModal);
elements.modalOverlay.addEventListener('click', closeModal);

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && elements.messageModal.classList.contains('active')) {
        closeModal();
    }
});

// ==========================================
// Initialization
// ==========================================
function init() {
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Check for saved account
    const savedData = localStorage.getItem('tempmail_account');
    if (savedData) {
        try {
            const { account, token } = JSON.parse(savedData);
            currentAccount = account;
            currentToken = token;
            updateEmailDisplay(account);
            startMessagesPolling();
        } catch (error) {
            console.error('Error restoring saved account:', error);
            localStorage.removeItem('tempmail_account');
        }
    }
}

// Start the application
init();
