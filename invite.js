exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { email, token, teacherName } = JSON.parse(event.body);
    const siteUrl = "https://teachergeanine.netlify.app";
    const registerLink = `${siteUrl}?register=${token}`;

    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: "service_e9warbr",
        template_id: "mf3yqag",
        user_id: "w3Gsz7oM3M5Q5-6wi",
        template_params: {
          to_email: email,
          teacher_name: teacherName,
          register_link: registerLink,
        },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return { statusCode: 500, body: JSON.stringify({ error: err }) };
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
