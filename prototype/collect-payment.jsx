
/* ============================================================
   COLLECT PAYMENT — interactive prototype (React)
   Split a due amount across Cash + Other method, capture photo
   proof (up to 4 each), validate, review, and complete.
   ============================================================ */
(function () {
  'use strict';
  const { useState, useRef, useEffect } = React;
  const DUE = 500;
  const CUR = 'SAR';
  const fmt = (n) => Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  /* ---------- icons ---------- */
  const Ic = {
    back: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7"/></svg>,
    bell: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><circle cx="12" cy="12" r="9"/><path d="M9.2 9.3a2.8 2.8 0 0 1 5.4 1c0 1.9-2.8 2.5-2.8 2.5" strokeLinecap="round"/><circle cx="11.9" cy="17" r="0.4" fill="currentColor" stroke="none"/></svg>,
    info: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><circle cx="12" cy="12" r="9"/><line x1="12" y1="11" x2="12" y2="16"/><circle cx="12" cy="7.6" r="0.6" fill="currentColor"/></svg>,
    chev: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>,
    cash: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/></svg>,
    card: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="5" width="20" height="14" rx="2.5"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
    bank: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10h18M5 10v8M19 10v8M9 10v8M15 10v8M3 18h18M12 3L3 7h18z"/></svg>,
    online: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="2" width="12" height="20" rx="3"/><line x1="11" y1="18" x2="13" y2="18"/></svg>,
    attach: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8a2 2 0 0 1 2-2h2l1.4-1.6h7L19 6h0a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="12.5" r="3.4"/></svg>,
    plus: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="6" x2="12" y2="18"/><line x1="6" y1="12" x2="18" y2="12"/></svg>,
    x: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>,
    tick: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>,
    arrow: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>,
    camBig: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 8a2 2 0 0 1 2-2h2l1.4-1.6h7L19 6h0a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="12.5" r="3.6"/></svg>,
    sealTick: <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>,
    sealClock: <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/></svg>,
    coins: <svg viewBox="0 0 120 120" fill="none" stroke="#fff" strokeWidth="3"><ellipse cx="60" cy="34" rx="34" ry="14"/><path d="M26 34v16c0 7.7 15.2 14 34 14s34-6.3 34-14V34"/><path d="M26 50v16c0 7.7 15.2 14 34 14s34-6.3 34-14V50"/></svg>,
  };

  const METHODS = [
    { id: 'Credit / Debit Card', icon: Ic.card },
    { id: 'Bank Transfer', icon: Ic.bank },
    { id: 'Online Payment', icon: Ic.online },
  ];
  const methodIcon = (id) => (METHODS.find((m) => m.id === id) || {}).icon || Ic.card;
  const SHORT = { 'Credit / Debit Card': 'Card', 'Bank Transfer': 'Bank', 'Online Payment': 'Online' };
  const shortLabel = (id) => SHORT[id] || id;
  const proofKind = (method) => (method === 'Credit / Debit Card' ? 'card' : 'online');

  /* ---------- captured-proof thumbnail (looks like a real photo) ---------- */
  function Shot({ kind }) {
    return (
      <div className={'shot shot--' + kind}>
        <div className="shot__photo" aria-hidden="true">
          <span className="shot__sheen" />
          <span className="shot__doc" />
        </div>
        <span className="shot__type">{kind === 'cash' ? Ic.cash : kind === 'card' ? Ic.card : Ic.online}</span>
      </div>
    );
  }

  /* ---------- amount field ---------- */
  function AmountField({ value, onChange, placeholder, disabled, error, autoFocus }) {
    const [focus, setFocus] = useState(false);
    const cls = 'amount' + (focus ? ' is-focus' : '') + (disabled ? ' is-disabled' : '') + (error ? ' is-error' : '');
    return (
      <div className={cls}>
        <input
          inputMode="decimal" type="text" value={value} disabled={disabled} autoFocus={autoFocus}
          placeholder={placeholder || '0.00'}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          onChange={(e) => { const v = e.target.value.replace(/[^0-9.]/g, ''); onChange(v); }}
        />
        <span className="cur">{CUR}</span>
      </div>
    );
  }

  /* ---------- method select ---------- */
  function MethodSelect({ value, onChange, disabled }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
      function out(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
      document.addEventListener('pointerdown', out);
      return () => document.removeEventListener('pointerdown', out);
    }, []);
    const cls = 'select' + (!value ? ' is-placeholder' : '') + (open ? ' is-open' : '');
    return (
      <div className={cls} ref={ref} onClick={() => !disabled && setOpen((o) => !o)} style={disabled ? { opacity: .6, pointerEvents: 'none' } : null}>
        {value ? <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{methodIcon(value)}<span style={{ fontSize: 12.5 }}>{shortLabel(value)}</span></span> : <span>Payment Via</span>}
        <span className="cv">{Ic.chev}</span>
        {open && (
          <div className="select__menu" onClick={(e) => e.stopPropagation()}>
            {METHODS.map((m) => (
              <div key={m.id} className={'select__opt' + (m.id === value ? ' is-sel' : '')}
                   onClick={() => { onChange(m.id); setOpen(false); }}>
                {m.icon}<span>{m.id}</span>
                {m.id === value && <span style={{ marginLeft: 'auto', color: 'var(--indigo)' }}>{Ic.tick}</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  /* ---------- proof row ---------- */
  function ProofRow({ proofs, kind, onAdd, onRemove }) {
    return (
      <div>
        <div className="proofs">
          {proofs.map((p, i) => (
            <div className="proof" key={p.id}>
              <button className="proof__rm" onClick={() => onRemove(i)} aria-label="Remove">{Ic.x}</button>
              <Shot kind={p.kind} />
            </div>
          ))}
          {proofs.length < 4 && (
            <button className="proof-add" onClick={onAdd} aria-label="Add proof">{Ic.plus}</button>
          )}
        </div>
        <div className="proofs__hint" style={{ marginTop: 8 }}>Up to 4 photos</div>
      </div>
    );
  }

  /* ---------- bottom sheet ---------- */
  function Sheet({ icon, title, body, onClose }) {
    return (
      <div className="overlay">
        <div className="scrim" onClick={onClose} />
        <div className="sheet">
          <div className="sheet__grip" />
          <div className="sheet__ic">{icon}</div>
          <div className="sheet__h">{title}</div>
          <div className="sheet__b">{body}</div>
          <button className="btn" onClick={onClose}>Okay, got it</button>
        </div>
      </div>
    );
  }

  /* ---------- camera overlay ---------- */
  function Camera({ label, kind, count, onClose, onCapture }) {
    const [flash, setFlash] = useState(false);
    const shoot = () => {
      setFlash(true);
      setTimeout(() => { onCapture(); setFlash(false); }, 360);
    };
    return (
      <div className="overlay">
        <div className="camera">
          <div className="camera__bar"><span className="camera__bar-ic">{Ic.attach}</span> Proof of Payment <small>{label}</small></div>
          <div className="camera__view">
            <div className="camera__grid" />
            <div className="camera__corners"><i /></div>
            <div className="camera__subject">
              <span className="ic">{Ic.camBig}</span>
              <span className="t">Frame the {kind === 'cash' ? 'collected cash' : 'transaction confirmation'} and capture</span>
            </div>
            <div className={'camera__flash' + (flash ? ' go' : '')} />
          </div>
          <div className="camera__controls">
            <button className="camera__x" onClick={onClose}>{Ic.x}</button>
            <button className="camera__shutter" onClick={shoot} aria-label="Capture" />
            <div className={'camera__roll' + (count ? '' : ' empty')}>
              {count ? <Shot kind={kind} /> : null}
              {count ? <span className="badge">{count}</span> : null}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ============================================================ APP */
  /* ---------- seed presets (for frozen case-study frames) ---------- */
  var PARAMS = new URLSearchParams(location.search);
  var SEED = PARAMS.get('seed') || '';
  var STATIC = PARAMS.get('static') === '1';
  var EMBED = PARAMS.get('embed') === '1';
  var BARE = PARAMS.get('bare') === '1';
  var FILL = PARAMS.get('fill') === '1';
  if (BARE) document.documentElement.classList.add('is-bare');
  if (EMBED) document.documentElement.classList.add('is-embed');
  if (FILL) document.documentElement.classList.add('is-static', 'is-fill');
  var proofs = (n, kind) => Array.from({ length: n }, (_, i) => ({ id: 'seed-' + kind + i, kind }));
  var SEEDS = {
    empty:        {},
    typing:       { cash: '300' },
    cash:         { cash: '300', cashProofs: proofs(1, 'cash') },
    partial:      { cash: '300', cashProofs: proofs(1, 'cash'), other: '200' },
    filled:       { cash: '300', cashProofs: proofs(2, 'cash'), other: '200', method: 'Credit / Debit Card', otherProofs: proofs(1, 'card') },
    methodneeded: { cash: '300', cashProofs: proofs(1, 'cash'), other: '200' },
    proofreq:     { cash: '300', reqCash: true, other: '200', method: 'Credit / Debit Card', otherProofs: proofs(1, 'card') },
    exceeds:      { other: '600', method: 'Credit / Debit Card' },
    overpaid:     { cash: '600', cashProofs: proofs(1, 'cash') },
    maxproof:     { cash: '300', cashProofs: proofs(4, 'cash'), other: '200', method: 'Credit / Debit Card', otherProofs: proofs(1, 'card') },
    limit:        { cash: '', other: '600', method: 'Credit / Debit Card', overlay: 'sheet-limit' },
    info:         { overlay: 'sheet-other' },
    camera:       { cash: '300', other: '200', overlay: 'cam-cash' },
    offline:      { net: 'offline', cash: '300', cashProofs: proofs(1, 'cash'), other: '200', method: 'Credit / Debit Card', otherProofs: proofs(1, 'card') },
    slow:         { net: 'slow', cash: '300', cashProofs: proofs(1, 'cash'), other: '200', method: 'Credit / Debit Card', otherProofs: proofs(1, 'card') },
    cashonly:     { cash: '500', cashProofs: proofs(1, 'cash') },
    cardonly:     { other: '500', method: 'Credit / Debit Card', otherProofs: proofs(1, 'card') },
    queued:       { screen: 'success', net: 'offline', cash: '300', other: '200', method: 'Credit / Debit Card' },
    review:       { screen: 'review', cash: '300', cashProofs: proofs(2, 'cash'), other: '200', method: 'Credit / Debit Card', otherProofs: proofs(2, 'card') },
    success:      { screen: 'success', cash: '300', other: '200', method: 'Credit / Debit Card' },
  };
  var S = SEEDS[SEED] || {};

  function App() {
    const [screen, setScreen] = useState(S.screen || 'collect'); // collect | review | success
    const [cash, setCash] = useState(S.cash || '');
    const [cashProofs, setCashProofs] = useState(S.cashProofs || []);
    const [other, setOther] = useState(S.other || '');
    const [method, setMethod] = useState(S.method || '');
    const [otherProofs, setOtherProofs] = useState(S.otherProofs || []);
    const [note, setNote] = useState('');
    const [overlay, setOverlay] = useState(S.overlay || null); // sheet-other | sheet-limit | cam-cash | cam-other
    const [reqCash, setReqCash] = useState(!!S.reqCash);
    const [reqOther, setReqOther] = useState(!!S.reqOther);
    const [net, setNet] = useState(S.net || 'online');
    const [driver, setDriver] = useState(null); // which amount the user is editing; the other auto-fills
    const [toast, setToast] = useState('');
    const idRef = useRef(0);

    const cashN = parseFloat(cash) || 0;
    const otherN = parseFloat(other) || 0;
    const total = cashN + otherN;
    const remaining = Math.max(0, DUE - total);
    const onlineExceeds = otherN > DUE;
    const overpaid = total > DUE + 0.001;
    const pct = Math.min(100, (total / DUE) * 100);

    useEffect(() => { if (toast) { const t = setTimeout(() => setToast(''), 2600); return () => clearTimeout(t); } }, [toast]);
    useEffect(() => { if (otherN > 0 && reqOther) setReqOther(false); }, [other]); // eslint-disable-line
    useEffect(() => { if (cashN > 0 && reqCash) setReqCash(false); }, [cash]); // eslint-disable-line
    // auto-split: the field the user edits drives the other, which fills with the remaining balance
    useEffect(() => {
      const split = (srcN) => (srcN > 0 ? (DUE - srcN > 0 ? String(+(DUE - srcN).toFixed(2)) : '') : '');
      if (driver === 'cash') setOther(split(cashN));
      else if (driver === 'other') setCash(split(otherN));
    }, [cash, other, driver]); // eslint-disable-line

    const addProof = (which) => {
      const kind = which === 'cash' ? 'cash' : proofKind(method);
      const item = { id: ++idRef.current, kind };
      if (which === 'cash') setCashProofs((p) => (p.length < 4 ? [...p, item] : p));
      else setOtherProofs((p) => (p.length < 4 ? [...p, item] : p));
    };

    const validate = () => {
      if (net === 'offline') { setToast('No connection — can’t submit yet'); return false; }
      if (total <= 0) { setToast('Enter a collected amount'); return false; }
      if (onlineExceeds) { setOverlay('sheet-limit'); return false; }
      if (overpaid) { setToast('Exceeds the due amount'); return false; }
      if (remaining > 0) { setToast(fmt(remaining) + ' ' + CUR + ' still due'); return false; }
      let ok = true;
      if (cashN > 0 && cashProofs.length === 0) { setReqCash(true); ok = false; }
      if (otherN > 0 && otherProofs.length === 0) { setReqOther(true); ok = false; }
      if (!ok) { setToast('Attach payment proof'); return false; }
      return true;
    };

    const next = () => { if (validate()) setScreen('review'); };

    const reset = () => {
      setScreen('collect'); setCash(''); setOther(''); setMethod(''); setNote(''); setDriver(null);
      setCashProofs([]); setOtherProofs([]); setReqCash(false); setReqOther(false); setOverlay(null); setNet('online');
    };

    // parent-frame controls (case-study modal sends network + reset via postMessage)
    useEffect(() => {
      function onMsg(e){
        var d = e.data; if (!d || typeof d !== 'object') return;
        if (d.type === 'pay-net' && ['online','slow','offline'].indexOf(d.net) > -1) setNet(d.net);
        else if (d.type === 'pay-reset') reset();
      }
      window.addEventListener('message', onMsg);
      return () => window.removeEventListener('message', onMsg);
    }, []); // eslint-disable-line

    /* ---------- screens ---------- */
    const collectScreen = (
      <div className="screen">
        {net !== 'online' && (
          <div className={'netbanner' + (net === 'slow' ? ' slow' : '')}>
            {Ic.info}
            <span>{net === 'offline' ? 'No connection. Record now, it submits when you’re back online.' : 'Weak connection. Submitting may take longer.'}</span>
          </div>
        )}
        <div className="scroll">
          {/* hero */}
          <div className="hero">
            <div className="hero__chip"><span className="dot" />Order #OM-4471</div>
            <div className="hero__lbl">Total due</div>
            <div className="hero__amt">{fmt(DUE)}<span className="cur">{CUR}</span></div>
            <div className="hero__bar"><i style={{ width: pct + '%' }} /></div>
            <div className="hero__bar-row">
              <span>{fmt(total)} {CUR} collected</span>
            </div>
          </div>

          <div className="section__h">Payment method</div>

          {/* CASH block */}
          <div className="block">
            <div className="block__head">
              <span className="block__ic cash">{Ic.cash}</span>
              <span className="block__t">Cash<small>Handed over at the door</small></span>
              {cashN > 0 && cashProofs.length > 0 && <span className="block__done" title="Ready"><svg viewBox="0 0 16 16" fill="none"><path d="M3.5 8.5 6.5 11l6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>}
            </div>
            <AmountField value={cash} onChange={(v) => { setCash(v); setDriver('cash'); }} error={overpaid} />
            {cashN === 0 && remaining > 0 && (
              <button className="qadd" onClick={() => { setCash(String(remaining)); setDriver('cash'); }}>
                {Ic.plus} Use remaining · {fmt(remaining)} {CUR}
              </button>
            )}
            {overpaid && (
              <div className="fieldmsg err">{Ic.info} Exceeds due by {fmt(total - DUE)} {CUR}</div>
            )}
            {cashN > 0 && (
              cashProofs.length === 0
                ? <button className={'attach' + (reqCash ? ' req' : '')} onClick={() => setOverlay('cam-cash')}>
                    {Ic.attach} Attach payment proof{reqCash ? ' *' : ''}
                  </button>
                : <ProofRow proofs={cashProofs} kind="cash" onAdd={() => setOverlay('cam-cash')}
                            onRemove={(i) => setCashProofs((p) => p.filter((_, x) => x !== i))} />
            )}
          </div>

          {/* OTHER block */}
          <div className="block">
            <div className="block__head">
              <span className="block__ic other">{method ? methodIcon(method) : Ic.card}</span>
              <span className="block__t">Other Method<small>Card, bank, or online</small></span>
              <span className="info" onClick={() => setOverlay('sheet-other')} style={{ color: 'var(--ink-4)', cursor: 'pointer', display: 'inline-flex', marginLeft: -3 }}>{Ic.info}</span>
              {otherN > 0 && otherProofs.length > 0 && method && <span className="block__done" title="Ready"><svg viewBox="0 0 16 16" fill="none"><path d="M3.5 8.5 6.5 11l6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>}
            </div>
            <div className="split">
              <AmountField value={other} onChange={(v) => { setOther(v); setDriver('other'); }} error={onlineExceeds} />
              <MethodSelect value={method} onChange={setMethod} />
            </div>
            {otherN === 0 && remaining > 0 && (
              <button className="qadd" onClick={() => { setOther(String(remaining)); setDriver('other'); }}>
                {Ic.plus} Use remaining · {fmt(remaining)} {CUR}
              </button>
            )}
            {onlineExceeds && (
              <div className="fieldmsg err">{Ic.info} Online can’t exceed the due</div>
            )}
            {otherN > 0 && !onlineExceeds && !method && (
              <div className="fieldmsg muted">Select how it was received</div>
            )}
            {otherN > 0 && !onlineExceeds && method && (
              otherProofs.length === 0
                ? <button className={'attach' + (reqOther ? ' req' : '')} onClick={() => setOverlay('cam-other')}>
                    {Ic.attach} Attach payment proof{reqOther ? ' *' : ''}
                  </button>
                : <ProofRow proofs={otherProofs} kind={proofKind(method)} onAdd={() => setOverlay('cam-other')}
                            onRemove={(i) => setOtherProofs((p) => p.filter((_, x) => x !== i))} />
            )}
          </div>

          {/* NOTE */}
          <div className="field">
            <div className="field__lbl">Delivery note</div>
            <textarea className="note" placeholder="Add a note (optional)" value={note}
                      onChange={(e) => setNote(e.target.value)} />
          </div>
        </div>

        <div className="action">
          <button className={'btn' + (total <= 0 || net === 'offline' ? ' is-disabled' : '')} onClick={next}>
            {net === 'offline'
              ? <>Waiting for connection…</>
              : <>Next {Ic.arrow}</>}
          </button>
        </div>
      </div>
    );

    const reviewScreen = (
      <div className="review">
        <div className="scroll">
          <div className="review-head">
            <div className="review-head__t">Review collection</div>
            <div className="review-head__s">Order #OM-4471 · check everything before you complete it.</div>
          </div>
          <div className="recon">
            <div className="recon__col"><span className="k">Due</span><b>{fmt(DUE)} <small>{CUR}</small></b></div>
            <div className="recon__eq"><svg viewBox="0 0 16 16" fill="none"><path d="M3.5 8.5 6.5 11l6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
            <div className="recon__col r"><span className="k">Collected</span><b>{fmt(total)} <small>{CUR}</small></b></div>
          </div>
          <div className="sec-row"><span className="section__h">Payment breakdown</span><button className="sec-edit" onClick={() => setScreen('collect')}>Edit</button></div>
          <div className="summary">
            {cashN > 0 && (
              <div className="summary__row">
                <div className="summary__head">
                  <span className="summary__ic" style={{ background: 'var(--green-50)', color: 'var(--green)' }}>{Ic.cash}</span>
                  <span className="summary__tx"><b>Cash</b><small>{cashProofs.length} photo{cashProofs.length !== 1 ? 's' : ''} attached</small></span>
                  <span className="summary__amt">{fmt(cashN)}</span>
                </div>
                {cashProofs.length > 0 && <div className="thumbstrip">{cashProofs.map((p) => <span className="t" key={p.id}><Shot kind={p.kind} /></span>)}</div>}
              </div>
            )}
            {otherN > 0 && (
              <div className="summary__row">
                <div className="summary__head">
                  <span className="summary__ic" style={{ background: 'var(--indigo-50)', color: 'var(--indigo)' }}>{methodIcon(method)}</span>
                  <span className="summary__tx"><b>{method}</b><small>{otherProofs.length} photo{otherProofs.length !== 1 ? 's' : ''} attached</small></span>
                  <span className="summary__amt">{fmt(otherN)}</span>
                </div>
                {otherProofs.length > 0 && <div className="thumbstrip">{otherProofs.map((p) => <span className="t" key={p.id}><Shot kind={p.kind} /></span>)}</div>}
              </div>
            )}
            <div className="summary__total"><b>Total collected</b><span>{fmt(total)} {CUR}</span></div>
          </div>
          {note && (
            <div className="block"><div className="block__t" style={{ fontSize: 12.5, color: 'var(--ink-3)', fontWeight: 600 }}>NOTE</div>
              <div style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.5 }}>{note}</div></div>
          )}
        </div>
        <div className="action" style={{ display: 'flex', gap: 10 }}>
          <button className="btn ghost" style={{ flex: '0 0 38%' }} onClick={() => setScreen('collect')}>Back</button>
          <button className="btn" style={{ flex: 1 }} onClick={() => setScreen('success')}>Confirm &amp; Complete {Ic.tick}</button>
        </div>
      </div>
    );

    const successScreen = (() => {
      const queued = net === 'offline';
      return (
      <div className="success">
        <div className={'success__seal' + (queued ? ' is-queued' : '')}>{queued ? Ic.sealClock : Ic.sealTick}</div>
        <div className="success__h">{queued ? 'Recorded Offline' : 'Payment Collected'}</div>
        <div className="success__sub">ORDER #OM-4471 · {fmt(total)} {CUR}</div>
        {queued && <div className="success__queue">No connection at the doorstep. This collection is saved on the device and will sync automatically when you’re back online.</div>}
        <div className="success__card">
          {cashN > 0 && <div className="success__line"><span className="m"><i style={{ background: 'var(--green)' }} />Cash</span><span className="v">{fmt(cashN)} {CUR}</span></div>}
          {otherN > 0 && <div className="success__line"><span className="m"><i style={{ background: 'var(--indigo)' }} />{method}</span><span className="v">{fmt(otherN)} {CUR}</span></div>}
          <div className="success__line success__tot"><span className="m"><b>Total</b></span><span className="v"><b>{fmt(total)} {CUR}</b></span></div>
        </div>
        <div style={{ width: '100%', marginTop: 'auto', paddingBottom: 22 }}>
          <button className="btn" onClick={reset}>Back to orders</button>
        </div>
      </div>
      );
    })();

    return (
      <div className="device-wrap">
        <div className="device">
          <div className="notch" />
          <div className="statusbar">
            <span>9:41</span>
            <span className="icons">
              <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor"><rect x="0" y="7" width="3" height="5" rx="1"/><rect x="4.5" y="4.5" width="3" height="7.5" rx="1"/><rect x="9" y="2" width="3" height="10" rx="1"/><rect x="13.5" y="0" width="3" height="12" rx="1" opacity="0.3"/></svg>
              <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor"><path d="M8 2.4c2.3 0 4.4.9 5.9 2.4l1.1-1.2A10 10 0 0 0 8 .8 10 10 0 0 0 1 3.6l1.1 1.2A8.3 8.3 0 0 1 8 2.4z" opacity="0.5"/><path d="M8 6c1.2 0 2.2.45 3 1.2l1.1-1.2A6.4 6.4 0 0 0 8 4.5a6.4 6.4 0 0 0-4.1 1.5L5 7.2A4.4 4.4 0 0 1 8 6z" opacity="0.7"/><path d="M8 9l2-2a3 3 0 0 0-4 0z"/></svg>
              <svg width="24" height="12" viewBox="0 0 24 12" fill="none"><rect x="1" y="1" width="20" height="10" rx="2.5" stroke="currentColor" opacity="0.4"/><rect x="3" y="3" width="14" height="6" rx="1.2" fill="currentColor"/><rect x="22" y="4" width="1.6" height="4" rx="0.8" fill="currentColor" opacity="0.5"/></svg>
            </span>
          </div>
          <div className="appbar">
            <button className="appbar__back" onClick={() => screen === 'collect' ? reset() : setScreen('collect')}>{Ic.back}</button>
            <div className="appbar__title">Collect Payment</div>
            <button className="appbar__bell">{Ic.bell}</button>
          </div>

          {screen === 'collect' && collectScreen}
          {screen === 'review' && reviewScreen}
          {screen === 'success' && successScreen}

          {/* overlays */}
          {overlay === 'sheet-other' && (
            <Sheet icon={Ic.info} title="Other Payment Method"
                   body="The amount received by card, bank transfer, or online payment."
                   onClose={() => setOverlay(null)} />
          )}
          {overlay === 'sheet-limit' && (
            <Sheet icon={Ic.info} title="Online Payment Limit"
                   body={'Online payments can\u2019t exceed the due amount of ' + fmt(DUE) + ' ' + CUR + '.'}
                   onClose={() => setOverlay(null)} />
          )}
          {overlay === 'cam-cash' && (
            <Camera label="Cash" kind="cash" count={cashProofs.length}
                    onClose={() => setOverlay(null)}
                    onCapture={() => { addProof('cash'); if (cashProofs.length + 1 >= 4) setOverlay(null); }} />
          )}
          {overlay === 'cam-other' && (
            <Camera label={method ? shortLabel(method) : 'Card'} kind={proofKind(method)} count={otherProofs.length}
                    onClose={() => setOverlay(null)}
                    onCapture={() => { addProof('other'); if (otherProofs.length + 1 >= 4) setOverlay(null); }} />
          )}

          {toast && <div className="toast"><span className="ic">{Ic.info}</span>{toast}</div>}
        </div>
      </div>
    );
  }

  /* ---------- scaler ---------- */
  function fit() {
    if (FILL) {
      document.documentElement.style.setProperty('--scale', (window.innerWidth / 390).toFixed(4));
      return;
    }
    const s = Math.min(window.innerWidth / 430, window.innerHeight / 900, 1);
    document.documentElement.style.setProperty('--scale', s.toFixed(3));
  }
  window.addEventListener('resize', fit);
  fit();

  if (STATIC) {
    document.documentElement.classList.add('is-static');
    var cap = document.querySelector('.caption');
    if (cap) cap.style.display = 'none';
  }

  ReactDOM.createRoot(document.getElementById('root')).render(<App />);
})();
