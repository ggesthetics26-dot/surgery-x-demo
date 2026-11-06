/* ORBIT core: registry for procedures, anatomy bases and cover art.
   Each data/procedures/*.js file calls ORBIT.register(), ORBIT.base() and ORBIT.cover(). */
(function () {
  'use strict';
  var O = window.ORBIT = window.ORBIT || {};
  O.version = '3.0.0';
  O.procs = [];
  O.bases = {};
  O.covers = {};
  O.register = function (p) { O.procs.push(p); return p; };
  /* base(id, title, fn): fn returns inner SVG markup for viewBox 0 0 400 300 */
  O.base = function (id, title, fn) { O.bases[id] = { id: id, title: title, fn: fn }; };
  /* cover(id, fn): fn returns inner SVG markup for viewBox 0 0 320 200 */
  O.cover = function (id, fn) { O.covers[id] = fn; };
  O.byId = function (id) { for (var i = 0; i < O.procs.length; i++) if (O.procs[i].id === id) return O.procs[i]; return null; };
})();
