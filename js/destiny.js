const clientId = null;
const apiKey = null;
const clientSecret = null;
const state = "randomState";

function checkAccessToken(accessToken, accessExpire, refreshToken, refreshExpire) {
    let authButton = document.getElementById("authButton");
    let bansheeButton = document.getElementById("bansheeButton");
    let adaButton = document.getElementById("adaButton");

    authDisplayData = document.getElementById("authContent");

    if (accessToken) {
        let currentDate = Date.now();
        if (accessExpire < currentDate) {
            if (refreshToken) {
                if (refreshExpire < currentDate) {
                    authDisplayData.innerHTML = "New access token required (access token AND refresh token are both expired).";
                    if (authButton) {
                        authButton.addEventListener('click', requestAuthorization);
                        if (bansheeButton) { 
                            bansheeButton.disabled = true;
                            bansheeButton.classList.add("disabled");
                        }
                        if (adaButton) {
                            adaButton.disabled = true;
                            adaButton.classList.add("disabled");
                        }
                    }
                } else {
                    console.log("Refresh token.");
                    authDisplayData.innerHTML = "Refresh access token.";
                    refreshAccessToken();

                    if (bansheeButton) { 
                        bansheeButton.disabled = true; 
                        bansheeButton.classList.add("disabled");
                    }
                    if (adaButton) { 
                        adaButton.disabled = true; 
                        adaButton.classList.add("disabled");
                    }
                    // if (authButton) {
                    //     authButton.addEventListener('click', refreshAccessToken);
                    //     if (bansheeButton) { 
                    //         bansheeButton.disabled = true; 
                    //         bansheeButton.classList.add("disabled");
                    //     }
                    //     if (adaButton) { 
                    //         adaButton.disabled = true; 
                    //         adaButton.classList.add("disabled");
                    //     }
                    // }
                }
            } else {
                console.log("New token. (access token expired, no refresh token found)");
                authDisplayData.innerHTML = "New access token required. (access token expired, no refresh token found).";
                if (authButton) {
                    authButton.addEventListener('click', requestAuthorization);
                    if (bansheeButton) { 
                        bansheeButton.disabled = true; 
                        bansheeButton.classList.add("disabled");
                    }
                    if (adaButton) {
                        adaButton.disabled = true; 
                        adaButton.classList.add("disabled");
                    }
                }
            }
        } else {
            console.log("Good to go (use access token).");
            authDisplayData.innerHTML = "Valid access token found.";
            if (authButton) {
                authButton.addEventListener('click', function(){ alert("Access token valid!") });
            }
        }
    } else {
        console.log("New token. (no access token found)");
        authDisplayData.innerHTML = "New access token required (no access token found).";
        if (authButton) {
            authButton.addEventListener('click', requestAuthorization);
            if (bansheeButton) { 
                bansheeButton.disabled = true; 
                bansheeButton.classList.add("disabled");
            }
            if (adaButton) { 
                adaButton.disabled = true; 
                adaButton.classList.add("disabled");
            }
        }
    }
}

function requestAuthorization() {
    window.localStorage.removeItem("accessToken");
    window.localStorage.removeItem("accessExpire");
    window.localStorage.removeItem("refreshToken");
    window.localStorage.removeItem("refreshExpire")    
    const url = `https://www.bungie.net/en/OAuth/Authorize?client_id=${clientId}&response_type=code&state=${state}`;
    window.location.replace(url);
}

function setupTabs() {
    var tabs = document.querySelectorAll(".tabs ul li");
    var tabContent = document.querySelectorAll(".contentWrapper .content");
    
    tabs.forEach( function(tab, tabIndex) {
        tab.addEventListener("click", function() {
            tabs.forEach( function(tab) {
                tab.classList.remove("active");
            });
    
            tab.classList.add("active");
    
            tabContent.forEach( function(content, contentIndex) {
                if(contentIndex == tabIndex) {
                    content.style.display = "block";
                } else {
                    content.style.display = "none";
                }
            });
        });
    });
}


