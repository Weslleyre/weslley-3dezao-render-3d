(() => {
  const dialog = document.querySelector('.sample-dialog');
  let opener;
  function imageFrame(sample, enlarged = false) {
    const frame = document.createElement('span');
    frame.className = 'sample-frame';
    const img = document.createElement('img');
    img.src = sample.src;
    img.loading = enlarged ? 'eager' : 'lazy';
    img.decoding = 'async';
    img.alt = sample.title + ' — ' + sample.detail;
    img.draggable = false;
    if (sample.crop) {
      const [x,y,w,h] = sample.crop;
      const size = Math.max(w,h);
      const crop = document.createElement('span');
      crop.className = 'sample-crop';
      crop.style.width = `${w/size*100}%`;
      crop.style.height = `${h/size*100}%`;
      img.style.width = `${sample.sourceWidth/w*100}%`;
      img.style.left = `${-x/w*100}%`;
      img.style.top = `${-y/h*100}%`;
      crop.append(img);
      frame.append(crop);
    } else {
      img.className = 'standalone-sample';
      if (sample.fit === 'cover') img.classList.add('sample-fill');
      frame.append(img);
    }
    return frame;
  }
  function openSample(sample, button) {
    opener = button;
    dialog.querySelector('.dialog-image').replaceChildren(imageFrame(sample, true));
    dialog.querySelector('h2').textContent = sample.title;
    dialog.querySelector('.dialog-description').textContent = sample.detail;
    dialog.showModal();
    document.body.classList.add('sample-open');
  }
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('sample-open');
    opener?.focus({preventScroll:true});
  });
  document.querySelectorAll('[data-catalog]').forEach(section => {
    const groups = [...window.serviceCatalog[section.dataset.catalog]].sort((a,b) =>
      a.title.localeCompare(b.title, 'pt-BR', {sensitivity:'base',numeric:true}));
    const options = section.querySelector('.service-options');
    function select(index) {
      const group = groups[index];
      [...options.children].forEach((button,i) => button.setAttribute('aria-pressed', String(i===index)));
      section.querySelector('.showcase-icon').src = group.icon;
      section.querySelector('.selected-title').textContent = group.title;
      section.querySelector('.selected-description').textContent = group.description;
      const samples = group.images.map(sample => {
        const figure = document.createElement('figure');
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'sample-button';
        button.setAttribute('aria-label', 'Ampliar '+sample.title);
        button.setAttribute('aria-haspopup','dialog');
        button.append(imageFrame(sample));
        button.addEventListener('click',() => openSample(sample,button));
        const caption = document.createElement('figcaption');
        const title = document.createElement('strong');
        title.textContent = sample.title;
        const detail = document.createElement('span');
        detail.textContent = sample.detail;
        caption.append(title,detail);
        figure.append(button,caption);
        return figure;
      });
      section.querySelector('.sample-grid').replaceChildren(...samples);
      if (!samples.length) {
        const grid = section.querySelector('.sample-grid');
        for (let i=0;i<3;i++) {
          const slot = document.createElement('span');
          slot.className = 'sample-pending';
          slot.setAttribute('aria-hidden','true');
          grid.append(slot);
        }
        const note = document.createElement('p');
        note.className = 'samples-pending-note';
        note.textContent = 'Amostras em breve';
        grid.append(note);
      }
    }
    groups.forEach((group,index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = group.title;
      button.addEventListener('click',() => select(index));
      options.append(button);
    });
    select(0);
  });
  // Reveal only after every group has initialized; failures retain the fallback.
  document.querySelectorAll('[data-catalog]').forEach(section => { section.hidden = false; });
  document.querySelector('#catalog-status').hidden = true;
})();
