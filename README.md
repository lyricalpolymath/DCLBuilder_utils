## Decentraland Builder Utilities

the Decentralan builder is very basic for now and it's a bit painful to work with. These utilities will allow you to create groups, shift one entity or the whole group by a certain amount, rotate, import and export your projects and more.

check the file

`decentraland_builder_utilities/DCLBuilderUtils.js`
for the API and the usage examples


## How to use it

### Requirements
- requires [React Developer Tools for Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
(you need to be able to use `$r` in the browser's console for the script to work)

### "install"

- open the browser on https://builder.decentraland.org
- open any project
- open the browser developer tools > Sources > Snippets
- create a new snippet
- copy & paste the content of the `decentraland_builder_utilities/DCLBuilderUtils.js` in the browser console

### how to use it
- open the React tab in the chrome developer tools (only if you installed the extension)
- then open the console and verify that `$r` is not `undefined`
- if it works open the DCLBuilder snippet and execute it (command+enter on mac)


now you have some useful functions to manipulate the builder.
Read the file for the API
