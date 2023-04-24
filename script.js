function getButtonClassName() {
    return "version-bumper-buttons";
}

function getDescription() {
    return document.createTextNode("Or use Version Bumper. Latest version is ");
}

function getVersionElement(version) {
    let elem = document.createElement("code");
    elem.textContent = version;
    elem.id = "description-version";
    return elem;
}

var newDiv = document.createElement("div");
var latestVersion = "v0.0.0";
var buttonDescription = document.createElement("p");
var buttonContainer = document.createElement("div");
var buttonMajor = document.createElement("span");
buttonMajor.onclick = function () {
    onBumpButtonClick("major");
};
var buttonMinor = document.createElement("span");
buttonMinor.onclick = function () {
    onBumpButtonClick("minor");
};
var buttonPatch = document.createElement("span");
buttonPatch.onclick = function () {
    onBumpButtonClick("patch");
};

function onBumpButtonClick(target) {
    // Parse version
    var parseResult = latestVersion.match(
        /(^.*)(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(.*$)/
    );
    if (parseResult == null) {
        [prefix, major, minor, patch] = ["v", "0", "0", "0"];
    } else {
        var [_, prefix, major, minor, patch, suffix] = parseResult;
    }

    // Bump version
    if (target == "major") {
        major++;
        minor = 0;
        patch = 0;
    } else if (target == "minor") {
        minor++;
        patch = 0;
    } else if (target == "patch") {
        patch++;
    }
    var newVersion = [prefix, major, ".", minor, ".", patch, suffix].join("");

    // Input new version
    document
        .querySelector(
            "input[name='release[tag_name]'][id='release_tag_name__refname_']"
        )
        .setAttribute("value", newVersion);
    document
        .querySelector("[id^=tag-select-menu]")
        .querySelector("span[data-menu-button]").textContent = newVersion;
    var completeTextElement = document.createElement("h4");
    completeTextElement.textContent = "Version bumped! 🚀";
    var releaseTagTextContainer = document
        .querySelector("div[class*='js-release-tag']")
        .querySelector("div[aria-live='polite'");
    releaseTagTextContainer.innerHTML = "";
    releaseTagTextContainer.appendChild(completeTextElement);

    // Enable generate release note button
    document
        .querySelector("button[id='generate-notes-btn']")
        .setAttribute("aria-disabled", "false");
}

function main() {
    // Return if not on new release screen
    if (location.href.indexOf("/releases/new") == -1) return;

    // Create buttons if not exist
    if (document.getElementById(getButtonClassName()) == null) {
        newDiv.className = getButtonClassName();
        newDiv.id = getButtonClassName();
        buttonDescription.appendChild(getDescription());
        buttonDescription.appendChild(getVersionElement(latestVersion));
        newDiv.appendChild(buttonDescription);

        // Prepare Buttons
        buttonMajor.className = "btn";
        buttonMajor.textContent = "major";
        buttonMajor.style.marginRight = "4px";
        buttonMinor.className = "btn";
        buttonMinor.textContent = "minor";
        buttonMinor.style.marginRight = "4px";
        buttonPatch.className = "btn";
        buttonPatch.textContent = "patch";
        buttonContainer.append(buttonMajor, buttonMinor, buttonPatch);

        newDiv.appendChild(buttonContainer);
        document
            .querySelector("div[class*='js-release-tag']")
            .appendChild(newDiv);
    }

    // Trigger fetching letest version
    var tagSelectMenu = document.querySelector("[id^=tag-select-menu]");
    if (tagSelectMenu instanceof HTMLElement) {
        tagSelectMenu.dispatchEvent(new Event("mouseover"));
    } else return;

    var tagItems = tagSelectMenu.getElementsByClassName("SelectMenu-item");
    if (tagItems.length > 0) {
        var latestItem =
            tagItems[0].getElementsByTagName("span")[0].textContent;
    } else return;
    if (latestItem !== null) {
        latestVersion = latestItem;
        document.getElementById("description-version").textContent =
            latestVersion;
    }
}

main();