async function requestAccessToken(authCode) {
    const url = "https://www.bungie.net/platform/app/oauth/token/";

    var header = new Headers();
    header.append('Content-Type', 'application/x-www-form-urlencoded');
    header.append("Authorization", "Basic " + window.btoa(clientId + ":" + clientSecret));

    try {
        var res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Basic " + window.btoa(clientId + ":" + clientSecret)
            },
            body: `grant_type=authorization_code&code=${authCode}/`
        });
        var data = await res.json();

        window.localStorage.setItem("accessToken", data["access_token"]);
        window.localStorage.setItem("accessExpire", Date.now() + (data["expires_in"] * 1000));
        window.localStorage.setItem("refreshToken", data["refresh_token"]);
        window.localStorage.setItem("refreshExpire", Date.now() + (data["refresh_expires_in"] * 1000));

        window.location.replace("https://cjackson98.github.io/DestinyUtil/");
    }
    catch (error) {
        console.log(error);
    }
}

async function refreshAccessToken() {
    // NOT FULLY TESTED!!!
    var refreshToken = window.localStorage.getItem("refreshToken");
    const url = "https://www.bungie.net/platform/app/oauth/token/";

    try {
        var res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Basic " + window.btoa(clientId + ":" + clientSecret)
            },
            body: `grant_type=refresh_token&refresh_token=${encodeURIComponent(refreshToken)}`
        });
        var data = await res.json();

        window.localStorage.setItem("accessToken", data["access_token"]);
        window.localStorage.setItem("accessExpire", Date.now() + (data["expires_in"] * 1000));
        window.localStorage.setItem("refreshToken", data["refresh_token"]);
        window.localStorage.setItem("refreshExpire", Date.now() + (data["refresh_expires_in"] * 1000));

        window.location.replace("https://cjackson98.github.io/DestinyUtil/");
    }
    catch (error) {
        console.log(error);
    }
}

async function getXurInventory() {
    const url = `https://www.bungie.net/Platform/Destiny2/Vendors/?components=402&definitions=true/`;

    var xurDisplayData = document.getElementById("xurContent");

    var header = new Headers();
    header.append('X-API-Key', apiKey);

    try {
        var res = await fetch(url, { headers: {'X-API-Key': apiKey} });
        var data = await res.json();

        // Acquire item hashes
        var itemData = data["Response"]["sales"]["data"]["2190858386"]["saleItems"]
        var itemArray = [];
        for(var item in itemData){
            itemArray.push(itemData[item]['itemHash']);
        }

        if (itemArray.length < 4) {
            xurDisplayData.innerHTML = "Xur is only here on weekends. Please check back later.";
            return;
        }
        else {
            Promise.all(
                itemArray.map((itemId) => getItemDefinition(itemId))
            )
            .then((data) => {
                xurDisplayData.innerHTML = "";
                for (var item in data) {
                    xurDisplayData.innerHTML += `<a href="https://www.light.gg/db/items/${data[item][1]}" target="_blank">${data[item][0]}</a></br>`;
                }
            })
            .catch((error) => {
                xurDisplayData.innerHTML = `Error: ${error}`;
            });
        }
    } catch (error) {
        console.log(error);
    }
}

async function getAdaInventory() {
    // Requires OAuth
    var accessToken = window.localStorage.getItem("accessToken");
    if (accessToken === null) {return;}

    /* UPDATE URL WITH CUSTOM USER PROFILE/CHARACTERS IN FUTURE */
    const url = `https://www.bungie.net/Platform/Destiny2/3/Profile/4611686018471073923/Character/2305843009301140567/Vendors/350061650/?components=402`;

    var adaDisplayData = document.getElementById("adaContent");

    try {
        var res = await fetch(url, {
            headers: {
                "X-API-Key": apiKey,
                'Authorization': `Bearer ${accessToken}`
            }
        });
        var data = await res.json();

        data = data["Response"]["sales"]["data"];

        var armorMods = [ 
            data[Object.keys(data)[5]]["itemHash"], 
            data[Object.keys(data)[6]]["itemHash"]
        ];

        Promise.all(
            armorMods.map((itemId) => getItemDefinition(itemId))
        )
        .then((data) => {
            adaDisplayData.innerHTML = "";
            for (var item in data) {
                // adaDisplayData.innerHTML += data[item] + "</br>";
                adaDisplayData.innerHTML += `<a href="https://www.light.gg/db/items/${data[item][1]}" target="_blank">${data[item][0]}</a></br>`;
            }
        })
        .catch((error) => {
            adaDisplayData.innerHTML = `Error: ${error}`;
        });
    }
    catch (error) {
        adaDisplayData.innerHTML = `Error: ${error}`;
    }
}

