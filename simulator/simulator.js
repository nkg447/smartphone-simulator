const uuidv4 = () => {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (
      +c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
    ).toString(16)
  );
};
const phone = document.getElementsByClassName("scene")[0];
let calibrateValues = { alpha: 0, beta: 0, gamma: 0 };
let id = undefined;
function setPhoneTransform(style) {
  phone.style["-webkit-transform"] =
    phone.style["-moz-transform"] =
    phone.style["-ms-transform"] =
    phone.style["transform"] =
      style;
}

function createQr(id) {
  const url = `${window.location.href.substr(
    0,
    window.location.href.length - 10
  )}device?id=${id}`;
  var qr = new QRious({
    element: document.getElementById("qr"),
    size: 300,
    value: url,
    background: "white",
    foreground: "#222831",
  });
  document.getElementById("message").innerHTML = `<a href="${url}">${url}</a>`;
}

const channel = uuidv4();
const client = new WebRTCClient(
  "https://signallite.nikunjgupta.dev",
  channel,
  (event) => {
    const raw = JSON.parse(event.data);
    const { data, type } = raw;
    if (type === "device-caliberate") {
      const { alpha, beta, gamma } = data;
      calibrateValues = {
        alpha: alpha * -1,
        beta: beta * -1,
        gamma: gamma * -1,
      };
    } else {
      document.getElementById("qr-code").style.display = "none";
      document.getElementById("message").style.display = "none";
      document.getElementById("message").innerHTML = JSON.stringify(data);
      const { alpha, beta, gamma } = data;
      setPhoneTransform(
        `rotateY(${calibrateValues.alpha + alpha}deg) rotateX(${
          (calibrateValues.beta + beta) * -1
        }deg) rotateZ(${calibrateValues.gamma + gamma}deg)`
      );
    }
  },
  (ignore) => {}
);

createQr(channel);
