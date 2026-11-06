// Pasted into the page by the QA run: renders every view and reports elements that spill past the viewport
window.__qa = async function (views) {
  const out = {}, W = innerWidth;
  const scrollers = el => { for (let p = el.parentElement; p && p !== document.body && p !== document.documentElement; p = p.parentElement) { const cs = getComputedStyle(p); if (/(auto|scroll|hidden)/.test(cs.overflowX) && p.scrollWidth > p.clientWidth + 1) return true; } return false; };
  for (const v of views) {
    if (typeof S !== 'undefined' && S.data) { S.view = v; render(); }
    await new Promise(r => setTimeout(r, 450));
    const bad = [];
    if (document.documentElement.scrollWidth > W + 1) bad.push('PAGE scrollWidth ' + document.documentElement.scrollWidth);
    document.querySelectorAll('#root *, body > *').forEach(el => {
      const r = el.getBoundingClientRect(); if (!r.width || !r.height) return;
      if ((r.right > W + 1 || r.left < -1) && !scrollers(el) && getComputedStyle(el).position !== 'fixed') {
        const id = el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '');
        bad.push(id + ' [' + Math.round(r.left) + ',' + Math.round(r.right) + '] ' + (el.textContent || '').trim().slice(0, 30));
      }
    });
    const errs = (window.__errs || []).splice(0);
    out[v] = bad.slice(0, 8).concat(errs.map(e => 'ERR ' + e));
  }
  return out;
};
window.__errs = []; window.addEventListener('error', e => window.__errs.push(e.message));
