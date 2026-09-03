export default async function handler(req, res) {
    const { app } = req.query;
    if (!app) return res.status(400).send('Invalid Request');

    const GITHUB_REPO = "mzereashte94/Mzere";
    
    // دروستکردنی ژمارەیەکی کاتی بۆ ئەوەی ئایفۆنەکە کاش (Cache) نەکات
    const cacheBuster = Date.now().toString();
    
    // دانانی لینکی فایلەکە لەگەڵ فێڵی کاشەکە
    let ipaUrl = `https://github.com/${GITHUB_REPO}/releases/download/V1/${app}_signed.ipa?v=${cacheBuster}`;
    if (app.toLowerCase() === 'esign') {
        ipaUrl = `https://github.com/${GITHUB_REPO}/releases/download/V1/ESign_signed.ipa?v=${cacheBuster}`;
    }

    const customIcons = {
        'esign': 'https://raw.githubusercontent.com/ipa-black/Signer/refs/heads/main/icons/IMG_1419.jpeg',
        'ksign': 'https://raw.githubusercontent.com/ipa-black/Signer/refs/heads/main/icons/IMG_1416.jpeg',
        'scarlet': 'https://raw.githubusercontent.com/ipa-black/Signer/refs/heads/main/icons/IMG_1420.jpeg',
        'gbox': 'https://raw.githubusercontent.com/ipa-black/Signer/refs/heads/main/icons/IMG_1417.jpeg',
        'feather': 'https://raw.githubusercontent.com/ipa-black/Signer/refs/heads/main/icons/IMG_1421.jpeg'
    };

    const iconUrl = customIcons[app.toLowerCase()] || customIcons['esign'];
    
    const bundleIds = {
        'esign': 'p3.puredarks.esign',
        'ksign': 'com.ksign.app',
        'scarlet': 'com.fastsign.scarlet',
        'gbox': 'com.gbox.app',
        'feather': 'com.feather.app'
    };
    
    const actualBundleId = bundleIds[app.toLowerCase()] || `com.ipablack.${app.toLowerCase()}`;

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
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.status(200).send(manifestXML);
}
