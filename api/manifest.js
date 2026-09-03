export default async function handler(req, res) {
    const { app } = req.query;
    if (!app) return res.status(400).send('Invalid Request');

    const GITHUB_REPO = "mzereashte94/Mzere";
    
    let ipaName = `${app}_signed.ipa`;
    if (app.toLowerCase() === 'esign') ipaName = 'ESign_signed.ipa';

    const ipaUrl = `https://github.com/${GITHUB_REPO}/releases/download/V1/${ipaName}`;

    // 🔥 چارەسەرە گەورەکە: هێنانەی ناوی ڕاستەقینەی ئەپەکە (Bundle ID) لە گایتهەبەوە
    let actualBundleId = `com.ipablack.${app.toLowerCase()}`;
    try {
        const bundleRes = await fetch(`https://github.com/${GITHUB_REPO}/releases/download/V1/bundle_id.txt?v=${Date.now()}`);
        if (bundleRes.ok) {
            const text = await bundleRes.text();
            if (text && text.trim().length > 3) {
                actualBundleId = text.trim();
            }
        }
    } catch (err) {
        console.log("Fallback to default bundle id");
    }

    const customIcons = {
        'esign': 'https://raw.githubusercontent.com/ipa-black/Signer/refs/heads/main/icons/IMG_1419.jpeg',
        'ksign': 'https://raw.githubusercontent.com/ipa-black/Signer/refs/heads/main/icons/IMG_1416.jpeg',
        'scarlet': 'https://raw.githubusercontent.com/ipa-black/Signer/refs/heads/main/icons/IMG_1420.jpeg',
        'gbox': 'https://raw.githubusercontent.com/ipa-black/Signer/refs/heads/main/icons/IMG_1417.jpeg',
        'feather': 'https://raw.githubusercontent.com/ipa-black/Signer/refs/heads/main/icons/IMG_1421.jpeg'
    };
    const iconUrl = customIcons[app.toLowerCase()] || customIcons['esign'];

    const manifestXML = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>items</key>
    <array>
        <dict>
            <key>assets</key>
            <array>
                <dict>
                    <key>kind</key>
                    <string>software-package</string>
                    <key>url</key>
                    <string>${ipaUrl}</string>
                </dict>
                <dict>
                    <key>kind</key>
                    <string>display-image</string>
                    <key>needs-shine</key>
                    <true/>
                    <key>url</key>
                    <string>${iconUrl}</string>
                </dict>
            </array>
            <key>metadata</key>
            <dict>
                <key>bundle-identifier</key>
                <string>${actualBundleId}</string>
                <key>bundle-version</key>
                <string>1.0.0</string>
                <key>kind</key>
                <string>software</string>
                <key>title</key>
                <string>${app} - IPA BLACK</string>
            </dict>
        </dict>
    </array>
</dict>
</plist>`;

    res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.status(200).send(manifestXML);
}
