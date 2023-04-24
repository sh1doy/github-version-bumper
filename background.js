chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (
        changeInfo.status === "complete" &&
        tab.url.indexOf("https://github.com/") > -1
    ) {
        console.log(`updated: ${tab.url}`);
        chrome.scripting.executeScript({
            target: { tabId: tab.id, allFrames: true },
            files: ["./script.js"],
        });
    }
});
