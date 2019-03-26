import puppeteer from 'puppeteer';

export default async function withPage(t, run) {
    const browser = await puppeteer.launch({ slowMo: 500 });
    const page = await browser.newPage();

    try {
        await run(t, page);
    } finally {
        await page.close();
        await browser.close();
    }
}
