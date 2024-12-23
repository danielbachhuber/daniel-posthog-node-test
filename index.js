const express = require("express");
const PostHog = require("posthog-node").PostHog;
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", async (req, res) => {
  const posthog = new PostHog(process.env.POSTHOG_API_KEY, {
    host: process.env.POSTHOG_HOST || "https://us.i.posthog.com/",
    personalApiKey: process.env.POSTHOG_PERSONAL_API_KEY,
  });

  posthog.on("*", (event, payload) => {
    console.log("PostHog event", { event, payload });
  });

  const flagKey = "tutorial_v2_experiment";
  const userID = "testing123";
  const userProps = {
    lastAppVersionNumber: 245100,
  };

  // The debug log for this call should say `locally_evaluated: true`.
  await posthog.getFeatureFlag(flagKey, userID, {
    personProperties: userProps,
  });

  // But the debug log for this event doesn't include this `tutorial_v2_experiment` flag!
  posthog.capture({
    distinctId: userID,
    event: "Test",
  });

  await posthog.shutdown();

  res.send("Hello, Node.js!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
