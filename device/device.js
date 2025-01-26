function onLoad() {
  // not smartphone
  if (
    !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    document.getElementById("message").innerHTML =
      "Please open the link in a smartphone.";
    document.getElementById("caliberate").style.display = "none";
    return;
  }
  // forcing https
  if (
    location.protocol !== "https:" &&
    location.hostname !== "127.0.0.1" &&
    location.hostname !== "localhost"
  ) {
    location.replace(
      `https:${location.href.substring(location.protocol.length)}`
    );
  }
  window.onerror = (msg, url, lineNum) => {
    document.getElementById("message").innerHTML = msg;
  };
  let id = new URLSearchParams(window.location.search).get("id");
  const lag = 5;
  let i = 0;
  let client = null;
  client = new WebRTCClient(
    "https://signallite.nikunjgupta.dev",
    id,
    (event) => {},
    (channel) => {
      window.ondeviceorientationabsolute = (e) => {
        document.getElementById("caliberate").onclick = () => {
          const data = JSON.stringify({
            type: "device-caliberate",
            data: {
              alpha: e.alpha,
              beta: e.beta,
              gamma: e.gamma,
            },
          });
          channel.send(data);
        };
        i++;
        if (i % lag == 0) {
          const data = JSON.stringify({
            type: "device-data",
            data: {
              alpha: e.alpha,
              beta: e.beta,
              gamma: e.gamma,
            },
          });
          channel.send(data);
        }
      };
    }
  );
  client.createOffer();
}
onLoad();
