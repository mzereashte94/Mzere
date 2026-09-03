export default async function handler(req, res) {
    const { build_id, app } = req.query;
    const GITHUB_TOKEN = process.env.GITHUB_PAT;
    const GITHUB_REPO = process.env.GITHUB_REPO;

    try {
        // دەگەڕێین بەدوای ڕیلیسی V1 کە دیاریمان کردووە
        const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/tags/V1`, {
            headers: { 'Authorization': `token ${GITHUB_TOKEN}` }
        });

        if (response.status === 200) {
            const data = await response.json();
            
            // دۆزینەوەی ناوی فایلەکە بەپێی ئەپەکە
            const expectedIpaName = app.toLowerCase() === 'esign' ? 'ESign_signed.ipa' : `${app}_signed.ipa`;
            const ipaAsset = data.assets.find(asset => asset.name === expectedIpaName);

            if (ipaAsset) {
                const assetTime = new Date(ipaAsset.updated_at).getTime();
                const buildTime = parseInt(build_id);

                // ئەگەر کاتی نوێکردنەوەی فایلەکە نوێتر بوو لە کاتی کلیککردنەکە، واتە واژۆکردنەکە تەواو بووە!
                if (assetTime > buildTime) {
                    const ipaUrl = `https://github.com/${GITHUB_REPO}/releases/download/V1/${expectedIpaName}`;
                    const bundleUrl = `https://github.com/${GITHUB_REPO}/releases/download/V1/bundle_id.txt`;
                    return res.status(200).json({ status: 'done', ipaUrl, bundleUrl });
                }
            }
            
            // ئەگەر فایلەکە هێشتا نوێ نەبووەتەوە، با سایتەکە بەردەوام بێت لە چاوەڕوانیکردن
            return res.status(200).json({ status: 'processing' });
        } else {
            return res.status(500).json({ error: 'GitHub API error or V1 not found' });
        }
    } catch (err) {
        console.error("Status Check Error:", err);
        res.status(500).json({ error: 'Server error' });
    }
}
