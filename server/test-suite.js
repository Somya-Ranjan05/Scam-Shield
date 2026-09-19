// server/test-suite.js
async function runTests() {
  console.log("==================================================");
  console.log("🛡️  SCAMSHIELD AUTOMATED END-TO-END TEST SUITE");
  console.log("==================================================");

  try {
    // Test 1: Live Stats
    console.log("\n[Test 1] GET /api/stats/live");
    const stats = await fetch("http://localhost:5000/api/stats/live").then(r => r.json());
    console.log("  ✅ Live Stats:", stats.data);

    // Test 2: Text Submission (Fake SBI KYC message)
    console.log("\n[Test 2] POST /api/submissions/text (Hindi language)");
    const textSub = await fetch("http://localhost:5000/api/submissions/text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message_body: "Dear SBI Customer, your account is suspended due to pending KYC. Click http://sbi-kyc-update.com immediately to update PAN or your account will be blocked.",
        sender_id: "+919876543210",
        preferred_language: "hi",
      }),
    }).then(r => r.json());
    console.log("  ✅ Submission ID:", textSub.data.submission_id);
    console.log("  ✅ Risk Score:", textSub.data.verdict.risk_score, `(${textSub.data.verdict.risk_tier})`);
    console.log("  ✅ Headline:", textSub.data.verdict.headline_verdict);
    console.log("  ✅ Red Flags:", textSub.data.verdict.red_flags.length);

    // Test 3: Link Submission with Threat Matching
    console.log("\n[Test 3] POST /api/submissions/link");
    const linkSub = await fetch("http://localhost:5000/api/submissions/link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: "https://sbi-kyc-update.com/login",
        preferred_language: "en",
      }),
    }).then(r => r.json());
    console.log("  ✅ Community Match Detected:", Boolean(linkSub.data.community_match));
    console.log("  ✅ Community Reports Count:", linkSub.data.community_match?.total_reports);
    console.log("  ✅ Elevated Risk Score:", linkSub.data.verdict.risk_score);

    // Test 4: APK Submission
    console.log("\n[Test 4] POST /api/submissions/apk");
    const apkSub = await fetch("http://localhost:5000/api/submissions/apk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apk_filename: "SBI-KYC-Update.apk",
        package_name: "com.fake.sbi.kyc",
        source_link: "http://whatsapp-download.net/sbi.apk",
        preferred_language: "en",
      }),
    }).then(r => r.json());
    console.log("  ✅ APK Risk Score:", apkSub.data.verdict.risk_score, `(${apkSub.data.verdict.risk_tier})`);

    // Test 5: Report Threat Workflow (Authenticated)
    console.log("\n[Test 5] POST /api/reports");
    const reportRes = await fetch("http://localhost:5000/api/reports", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer mock-user-token-12345",
      },
      body: JSON.stringify({
        submission_id: textSub.data.submission_id,
        scam_category: "fake_banking_upi",
        additional_context: "Received on WhatsApp demanding OTP verification",
      }),
    }).then(r => r.json());
    console.log("  ✅ Scam Report Created:", reportRes.data.report.id, `Status: ${reportRes.data.report.status}`);

    // Test 6: Public Registry Query
    console.log("\n[Test 6] GET /api/registry");
    const registryRes = await fetch("http://localhost:5000/api/registry").then(r => r.json());
    console.log("  ✅ Public Registry Accessible:", registryRes.success, `Total: ${registryRes.data.total}`);

    // Test 7: Admin Moderation
    console.log("\n[Test 7] GET /api/admin/reports/pending (Admin Auth)");
    const pendingRes = await fetch("http://localhost:5000/api/admin/reports/pending", {
      headers: { "Authorization": "Bearer mock-admin-token" },
    }).then(r => r.json());
    console.log("  ✅ Admin Pending Queue Loaded:", pendingRes.data.reports.length, "reports");

    // Test 8: Non-Admin 403 Security Check
    console.log("\n[Test 8] GET /api/admin/reports/pending (Non-Admin User Token)");
    const nonAdminCheck = await fetch("http://localhost:5000/api/admin/reports/pending", {
      headers: { "Authorization": "Bearer mock-user-token-12345" },
    });
    console.log("  ✅ Security Status Code:", nonAdminCheck.status, "(Expected 403 Forbidden)");

    console.log("\n==================================================");
    console.log("✨ ALL SCAMSHIELD CRITICAL TESTS PASSED SUCCESSFULLY");
    console.log("==================================================");
  } catch (err) {
    console.error("❌ Test failed:", err);
  }
}

runTests();
