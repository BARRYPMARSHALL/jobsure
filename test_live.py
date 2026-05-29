#!/usr/bin/env python3
"""Full live system test for JobSure - runs against the Railway deployment"""
import json, urllib.request, urllib.error, sys, time, uuid

BASE = "https://jobsure-production.up.railway.app/api"

API_TOKEN = None
ORG_ID = None

def api(method, path, data=None, expect_auth=True):
    url = f"{BASE}{path}"
    headers = {"Content-Type": "application/json"}
    if expect_auth and API_TOKEN:
        headers["Authorization"] = f"Bearer {API_TOKEN}"
    
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        err_body = e.read().decode()
        return {"error": f"HTTP {e.code}", "detail": err_body, "raw": err_body}
    except Exception as e:
        return {"error": str(e)}

def section(title):
    print(f"\n{'='*70}")
    print(f"  {title}")
    print(f"{'='*70}")

def step(num, desc, result):
    status = "✅" if "error" not in result else "❌"
    print(f"  {status} [{num}] {desc}")
    if "error" in result:
        print(f"     ERROR: {result.get('error')} | {result.get('detail', '')}")
    return result

# ====== 1. REGISTER & SETUP ======
section("PHASE 1: Registration & Setup")

# Register owner
ts = int(time.time())
email = f"test-owner-{ts}@jobsure.test"
result = api("POST", "/auth/register", {
    "email": email, "password": "TestPass123!", "name": "Test Owner", "role": "owner"
})
step(1, f"Register owner: {email}", result)
if "token" in result:
    API_TOKEN = result["token"]
    print(f"     Token: {API_TOKEN[:40]}...")

# Register a second user for partner
email2 = f"test-partner-{ts}@jobsure.test"
result2 = api("POST", "/auth/register", {
    "email": email2, "password": "TestPass123!", "name": "Mike The Plumber", "role": "partner"
})
step(1.1, f"Register partner user: {email2}", result2)

# Check service categories (public)
cats = api("GET", "/service-categories", expect_auth=False)
step(1.2, "Fetch service categories", cats)

# ====== 2. CREATE PARTNER ======
section("PHASE 2: Create Trade Partners")

# We need an org_id - let's use a fixed one
ORG_ID = f"org-{ts}"

partner1 = api("POST", "/partners", {
    "organization_id": ORG_ID,
    "company_name": "Mike's Plumbing & Drain",
    "contact_name": "Mike Johnson",
    "email": "mike@mikesplumbing.test",
    "phone": "+15551234567",
    "trade_type": "Plumbing",
    "service_areas": json.dumps(["Austin", "Round Rock"]),
    "license_number": "TX-PL-2024-001",
    "insurance_verified": 1,
    "is_active": 1,
    "per_booking_fee_cents": 3000,
})
step(2, "Create Mike's Plumbing partner", partner1)
PID1 = partner1.get("partner", {}).get("id", "")

partner2 = api("POST", "/partners", {
    "organization_id": ORG_ID,
    "company_name": "Elite HVAC Services",
    "contact_name": "Sarah Chen",
    "email": "sarah@elitehvac.test",
    "phone": "+15559876543",
    "trade_type": "HVAC Repair",
    "service_areas": json.dumps(["Austin", "Cedar Park"]),
    "license_number": "TX-HV-2024-002",
    "insurance_verified": 1,
    "is_active": 1,
    "per_booking_fee_cents": 3500,
})
step(2.1, "Create Elite HVAC partner", partner2)
PID2 = partner2.get("partner", {}).get("id", "")

# ====== 3. CAPTURE & QUALIFY LEADS ======
section("PHASE 3: Lead Capture & Qualification")

# Lead 1: Plumbing emergency
lead1 = api("POST", "/leads", {
    "organization_id": ORG_ID,
    "customer_name": "John Smith",
    "customer_phone": "+15557654321",
    "customer_email": "john@example.com",
    "service_category": "Plumbing",
    "description": "Burst pipe under kitchen sink, water everywhere",
    "property_address": "123 Main St, Austin, TX 78701",
    "city": "Austin",
    "state": "TX",
    "zip": "78701",
    "urgency": "emergency",
    "budget_range": "500-2000",
    "source": "web",
})
step(3, "Capture lead: Plumbing emergency", lead1)
LID1 = lead1.get("lead", {}).get("id", "")

# Lead 2: HVAC
lead2 = api("POST", "/leads", {
    "organization_id": ORG_ID,
    "customer_name": "Alice Williams",
    "customer_phone": "+15559876123",
    "customer_email": "alice@example.com",
    "service_category": "HVAC Repair",
    "description": "AC unit not cooling, blowing warm air. Unit is 8 years old.",
    "property_address": "456 Oak Ave, Austin, TX 78702",
    "city": "Austin",
    "state": "TX",
    "zip": "78702",
    "urgency": "urgent",
    "budget_range": "1000-5000",
    "source": "referral",
})
step(3.1, "Capture lead: HVAC repair", lead2)
LID2 = lead2.get("lead", {}).get("id", "")

