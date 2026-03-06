document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const mainNav = document.querySelector('.main-nav');
  
  // ===== Hamburger + dropdown close =====
  if (hamburger && mainNav) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mainNav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    
    document.addEventListener('click', (e) => {
      if (e.target.closest('.copy-link')) return;
      if (e.target.closest('.copy-endpoint')) return;
      
      document.querySelectorAll('.dropdown-content').forEach(el =>
        el.classList.remove('show')
      );
      mainNav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  }
  
  // ===== Dropdown helper =====
  window.toggleDropdown = function(event, id) {
    event.stopPropagation();
    const dropdown = document.getElementById(id);
    document.querySelectorAll('.dropdown-content').forEach(el => {
      if (el !== dropdown) el.classList.remove('show');
    });
    if (dropdown) dropdown.classList.toggle('show');
  };
  
  // ===== Shared copy handler for .copy-endpoint =====
  const endpointButtons = document.querySelectorAll('.copy-endpoint');
  const toast = document.getElementById('copy-toast');
  
  function handleEndpointCopy(e) {
    e.stopPropagation();
    const btn = e.currentTarget;
    const url = btn.getAttribute('data-url');
    const message = btn.getAttribute('data-message') || 'Link copied!';
    
    const doToast = () => {
      if (!toast) return;
      toast.textContent = message;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
        toast.textContent = 'Link copied!';
      }, 1500);
    };
    
    const flashOnly = () => {
      btn.classList.remove('flash');
      void btn.offsetWidth;
      btn.classList.add('flash');
      // keep focus so the ring stays as your “last copied” marker
    };
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        doToast();
        flashOnly();
      }).catch(() => {
        doToast();
        flashOnly();
      });
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = url;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
      } catch (err) {
        // ignore
      }
      document.body.removeChild(textArea);
      doToast();
      flashOnly();
    }
  }
  
  endpointButtons.forEach(btn =>
    btn.addEventListener('click', handleEndpointCopy)
  );
});

// ===== Header copy button (page URL) =====
function copyCurrentUrl(e) {
  if (e) {
    e.stopPropagation();
    if (e.currentTarget) {
      e.currentTarget.blur();
    }
  }
  
  const btnEl = e?.currentTarget || document.querySelector('.copy-link');
  if (btnEl) {
    btnEl.classList.remove('flash');
    void btnEl.offsetWidth;
    btnEl.classList.add('flash');
  }
  
  const url = window.location.href;
  const toast = document.getElementById('copy-toast');
  
  const doToast = () => {
    if (!toast) return;
    toast.textContent = 'Link copied!';
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 1500);
  };
  
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(doToast).catch(doToast);
  } else {
    const textArea = document.createElement('textarea');
    textArea.value = url;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      // ignore
    }
    document.body.removeChild(textArea);
    doToast();
  }
}