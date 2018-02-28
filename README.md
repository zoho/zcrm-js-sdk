# zcrm-js-sdk
######JS Sdk for Zoho CRM


Zoho CRM offers REST APIs for communication between several clients. This SDK helps you to make API calls from the domains registered with accounts.zoho.{com/eu/com.cn}. 

Refer [Building Webapp](https://zcms.zohocorp.com/crm/help/developer/webapp-sdk/build-webapp.html) and [Install CLI](https://zcms.zohocorp.com/crm/help/developer/webapp-sdk/install-cli.html) using [ZET](https://www.npmjs.com/package/zoho-extension-toolkit) before proceeding further




**Please follow the steps to work with JS SDK**
* Register the client from CRM UI and note the client id
* Create a new project using the command '**zet init**' via terminal/command line. Choose the option '**ZES**' and give the project name.
* New folder will be created with the project name. Inside that, there will be a file **plugin\_manifest.json**. Update the client id in that file and required scopes to be used in the web app
* Under the project folder, there will be another folder named '**app**'. This will act as the base.
* Include the '**zcrmsdk.js**' file (available in _app_ folder) and use it in your html files.
* **ZCRM.API.AUTH.getAccess()** will create a token by authenticating the user.
* After the development, run the command '**zet pack**' from the project base folder and upload it in CRM UI. FYI: Only one app can be uploaded for each client. While updating with new app, old one has to be deleted. Also redirect url will be changed.
* To know the redirect url, ZCRM.API.AUTH.getAccess() function has to be accessed from web app. It'll redirect to accounts.zoho.com/oauth/v2/auth along with a parameter redirect\_uri. Take that redirect\_uri and configure it in accounts.zoho.com/developerconsole. 
Eg : if the redirect\_uri is "`https://99000000223015.localzappscontents.com/appfiles/99000000223015/1.0/1dd62561c00429f2c4970bf4f2b4dc09142d08b6949a17a5c3388f30851ec9cf/redirect.html`"
Then 

	"**Client Domain**" is "`99000000223015.localzappscontents.com`"

	"**JavaScript Domain**" is "`https://99000000223015.localzappscontents.com`"

_PS_ : Note the https configuration difference in "Client Domain" and "JavaScript Domain".



**Note**
- If a single page uses many ajax calls at the same time and the token is not set. All the responses will be empty json object string `'{}'` . This one has to be handled for every request.
- Once token is set for the first time, the page will be reloaded.


---
**Object Hierarchy**

\* - indicates mandatory param and input has to be passed as parameters (as JSON) for the functions


**ZCRM**
- **AUTH**
  - getAccess
  - revokeAccess
- **RECORDS**
  - get - (\*input.module, input.params)
  - post - (\*input.module, \*input.body, \*headers['Content-Type'])
  - put - (\*input.module, \*input.body, \*headers['Content-Type'])
  - delete - (\*input.module, \*input.id)
  - getNotes - (\*input.module, \*input.id)
  - getRelated - (\*input.module, \*input.id, \*input.relatedModule)
  - getAllDeletedRecords - (\*input.module)
  - getRecycleBinRecords - (\*input.module)
  - getPermanentlyDeletedRecords - (\*input.module)
- **SETTINGS**
  - getFields - (\*input.params, input.id)
  - getLayouts - (\*input.params, input.id)
  - getCustomViews - (\*input.params, input.id)
  - updateCustomViews - (\*input.params, input.id)
  - getModules - (input.module)
  - getRoles - (input.id)
  - getProfiles - (input.id)
  - getRelatedLists - (input.id)
- **ACTIONS**
  - convert - (\*input.id, \*input.body)
- **USERS**
  - get - (input.id)
- **ORG**
  - get 
- **ATTACHMENTS**
  - uploadFile - (\*input.module, \*input.id, \*input.x\_file\_content)
  - deleteFile - (\*input.module, \*input.id, \*input.relatedId)
  - downloadFile - (\*input.module, \*input.id, \*input.relatedId)
  - uploadLink - (\*input.module, \*input.id, \*input.params)
  - uploadPhoto - (\*input.module, \*input.id, \*input.x\_file\_content)
  - downloadPhoto - (\*input.module, \*input.id)
  - deletePhoto - (\*input.module, \*input.id)
- init
