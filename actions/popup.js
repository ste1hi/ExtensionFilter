chrome.runtime.sendMessage({ action: 'getExtensions' }, (extensions) => {

  const list = document.getElementById('extList');
  
  extensions.forEach(ext => {

    let img = document.createElement('img');
    const li = document.createElement('li');
    
    li.textContent = `${ext.name}`;
    img.id = `${ext.id}`;
    
    setIcon(ext.icons, img, ext.enabled);

    img.addEventListener('click', 
      function(event) {
        chrome.runtime.sendMessage({
          action: 'switch',
          id: `${img.id}`
        }, (ext_info) => {
          setIcon(ext_info[1], img, ext_info[0]);
        });
    });

    li.appendChild(img);
    list.appendChild(li);
  });
});


function setIcon(icons, img, ext_status){

  let flag = false;
  for (let icon of icons) {
    if (icon.size == 32) {
      img.src = icon.url;
      flag = true;
      break;
    }
  }

  if (!flag) {
    img.src = icons.at(-1).url;
    img.width = '32';
    img.height = '32';
  }

  if (!ext_status) {
    img.src += '?grayscale=true';
  }

}