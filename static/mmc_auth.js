const script = registerScript({
  name: "MMC Auth",
  version: "1.0.0",
  authors: ["orban viktor"]
});

const JString = Java.type("java.lang.String");
const MessageDigest = Java.type("java.security.MessageDigest");
const Base64 = Java.type("java.util.Base64");
const HttpClient = Java.type("java.net.http.HttpClient");
const HttpRequest = Java.type("java.net.http.HttpRequest");
const HttpResponse = Java.type("java.net.http.HttpResponse");
const URI = Java.type("java.net.URI");
const Duration = Java.type("java.time.Duration");

const startTimestamp = Date.now();
const http = HttpClient.newBuilder()
  .connectTimeout(Duration.ofSeconds(30))
  .build();

script.registerModule({
  name: "MMC Auth",
  category: "Client",
  description: "",
  settings: {
    launcherSecret: Setting.text({
      name: "Launcher Secret",
      default: "MesterMC_Secret_2024_v2.0_OnlyOfficialLauncher_HibridSupport"
    }),
    launcherIdentifier: Setting.text({
      name: "Launcher Identifier",
      default: "MesterMC-Official-Launcher-v2.0-Hibrid"
    }),
    launcherVersion: Setting.text({
      name: "Launcher Version",
      default: "2.0-hibrid"
    })
  }
}, (mod) => {
  // the serverConnect event is broken so we have to do this ugly hack
  let joinHandled = false;

  mod.on("disconnect", () => {
    joinHandled = false;
  });

  mod.on("playerTick", async () => {
    if (joinHandled) return;
    joinHandled = true;

    Client.displayChatMessage("Authenticating...");
    await sendVerification(mod);
  });
});

async function sendVerification(mod) {
  const ts = Date.now();

  const hash = mmcHash(mod, ts);

  const username = mc.session.username;

  const payload = {
    messageType: "LAUNCHER_AUTH",
    secret: mod.settings.launcherSecret.value,
    identifier: mod.settings.launcherIdentifier.value,
    timestamp: ts,
    serverHash: hash,
    version: mod.settings.launcherVersion.value,
    playerName: username
  };

  console.log(`Payload: ${JSON.stringify(payload, null, 2)}`);

  const request = HttpRequest.newBuilder()
    .uri(URI.create("http://57.128.198.223:25581/launcher/verify"))
    .header("Accept", "application/json")
    .header("Content-Type", "application/json")
    .header("User-Agent", "MesterMC-Auth-Mod/2.0.0")
    .header("X-Launcher-Version", mod.settings.launcherVersion.value)
    .header("X-Client-IP", "127.0.0.1")
    .header("X-Player-Name", username)
    .POST(HttpRequest.BodyPublishers.ofString(JSON.stringify(payload)))
    .build();

  try {
    const response = http.send(request, HttpResponse.BodyHandlers.ofString());
    const statusCode = response.statusCode();
    const responseBody = response.body();

    if (statusCode != 200) {
      throw new Error(`Status: ${statusCode}, body: ${responseBody}`);
    }
  } catch (error) {
    console.log(error);
    Client.displayChatMessage("Error while authenticating, check console for details.");
  }
}

function mmcHash(mod, timestamp) {
  const str = `${mod.settings.launcherSecret.value}|${mod.settings.launcherIdentifier.value}|${timestamp}|${mod.settings.launcherVersion.value}|mestermc_verification_salt_2024`;

  const javaStr = new JString(str);
  const md = MessageDigest.getInstance("SHA-256");
  const hashBytes = md.digest(javaStr.getBytes("UTF-8"));

  return Base64.getEncoder().encodeToString(hashBytes);
}

function generateVerification(mod) {
  const str = `${mod.settings.launcherSecret.value}|${mod.settings.launcherIdentifier.value}|${startTimestamp}|${mod.settings.launcherVersion.value}`;

  const javaStr = new JString(str);
  const md = MessageDigest.getInstance("SHA-256");
  const hashBytes = md.digest(javaStr.getBytes("UTF-8"));

  return Base64.getEncoder().encodeToString(hashBytes);
}
