#!/usr/bin/env python3
"""Show detailed results from the JobSure live test"""
import json, urllib.request, urllib.error, sys

BASE = "https://jobsure-production.up.railway.app/api"
API_TOKEN = None

def api(method, path, data=None):
    url = f"{BASE}{path}"
    headers = {"Content-Type": "application/json"}
    if API_TOKEN:
        headers["Authorization"] = f"Bearer {API_TOKEN}"
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        return {"error": e.code, "detail": e.read().decode()}

# Register a fresh session
ts = __import__('time').time()
email = f"show-{int(ts)}@jobsure.test"
r = api("POST", "/auth/register", {"email": email, "password": "TestPass123!", "name": "Show", "role": "owner"})
API_TOKEN = r.get("token", "")
org_id = f"org-{int(ts)}"

# Create partner + lead + book + complete
p = api("POST", "/partners", {
    "organization_id": org_id, "company_name": "Demo Plumbing Co",
    "contact_name": "Demo User", "email": "demo@test.com", "phone": "+15550001111",
    "trade_type": "Plumbing", "service_areas": '["Austin"]',
    "license_number": "TX-123", "insurance_verified": 1, "is_active": 1
})
pid = p["partner"]["id"]

l = api("POST", "/leads", {
    "organization_id": org_id, "customer_name": "Jane Doe",
    "customer_phone": "+15550002222", "service_category": "Plumbing",
    "description": "Leaky faucet in master bathroom", "city": "Austin",
    "state": "TX", "urgency": "normal", "source": "web"
})
lid = l["lead"]["id"]
api("POST", f"/leads/{lid}/qualify")
b = api("POST", f"/leads/{lid}/book", {"partner_id": pid, "scheduled_date": "2026-06-01", "scheduled_time": "10:00"})
bid = b["booking"]["id"]
api("PUT", f"/bookings/{bid}/status", {"status": "completed"})
api("GET", f"/bookings/{bid}/job")

# Generate landing page
api("POST", "/marketing/landing-pages", {"partner_id": pid, "service_category": "Plumbing", "city": "Austin", "state": "TX"})

# Log sensing events
for cat, title, desc, sev in [
    ("competitor","New competitor offering $49 drain cleaning","Local plumbing company offering $49 flat rate drain cleaning","warning"),
    ("weather","Freeze warning for Central Texas","NWS issued freeze warning - burst pipe risk","critical"),
    ("market","Home renovation spending up 12%","Q2 report shows homeowners spending more on renovations","info"),
]:
    api("POST", "/sensing/events", {"organization_id": org_id, "category": cat, "title": title, "description": desc, "severity": sev})

# Fetch all results
print("=== DASHBOARD ===")
dash = api("GET", "/dashboard")
print(json.dumps(dash, indent=2))

print("\n\n=== LANDING PAGES ===")
lps = api("GET", "/marketing/landing-pages")
for p in lps.get("pages", []):
    print(f"\n--- {p.get('title','?')} ---")
    for k in ["slug","service_category","city","state","meta_description","views","leads_generated"]:
        print(f"  {k}: {p.get(k, '?')}")
    print(f"  content (first 300 chars): {json.dumps(p.get('content_json','')[:300])}")

print("\n\n=== SENSING REPORT ===")
report = api("GET", f"/sensing/report?organization_id={org_id}")
print(json.dumps(report, indent=2))

print("\n\n=== URGENT EVENTS ===")
urgent = api("GET", f"/sensing/urgent?organization_id={org_id}")
print(json.dumps(urgent, indent=2))
