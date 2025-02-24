const MY_ID = 'gfdkjmgpgpmbbpdcllpdmegcblkhmflb';


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  if (request.action === 'getExtensions') {
    chrome.management.getAll((extensions) => {

      // Filter out Chrome itself and the current extension
      const filtered = extensions.filter(ext =>

        ext.id !== chrome.runtime.id && 
        ext.id !==  MY_ID
      );

      console.log(filtered);
      sendResponse(filtered);

    });
    return true;
  } else if (request.action == 'switch') {

    chrome.management.get(request.id, (ext) => {
      chrome.management.setEnabled(request.id, !ext.enabled);
      sendResponse([!ext.enabled,ext.icons]);
    });

    return true;
  }

});
