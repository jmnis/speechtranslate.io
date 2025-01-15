# SpeechTranslate
SpeechTranslate offers a real-time translation engine powered by the Azure Speech Service. You will need a valid Microsoft Azure Subscription Key linked to a Speech Service resource to use this application. Instructions on creating a Speech Service resource and generating a Subscription Key can be found in the documentation.

This app was developed for a Swiss theatre company that required a solution to provide English subtitles in real-time during performances. With SpeechTranslate, translations occur instantly, ensuring an immersive experience for French-speaking and English-speaking audiences.

# Commands
CTRL + R: Start/Stop recording

CTRL + F: Enter full screen

Esc: Exit full screen

To access, visit: https://jmnis.github.io/speechtranslate.io/

# How to Create a Speech Service on Azure and Generate a Subscription Key

This guide explains how to create a Speech service on Microsoft Azure and generate a subscription key to use in your application.

## Prerequisites

- An active **Azure account**. If you don’t have one, sign up [here](https://azure.microsoft.com/en-us/free/).
- Basic knowledge of how to use the **Azure Portal** and **Azure Cognitive Services**.

## Steps to Create a Speech Service

### 1. **Create an Azure Account**
If you don't already have an Azure account, you can create one for free. Visit [Azure Free Account](https://azure.microsoft.com/en-us/free/) to sign up.

### 2. **Create a Speech Service Resource**

1. Go to the **Azure Portal** at [portal.azure.com](https://portal.azure.com/).
2. In the left-hand menu, click on **Create a resource**.
3. In the search bar, type **Speech** and select **Speech** from the list of available services.
4. Click on the **Create** button to start setting up your Speech service.

### 3. **Fill in the Required Details**

- **Subscription**: Choose the Azure subscription under which the Speech service will be billed.
- **Resource Group**: Choose an existing resource group or create a new one to organize your Azure resources.
- **Region**: Select the region that is geographically closest to your users.
- **Name**: Provide a unique name for your Speech resource (e.g., `mySpeechResource`).
- **Pricing Tier**: Choose a pricing tier. You can start with the **Free** tier if you are just testing.
  
Click **Review + Create**, and once validated, click **Create**.

### 4. **Access Subscription Key and Endpoint URL**

Once the Speech service resource is created:

1. Go to the **Speech service** resource page.
2. In the left sidebar, click on **Keys and Endpoint**.
3. Here, you'll find two subscription keys (Key 1 and Key 2) and the **Endpoint URL**. Copy either of the keys (usually Key 1) and the endpoint URL.

# Demo
[Click here to watch the demo video](https://github.com/jmnis/speechtranslate.io/blob/main/demo/demo.mov)