async function getBansheeInventory() {
    // Requires OAuth
    let accessToken = window.localStorage.getItem("accessToken");
    if (accessToken === null) {return;}

    /* UPDATE URL WITH CUSTOM USER PROFILE/CHARACTERS IN FUTURE*/
    const url = `https://www.bungie.net/Platform/Destiny2/3/Profile/4611686018471073923/Character/2305843009301140567/Vendors/672118013/?components=402`;

    var bansheeDisplayData = document.getElementById("bansheeContent");

    try {
        var res = await fetch(url, {
            headers: {
                "X-API-Key": apiKey,
                'Authorization': `Bearer ${accessToken}`
            }
        });
        var data = await res.json();
        
        // console.log(data);

        data = data["Response"]["sales"]["data"];
        
        var weapons = [];
        for (var i = 9; i <= 14; i++) {
            weapons.push( data[Object.keys(data)[i]]["itemHash"] );
        }

        Promise.all(
            weapons.map((itemId) => getItemDefinition(itemId))
        )
        .then((data) => {
            bansheeDisplayData.innerHTML = "";
            for (var item in data) {
                // bansheeDisplayData.innerHTML += data[item] + "</br>";
                bansheeDisplayData.innerHTML += `<a href="https://www.light.gg/db/items/${data[item][1]}" target="_blank">${data[item][0]}</a></br>`;
            }
        })
        .catch((error) => {
            bansheeDisplayData.innerHTML = `Error: ${error}`;
        });
    }
    catch (error) {
        bansheeDisplayData.innerHTML = `Error: ${error}`;
    }
}

async function getItemDefinition(itemId) {
    var entityDefinitionUrl = `https://www.bungie.net/Platform/Destiny2/Manifest/DestinyInventoryItemDefinition/${itemId}/`;

    try {
        var res = await fetch(entityDefinitionUrl, { headers: {'X-API-Key': apiKey} });
        var data = await res.json();

        return [data["Response"]["displayProperties"]["name"], itemId];
    } catch (error) {
        console.log(error);
    }
}



window.onload = function () {
    setupTabs();

    // Ensure required data is set
    if(clientId === null || clientSecret === null || apiKey === null) {
        var tabContents = document.querySelectorAll(".contentWrapper .content p");
        tabContents.forEach( function(content) {
            content.innerHTML = "Please make sure clientId, apiKey, and clientSecret are set.";
        });

        let xurButton = document.getElementById("xurButton");
        if (xurButton) {xurButton.remove();}

        let authButton = document.getElementById("authButton");
        if (authButton) {authButton.remove();}

        let bansheeButton = document.getElementById("bansheeButton");
        if (bansheeButton) {bansheeButton.remove();}

        let adaButton = document.getElementById("adaButton");
        if (adaButton) {adaButton.remove();}
        return;
    }

    // Check access token/refresh token
    let accessToken = window.localStorage.getItem("accessToken");
    let accessExpire = window.localStorage.getItem("accessExpire");
    let refreshToken = window.localStorage.getItem("refreshToken");
    let refreshExpire = window.localStorage.getItem("refreshExpire");
    checkAccessToken(accessToken, accessExpire, refreshToken, refreshExpire);

    // Add event listeners
    let xurButton = document.getElementById("xurButton");
    if (xurButton) { xurButton.addEventListener('click', getXurInventory); }

    let bansheeButton = document.getElementById("bansheeButton");
    if (bansheeButton) { bansheeButton.addEventListener('click', getBansheeInventory); }

    let adaButton = document.getElementById("adaButton");
    if (adaButton) { adaButton.addEventListener('click', getAdaInventory); }

    // Check if url contains an authorization code. If so, proceed to request access token.
    let authCode = new URLSearchParams(window.location.search).get('code');
    if(authCode) { requestAccessToken(authCode); }
}

