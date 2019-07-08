
var libBase, headers, HTTP_METHODS, version;
version = 2;
HTTP_METHODS = {
    GET : "GET",//No I18N
    POST : "POST",//No I18N
    PUT : "PUT",//No I18N
    DELETE : "DELETE"//No I18N
};

function promiseResponse(request) {
    return new Promise(function (resolve, reject) {
        var body, baseUrl, xhr, i, formData;
        libBase = localStorage.api_domain+"/crm/v"+version+"/";
        baseUrl = libBase + request.url;

        var token = ZCRM.API.AUTH.getAccess();
        if(token == null){
                return resolve('{}');	// in case of no ticket, returns empty json
        }

        if (request.params)
        {
            baseUrl = baseUrl + '?' + request.params;
        }

        xhr = new XMLHttpRequest();
        xhr.withCredentials = true
        xhr.open(request.type, baseUrl);
        xhr.setRequestHeader("Authorization", "Zoho-oauthtoken "+token)
        for (i in headers)
        {
            xhr.setRequestHeader(i, headers[i]);
        }

        if (request.download_file){
            xhr.responseType = "blob";//No I18N
        }

        if (request.x_file_content) {
            formData = new FormData();
            formData.append('file', request.x_file_content);//No I18N
            xhr.send(formData);
        }
        else{
            body = request.body || null;
            xhr.send(body);
        }

        xhr.onreadystatechange = function() {
                if(xhr.readyState == 4){
                    if (xhr.status == 204)
                    {
                        var respObj = {
                            "message" : "no data", //No I18N
                            "status_code" : "204" //No I18N
                        }
                        resolve(JSON.stringify(respObj));
                    }
                    else
                    {
                        if (request.download_file){
                            var filename;
                            var disposition = xhr.getResponseHeader("Content-Disposition");//No I18N
                            if (disposition && disposition.indexOf('attachment') !== -1) {
                                var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                                var matches = filenameRegex.exec(disposition);
                                if (matches != null && matches[1]) {
                                  filename = matches[1].replace(/['"]/g, '');
                                    filename = filename.replace('UTF-8','');
                                }
                            }
                            var blob = xhr.response;
                            var url = URL.createObjectURL(blob);
                            var ttt = document.createElement('a');
                            ttt.href = url;
                            ttt.download = filename;
                            ttt.click();
                        }
                        else{
                            resolve(xhr.response);
                        }
                    }
                }
            }
    })
};
function createParams(parameters)
{
    var params, key;
    for (key in parameters)
    {
        if (parameters.hasOwnProperty(key)) {
            if (params)
            {
                params = params + key + '=' + parameters[key] + '&';
            }
            else
            {
                params = key + '=' + parameters[key] + '&';
            }
        }
    }

    return params;
};
function constructRequestDetails(input, url, type, isModuleParam)
{
    var requestDetails = {};

    requestDetails.type = type;

    if (input != undefined)
    {
        if (input.id)
        {
            url = url.replace("{id}", input.id);
//                        url = url + "/" + input.id;
        }
        else
        {
            url = url.replace("/{id}", "");
        }
        if (input.params)
        {
            requestDetails.params = createParams(input.params) + (input.module && isModuleParam ? "module=" + input.module : "");//No I18N
        }
        if (!requestDetails.params && isModuleParam)
        {
            requestDetails.params = "module=" + input.module;//No I18N
        }
        if (input.body && (type == HTTP_METHODS.POST || type == HTTP_METHODS.PUT))
        {
            requestDetails.body = JSON.stringify(input.body);
        }
        if (input.x_file_content)
        {
            requestDetails.x_file_content = input.x_file_content;
        }
        if (input.download_file)
        {
            requestDetails.download_file = input.download_file;
        }
    }
    requestDetails.url = url;

    return requestDetails;
};
function getParameterByName(name, url)
{
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    var results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
function actions()
{

    return {
        convert : function (input)
        {
            return promiseResponse(constructRequestDetails(input, "Leads/{id}/actions/convert", HTTP_METHODS.POST, false));//No I18N
        }
    }
}
function attachments()
{

    return {
        uploadFile : function (input)
        {
            return promiseResponse(constructRequestDetails(input, input.module+ "/{id}/Attachments", HTTP_METHODS.POST, false));//No I18N
        },
        deleteFile : function (input)
        {
            return promiseResponse(constructRequestDetails(input, input.module+ "/{id}/Attachments/"+input.relatedId, HTTP_METHODS.DELETE, false));//No I18N
        },
        downloadFile : function (input)
        {
            input.download_file = true;
            return promiseResponse(constructRequestDetails(input, input.module+ "/{id}/Attachments/"+input.relatedId, HTTP_METHODS.GET, false));//No I18N
        },
        uploadLink : function (input)
        {
            return promiseResponse(constructRequestDetails(input, input.module+ "/{id}/Attachments", HTTP_METHODS.POST, false));//No I18N
        },
        uploadPhoto : function (input)
        {
            return promiseResponse(constructRequestDetails(input, input.module+ "/{id}/photo", HTTP_METHODS.POST, false));//No I18N
        },
        downloadPhoto : function (input)
        {
            input.download_file = true;
            return promiseResponse(constructRequestDetails(input, input.module + "/{id}/photo", HTTP_METHODS.GET, false));//No I18N
        },
        deletePhoto : function (input)
        {
            return promiseResponse(constructRequestDetails(input, input.module + "/{id}/photo", HTTP_METHODS.DELETE, false));//No I18N
        }
    }
}

function org()
{

    return {
        get : function (input)
        {
            return promiseResponse(constructRequestDetails(input, "org", HTTP_METHODS.GET, true));//No I18N
        }
    }
}

function records()
{
    
    return {
        get : function(input)
        {
            return promiseResponse(constructRequestDetails(input, input.module + "/{id}", HTTP_METHODS.GET, false));//No I18N
        },
        post : function(input)
        {
            return promiseResponse(constructRequestDetails(input, input.module + "/{id}", HTTP_METHODS.POST, false));//No I18N
        },
        put : function(input)
        {
            return promiseResponse(constructRequestDetails(input, input.module + "/{id}", HTTP_METHODS.PUT, false));//No I18N
        },
        delete : function (input)
        {
            return promiseResponse(constructRequestDetails(input, input.module + "/{id}", HTTP_METHODS.DELETE, false));//No I18N
        },
        getNotes : function (input)
        {
            return promiseResponse(constructRequestDetails(input, input.module + "/{id}/Notes", HTTP_METHODS.GET, false));//No I18N
        },
        getRelated : function (input)
        {
            return promiseResponse(constructRequestDetails(input, input.module + "/{id}/"+input.relatedModule, HTTP_METHODS.GET, false));//No I18N
        },
        getAllDeletedRecords : function (input)
        {
            if (input.params)
            {
                input.params.type = "all";
            }
            else
            {
                input.params = {
                    "type" : "all"//No I18N
                };
            }

            return promiseResponse(constructRequestDetails(input, input.module + "/deleted", HTTP_METHODS.GET, false));//No I18N
        },
        getRecycleBinRecords : function (input)
        {
            if (input.params)
            {
                input.type = "recycle";
            }
            else
            {
                input.params = {
                    "type" : "recycle"//No I18N
                };
            }

            return promiseResponse(constructRequestDetails(input, input.module + "/deleted", HTTP_METHODS.GET, false));//No I18N
        },
        getPermanentlyDeletedRecords : function (input)
        {
            if (input.params)
            {
                input.type = "permanent";
            }
            else
            {
                input.params = {
                    "type" : "permanent"//No I18N
                };
            }

            return promiseResponse(constructRequestDetails(input, input.module + "/deleted", HTTP_METHODS.GET, false));//No I18N
        },
        search : function (input)
        {
            return promiseResponse(constructRequestDetails(input, input.module + "/search", HTTP_METHODS.GET, false));//No I18N
        }
    }
}
function settings()
{
    
    return {
        getFields : function (input)
        {
            return promiseResponse(constructRequestDetails(input, "settings/fields/{id}", HTTP_METHODS.GET, true));//No I18N
        },
        getLayouts : function (input)
        {
            return promiseResponse(constructRequestDetails(input, "settings/layouts/{id}", HTTP_METHODS.GET, true));//No I18N
        },
        getCustomViews : function (input)
        {
            return promiseResponse(constructRequestDetails(input, "settings/custom_views/{id}", HTTP_METHODS.GET, true));//No I18N
        },
        updateCustomViews : function (input)
        {
            return promiseResponse(constructRequestDetails(input, "settings/custom_views/{id}", HTTP_METHODS.PUT, true));//No I18N
        },
        getModules : function (input)
        {
            return promiseResponse(constructRequestDetails(input, "settings/modules" + ((input && input.module) ? "/" + input.module : ""), HTTP_METHODS.GET, false));//No I18N
        },
        getRoles : function (input)
        {
            return promiseResponse(constructRequestDetails(input, "settings/roles/{id}", HTTP_METHODS.GET, true));//No I18N
        },
        getProfiles : function (input)
        {
            return promiseResponse(constructRequestDetails(input, "settings/profiles/{id}", HTTP_METHODS.GET, true));//No I18N
        },
        getRelatedLists : function (input)
        {
            return promiseResponse(constructRequestDetails(input, "settings/related_lists/{id}", HTTP_METHODS.GET, true));//No I18N
        }
    }
}
function users()
{
    
    return {
        get : function (input)
        {
            return promiseResponse(constructRequestDetails(input, "users/{id}", HTTP_METHODS.GET, true));//No I18N
        }
    }
}
var listener = 0;
function auth()
{
    return {
        getAccess : function(){
            if(listener == 0){
                 window.addEventListener("storage", function(e){
                        if(e.key === 'access_token' && e.oldValue!=e.newValue && e.oldValue == null){
                                location.reload();
                        }
                        if(e.key === 'access_token'){
                                localStorage.removeItem('__auth_process');
                        }
                }, false);
                listener = 1;
                if(localStorage.getItem('__auth_process')){ localStorage.removeItem('__auth_process'); }
            }


            var valueInStore = localStorage.getItem('access_token');
            var token_init = localStorage.getItem('__token_init');
            if(token_init != null && valueInStore != null && Date.now() >= parseInt(token_init)+55*60*1000){ // check after 55 mins
                valueInStore = null;
                localStorage.removeItem('access_token');
            }
            var auth_process = localStorage.getItem('__auth_process');

            if (valueInStore == null && auth_process == null)
            {
                var accountsUrl =document.getElementById("zes_client_scope").getAttribute("data-accounts-url");
                var endPoint = "/oauth/v2/auth";
		var full_grant = localStorage.getItem('full_grant');
		if(full_grant != null && 'true' == full_grant && localStorage.getItem('__token_init') != null){
			endPoint += '/refresh';
		}
                var client_id = document.getElementById("zes_client_scope").getAttribute("data-clientid");
                var scope = document.getElementById("zes_client_scope").getAttribute("data-scope");

                var path = window.location.pathname;
                var redirect_url = window.location.origin;
                var pathSplit = path.split('/');
                var length=pathSplit.length
                for (var i=0;i<length-2;i++){
                       redirect_url +=pathSplit[i]+"/";
                }
                if(location.hostname=="127.0.0.1" ||location.hostname=="localhost" ||location.hostname=="" ){
                    redirect_url += "app/"
                }
                redirect_url = redirect_url + "redirect.html";

                if (client_id && scope){
                    localStorage.setItem('__token_init', Date.now());
                    localStorage.removeItem('access_token');
                    localStorage.setItem('__auth_process', 'true');
                    var popup = window.open(accountsUrl+endPoint+"?scope="+scope+"&client_id="+client_id+"&response_type=token&state=zohocrmclient&redirect_uri="+redirect_url);//,'', 'width:' + window.innerWidth + ',height:' + window.innerHeight);
                        //popup.focus();
                }
                else{
                    throw 'missing auth params[clientId, redirectUri, scope]';
                }
            }
            return valueInStore;
        },
        revokeAccess : function (){
            localStorage.removeItem('crm_access_token');
        }
    }
}

    var ZCRM = (function (argument) {
	return {
        API : (function (argument) {
			return{
                AUTH : new auth(),
                RECORDS : new records(),
                SETTINGS : new settings(),
                ACTIONS : new actions(),
                USERS : new users(),
                ORG : new org(),
                ATTACHMENTS : new attachments()
			}
		})(this),
	init: function(data){
			if(data.constructor === {}.constructor && data.hasOwnProperty('full_grant') && data['full_grant'] == true){
				localStorage.setItem('full_grant', 'true');
			}
		}
	}
})(this)