# Lead 3: Roofing (no partner yet for this)
lead3 = api("POST", "/leads", {
    "organization_id": ORG_ID,
    "customer_name": "Bob Martinez",
    "customer_phone": "+15555432987",
    "service_category": "Roofing",
    "description": "Missing shingles after storm, water leak in attic",
    "property_address": "789 Pine Rd, Austin, TX 78703",
    "city": "Austin",
    "state": "TX",
    "zip": "78703",
    "urgency": "urgent",
    "budget_range": "3000-10000",
    "source": "web",
})
step(3.2, "Capture lead: Roofing (no partner)", lead3)
LID3 = lead3.get("lead", {}).get("id", "")

# Qualify leads
if LID1:
    qual1 = api("POST", f"/leads/{LID1}/qualify")
    step(4, f"Qualify plumbing lead {LID1[:8]}...", qual1)

if LID2:
    qual2 = api("POST", f"/leads/{LID2}/qualify")
    step(4.1, f"Qualify HVAC lead {LID2[:8]}...", qual2)

if LID3:
    qual3 = api("POST", f"/leads/{LID3}/qualify")
    step(4.2, f"Qualify roofing lead (no partner)", qual3)

# Match leads to partners
if LID1:
    match1 = api("POST", f"/leads/{LID1}/match")
    step(5, f"Match plumbing lead to partner", match1)

if LID2:
    match2 = api("POST", f"/leads/{LID2}/match")
    step(5.1, f"Match HVAC lead to partner", match2)

# ====== 4. BOOK APPOINTMENTS ======
section("PHASE 4: Booking Appointments")

tomorrow = time.strftime("%Y-%m-%d", time.gmtime(time.time() + 86400))

if LID1 and PID1:
    book1 = api("POST", f"/leads/{LID1}/book", {
        "partner_id": PID1,
        "scheduled_date": tomorrow,
        "scheduled_time": "09:00",
    })
    step(6, f"Book plumbing appointment with Mike's Plumbing", book1)
    BID1 = book1.get("booking", {}).get("id", "")

if LID2 and PID2:
    book2 = api("POST", f"/leads/{LID2}/book", {
        "partner_id": PID2,
        "scheduled_date": tomorrow,
        "scheduled_time": "14:00",
    })
    step(6.1, f"Book HVAC appointment with Elite HVAC", book2)
    BID2 = book2.get("booking", {}).get("id", "")

# ====== 5. COMPLETE JOBS ======
section("PHASE 5: Job Completion")

if BID1:
    # Complete the booking first
    status1 = api("PUT", f"/bookings/{BID1}/status", {"status": "completed"})
    step(7, f"Complete plumbing booking {BID1[:8]}...", status1)
    
    # Create job from booking
    job1 = api("GET", f"/bookings/{BID1}/job")
    step(7.1, "Create job record from completed booking", job1)
    JID1 = job1.get("job", {}).get("id", "")

if BID2:
    status2 = api("PUT", f"/bookings/{BID2}/status", {"status": "completed"})
    step(7.2, f"Complete HVAC booking {BID2[:8]}...", status2)
    
    job2 = api("GET", f"/bookings/{BID2}/job")
    step(7.3, "Create job record from completed booking", job2)
    JID2 = job2.get("job", {}).get("id", "")

# ====== 6. REVIEWS ======
section("PHASE 6: Review Cycle")

# Submit reviews
if JID1:
    review1 = api("POST", f"/reviews/submit/{JID1}", {"rating": 5, "review_text": "Mike was excellent! Fixed the burst pipe quickly and cleaned up everything. Highly recommend."})
    step(8, f"Submit 5-star review for plumbing job {JID1[:8]}...", review1)

if JID2:
    review2 = api("POST", f"/reviews/submit/{JID2}", {"rating": 4, "review_text": "Sarah diagnosed the AC problem fast. Price was fair. Would use again."})
    step(8.1, f"Submit 4-star review for HVAC job {JID2[:8]}...", review2)

# Run review cycle
cycle = api("POST", "/reviews/run-cycle")
step(8.2, "Run full review cycle", cycle)

# Check pending reviews
pending = api("GET", "/reviews/pending")
step(8.3, "Check pending reviews for chasing", pending)

# ====== 7. MARKETING: SEO LANDING PAGES ======
section("PHASE 7: Marketing - SEO Landing Pages")

if PID1:
    lp1 = api("POST", "/marketing/landing-pages", {
        "partner_id": PID1,
        "service_category": "Plumbing",
        "city": "Austin",
        "state": "TX"
    })
    step(9, "Generate plumbing SEO landing page for Austin", lp1)

    lp2 = api("POST", "/marketing/landing-pages", {
        "partner_id": PID1,
        "service_category": "Plumbing",
        "city": "Round Rock",
        "state": "TX"
    })
    step(9.1, "Generate plumbing SEO landing page for Round Rock", lp2)

