function installIPA() {
  const manifestURL = "https://yourdomain.com/game.plist"; // 🔁 ប្ដូរជា URL IPA របស់អ្នក

  const confirmInstall = confirm("តើអ្នកចង់ដំឡើង IPA នេះឬទេ?");
  if (confirmInstall) {
    window.location.href = `itms-services://?action=download-manifest&url=${manifestURL}`;
  }
}
