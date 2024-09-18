chrome.action.onClicked.addListener((tab) => {
  organizeTabs();
});

function organizeTabs() {
  closeDuplicateTabs().then(groupTabsByDomain);
}

function closeDuplicateTabs() {
  return new Promise((resolve) => {
    chrome.tabs.query({}, (tabs) => {
      const urlMap = new Map();
      const tabsToClose = [];

      tabs.forEach((tab) => {
        if (urlMap.has(tab.url)) {
          tabsToClose.push(tab.id);
        } else {
          urlMap.set(tab.url, tab.id);
        }
      });

      chrome.tabs.remove(tabsToClose, resolve);
    });
  });
}

function groupTabsByDomain() {
  chrome.tabs.query({}, (tabs) => {
    const domainMap = new Map();

    // Group tabs by domain
    tabs.forEach((tab) => {
      const domain = new URL(tab.url).hostname;
      if (!domainMap.has(domain)) {
        domainMap.set(domain, []);
      }
      domainMap.get(domain).push(tab);
    });

    // Sort domains by the number of tabs (descending)
    const sortedDomains = Array.from(domainMap.entries()).sort((a, b) => b[1].length - a[1].length);

    // Reorder tabs
    let index = 0;
    sortedDomains.forEach(([domain, domainTabs]) => {
      domainTabs.forEach((tab) => {
        chrome.tabs.move(tab.id, {index: index++});
      });
    });
  });
}
