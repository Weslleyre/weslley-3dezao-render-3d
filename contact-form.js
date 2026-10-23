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
    if (payload._gotcha) {
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
      // HTTP status is authoritative; a successful body may be empty or non-JSON.
      if (response.ok) {
        show('success', 'Solicitação enviada com sucesso. Em breve entraremos em contato.');
      } else if (response.status === 429) {
        show('error', 'Muitas solicitações em pouco tempo. Aguarde alguns minutos antes de tentar novamente.');
      } else if (response.status === 400 || response.status === 422) {
        show('error', 'Não foi possível validar sua solicitação. Confira os campos e tente novamente ou use o WhatsApp ou e-mail ao lado.');
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
