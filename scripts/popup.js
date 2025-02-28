import { setIcon } from './utils/utils.js';


chrome.runtime.sendMessage({ action: 'getExtensions' }, (extensions) => {

    const LIST = document.getElementById('extList');
  
    extensions.forEach(ext => {

        let img = document.createElement('img');
        let li = document.createElement('li');
    
        li.textContent = ext.name;
        img.id = ext.id;
    
        setIcon(ext.icons, img, ext.enabled);

        img.addEventListener('click', 
            function() {
                chrome.runtime.sendMessage({
                    action: 'switch',
                    id: img.id
                }, (ext_info) => {
                    setIcon(ext_info[1], img, ext_info[0]);
                });
            }
        );

        li.appendChild(img);
        LIST.appendChild(li);
    });
});


document.getElementById('option_page').addEventListener('click',
    function () {
        chrome.runtime.openOptionsPage();
    }
);


