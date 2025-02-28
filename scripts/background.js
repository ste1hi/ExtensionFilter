import { MY_ID, get_all_exts} from './utils/utils.js';


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    if (request.action === 'getExtensions') {
        get_all_exts((ext) => {
            sendResponse(ext);
        });
        return true;
    } else if (request.action === 'switch') {

        chrome.management.get(request.id, (ext) => {
            chrome.management.setEnabled(request.id, !ext.enabled);
            sendResponse([!ext.enabled,ext.icons]);
        });

        return true;
    }
});


chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        if (tab.url !== ""){
            check_rule(tab.url);
        }
    });
});

chrome.tabs.onUpdated.addListener((id, changeInfo) => {
    if (changeInfo.status === "loading" && changeInfo.url !== undefined) {
        check_rule(changeInfo.url)
    }
});
  

chrome.runtime.onInstalled.addListener(async () => {
    // chrome.storage.local.clear();
    // If `entry` is not exist, the array will be created.
    chrome.storage.local.get(["entry"], function(re) {
        if (Object.keys(re).length === 0) {
            chrome.storage.local.set({entry: []});
        }
    });
});


function check_rule(url) {
    console.log(url);
    chrome.storage.local.get(["entry"], function(re) {
        re.entry.forEach(rule => {
            if (rule.enable) {
                let regex = new RegExp(rule.url);
                let enable = rule.motion === "on";  // on -> true   off -> false
                // If url is matched, the extension will be set to motion.
                let do_enable = regex.test(url) ? enable : !enable;
                // If motion is on and rule.reload is true, then need reload.
                let reload = rule.reload ? do_enable : false;
                toggle_extension(rule.ext_id, do_enable, reload);
            }
        });
    });
}


function toggle_extension(ext_id, enable, reload = false) {
    /* 
    * Set the extension status to the value of the `enable`.
    */
    chrome.management.get(ext_id, (ext) => {
        if (ext.enabled !== enable) {
            chrome.management.setEnabled(ext_id, enable);
            if (reload){
                chrome.tabs.reload();
            }
        }
    }); 
}