import { get_all_exts, setIcon, check_input } from './utils/utils.js';


const SELECTED = document.querySelector('.selected-option');
const OPT = document.querySelector('.options');
const INPUT = document.getElementById("url_rule");
const MOTION = document.getElementById("motions");
get_all_exts((exts) => {
    let img = document.createElement('img');
    let name = document.createElement('span');
    let p = document.createElement('p');

    setIcon(exts[0].icons, img, true, 16);
    name.textContent = exts[0].shortName;
    p.innerHTML = exts[0].id;
    p.style.display = 'none';

    SELECTED.appendChild(p);
    SELECTED.appendChild(img);
    SELECTED.appendChild(name);

    exts.forEach(ext => {
        let img = document.createElement('img');
        let name = document.createElement('span');
        let li = document.createElement('li');
        let p = document.createElement('p');

        p.innerHTML = ext.id;
        p.style.display = 'none';
        setIcon(ext.icons, img, true, 16);
        name.textContent = ext.shortName;

        li.addEventListener('click', function() {
            document.querySelector('.selected-option').innerHTML = li.innerHTML;
            document.querySelector('.options').style.display = 'none';
        });

        li.appendChild(img);
        li.appendChild(name);
        li.appendChild(p);
        OPT.appendChild(li);
    });
});


document.addEventListener('DOMContentLoaded', function() {
    refresh_rule();
    SELECTED.addEventListener('click', function() {
        OPT.style.display = 'block';
    });

    document.getElementById('submit').addEventListener('click', function() {
        if (check_input(INPUT, 'URL')){
            let ext_id = document.querySelector('.selected-option p').innerHTML;
            let reload = document.getElementById('if_reload').checked;
            chrome.storage.local.get(['entry'], function(re) {
                let entry = re.entry;
                entry.push({
                    ext_id: ext_id,
                    url: INPUT.value,
                    motion: MOTION.value,
                    enable: true,
                    reload: reload
                });
                console.log(entry);
                chrome.storage.local.set({
                    entry: entry
                });
                refresh_rule();
                INPUT.value = '';
            });     
        }
    });


    document.getElementById('submit_del').addEventListener('click', function(){
        let id_input = document.getElementById("del_id");
        if (check_input(id_input, "ID")) {
            chrome.storage.local.get(['entry'], function(re) {
                if (id_input.value > re.entry.length || id_input.value < 1){
                    window.alert("This entry is not exist.");
                } else {
                    if (window.confirm(`Confirm to delete the entry with ID ${id_input.value}`)){
                        re.entry.splice(id_input.value-1, 1);
                        chrome.storage.local.set({entry: re.entry});
                        refresh_rule();
                        id_input.value = '';
                    }
                } 
            });
        }
    });


    document.getElementById('submit_disable').addEventListener('click', function(){
        let id_input = document.getElementById("disable_id");
        if (check_input(id_input, "ID")) {
            chrome.storage.local.get(['entry'], function(re) {
                if (id_input.value > re.entry.length || id_input.value < 1){
                    window.alert("This entry is not exist.");
                } else {
                    if (window.confirm(`Confirm to disable/enable the entry with ID ${id_input.value}`)){
                        re.entry[id_input.value-1].enable = !re.entry[id_input.value-1].enable;
                        chrome.storage.local.set({entry: re.entry});
                        refresh_rule();
                        id_input.value = '';
                    }
                } 
            });
        }
    });
});


document.addEventListener('click', function(event) {
    if (!OPT.contains(event.target) && !SELECTED.contains(event.target)) {
        OPT.style.display = 'none';
    }
});


function refresh_rule() {
    const TABLE_BODY = document.querySelector('#rules tbody');
    TABLE_BODY.innerHTML = '';
    let count = 0;

    chrome.storage.local.get(['entry'], function(res) {
        count = res.entry.length;

        for (let i = 0; i < count; i++){

            let tr = document.createElement('tr');
            chrome.storage.local.get(['entry'], function(re) {
                let tds = new Array(6).fill().map(() => document.createElement('td'));;
                let img = document.createElement('img');
                tds[0].innerHTML = i+1;
                tds[2].innerHTML = re.entry[i].url;
                tds[3].innerHTML = re.entry[i].motion;
                tds[4].innerHTML = re.entry[i].enable ? 'enabled' : 'disabled';
                tds[5].innerHTML = re.entry[i].reload;

                chrome.management.get(re.entry[i].ext_id, function(ext){
                    setIcon(ext.icons, img, re.entry[i].enable, 16);
                });
                tds[1].appendChild(img);
                tds.forEach(td => {
                    tr.appendChild(td);
                });
                TABLE_BODY.appendChild(tr);
            });
        }
    });
}

