export const MY_ID = 'gfdkjmgpgpmbbpdcllpdmegcblkhmflb';


export function get_all_exts(callback){
    chrome.management.getAll((extensions) => {
        // Filter out Chrome itself and the current extension
        const filtered = extensions.filter(ext =>
            ext.id !== chrome.runtime.id &&
            ext.id !==  MY_ID
        );
        callback(filtered);
    });
}


export function setIcon(icons, img, ext_status, size = 32){
    /*Find the icon that fits the size.
    * If icon that fits the size is not found, use the last icon and resize it to size.
    */
  
    let flag = false;
    for (let icon of icons) {
        if (icon.size === size) {
            img.src = icon.url;
            flag = true;
            break;
        }
    }
  
    if (!flag) {
        img.src = icons.at(-1).url;
        img.width = size;
        img.height = size;
    }
  
    if (!ext_status) {
        img.src += '?grayscale=true';  // Set gray mode.
    }
}


export function check_input (input, out, max_length=256,if_check_range=false, min=1, max=256){
    if (input.value.trim() === '') {
        window.alert(out + ' cannot be empty.');
        return false;
    } else if (input.value.trim().length > max_length) {
        window.alert(out + ' is too long.');
        id_input.value = '';
        return false;
    } else {
        if (if_check_range) {
            if (input.value < min || input.value > max){
                window.alert(out + ' is out of range.');
                return false;
            }
        }
        return true;
    }
}