import {test, expect} from "@playwright/test";

const wait = (duration) => new Promise((resolve) => setTimeout(resolve, duration));
const base_url = process.env.BASE_URL;

test.describe("main", () => {
  test("requires task result", async ({page}) => {
    test.setTimeout(25_000);
    await wait(20_000);
    await page.goto(base_url);
    await wait(100);

    const result = await page.innerText("#result");
    console.log("Found in HTML:");
    console.log(result);
    expect(result).toBe('Final result: {"example":true,"a":"a"}');
  })
});
