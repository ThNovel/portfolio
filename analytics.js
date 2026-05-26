// Google tag (gtag.js) loader for this portfolio.
// The Measurement ID is configured in analytics-config.js.
const measurementId = window.PORTFOLIO_GA_MEASUREMENT_ID;

if (measurementId) {
  window.dataLayer = window.dataLayer || [];

  function gtag() {
    window.dataLayer.push(arguments);
  }

  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", measurementId);

  const gtagScript = document.createElement("script");
  gtagScript.async = true;
  gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(gtagScript);
}
