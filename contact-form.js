(() => {
  const form = document.querySelector('#quote-form');
  if (!form) return;
  const button = form.querySelector('button[type="submit"]');
  const status = document.querySelector('#quote-status');
  const buttonText = button.textContent;
  let sending = false;

  function show(state, message) {
    form.dataset.state = state;
    status.textContent = message;
    status.hidden = !message;
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending || !form.reportValidity()) return;
    const payload = Object.fromEntries(new FormData(form));
    // Do not submit a filled spam trap or report a false success.
    if (payload._honey) {
      show('error', 'Não foi possível enviar. Entre em contato pelo WhatsApp ou e-mail ao lado.');
      return;
    }
    sending = true;
    button.disabled = true;
    button.textContent = 'ENVIANDO…';
    form.setAttribute('aria-busy', 'true');
    show('sending', 'Enviando sua solicitação…');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);
    try {
      const response = await fetch(form.dataset.endpoint, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      const result = await response.json();
      const needsActivation = /activat|confirm.*email|verify.*email/i.test(String(result.message || ''));
      if (needsActivation) {
        show('error', 'O formulário aguarda ativação pelo estúdio. Entre em contato pelo WhatsApp ou e-mail ao lado.');
      } else if (response.ok && (result.success === true || result.success === 'true')) {
        // Only the service's explicit positive response can enter this state.
        show('success', 'Solicitação enviada com sucesso. Em breve entraremos em contato.');
      } else {
        show('error', 'Não foi possível enviar sua solicitação. Tente novamente ou use o WhatsApp ou e-mail ao lado.');
      }
    } catch {
      // A timeout is indeterminate: do not claim delivery or retry automatically.
      show('error', 'Não foi possível confirmar o envio. Verifique sua conexão ou entre em contato pelo WhatsApp ou e-mail ao lado.');
    } finally {
      clearTimeout(timeout);
      sending = false;
      button.disabled = false;
      button.textContent = buttonText;
      form.setAttribute('aria-busy', 'false');
    }
  });
})();
