export default async function handler(req, res) {
    const { app } = req.query;
    if (!app) return res.status(400).send('Invalid Request');

    const GITHUB_REPO = "mzereashte94/Mzere";
    
    let ipaName = `${app}_signed.ipa`;

    const ipaUrl = `https://github.com/${GITHUB_REPO}/releases/download/V1/${ipaName}`;

    // هێنانەی ناوی ڕاستەقینەی ئەپەکە (Bundle ID) لە گایتهەبەوە
    let actualBundleId = `com.ashtemobile.${app.toLowerCase()}`;
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

    // ناوی وێنەکان ڕاستەوخۆ لە ریپۆزتۆرییەکەی خۆت
    const customIcons = {
        'ashtemobile': 'https://raw.githubusercontent.com/mzereashte94/Mzere/main/icons/Ashtemobile.jpeg',
        'esign': 'https://raw.githubusercontent.com/mzereashte94/Mzere/main/icons/Esign.jpeg',
        'ksign': 'https://raw.githubusercontent.com/mzereashte94/Mzere/main/icons/Ksign.jpeg',
        'mytv': 'https://raw.githubusercontent.com/mzereashte94/Mzere/main/icons/mytv.jpeg'
    };
    
    const iconUrl = customIcons[app.toLowerCase()] || customIcons['ashtemobile'];

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
                <string>${app} - AshteMobile</string>
            </dict>
        </dict>
    </array>
</dict>
</plist>`;

    res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.status(200).send(manifestXML);
}
