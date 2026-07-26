# CORS-free standalone leaderboard

This version uses Google Visualization's supported JSONP `responseHandler`
instead of `fetch()`, so it does not require CORS.

It can be hosted normally and can also be tested by opening `Index.html`
directly from disk.

Configured tabs currently include:
- LVL 9
- LVL A-J
- LVL 9 ♥

Add any remaining score tabs to the `SHEETS` array in `Index.html`.

The Google Sheet must be shared so that anyone with the link can view it.
