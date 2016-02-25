// @author Rob W <http://stackoverflow.com/users/938089/rob-w>
// Demo: var serialized_html = DOMtoString(document);



function getForms(document_root) {

    //THIS IS WHERE WE CAN MODIFY THE DOM
    var output = '';
    var formsCollection = document.getElementsByTagName("form");

    for(var i=0;i<formsCollection.length;i++)
    {
        html += formsCollection[i].innerHTML;
    }
    return html;
}

function addToolTips(document_root) {
    $('.XSSVuln').qtip({
        content: {
          text: 'This is an xss vuln!!!!111'
        },
        position: {
            at: 'top right',
            my: 'bottom left'
        }
    })
}

function discoverAttackSurface(document_root) {
    var text = ''

    text += findXSS(document_root);
    text += findAuthentication(document_root);
    addToolTips(document_root)

    return text;
}

function findXSS(document_root) {
    //find all text fields
    var inputs = '';
    var inputsCollection = document.getElementsByTagName("input");
    for (var i=0; i < inputsCollection.length; i++) {
        if (inputsCollection[i].getAttribute('type') == "text") {
            inputsCollection[i].setAttribute("style", "outline: #00FF00 dotted thick;");
            inputsCollection[i].setAttribute("class", "XSSVuln");

            //inputs += inputsCollection[i].outerHTML;
            //inputs += "\n";
        }
    }

    return inputs;
}

function findAuthentication(document_root) {
    //find all email, password, username fields
    var inputs = '';
    var inputsCollection = document.getElementsByTagName("input");

    for (var i=0; i < inputsCollection.length; i++) {
        if (inputsCollection[i].getAttribute('type') == "email" ||
            inputsCollection[i].getAttribute('type') == "password" ||
            inputsCollection[i].getAttribute('type') == "username") {
            inputsCollection[i].setAttribute("style", "outline: #0000FF dotted thick;");


            //Wrap it in jquery and then add the qtip

            //inputs += inputsCollection[i].outerHTML;
            //inputs += "\n";
        }
    }

    return inputs;
}

chrome.runtime.sendMessage({
    action: "getSource",
    source: discoverAttackSurface(document)
});  
