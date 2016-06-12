// ---
// FORM SUBMISSION ALERT
// ---

if (document.URL.indexOf("form=success") !== -1) {
  $('#alert-form').toggleClass('dn');
}

if (document.URL.indexOf("status=404") !== -1) {
  $('#alert-404').toggleClass('dn');
}