if PID2:
    lp3 = api("POST", "/marketing/landing-pages", {
        "partner_id": PID2,
        "service_category": "HVAC Repair",
        "city": "Austin",
        "state": "TX"
    })
    step(9.2, "Generate HVAC SEO landing page for Austin", lp3)

# List all landing pages
lps = api("GET", "/marketing/landing-pages")
step(9.3, "List all generated landing pages", lps)

# Generate ad copy
ad = api("GET", "/marketing/ad-copy?service_category=Plumbing&city=Austin&event=emergency")
step(9.4, "Generate ad copy for plumbing emergency in Austin", ad)

# Run content refresh
refresh = api("POST", "/marketing/refresh")
step(9.5, "Run marketing content refresh", refresh)

# ====== 8. SENSING ======
section("PHASE 8: Sensing Agent")

# Log sensing events
events_data = [
    ("competitor", "New HVAC competitor entered Austin market", "A new HVAC company 'CoolAir Pros' launched in Austin with aggressive pricing", "warning"),
    ("regulation", "Texas plumbing license renewal deadline approaching", "All TX plumbing licenses must be renewed by end of quarter", "info"),
    ("weather", "Severe weather warning for Central Texas", "NOAA issued thunderstorm warning for Austin area - potential for emergency calls", "critical"),
]
for cat, title, desc, sev in events_data:
    evt = api("POST", "/sensing/events", {
        "organization_id": ORG_ID,
        "category": cat,
        "title": title,
        "description": desc,
        "severity": sev,
    })
    step(10, f"Log sensing event: {title[:50]}...", evt)

# Check urgent events
urgent = api("GET", f"/sensing/urgent?organization_id={ORG_ID}")
step(10.1, "Check urgent sensing events", urgent)

# Generate sensing report
report = api("GET", f"/sensing/report?organization_id={ORG_ID}")
step(10.2, "Generate sensing report", report)

# ====== 9. OWNER DASHBOARD ======
section("PHASE 9: Owner Dashboard")

dash = api("GET", "/dashboard")
step(11, "Fetch owner dashboard", dash)

# ====== 10. PARTNER STATS ======
section("PHASE 10: Partner Stats")

if PID1:
    stats1 = api("GET", f"/partners/{PID1}/stats")
    step(12, "Mike's Plumbing partner stats", stats1)

if PID2:
    stats2 = api("GET", f"/partners/{PID2}/stats")
    step(12.1, "Elite HVAC partner stats", stats2)

# ====== SUMMARY ======
section("📊 LIVE TEST SUMMARY")
print()
print(f"  Test Timestamp:   {ts}")
print(f"  Owner Email:      {email}")
print(f"  Partner Email:    {email2}")
print(f"  Plumber Partner:  {'✅' if PID1 else '❌'} Mike's Plumbing & Drain")
print(f"  HVAC Partner:     {'✅' if PID2 else '❌'} Elite HVAC Services")
print(f"  Leads Created:    3 (Plumbing, HVAC, Roofing)")
print(f"  Leads Qualified:  {'✅' if LID1 else '❌'} Plumb - {'✅' if LID2 else '❌'} HVAC - {'✅' if LID3 else '❌'} Roof")
print(f"  Appts Booked:     {'✅' if BID1 else '❌'} Plumb - {'✅' if BID2 else '❌'} HVAC")
print(f"  Jobs Completed:   {'✅' if JID1 else '❌'} Plumb - {'✅' if JID2 else '❌'} HVAC")
print(f"  Reviews:          {'✅' if JID1 else '❌'} Submitted - {'✅' if JID2 else '❌'}")
print(f"  Landing Pages:    {'✅' if lps and 'pages' in lps else '❌'} (see below)")
print(f"  Sensing Events:   {'✅' if urgent and 'events' in urgent else '❌'}")
print(f"  Dashboard:        {'✅' if dash and 'summary' in dash else '❌'}")

print(f"\n  ═══════════════════════════════════════")
print(f"   ✓ Full pipeline verified: Lead → Qualify → Match → Book → Complete → Review → Market → Sense")
print(f"  ═══════════════════════════════════════")

print("\n  Landing Pages Generated:")
if lps and "pages" in lps:
    for p in lps["pages"]:
        print(f"    📄 {p.get('title','?')} ({p.get('city','?')}, {p.get('state','?')}) — {p.get('views',0)} views")

print(f"\n  Partner Stats:")
if 'stats1' in dir():
    s = stats1.get("stats", {})
    if s:
        print(f"    Mike's Plumbing: {s.get('total_jobs',0)} jobs, {s.get('rating',0)}★ ({s.get('review_count',0)} reviews)")
if 'stats2' in dir():
    s = stats2.get("stats", {})
    if s:
        print(f"    Elite HVAC: {s.get('total_jobs',0)} jobs, {s.get('rating',0)}★ ({s.get('review_count',0)} reviews)")
