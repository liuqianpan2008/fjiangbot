import pupperteer from 'puppeteer';
import artTemplate from "art-template";
import fs from "fs";
async function HtmlImg(mode = "", data: any, id: number = 0) {
    fs.mkdirSync(`${__dirname}/../resources/${mode}`, { recursive: true });
    const html = artTemplate(`${__dirname}/../../src/modular/${mode}/index.html`, data);
    await fs.writeFile(`${__dirname}/../resources/${mode}/${id === 0 ? "index" : id}.html`, html, (err: any) => {
        if (err) {
            console.log(err);
        }
    });
    const browser = await pupperteer.launch({
        headless: true,
    });
    const page = await browser.newPage();
    await page.goto(`file://${__dirname}/../resources/${mode}/${id === 0 ? "index" : id}.html`);
    let body = await page.$("#container");
    let img = await body?.screenshot({ encoding: "base64", type: "jpeg", quality: 100 }) ?? "截图失败";
    await browser.close();
    return img;
}
export { HtmlImg };