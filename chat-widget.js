/**
 * itsbkon.com AI Chat Widget
 * Self-contained — no framework, no build step.
 * Drop in chat-widget.js and add one <script> tag to index.html.
 *
 * SETUP: Replace the LAMBDA_URL value below with your AWS Lambda Function URL
 * from Part 6 of Phase2_Setup_Instructions.md
 */

(function () {
  'use strict';

  // ─── CONFIGURATION ────────────────────────────────────────────────────────
  const LAMBDA_URL = 'https://syo3rma7nezbbcbjkmwthly6ky0posal.lambda-url.us-east-1.on.aws/';
  // Example: 'https://xxxxxxxxxxxxxxxxxx.lambda-url.us-east-1.on.aws/'

  const MAX_HISTORY_TURNS = 8; // last N pairs sent to Lambda to cap cost

  const SUGGESTED_PROMPTS = [
    "What's his experience with payments at scale?",
    "Tell me about the SPI platform he built at NM",
    "How does he approach leading engineering teams?",
    "What was his scope at American Express?",
  ];

  // ─── CSS ──────────────────────────────────────────────────────────────────
  const CSS = `
    #bk-chat-bubble {
      position: fixed;
      bottom: 28px;
      right: 28px;
      z-index: 9000;
      display: flex;
      align-items: center;
      gap: 10px;
      background: #c9a84c;
      color: #0d1b2a;
      font-family: 'Inter', sans-serif;
      font-size: 0.875rem;
      font-weight: 700;
      padding: 0 20px 0 14px;
      height: 52px;
      border-radius: 26px;
      cursor: pointer;
      box-shadow: 0 4px 24px rgba(0,0,0,0.35);
      transition: background 0.2s, transform 0.2s;
      border: none;
      letter-spacing: 0.01em;
      user-select: none;
    }
    #bk-chat-bubble:hover {
      background: #e8c86a;
      transform: translateY(-2px);
    }
    #bk-chat-bubble svg {
      flex-shrink: 0;
    }

    #bk-chat-panel {
      position: fixed;
      bottom: 94px;
      right: 28px;
      z-index: 9000;
      width: 380px;
      height: 520px;
      background: #0d1b2a;
      border: 1px solid rgba(201,168,76,0.3);
      border-radius: 16px;
      box-shadow: 0 8px 40px rgba(0,0,0,0.5);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      font-family: 'Inter', sans-serif;
      transform-origin: bottom right;
      transition: opacity 0.18s ease, transform 0.18s ease;
    }
    #bk-chat-panel.bk-hidden {
      opacity: 0;
      transform: scale(0.92) translateY(12px);
      pointer-events: none;
    }

    #bk-chat-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px;
      background: #122236;
      border-bottom: 1px solid rgba(201,168,76,0.15);
      flex-shrink: 0;
    }
    #bk-chat-header-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    #bk-chat-avatar {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: rgba(201,168,76,0.15);
      border: 1.5px solid rgba(201,168,76,0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 800;
      color: #c9a84c;
      flex-shrink: 0;
    }
    #bk-chat-header-title {
      font-size: 0.875rem;
      font-weight: 700;
      color: #ffffff;
      line-height: 1.2;
    }
    #bk-chat-header-sub {
      font-size: 0.7rem;
      color: #8fa3bb;
      line-height: 1.2;
    }
    #bk-chat-close {
      background: rgba(255,255,255,0.06);
      border: none;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      color: #8fa3bb;
      font-size: 1rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s, color 0.2s;
      font-family: inherit;
      flex-shrink: 0;
    }
    #bk-chat-close:hover {
      background: rgba(255,255,255,0.12);
      color: #ffffff;
    }

    #bk-chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      scroll-behavior: smooth;
    }
    #bk-chat-messages::-webkit-scrollbar {
      width: 4px;
    }
    #bk-chat-messages::-webkit-scrollbar-track {
      background: transparent;
    }
    #bk-chat-messages::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.1);
      border-radius: 2px;
    }

    .bk-msg {
      display: flex;
      flex-direction: column;
      max-width: 86%;
      animation: bk-msg-in 0.16s ease;
    }
    @keyframes bk-msg-in {
      from { opacity: 0; transform: translateY(6px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .bk-msg-user {
      align-self: flex-end;
      align-items: flex-end;
    }
    .bk-msg-ai {
      align-self: flex-start;
      align-items: flex-start;
    }
    .bk-msg-bubble {
      padding: 10px 13px;
      border-radius: 12px;
      font-size: 0.845rem;
      line-height: 1.6;
      word-break: break-word;
    }
    .bk-msg-user .bk-msg-bubble {
      background: rgba(201,168,76,0.18);
      border: 1px solid rgba(201,168,76,0.3);
      color: #e8edf3;
      border-bottom-right-radius: 4px;
    }
    .bk-msg-ai .bk-msg-bubble {
      background: #1a3150;
      border: 1px solid rgba(255,255,255,0.07);
      color: #e8edf3;
      border-bottom-left-radius: 4px;
    }

    /* Suggested prompts */
    #bk-suggestions {
      padding: 0 16px 12px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      flex-shrink: 0;
    }
    #bk-suggestions-label {
      font-size: 0.68rem;
      color: #8fa3bb;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      margin-bottom: 2px;
    }
    .bk-suggestion-chip {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(201,168,76,0.2);
      color: #c9a84c;
      font-size: 0.78rem;
      font-weight: 500;
      padding: 7px 11px;
      border-radius: 8px;
      cursor: pointer;
      text-align: left;
      font-family: inherit;
      transition: background 0.15s, border-color 0.15s;
      line-height: 1.4;
    }
    .bk-suggestion-chip:hover {
      background: rgba(201,168,76,0.1);
      border-color: rgba(201,168,76,0.45);
    }

    /* Typing indicator */
    #bk-typing {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 10px 13px;
      background: #1a3150;
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 12px;
      border-bottom-left-radius: 4px;
      width: fit-content;
    }
    .bk-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #8fa3bb;
      animation: bk-bounce 1.2s infinite;
    }
    .bk-dot:nth-child(2) { animation-delay: 0.2s; }
    .bk-dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes bk-bounce {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
      30% { transform: translateY(-5px); opacity: 1; }
    }

    /* Input row */
    #bk-chat-input-row {
      display: flex;
      gap: 8px;
      padding: 12px 14px;
      border-top: 1px solid rgba(255,255,255,0.07);
      background: #0d1b2a;
      flex-shrink: 0;
    }
    #bk-chat-input {
      flex: 1;
      background: #122236;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 8px;
      color: #ffffff;
      font-family: inherit;
      font-size: 0.845rem;
      padding: 9px 12px;
      resize: none;
      outline: none;
      line-height: 1.45;
      min-height: 40px;
      max-height: 100px;
      transition: border-color 0.2s;
      overflow-y: auto;
    }
    #bk-chat-input::placeholder {
      color: #4d6478;
    }
    #bk-chat-input:focus {
      border-color: rgba(201,168,76,0.4);
    }
    #bk-chat-send {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background: #c9a84c;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: background 0.2s, transform 0.15s;
    }
    #bk-chat-send:hover:not(:disabled) {
      background: #e8c86a;
      transform: scale(1.05);
    }
    #bk-chat-send:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }
    #bk-chat-send svg {
      color: #0d1b2a;
    }

    /* Error message */
    .bk-error {
      font-size: 0.78rem;
      color: #ff7b7b;
      padding: 8px 12px;
      background: rgba(255,60,60,0.08);
      border: 1px solid rgba(255,60,60,0.2);
      border-radius: 8px;
      align-self: flex-start;
      max-width: 86%;
    }

    /* Mobile */
    @media (max-width: 480px) {
      #bk-chat-panel {
        right: 0;
        bottom: 0;
        width: 100vw;
        height: 75vh;
        border-radius: 20px 20px 0 0;
        border-left: none;
        border-right: none;
        border-bottom: none;
      }
      #bk-chat-bubble {
        right: 16px;
        bottom: 16px;
      }
    }
  `;

  // ─── INJECT STYLES ─────────────────────────────────────────────────────────
  const styleEl = document.createElement('style');
  styleEl.textContent = CSS;
  document.head.appendChild(styleEl);

  // ─── BUILD DOM ────────────────────────────────────────────────────────────

  // Chat bubble button
  const bubble = document.createElement('button');
  bubble.id = 'bk-chat-bubble';
  bubble.setAttribute('aria-label', 'Open chat assistant');
  bubble.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
    Ask about BK
  `;
  document.body.appendChild(bubble);

  // Chat panel
  const panel = document.createElement('div');
  panel.id = 'bk-chat-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Chat with BK\'s AI assistant');
  panel.classList.add('bk-hidden');
  panel.innerHTML = `
    <div id="bk-chat-header">
      <div id="bk-chat-header-left">
        <div id="bk-chat-avatar">BK</div>
        <div>
          <div id="bk-chat-header-title">Ask about Bharat</div>
          <div id="bk-chat-header-sub">AI assistant · Answers about BK's background</div>
        </div>
      </div>
      <button id="bk-chat-close" aria-label="Close chat">&#x2715;</button>
    </div>
    <div id="bk-chat-messages"></div>
    <div id="bk-suggestions">
      <div id="bk-suggestions-label">Try asking…</div>
    </div>
    <div id="bk-chat-input-row">
      <textarea
        id="bk-chat-input"
        placeholder="Ask anything about Bharat's background…"
        rows="1"
        aria-label="Your question"
      ></textarea>
      <button id="bk-chat-send" aria-label="Send message" disabled>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </button>
    </div>
  `;
  document.body.appendChild(panel);

  // Grab refs
  const messagesEl   = panel.querySelector('#bk-chat-messages');
  const suggestionsEl = panel.querySelector('#bk-suggestions');
  const inputEl      = panel.querySelector('#bk-chat-input');
  const sendBtn      = panel.querySelector('#bk-chat-send');
  const closeBtn     = panel.querySelector('#bk-chat-close');

  // ─── STATE ────────────────────────────────────────────────────────────────
  let isOpen = false;
  let isLoading = false;
  // Full conversation history stored in memory (never persisted)
  // Each entry: { role: 'user'|'assistant', content: string }
  const history = [];

  // ─── RENDER SUGGESTIONS ──────────────────────────────────────────────────
  SUGGESTED_PROMPTS.forEach(prompt => {
    const chip = document.createElement('button');
    chip.className = 'bk-suggestion-chip';
    chip.textContent = prompt;
    chip.addEventListener('click', () => {
      hideSuggestions();
      inputEl.value = prompt;
      sendMessage();
    });
    suggestionsEl.appendChild(chip);
  });

  function hideSuggestions() {
    suggestionsEl.style.display = 'none';
  }

  // ─── OPEN / CLOSE ─────────────────────────────────────────────────────────
  function openPanel() {
    isOpen = true;
    panel.classList.remove('bk-hidden');
    bubble.setAttribute('aria-expanded', 'true');
    setTimeout(() => inputEl.focus(), 180);
  }

  function closePanel() {
    isOpen = false;
    panel.classList.add('bk-hidden');
    bubble.setAttribute('aria-expanded', 'false');
  }

  bubble.addEventListener('click', () => isOpen ? closePanel() : openPanel());
  closeBtn.addEventListener('click', closePanel);

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isOpen) closePanel();
  });

  // ─── INPUT HANDLING ──────────────────────────────────────────────────────
  inputEl.addEventListener('input', () => {
    sendBtn.disabled = inputEl.value.trim().length === 0 || isLoading;
    // Auto-grow textarea
    inputEl.style.height = 'auto';
    inputEl.style.height = Math.min(inputEl.scrollHeight, 100) + 'px';
  });

  inputEl.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!sendBtn.disabled) sendMessage();
    }
  });

  sendBtn.addEventListener('click', sendMessage);

  // ─── RENDER A MESSAGE ─────────────────────────────────────────────────────
  function appendMessage(role, text) {
    const wrap = document.createElement('div');
    wrap.className = `bk-msg bk-msg-${role}`;

    const bubble = document.createElement('div');
    bubble.className = 'bk-msg-bubble';
    // Render line breaks; escape HTML to prevent XSS
    bubble.innerHTML = escapeHtml(text).replace(/\n/g, '<br>');

    wrap.appendChild(bubble);
    messagesEl.appendChild(wrap);
    scrollToBottom();
    return wrap;
  }

  function appendError(text) {
    const el = document.createElement('div');
    el.className = 'bk-error';
    el.textContent = text;
    messagesEl.appendChild(el);
    scrollToBottom();
  }

  function showTypingIndicator() {
    const wrap = document.createElement('div');
    wrap.className = 'bk-msg bk-msg-ai';
    wrap.id = 'bk-typing-wrap';
    wrap.innerHTML = `
      <div id="bk-typing">
        <div class="bk-dot"></div>
        <div class="bk-dot"></div>
        <div class="bk-dot"></div>
      </div>
    `;
    messagesEl.appendChild(wrap);
    scrollToBottom();
  }

  function hideTypingIndicator() {
    const el = document.getElementById('bk-typing-wrap');
    if (el) el.remove();
  }

  function scrollToBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // ─── SEND MESSAGE ─────────────────────────────────────────────────────────
  async function sendMessage() {
    const question = inputEl.value.trim();
    if (!question || isLoading) return;

    // Hide suggestions on first message
    hideSuggestions();

    // Clear input
    inputEl.value = '';
    inputEl.style.height = 'auto';
    sendBtn.disabled = true;
    isLoading = true;

    // Show user message
    appendMessage('user', question);

    // Add to history
    history.push({ role: 'user', content: question });

    // Show typing indicator
    showTypingIndicator();

    // Build the messages payload (last N turns to cap cost)
    const recentHistory = getRecentHistory();

    try {
      // Guard: warn in console if Lambda URL not configured
      if (LAMBDA_URL === 'YOUR_LAMBDA_FUNCTION_URL_HERE') {
        throw new Error('SETUP_NEEDED');
      }

      const res = await fetch(LAMBDA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: recentHistory }),
      });

      if (!res.ok) {
        const body = await res.text();
        throw new Error(`Lambda error ${res.status}: ${body}`);
      }

      const data = await res.json();
      const aiText = data.response || data.content || '';

      hideTypingIndicator();
      appendMessage('ai', aiText);
      history.push({ role: 'assistant', content: aiText });

    } catch (err) {
      hideTypingIndicator();

      if (err.message === 'SETUP_NEEDED') {
        appendError(
          'The chat assistant isn\'t connected yet — Lambda URL not configured. ' +
          'If you\'re Bharat, complete Part 6 of the setup instructions and update LAMBDA_URL in chat-widget.js.'
        );
      } else {
        console.error('[BK Chat]', err);
        appendError(
          'Something went wrong reaching the assistant. Please try again in a moment, ' +
          'or reach out directly at bharat.kondapalli@gmail.com'
        );
        // Remove the last user message from history since it didn't get a response
        history.pop();
      }
    } finally {
      isLoading = false;
      sendBtn.disabled = inputEl.value.trim().length === 0;
      inputEl.focus();
    }
  }

  // Returns last MAX_HISTORY_TURNS * 2 messages (user + assistant pairs)
  function getRecentHistory() {
    const maxMessages = MAX_HISTORY_TURNS * 2;
    return history.slice(-maxMessages);
  }

})();
