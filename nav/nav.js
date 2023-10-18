document.body.appendChild(document.createElement("br"))
document.body.appendChild(document.createElement("br"))


/* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
function myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}
function setCook(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCook(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

if (getCook("dark") == "") {
    setCook("dark", "false", 365)
}

const applyTheme = () => {
    if (getCook("dark") == "true") {
        document.getElementById("genestyle").setAttribute("href", "/nightGeneral.css")
    } else {
        document.getElementById("genestyle").setAttribute("href", "/general.css")
    }
}


document.getElementById("dark").onclick = () => {
    if (getCook("dark") == "true") {
        setCook("dark", "false", 365)
        applyTheme()
    }else{
        setCook("dark", "true", 365)
        applyTheme()
    }
}
applyTheme()

let isPages = true
;(async() => {
    const response = await fetch("/loc");
    const u = document.getElementById("url")
    if (response.ok) {
        isPages = false
        u.innerHTML = '<i class="fa-solid fa-server"></i> '
    }else {
        u.innerHTML = '<i class="fa-solid fa-file"></i> '
    }
    const a = document.createElement('a')
    a.href = "/"
    a.innerText = window.location.hostname 
    u.appendChild(a)
})()