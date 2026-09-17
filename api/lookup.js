// Vercel serverless function: proxies batch IP geolocation lookups to ip-api.com.
//
// ip-api.com's free tier is HTTP-only, so a browser page served over HTTPS
// (like this one on Vercel) cannot call it directly — that request gets
// blocked as mixed content. A server-side fetch has no such restriction,
// which is also the only way to get ip-api.com's mobile/proxy/hosting flags
// (used for IP-type classification) without a paid HTTPS plan.
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const body = req.body || {};
  const ips = Array.isArray(body.ips) ? body.ips.filter(ip => typeof ip === 'string').slice(0, 100) : [];

  if (ips.length === 0) {
    res.status(400).json({ error: 'Provide a non-empty "ips" array (max 100 per request).' });
    return;
  }

  const payload = ips.map(ip => ({
    query: ip,
    fields: 'status,message,country,countryCode,region,regionName,city,isp,org,as,mobile,proxy,hosting,query'
  }));

  try {
    const upstream = await fetch('http://ip-api.com/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!upstream.ok) {
      res.status(502).json({ error: `Upstream ip-api.com responded with HTTP ${upstream.status}` });
      return;
    }

    const data = await upstream.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(502).json({ error: err.message || 'Upstream lookup failed' });
  }
};
