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

function findXSS(document_root) {
    //find all text fields
    var inputs = '';
    var inputsCollection = document.getElementsByTagName("input");

    for (var i=0; i < inputsCollection.length; i++) {
        if (inputsCollection[i].getAttribute('type') == "text") {
            inputsCollection[i].setAttribute("style", "outline: #00FF00 dotted thick;");

            inputs += inputsCollection[i].outerHTML;
            inputs += "\n";
        }
    }
    return inputs;
}

chrome.runtime.sendMessage({
    action: "getSource",
    source: findXSS(document)
});