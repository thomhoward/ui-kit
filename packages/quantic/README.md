# Coveo Quantic

## Using Quantic

Coveo Quantic is a [Lightning Web Component](https://developer.salesforce.com/docs/component-library/documentation/en/lwc) library for assembling responsive, accessible, and future-proof Coveo for Salesforce search UIs. Quantic components are self-encapsulated, composable, and lightweight.
Under the hood, Quantic relies on the [Coveo Headless](https://docs.coveo.com/headless) library to interface with the Coveo Platform and handle the search application state.

### When Should I Use Quantic?

While Quantic is the modern library to use to build Coveo for Salesforce search UIs, there is currently a Salesforce AppExchange limitation preventing the release of Quantic there.
As opposed to [standard Coveo Lightning Components that you can drag and drop out of the box](https://docs.coveo.com/en/1033/#adding-lightning-components), the Quantic library is deployed as a managed package and requires you to create your own components from it.
In other words, provided that you have developer skills, you can wrap the components of the Quantic managed package to create your own components, which you can then assemble to create your search UI.
If you have developer skills and want to create a new Coveo for Salesforce search UI, we recommend using Quantic.

### Install Quantic

0. Prerequisite: you must have installed [sfdx](https://developer.salesforce.com/tools/sfdxcli).

1. Go to <BUTTON LOCATION> and click <BUTTON_NAME> to install the managed package in your Salesforce organization.
2. In the target sfdx project, create a separate package directory structure for Quantic (see [Salesforce DX Project Structure and Source Format](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_source_file_format.htm)).
3. Retrieve quantic source from your organization: `sfdx force:mdapi:retrieve -r <DOWNLOAD_LOCATION> -p Quantic -u <alias>`
4. Unzip the resulting `.zip` compressed folder found in `<DOWNLOAD_LOCATION>`.
5. Convert package to usable source: `sfdx force:mdapi:convert -r <DOWNLOAD_LOCATION> -d <TARGET_LOCATION>`, where `<TARGET_LOCATION>` is the new package directory created at step 2.
6. [Use the Quantic components to build your own.](#use-quantic-components)
7. Deploy the package source back to the org with new custom components: `sfdx force:source:deploy -d <PROJECT_DIRECTORY> -u <alias>`
8. Your new component will be available for drag and drop editing in your Lightning pages.

### Use Quantic Components to Build your Own

Quantic components reside in the same default namespace as your custom components.
Wrap them in your custom components to use them, as you would other [custom Coveo for Salesforce lightning components](https://docs.coveo.com/en/1193), with two additional tweaks:

1. For each Headless engine, there must be a `QuanticSearchInterface` component in the page. This component takes as properties the options to configure the headless engine and is responsible for setting the configuration for a given `engineId` and performing the initial search query when all components are initialized.

  This component is packaged with Quantic so users must just have it present in the page somewhere with their options passed down to it, ideally by a wrapper component.

2. Each component belonging to the same engine must be given the same `engineId` value as parameter.

For examples, see <PATH_TO_EXAMPLE_FOLDER>.

## Contributing

The following documentation is meant for developers who want to contribute to the Quantic project itself.

### Reference documentation

[Useful reference documentation to setup "from scratch"](https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.get_started_local_dev_setup)

### Create a salesforce developer organization

- [Signup](https://developer.salesforce.com/signup)
- Use your @coveo.com email account. The username can be anything.

### Setup SFDX cli

[SFDX cli](https://developer.salesforce.com/tools/sfdxcli)

### Update SFDX cli plugins

- Run `sfdx plugins:install @salesforce/lwc-dev-server`
- Run `sfdx plugins:update`

### Install vscode extension

[vscode Salesforce Extension Pack](https://marketplace.visualstudio.com/items?itemName=salesforce.salesforcedx-vscode)

**Note** Make sure you open the quantic project at the root (`/packages/quantic/`) in vscode in order for the extension to work properly.

### Enable Dev Hub in your Salesforce organization

- Connect to your salesforce developer organization [login](http://login.salesforce.com/)
- From Setup, enter Dev Hub in the Quick Find box and select Dev Hub.
- To enable Dev Hub, click Enable

### Authorize Your Dev Hub

- In VS Code, press Command + Shift P, enter sfdx, and select SFDX: Authorize a Dev Hub.
- You can also run this command from the command line. `sfdx force:auth:web:login -d -a LWC-Hub`
- Running this command opens a browser to the Salesforce login page. Enter your Salesforce username and password. Authorize only once, not every time you work on your project.

### Create a Default Scratch Org

- In VS Code, press Command + Shift P, enter sfdx, and select SFDX: Create a Default Scratch Org.
- You can also run this command from the command line. `sfdx force:org:create -s -f config/project-scratch-def.json -a "LWC"`
- `LWC` is an alias for the scratch org that you can use in other Salesforce CLI commands. You can create any alias that you like.

### Start the Local Development Server

Start the server.

- Run `npm run start`
- You can also run this command from the command line. `sfdx force:lightning:lwc:start`
- View the server at http://localhost:3333/.

### Other useful commands

- Deploy source code to your salesforce organization: `sfdx force:source:deploy -m LightningComponentBundle`.
- `-m LightningComponentBundle` can be changed for different types of "resources". To know which name, check the related `meta.xml` file for each type of resource.
- Create new web components. In VS Code, press Command + Shift P, enter sfdx, and select SFDX: Create Lightning Web Component.

### Learn about LWC

- [lwc.dev](https://lwc.dev/)
- [Components reference](https://developer.salesforce.com/docs/component-library/overview/components). Make sure you stay in the "Lightning web components section". Aura does not apply. Aura is the older UI library that is being deprecated by Salesforce.
- [Lightning design system](https://www.lightningdesignsystem.com/). Reference for styling, CSS utilities, icons, and more.