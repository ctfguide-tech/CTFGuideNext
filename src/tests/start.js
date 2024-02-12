console.clear();
// Import puppeteer module
const puppeteer = require("puppeteer");

let testAmount = 2;
let testsRun = 0;

async function loadingAnimation(
    text = "",
    chars = ["⠙", "⠘", "⠰", "⠴", "⠤", "⠦", "⠆", "⠃", "⠋", "⠉"],
    delay = 100
) {
    let x = 0;

    return setInterval(function () {
        process.stdout.write("\r" + chars[x++] + " " + text);
        x = x % chars.length;
    }, delay);


}

loadingAnimation("Running tests...").then((intervalId) => {
    setTimeout(() => {
        clearInterval(intervalId);
    }, 1000);

    // first run pre req
    prereq().then((result) => {
        if (!result) {

            console.log("\x1b[31m❌ Prerequisites are NOT met. Aborting tests...\x1b[0m");
            process.exit();
        }
        console.log("\n\x1b[32m✔️ Prerequisites are met. Running tests...\x1b[0m");
        home_page().then(() => {
            ///  console.log("\x1b[32m✔️ Home Page | home.jsx | Passed\x1b[0m");


        })
        login_page().then(() => {
        })
        
        .then(() => {

            if (testsRun !== testAmount) {
                console.log("────────────────── RESULTS ───────────────────")
                console.log(`\x1b[31m❌ Some tests failed. (${testsRun}/${testAmount}) Please check the logs above.\x1b[0m`);
                console.log("──────────────────────────────────────────────")
                return process.exit();
            } else {
                console.log("────────────────── RESULTS ───────────────────")
                console.log(`\x1b[32m✔️ All tests passed. ${testsRun}/${testAmount}\x1b[0m`)
                console.log("──────────────────────────────────────────────")
                return process.exit();
            }

            return;

        })
    }).catch((error) => {
        console.error(error);
    });

    return;
}
);


// TEST FUNCTIONS
async function prereq() {
    // check if localhost:3000 is even running
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        await page.goto('http://localhost:3000');
        // check to see if anything is there
        const title = await page.title();
        if (title !== "CTFGuide") {
            console.log("\nFrontend is not running. Please ensure it is running.");
            return false;
        }
        await browser.close();
    } catch (err) {
        console.log("\nFrontend is not running. Please ensure it is running.");
        return false;
    }

    // check if the server is running
    try {
        const response = await fetch('http://localhost:3001');
        if (response.status !== 404) {
            console.log("\nBackend is not running. Please ensure it is running.");
            return false;

        }
    } catch (err) {
        console.log("\nBackend is not running. Please ensure it is running.");
        return false;
    }


    return true; // pre req pass ok


}
async function home_page() {
    try {
        console.log("testing home..")
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:3000');
    // check if page has the word Copyright
    const content = await page.content();

    console.log(content)
    if (content.includes("Copyright")) {
        console.log("\x1b[32m✔️ Home Page | index.jsx | Passed\x1b[0m");
        testsRun++;
        return true;
    } else {
        console.log("\x1b[31m❌ Home Page | index.jsx | Failed\x1b[0m");
        console.log("         \\__ Page does not contain the word 'Copyright'");
        return false;
    }
    await browser.close();

} catch(err) {
    console.error(err);
    return false;

}


}

async function login_page() {
    console.log("testing login..")
    // with browser view

    const browser = await puppeteer.launch();


    const page = await browser.newPage();
    await page.goto('http://localhost:3000/login');
    // check if page has the word Login
    const content = await page.content();

    // do login flow
    await page.type('input[name=email]', 'unit@ctfguide.com');
    await page.type('input[name=password]', 'unit_testing');
    await page.evaluate(() => {
        const button = document.querySelector('button[type=submit]');
        button.click();
    });
    await page.waitForNavigation();
    
    // check if it redirected to dashboard
    const url = page.url();
    if (url === "http://localhost:3000/dashboard") {
        console.log("\x1b[32m✔️ Login Page | login.jsx | Passed\x1b[0m");
        testsRun++;
        return true;
    } else {
        console.log("\x1b[31m❌ Login Page | login.jsx | Failed\x1b[0m");
        console.log("         \\__ Page did not redirect to dashboard after login");
        return false;
    }




    await browser.close();
}
