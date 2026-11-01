// Google Analytics 4 with a consent banner (Google Consent Mode v2).
// Inactive until GA_ID is set. Analytics only loads after the visitor clicks "Accept";
// the choice is remembered in localStorage so the banner shows once.
(function () {
  var GA_ID = ''; // e.g. 'G-XXXXXXXXXX' from GA4 Admin > Data streams
  if (!GA_ID) return;

  var KEY = 'sj-consent';
  var choice = null;
  try { choice = localStorage.getItem(KEY); } catch (e) {}

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied' });

  function load() {
    gtag('consent', 'update', { analytics_storage: 'granted' });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
    // Track enquiry intent: WhatsApp, email and phone clicks.
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href]');
      if (!a) return;
      var h = a.getAttribute('href');
      var kind = /wa\.me/.test(h) ? 'whatsapp' : /^mailto:/.test(h) ? 'email' : /^tel:/.test(h) ? 'phone' : null;
      if (kind) gtag('event', 'contact_click', { method: kind });
    });
  }

  if (choice === 'yes') { load(); return; }
  if (choice === 'no') return;

  function banner() {
    var b = document.createElement('div');
    b.setAttribute('role', 'dialog');
    b.setAttribute('aria-label', 'Cookie consent');
    b.style.cssText = 'position:fixed;left:16px;right:16px;bottom:16px;z-index:200;max-width:560px;margin:0 auto;background:#0F0F0F;color:#fff;padding:18px 20px;display:flex;flex-wrap:wrap;gap:12px 16px;align-items:center;font-size:14px;line-height:1.5;box-shadow:0 8px 30px rgba(0,0,0,.25)';
    b.innerHTML = '<p style="margin:0;flex:1 1 260px">This site uses cookies to understand how visitors use it. <a href="privacy.html" style="color:#fff;text-decoration:underline">Privacy policy</a></p>' +
      '<div style="display:flex;gap:10px"><button type="button" data-c="no" style="background:transparent;color:#fff;border:1px solid rgba(255,255,255,.5);padding:10px 16px;cursor:pointer;font:inherit">Decline</button>' +
      '<button type="button" data-c="yes" style="background:#fff;color:#000;border:1px solid #fff;padding:10px 16px;cursor:pointer;font:inherit">Accept</button></div>';
    b.addEventListener('click', function (e) {
      var c = e.target.getAttribute && e.target.getAttribute('data-c');
      if (!c) return;
      try { localStorage.setItem(KEY, c); } catch (err) {}
      b.remove();
      if (c === 'yes') load();
    });
    document.body.appendChild(b);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', banner); else banner();
})();
