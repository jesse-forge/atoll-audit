/* Privacy-respecting analytics for Atoll Audit (GoatCounter, cookieless).
   - Loads nothing unless GOATCOUNTER_CODE is configured.
   - Loads nothing (and sends no events) if the browser sends Do Not Track or Global Privacy Control.
   - Page views are sent with the bare path only (no query string or #hash).
   - Custom events are restricted to a fixed allow-list of names; never pasted code, keys, URLs or emails. */
(function () {
  var C = window.ATOLL_CONFIG || {};
  var code = String(C.GOATCOUNTER_CODE || "");
  var n = navigator || {};
  var optedOut = n.doNotTrack === "1" || n.doNotTrack === "yes" || window.doNotTrack === "1" ||
                 n.msDoNotTrack === "1" || n.globalPrivacyControl === true;
  var configured = /^[a-z0-9][a-z0-9-]{0,49}$/.test(code) && code !== "goatcounter_code";
  var enabled = configured && !optedOut;
  var EVENT_RE = /^(check_run|scan_request|finding_[a-z0-9_]{1,40}|platform_(lovable|bolt|cursor|replit|v0|other|unknown))$/;
  var queue = [];
  function send(name) {
    window.goatcounter.count({ path: name, title: name, event: true });
  }
  window.atollAnalytics = {
    enabled: enabled, optedOut: optedOut, configured: configured, EVENT_RE: EVENT_RE,
    track: function (name) {
      if (!enabled || !EVENT_RE.test(name)) return false;
      if (window.goatcounter && window.goatcounter.count) send(name); else queue.push(name);
      return true;
    }
  };
  if (!enabled) return;
  window.goatcounter = { no_onload: true };
  var s = document.createElement("script");
  s.async = true;
  s.src = "https://gc.zgo.at/count.js";
  s.setAttribute("data-goatcounter", "https://" + code + ".goatcounter.com/count");
  s.setAttribute("data-goatcounter-settings", '{"no_onload": true}');
  s.onload = function () {
    if (!window.goatcounter || !window.goatcounter.count) return;
    window.goatcounter.count({ path: location.pathname, title: document.title }); // path only, never ?query or #hash
    while (queue.length) send(queue.shift());
  };
  document.head.appendChild(s);
})();
