var url = new URL(document.URL);
var dbTEMP = localStorage.dbCoffe;
newEntry = {
    email: url.searchParams.get("email"),
    form: url.searchParams.get("form"),
    dosis: url.searchParams.get("dosis"),
    date: url.searchParams.get("date")
}

//localStorage.dbCoffe = "[]";

//Vorbedingung
if (newEntry.email != null) {
    if (newEntry.dosis < 0) {
        newEntry.dosis = 0;
    }
}
if (dbTEMP == null) {
    dbTEMP = "[]";
}

//main() 
//begin DONT TOUCH THIS CODE
if (newEntry.email == null && newEntry.dosis == null) {
    window.onload = overview;
} else {
    if ('add' == url.searchParams.get('type')) {
        createNewEntry();
    } else if ('overwrite' == url.searchParams.get('type')) {
        overwriteEntry();
    } else {
        window.onload = writeOnlyFor;
    }
}

//Überschreibe einen Eintrag
function overwriteEntry() {
    var existed = false;
    var newDB = JSON.parse(dbTEMP);

    //Abfrage ob bereits ein Eintrag für ein Datum mit der Email existiert
    for (i = 0; i < newDB.length; i++) {
        if(newDB[i] == null){
            continue;
        }
        if (newDB[i].email == newEntry.email && newDB[i].date == newEntry.date) {
            newDB[i].form = newEntry.form;
            newDB[i].dosis = newEntry.dosis;
            existed = true;
            break;
        }
    }
    if (existed) {
        localStorage.dbCoffe = JSON.stringify(newDB);
        window.onload = clearURL;
    } else {
        alert("Es konnte kein Eintrag für den " +
            newEntry.date + " mit der Email " +
            newEntry.email + " gefunden werden"
        );
        window.onload = clearURL;
    }
}

//Erstellt oder bearbeitet einen Eintrag
function createNewEntry() {
    var existed = false;
    var newDB = JSON.parse(dbTEMP);

    //Abfrage ob bereits ein Eintrag für ein Datum mit der Email existiert
    for (i = 0; i < newDB.length; i++) {
        if (newDB[i] != null &&
            newEntry != null &&
            newDB[i].email == newEntry.email && newDB[i].date == newEntry.date) {
            if (newEntry.form != "") {
                if (newDB[i].form == "") {
                    newDB[i].form = newEntry.form;
                } else {
                    newDB[i].form = newDB[i].form + ", " + newEntry.form;
                }
            }
            newDB[i].dosis = parseInt(newDB[i].dosis) + parseInt(newEntry.dosis);
            existed = true;
            break;
        }
    }
    if (existed) {
        localStorage.dbCoffe = JSON.stringify(newDB);
    } else {
        newDB.push(newEntry);
        localStorage.dbCoffe = JSON.stringify(newDB);
    }
    window.onload = clearURL;
}

function randomGenerate() {
    var sorts = [
        "Filterkaffee",
        "Espresso",
        "Instantkaffee",
        "Schwarzer Tee",
        "Grüner Tee",
        "Coca-Cola",
        "Fritz Kola",
        "Club Mate"
                ];
    var i = localStorage.length;
    var entry = {
        email: Math.random().toString(26).substr(2, 8) + "@" + Math.random().toString(26).substr(2, 5) + ".de",
        form: sorts[Math.floor(Math.random() * sorts.length)],
        dosis: Math.floor(Math.random() * 250),
        date: Math.floor(Math.random() * 18 + 2000) + "-" +
            Math.floor(Math.random() * 12 + 1) + "-" +
            Math.floor(Math.random() * 31 + 1)
    };
    var newDB = JSON.parse(dbTEMP);
    newDB[newDB.length] = entry;
    dbTEMP = JSON.stringify(newDB);
    localStorage.dbCoffe = dbTEMP;
    location.reload();
}

//Zeigt alle Eintraege des LocalStorages
function overview() {
    if (dbTEMP == "[]") {
        var p = document.createElement('p');
        var div = document.getElementById('noValues');
        div.appendChild(p);
        p.innerHTML = 'Noch keine Einträge vorhanden'
    } else {
        var entries = JSON.parse(localStorage.dbCoffe);
        if (entries.length > 0) {
            createHeader(true);
        }
        for (i = 0; i < entries.length; i++) {
            if (entries[i] != null) {
                var trE = document.createElement('tr');
                table.appendChild(trE);
                trE.innerHTML =
                    '<td><input id="cb' + i + '" type="checkbox"></td>' +
                    '<td>' + entries[i].email + '</td>' +
                    '<td>' + entries[i].form + '</td>' +
                    '<td>' + entries[i].dosis + '</td>' +
                    '<td>' + entries[i].date + '</td>';
            }
        }
    }
}

function deleteEntry() {
    var entries = JSON.parse(localStorage.dbCoffe);
    var temp = [];
    for (i = 0; i < localStorage.dbCoffe.length; i++) {
        if (document.getElementById("cb" + i) != null && document.getElementById("cb" + i).checked == false) {
            temp[i] = entries[i];
        }
    }
    dbTEMP = JSON.stringify(temp)
    localStorage.dbCoffe = dbTEMP;
    location.reload();
}

//Schreibe nur für die Email des neuen Eintrags
function writeOnlyFor() {
    var entries = JSON.parse(localStorage.dbCoffe);
    if (entries.length > 0) {
        createHeader(false);
    }
    for (i = 0; i < entries.length; i++) {
        if (entries[i] != null &&
            newEntry != null &&
            entries[i].email == newEntry.email) {
            var trE = document.createElement('tr');
            table.appendChild(trE);
            trE.innerHTML =
                '<td><input id="cb' + i + '" type="checkbox"></td>' +
                '<td>' + entries[i].form + '</td>' +
                '<td>' + entries[i].dosis + '</td>' +
                '<td>' + entries[i].date + '</td>';
        }
    }
}

function clearURL() {
    if (document.URL.includes("&form")) {
        window.location.replace(location.href.split("&form")[0]);
    }
}

//Header für Standard Tabelle
function createHeader(showEmail) {
    table = document.getElementById('theTable');
    var trH = document.createElement('tr');
    table.appendChild(trH);
    if (showEmail) {
        trH.innerHTML =
            '<th></th>' +
            '<th>E-Mail</th>' +
            '<th>Form</th>' +
            '<th>Dosis</th>' +
            '<th>Datum</th>';
    } else {
        trH.innerHTML =
            '<th></th>' +
            '<th>Form</th>' +
            '<th>Dosis</th>' +
            '<th>Datum</th>';
    }
}

function clearLocalStorage() {
    localStorage.dbCoffe = "[]";
    location.reload();
}
//end DONT TOUCH THIS CODE