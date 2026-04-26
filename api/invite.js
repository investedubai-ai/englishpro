export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, token, teacherName } = req.body;

  if (!email || !token) {
    return res.status(400).json({ error: "Missing email or token" });
  }

  const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID || "service_e9warbr";
  const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID || "template_ci39t6r";
  const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY || "w3Gsz7oM3M5Q5-6wi";
  const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY; // Set this in Vercel env vars

  const registerUrl = `https://englishpro-seven.vercel.app/?register=${token}`;

  try {
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        accessToken: EMAILJS_PRIVATE_KEY,
        template_params: {
          to_email: email,
          teacher_name: teacherName || "Geanine Giacomin",
          register_url: registerUrl,
        },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("EmailJS error:", err);
      return res.status(500).json({ error: "Failed to send email" });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Invite handler error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
