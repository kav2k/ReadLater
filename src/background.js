chrome.runtime.onStartup.addListener(setBadge);
chrome.runtime.onInstalled.addListener(setBadge);
chrome.storage.onChanged.addListener(setBadge);

function setBadge() {
  chrome.storage.sync.get({count: 0}, function({count}) {
    chrome.browserAction.setBadgeText({"text": badgeText(count)});
  });
}

function badgeText(c) {
	if(c > 999){
		return c.toString()+"+";
	}
	return c.toString();
}

chrome.runtime.onStartup.addListener(setContextMenus);
chrome.runtime.onInstalled.addListener(setContextMenus);

function setContextMenus() {
	chrome.contextMenus.removeAll(function() {
		chrome.contextMenus.create({
			id: "addPage",
			title: "Add to ReadLater",
			contexts: ["page"]
		});
	});
}

chrome.contextMenus.onClicked.addListener(contextClick);

function contextClick(info, tab) {
	switch (info.menuItemId) {
		case "addPage":
			addLink(tab);
			break;
	}
}

// Adds new entry for Tab tab, if it was not yet in storage
function addLink(tab) {
	let key = tab.url;

	chrome.storage.sync.get([key, "count"], function(items) {
		if (typeof items[tab.url] === "undefined") { // Link was not in storage yet
			let count = items.count || 0; // Might be undefined

			let newLink = {"title": tab.title, "timestamp": new Date().getTime()};
			if (newLink.title.length > 50) {
				newLink.title = newLink.title.substr(0, 50) + "...";
			}

			chrome.storage.sync.set({
				[key]: newLink,
				count: count + 1
			}, setBadge);
		}
	});
}
